// projectStore store: centralizes client state and API calls for this domain.
import { create } from 'zustand'
import { createProjectSlice } from './projectSlices/projectSlice'
import { createListSlice } from './projectSlices/listSlice'
import { createCardSlice } from './projectSlices/cardSlice'
import { createSocketSlice } from './projectSlices/socketSlice'
import { createUtilitySlice } from './projectSlices/utilitySlice'

export const useProjectStore = create((set, get) => ({
  ...createProjectSlice(set, get),
  ...createListSlice(set, get),
  ...createCardSlice(set, get),
  ...createSocketSlice(set, get),
  ...createUtilitySlice(set, get)
}))
