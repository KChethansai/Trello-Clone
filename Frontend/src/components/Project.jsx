import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { BsPlusLg, BsPeopleFill, BsArrowLeft } from 'react-icons/bs'
import toast from 'react-hot-toast'
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners
} from '@dnd-kit/core'
import {
  SortableContext,
  horizontalListSortingStrategy,
  arrayMove
} from '@dnd-kit/sortable'
import { useProjectStore } from '../store/projectStore'
import { useAuth } from '../store/authStore'
import { useWorkspaceStore } from '../store/workspaceStore'
import Navbar from './Navbar'
import {
  addListButton,
  projectCanvas,
  projectFallbackBg,
  projectHeader,
  projectHeaderBtn,
  projectHeaderTitle,
  projectListRow,
  projectStatusBar,
  projectStatusBarLabel,
  projectStatusPillBase,
  projectShareBtn,
  dashboardMutedColor
} from '../Styles/common'
import {
  STATUS_LABELS,
  normalizeStatusText,
  getStatusByText,
  getNonStatusLabels,
  getId,
  getInitials,
  getAvatarClass,
  normalizeMember
} from '../utils/projectUtils'

// Import Split Components
import PublishForm from './PublishForm'
import CardDetailModal from './CardDetailModal'
import { DragCard } from './Card'
import { ListColumn, AddListForm } from './ListColumn'

function Project() {
  const { projectId } = useParams()
  const navigate = useNavigate()

  const {
    activeProject,
    lists,
    cards,
    loading,
    fetchProject,
    fetchLists,
    fetchCards,
    createList,
    createCard,
    deleteCard,
    deleteList,
    updateList,
    updateCard,
    uploadCardAttachment,
    setActiveProject,
    projects,
    moveCard,
    moveCardBetweenLists,
    reorderLists,
    reorderCardsInList,
    persistCardOrder,
    joinProject,
    leaveProject,
    activeUsers,
    typingUsers,
    activityFeed,
    emitTyping,
    emitActivity
  } = useProjectStore()
  const { currentUser } = useAuth()
  const { activeWorkspace, fetchWorkspace } = useWorkspaceStore()

  const [showAddList, setShowAddList] = useState(false)
  const [activeCard, setActiveCard] = useState(null)
  const [modalCard, setModalCard] = useState(null)
  const [localLists, setLocalLists] = useState([])
  const [listsReady, setListsReady] = useState(false)
  const [showPublishModal, setShowPublishModal] = useState(false)
  const [bgFailed, setBgFailed] = useState(false)
  const [dragOverlayWidth, setDragOverlayWidth] = useState(null)
  const dragStartListId = useRef(null)
  const statusInitBoard = useRef(null)
  const addListButtonRef = useRef(null)
  const boardTotals = useMemo(
    () => ({
      lists: localLists.length,
      cards: Object.values(cards).reduce(
        (total, items) => total + items.length,
        0
      )
    }),
    [cards, localLists.length]
  )

  useEffect(() => {
    setLocalLists(lists)
  }, [lists])

  useEffect(() => {
    const workspaceId = getId(activeProject?.workspace)

    if (workspaceId) {
      fetchWorkspace(workspaceId)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeProject?._id])

  useEffect(() => {
    setBgFailed(false)
  }, [activeProject?.img])

  useEffect(() => {
    if (!activeProject?.img) return
    const image = new Image()
    image.onload = () => setBgFailed(false)
    image.onerror = () => setBgFailed(true)
    image.src = activeProject.img
  }, [activeProject?.img])

  const projectMembers = useMemo(() => {
    const projectMemberMap = new Map(
      (activeProject?.members || [])
        .map(normalizeMember)
        .filter(Boolean)
        .map((member) => [getId(member), member])
    )
    const workspaceMembers = (activeWorkspace?.members || [])
      .map((member) => member.user || member)
      .filter(Boolean)
    workspaceMembers.forEach((member) => {
      if (!projectMemberMap.has(getId(member))) {
        projectMemberMap.set(getId(member), member)
      }
    })
    if (activeProject?.creatorId) {
      const creator = normalizeMember(activeProject.creatorId)
      projectMemberMap.set(getId(creator), creator)
    }
    return [...projectMemberMap.values()].filter((member) => getId(member))
  }, [activeProject, activeWorkspace?.members])

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  )

  useEffect(() => {
    const handler = (event) => {
      const target = event.target
      const isTyping =
        target?.tagName === 'INPUT' ||
        target?.tagName === 'TEXTAREA' ||
        target?.tagName === 'SELECT' ||
        target?.isContentEditable
      if (isTyping) return
      if (event.key.toLowerCase() === 'n') {
        event.preventDefault()
        addListButtonRef.current?.focus()
      }
      if (event.key === 'Escape' && modalCard) {
        setModalCard(null)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [modalCard])

  //fetch project data and join socket room
  useEffect(() => {
    if (!projectId) return

    let mounted = true

    const loadProject = async () => {
      try {
        setListsReady(false)

        await fetchLists(projectId)

        if (!mounted) return

        const project = projects.find((b) => b._id === projectId)

        if (project) {
          setActiveProject(project)
        }

        await fetchProject(projectId)

        joinProject(projectId, currentUser)
      } finally {
        if (mounted) {
          setListsReady(true)
        }
      }
    }

    loadProject()

    return () => {
      mounted = false
      leaveProject(projectId)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId])

  //hydrate every visible list with its current cards
  useEffect(() => {
    if (!localLists.length) return

    localLists.forEach((list) => {
      if (!cards[list._id] || cards[list._id].length === 0) {
        fetchCards(list._id)
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localLists])

  const findListByCardId = useCallback(
    (cardId) => {
      for (const [listId, listCards] of Object.entries(cards)) {
        if (listCards?.some((c) => c._id === cardId)) return listId
      }
      return null
    },
    [cards]
  )

  const getOverListId = (over) => {
    const overData = over?.data.current
    if (!overData) return null
    if (overData.type === 'list' || overData.type === 'list-drop') {
      return overData.listId
    }
    if (overData.type === 'card') return overData.listId
    return null
  }

  const findStatusList = useCallback(
    (status, sourceLists = localLists) =>
      sourceLists.find(
        (list) =>
          normalizeStatusText(list.title) ===
          normalizeStatusText(status.listTitle)
      ),
    [localLists]
  )

  const orderStatusLists = useCallback(
    async (nextLists) => {
      const statusLists = STATUS_LABELS.map((status) =>
        nextLists.find(
          (list) =>
            normalizeStatusText(list.title) ===
            normalizeStatusText(status.listTitle)
        )
      ).filter(Boolean)
      const statusIds = statusLists.map((list) => list._id)
      const rest = nextLists.filter((list) => !statusIds.includes(list._id))
      const ordered = [...statusLists, ...rest]
      setLocalLists(ordered)
      await reorderLists(projectId, ordered)
      return ordered
    },
    [projectId, reorderLists]
  )

  const ensureStatusList = useCallback(
    async (status) => {
      const existing = findStatusList(status)
      if (existing) return existing
      const created = await createList(projectId, status.listTitle)
      if (!created) return null
      const nextLists = [...localLists, created]
      await orderStatusLists(nextLists)
      return created
    },
    [projectId, createList, findStatusList, localLists, orderStatusLists]
  )

  useEffect(() => {
    if (
      !projectId ||
      !listsReady ||
      loading ||
      statusInitBoard.current === projectId
    ) {
      return
    }
    statusInitBoard.current = projectId

    const ensureBoardStatuses = async () => {
      const missingStatuses = STATUS_LABELS.filter(
        (status) => !findStatusList(status)
      )
      if (missingStatuses.length === 0) {
        await orderStatusLists(localLists)
        return
      }
      for (const status of missingStatuses) {
        await createList(projectId, status.listTitle)
      }
      const loadedLists = await fetchLists(projectId)
      await orderStatusLists(loadedLists)
    }

    ensureBoardStatuses()
  }, [
    projectId,
    createList,
    fetchLists,
    findStatusList,
    listsReady,
    loading,
    localLists,
    orderStatusLists
  ])

  // DnD handlers

  const handleDragStart = ({ active }) => {
    const data = active.data.current
    if (data?.type === 'card') {
      const cardId = data.cardId
      const listId = data.listId || findListByCardId(cardId)
      const card = cards[listId]?.find((c) => c._id === cardId)
      const node = document.querySelector(`[data-card-id="${cardId}"]`)
      setDragOverlayWidth(node?.getBoundingClientRect().width || null)
      dragStartListId.current = listId
      setActiveCard(card)
    } else {
      dragStartListId.current = null
      setActiveCard(null)
      setDragOverlayWidth(null)
    }
  }

  const handleDragOver = ({ active, over }) => {
    if (!over) return
    const activeData = active.data.current
    if (activeData?.type !== 'card') return

    const cardId = activeData.cardId
    const activeListId = findListByCardId(cardId)
    const overListId = getOverListId(over)
    if (!activeListId || !overListId) return

    if (activeListId === overListId && over.data.current?.type === 'card') {
      const listCards = cards[activeListId] || []
      const activeIndex = listCards.findIndex((card) => card._id === cardId)
      const overIndex = listCards.findIndex(
        (card) => card._id === over.data.current.cardId
      )
      if (activeIndex !== -1 && overIndex !== -1 && activeIndex !== overIndex) {
        reorderCardsInList(
          activeListId,
          arrayMove(listCards, activeIndex, overIndex)
        )
      }
      return
    }

    if (activeListId !== overListId) {
      const overCards = cards[overListId] || []
      const overIndex =
        over.data.current?.type === 'card'
          ? overCards.findIndex((card) => card._id === over.data.current.cardId)
          : overCards.length
      moveCardBetweenLists(cardId, activeListId, overListId, overIndex)
    }
  }

  const handleDragEnd = async ({ active, over }) => {
    setActiveCard(null)
    setDragOverlayWidth(null)

    const activeData = active.data.current
    if (!activeData) return
    if (!over) return

    if (activeData.type === 'list') {
      const overData = over.data.current
      if (overData?.type !== 'list') return
      const activeIndex = localLists.findIndex(
        (list) => list._id === activeData.listId
      )
      const overIndex = localLists.findIndex(
        (list) => list._id === overData.listId
      )
      if (activeIndex === -1 || overIndex === -1 || activeIndex === overIndex) {
        return
      }
      const nextLists = arrayMove(localLists, activeIndex, overIndex)
      setLocalLists(nextLists)
      await reorderLists(projectId, nextLists)
      return
    }

    if (activeData.type === 'card') {
      const cardId = activeData.cardId
      const startListId = dragStartListId.current
      const finalListId = findListByCardId(cardId)
      if (!finalListId) return
      const finalList = localLists.find((list) => list._id === finalListId)
      const finalStatus = getStatusByText(finalList?.title)
      const finalCard = cards[finalListId]?.find((card) => card._id === cardId)

      // Build card patch based on whether the list has a status or not
      let cardPatch = {}
      if (finalCard) {
        if (finalStatus) {
          // If the list has a status, update with that status
          cardPatch = {
            labels: [
              ...getNonStatusLabels(finalCard.labels),
              { text: finalStatus.label, color: finalStatus.color }
            ],
            status: finalStatus.taskStatus
          }
        } else {
          // If it's a custom list (no status), reset labels to blank
          cardPatch = {
            labels: [],
            status: null
          }
        }
      }

      if (Object.keys(cardPatch).length > 0) {
        moveCardBetweenLists(cardId, finalListId, finalListId, null, cardPatch)
      }

      if (startListId && startListId !== finalListId) {
        await moveCard(cardId, finalListId, cardPatch)
        await persistCardOrder(startListId)
      } else if (Object.keys(cardPatch).length > 0) {
        await updateCard(cardId, cardPatch)
      }
      await persistCardOrder(finalListId)
    }
  }

  // Event handlers

  const handleAddList = async (title) => {
    const list = await createList(projectId, title)
    if (!list) {
      toast.error('Could not add list')
      return
    }
    setShowAddList(false)
    toast.success('List added!')
  }

  const handleAddCard = async (listId, cardData) => {
    const list = localLists.find((l) => l._id === listId)
    const status = getStatusByText(list?.title)

    const finalData = { ...cardData }
    if (status) {
      finalData.labels = [{ text: status.label, color: status.color }]
      finalData.status = status.taskStatus
    }

    const card = await createCard(listId, finalData)
    if (!card) {
      toast.error('Could not add card')
      return
    }
    await persistCardOrder(listId)
    toast.success('Card added!')
  }

  const handleDeleteCard = async (cardId, listId) => {
    await deleteCard(cardId, listId)
    if (listId) await persistCardOrder(listId)
    toast.success('Card deleted')
  }

  const handleDeleteList = async (listId) => {
    await deleteList(listId)
    toast.success('List deleted')
  }

  const handleUpdateList = async (listId, data) => {
    const updated = await updateList(listId, data)
    if (!updated) toast.error('Could not update list')
    return updated
  }

  const handleSaveCard = async (cardId, data) => {
    const updated = await updateCard(cardId, data)
    if (!updated) {
      toast.error('Could not update card')
      return
    }
    emitActivity(projectId, {
      type: 'card-updated',
      cardId,
      actorId: currentUser?._id,
      message: `${currentUser?.name || 'Someone'} updated a card`
    })
    toast.success('Card updated')
  }

  const patchLocalCard = useCallback(
    (cardId, patch) => {
      const listId = findListByCardId(cardId)
      if (!listId) return
      const card = cards[listId]?.find((item) => item._id === cardId)
      if (!card) return
      moveCardBetweenLists(cardId, listId, listId, null, {
        ...patch,
        updatedAt: new Date().toISOString()
      })
      if (modalCard?._id === cardId) {
        setModalCard((current) =>
          current ? { ...current, ...patch } : current
        )
      }
    },
    [cards, findListByCardId, modalCard?._id, moveCardBetweenLists]
  )

  const handleQuickUpdateCard = useCallback(
    async (cardId, data) => {
      const updated = await updateCard(cardId, data)
      if (!updated) {
        toast.error('Could not update card')
        return null
      }
      patchLocalCard(cardId, updated)
      return updated
    },
    [patchLocalCard, updateCard]
  )

  const handleCommentCountChange = useCallback(
    (cardId, count) => {
      patchLocalCard(cardId, { commentCount: count })
    },
    [patchLocalCard]
  )

  const handleTyping = useCallback(
    (cardId, typing) => {
      emitTyping({ projectId, cardId, user: currentUser, typing })
    },
    [currentUser, emitTyping, projectId]
  )

  const handleAttachCardImage = async (cardId, file) => {
    const updated = await uploadCardAttachment(cardId, file)
    if (!updated) {
      toast.error('Could not upload image')
      return
    }
    setModalCard(updated)
    toast.success('Image attached')
  }

  const handleCardStatusChange = async (card, status) => {
    const targetList = await ensureStatusList(status)
    const fromListId = findListByCardId(card._id) || card.listId?.toString()
    if (!targetList || !fromListId) {
      toast.error('Could not resolve status list')
      return
    }

    const labels = [
      ...getNonStatusLabels(card.labels),
      { text: status.label, color: status.color }
    ]
    const cardPatch = { labels, status: status.taskStatus }
    const nextCard = { ...card, ...cardPatch, listId: targetList._id }

    moveCardBetweenLists(card._id, fromListId, targetList._id, null, {
      ...cardPatch
    })
    setModalCard(nextCard)
    const moved = await moveCard(card._id, targetList._id, cardPatch)
    if (!moved) {
      toast.error('Could not move card')
      return
    }
    if (fromListId !== targetList._id) await persistCardOrder(fromListId)
    await persistCardOrder(targetList._id)
    toast.success(`Moved to ${status.title}`)
  }

  const handleListStatusChange = async (list, status) => {
    const updated = await updateList(list._id, { title: status.listTitle })
    if (!updated) {
      toast.error('Could not update list status')
      return
    }
    const nextLists = localLists.map((item) =>
      item._id === list._id
        ? { ...item, ...updated, title: status.listTitle }
        : item
    )
    await orderStatusLists(nextLists)
    toast.success(`List set as ${status.title}`)
  }

  const handlePublishSave = (updatedProject) => {
    setActiveProject(updatedProject)
    setShowPublishModal(false)
  }

  //owner check: only the creator can edit
  const isOwner =
    activeProject?.creatorId?._id?.toString() ===
      currentUser?._id?.toString() ||
    activeProject?.creatorId?.toString() === currentUser?._id?.toString()

  //owner can always edit; others can edit only if isEditable is explicitly true
  const canEdit = isOwner || activeProject?.isEditable === true
  const readOnlyMode = !canEdit

  const projectBg =
    activeProject?.img && !bgFailed
      ? ''
      : activeProject?.color
        ? `bg-linear-to-br ${activeProject.color}`
        : projectFallbackBg
  const projectStyle =
    activeProject?.img && !bgFailed
      ? {
          backgroundImage: `linear-gradient(rgba(0,0,0,.2), rgba(0,0,0,.2)), url(${activeProject.img})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }
      : undefined

  return (
    <div
      className={`flex flex-col h-screen ${projectBg} overflow-hidden`}
      style={projectStyle}
    >
      {/* project header */}
      <Navbar />
      <div className={projectHeader}>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/main-page')}
            className={projectHeaderBtn}
          >
            <BsArrowLeft /> Back
          </button>
          <h1 className={projectHeaderTitle}>
            {activeProject?.title || 'Project'}
          </h1>
          <span className={`text-xs ${dashboardMutedColor}`}>
            {boardTotals.cards} cards · {boardTotals.lists} lists
          </span>
          {!canEdit && (
            <span className="rounded-full bg-[#2f3741] px-3 py-1 text-xs uppercase tracking-widest text-[#a1a1aa]">
              View-only board
            </span>
          )}
          {activeProject?.isPublished && (
            <span className="rounded-full bg-[#164b35] px-3 py-1 text-xs uppercase tracking-widest text-[#4caf50]">
              Published
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {activeUsers.length > 0 ? (
            <div className="hidden items-center gap-1 sm:flex">
              {activeUsers.slice(0, 4).map((user) => (
                <span
                  key={user.socketId || user._id}
                  title={user.name}
                  className="flex h-7 w-7 items-center justify-center rounded-full border border-white/20 bg-[#ff4d67] text-xs font-bold text-white"
                >
                  {(user.name || 'U').slice(0, 1).toUpperCase()}
                </span>
              ))}
            </div>
          ) : activeProject?.creatorId ? (
            <span
              title={activeProject.creatorId.name || 'Creator online'}
              className={`relative flex h-7 w-7 items-center justify-center rounded-full border border-white/20 text-xs font-bold text-white ${getAvatarClass(activeProject.creatorId.name || activeProject.creatorId.email)}`}
            >
              {getInitials(
                activeProject.creatorId.name || activeProject.creatorId.email
              )}
              <span className="absolute -right-0.5 -bottom-0.5 h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-black" />
            </span>
          ) : null}
          {/* publish button, only shown to the board owner */}
          {isOwner && (
            <button
              onClick={() => setShowPublishModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-[#216e4e] hover:bg-[#1e6045] text-white transition-colors"
            >
              {activeProject?.isPublished ? 'Edit Publish' : 'Publish'}
            </button>
          )}
          <button className={projectShareBtn}>
            <BsPeopleFill className="text-xs" /> Share
          </button>
        </div>
      </div>

      <div className={projectStatusBar}>
        <div className="flex items-center gap-2 flex-wrap">
          <span className={projectStatusBarLabel}>Status labels</span>
          <span className={`text-xs ${dashboardMutedColor}`}>
            {boardTotals.lists} lists / {boardTotals.cards} cards
          </span>
          {STATUS_LABELS.map((status) => (
            <button
              key={status.id}
              onClick={() => ensureStatusList(status)}
              className={`${projectStatusPillBase} ${status.pill}`}
              title={`Cards marked ${status.title} move to the ${status.listTitle} list`}
            >
              {status.title}
            </button>
          ))}
          {!canEdit && (
            <span className={`text-sm ${dashboardMutedColor} ml-3`}>
              View-only mode: editing disabled.
            </span>
          )}
        </div>
        {activityFeed.length > 0 && (
          <div className={`hidden text-xs ${dashboardMutedColor} lg:block`}>
            {activityFeed[0].message || 'Board activity updated'}
          </div>
        )}
      </div>

      {/* lists area */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className={projectCanvas}>
          <div className={projectListRow}>
            {loading ? (
              <div className="flex gap-4 p-2">
                {[0, 1, 2].map((item) => (
                  <div
                    key={item}
                    className="h-[70vh] w-72 shrink-0 animate-pulse rounded-xl bg-[#101418]/80 p-3"
                  >
                    <div className="mb-4 h-5 w-2/3 rounded bg-white/10" />
                    <div className="mb-3 h-24 rounded-lg bg-white/10" />
                    <div className="mb-3 h-20 rounded-lg bg-white/10" />
                    <div className="h-28 rounded-lg bg-white/10" />
                  </div>
                ))}
              </div>
            ) : (
              <>
                {localLists.length === 0 && !showAddList && (
                  <div className="flex h-40 w-80 shrink-0 flex-col justify-center rounded-xl border border-dashed border-white/20 bg-black/20 px-5 text-sm text-white/80">
                    <p className="font-semibold text-white">No lists yet</p>
                    <p className={`mt-1 text-xs ${dashboardMutedColor}`}>
                      Add a list to start organizing cards.
                    </p>
                  </div>
                )}
                <SortableContext
                  items={localLists.map((list) => `list:${list._id}`)}
                  strategy={horizontalListSortingStrategy}
                >
                  {localLists.map((list) => (
                    <ListColumn
                      key={list._id}
                      list={list}
                      cards={cards[list._id]}
                      onAddCard={handleAddCard}
                      onDeleteCard={handleDeleteCard}
                      onDeleteList={handleDeleteList}
                      onOpenCard={setModalCard}
                      onQuickUpdate={handleQuickUpdateCard}
                      onUpdateList={handleUpdateList}
                      onStatusList={handleListStatusChange}
                      isEditable={canEdit}
                    />
                  ))}
                </SortableContext>

                {showAddList ? (
                  <AddListForm
                    onAdd={handleAddList}
                    onCancel={() => setShowAddList(false)}
                  />
                ) : canEdit ? (
                  <button
                    ref={addListButtonRef}
                    onClick={() => setShowAddList(true)}
                    className={addListButton}
                  >
                    <BsPlusLg className="text-xs" /> Add another list
                  </button>
                ) : (
                  <div
                    className={`flex items-center gap-2 mx-2 mb-2 px-3 py-2 rounded-lg border border-[#27272a] text-xs ${dashboardMutedColor}`}
                  >
                    This board is view-only. Lists cannot be added.
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        <DragOverlay>
          {activeCard ? (
            <DragCard card={activeCard} width={dragOverlayWidth} />
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* card detail modal */}
      {modalCard && (
        <CardDetailModal
          card={modalCard}
          listTitle={
            localLists.find(
              (l) =>
                l._id ===
                (modalCard.listId?.toString() ||
                  findListByCardId(modalCard._id))
            )?.title || 'List'
          }
          onClose={() => setModalCard(null)}
          onSave={handleSaveCard}
          onDelete={handleDeleteCard}
          onStatusChange={handleCardStatusChange}
          onAttach={handleAttachCardImage}
          onTyping={handleTyping}
          typingUsers={typingUsers[modalCard._id]}
          currentUser={currentUser}
          members={projectMembers}
          onQuickUpdate={handleQuickUpdateCard}
          onCommentCountChange={handleCommentCountChange}
          readOnly={readOnlyMode}
        />
      )}

      {/* publish modal */}
      {showPublishModal && (
        <PublishForm
          project={activeProject}
          onClose={() => setShowPublishModal(false)}
          onSave={handlePublishSave}
        />
      )}
    </div>
  )
}

export default Project
