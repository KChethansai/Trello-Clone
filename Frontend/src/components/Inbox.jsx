// Inbox component: renders a focused piece of the Trello clone UI.
import { useNavigate } from 'react-router-dom'
function Inbox() {
  const navigate = useNavigate()
  return (
    <div>
      <div className="w-full bg-gray-100 py-20 px-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between">
          <div className="max-w-lg">
            <h1 className="text-5xl font-bold text-blue-950 mb-6 font-loader">
              Trello Inbox
            </h1>

            <p className="text-lg text-gray-700 mb-6">
              Capture, organize, and conquer every to-do
            </p>

            <button
              className="border border-blue-500 text-blue-600 px-6 py-3 rounded-md hover:bg-blue-50 transition"
              onClick={() => {
                navigate('/register')
              }}
            >
              Try Inbox for free
            </button>
          </div>
          <div>
            <img
              className="w-200 block float-right"
              src="https://images.ctfassets.net/rz1oowkt5gyp/15yelj0vFDnyOgwyWAZSup/bbdc0dfa821ff9056b2eae8a782c14bf/inbox-hero-updated.png?w=1440&fm=webp"
              alt=""
            />
          </div>
        </div>
      </div>

      <div className="mt-30 ml-125">
        <h1 className="text-3xl text-blue-950 font-bold ml-23">
          Capture anywhere, anytime
        </h1>
        <p className="font-loader font-light text-lg">
          Say goodbye to lost to-dos and scattered ideas! Trello Inbox saves you
          from <br></br>
          the chaos of emails, messages, and notes. Jot down thoughts as they
          come<br></br>
          or effortlessly snatch snippets from your favorite tools-no need to
          organize<br></br>
        </p>
        <div>
          <p className="font-loader font-light text-lg ml-47">
            them right away.
          </p>
        </div>
      </div>
      <div className="ml-100 mt-15">
        <img
          className="w-200 pr-10 mb-50"
          src="https://images.ctfassets.net/rz1oowkt5gyp/76s8l9DR2ZxNhjevNpluXZ/cfb2b7555f019f09045ff08b05cf5a4d/inbox-subheader-updated.png?w=1440&fm=webp"
          alt=""
        />
      </div>

      <div className="flex justify-around">
        <div className="text-2xl font-extralight font-loader">
          <h1 className="text-3xl font-bold text-blue-950">Instant capture</h1>
          No more missed opportunities! Capture tasks <br></br>
          and ideas from emails and your favorite <br></br>
          messaging apps-like Slack and Microsoft <br></br>
          Teams-so nothing important slips away.
        </div>
        <div className="w-100 mb-30">
          <img
            className="mr-30"
            src="https://images.ctfassets.net/rz1oowkt5gyp/3bcHZVmKoRsaSDFZKJwXDw/77413476c30fe9e370b31735ab8acc21/inbox-email.png?w=1440&fm=webp"
            alt="this img is not available"
          />
        </div>
      </div>
      <div className="flex justify-around ">
        <div>
          <img
            className="w-100 mb-30 "
            src="https://images.ctfassets.net/rz1oowkt5gyp/5DRtL3KwxCfXwlkz5KOktV/9ccca794c97e1667b267ef9b23559876/inbox-to-board.png?w=1440&fm=webp"
            alt="this image is not available"
          />
        </div>
        <div>
          <div className="text-2xl font-extralight font-loader">
            <h1 className="text-3xl text-blue-950 font-loader">
              Seamless organization
            </h1>
            Ready to tidy up? Simply drag and drop your captured<br></br>
            items into the right boards, making organization a<br></br>
            breeze.
          </div>
        </div>
      </div>

      <div className="flex justify-around">
        <div>
          <div className="text-2xl font-extralight font-loader">
            <h1 className="text-3xl text-blue-950 font-loader">
              Intuitive organization
            </h1>
            Got quick to-dos? Mark them "Done" straight from the<br></br>
            Inbox and keep your momentum going!
          </div>
        </div>
        <div>
          <img
            className="w-100 mb-30"
            src="https://images.ctfassets.net/rz1oowkt5gyp/409sOWzv1tfbFOOHEyjIzs/4d40324069846676dacf868fe3b373e0/inbox-donestate.png?w=1440&fm=webp"
            alt="this image in not available"
          />
        </div>
      </div>

      <div className="bg-blue-500 py-10 flex items-center justify-center">
        <div className="text-center px-4">
          <h1 className="text-4xl font-bold text-white">
            Join the Trello Inbox revolution!
          </h1>

          <p className="text-white text-lg leading-relaxed ">
            We're thrilled to bring you Trello Inbox, and we want your input to
            make it even better! Try it out, share your feedback,<br></br>
            and help us innovate the future of to-do list management.
          </p>
          <button
            className="bg-white text-blue-600 px-6 py-3 rounded-md font-semibold mt-5"
            onClick={() => {
              navigate('/register')
            }}
          >
            Get Started
          </button>
        </div>
      </div>
    </div>
  )
}

export default Inbox


