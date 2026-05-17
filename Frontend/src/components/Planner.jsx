// Planner component: renders a focused piece of the Trello clone UI.
import { useNavigate } from 'react-router-dom'

function Planner() {
  const navigate = useNavigate()

  return (
    <div>
      {/* HERO SECTION (with background) */}
      <div className="w-full bg-gray-200 py-20 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10">
          {/* LEFT TEXT */}
          <div className="max-w-lg text-center md:text-left">
            <h1 className="text-5xl font-bold text-blue-950 mb-6 font-loader">
              Trello Planner
            </h1>

            <h2 className="text-4xl font-bold text-blue-950 mb-6 font-loader">
              Plan, stay focused, and get more [sh*t] done
            </h2>

            <p className="text-lg text-gray-700 mb-6">
              Planner is your ultimate planning companion <br />
              to unlock the power of staying in the zone and <br />
              getting more done.
            </p>

            <button
              onClick={() => navigate('/register')}
              className="border border-blue-500 text-blue-600 px-6 py-3 rounded-md hover:bg-blue-50 transition"
            >
              Get Started
            </button>
          </div>

          {/* RIGHT IMAGE */}
          <div className="flex justify-center">
            <img
              className="w-full max-w-lg"
              src="https://images.ctfassets.net/rz1oowkt5gyp/5jLvxYsqWehh4tkm3FqMYj/eec08095626ec26259144e7055dd7d08/planner-hero.png?w=1440&fm=webp"
              alt="Trello Planner"
            />
          </div>
        </div>
      </div>

      <div className="py-20 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-4 text-blue-950 font-loader">
            Plan anytime, anywhere
          </h1>

          <p className=" text-2xl font-extralight">
            Focus and make time for what truly matters. Say goodbye to scattered{' '}
            <br />
            schedules and missed deadlines! Trello Planner is your go-to tool
            for <br />
            capturing and organizing your plans, whether you're at your desk or
            on the go.
          </p>
        </div>
      </div>

      <div className="flex justify-around">
        <div>
          <div className="text-2xl font-extralight">
            <h1 className="text-3xl text-blue-950 font-bold mb-5">
              Effortless scheduling
            </h1>
            Never miss a beat! Schedule tasks and events <br></br>
            directly from your favorite tools, like Google<br></br>
            Calendar and Outlook, ensuring you stay on <br></br>
            top of everything.
          </div>
        </div>
        <div>
          <img
            className="w-150 mb-30"
            src="https://images.ctfassets.net/rz1oowkt5gyp/6agYIp4VLJgXJdlbuofjbs/41f35a2372327f35d3aaee3377250cd3/effortless-scheduling.png?w=1440&fm=webp"
            alt="this img is not available"
          />
        </div>
      </div>

      <div className="flex justify-around">
        <div>
          <img
            className="w-150 mb-30"
            src="https://images.ctfassets.net/rz1oowkt5gyp/3EKhSNm6rGLbkmQbhL7d6l/9ae2600f804c8ae50c0fd4cb5c6b87dd/intuitive-organization.png?w=1440&fm=webp"
            alt="this img is not avaiable"
          />
        </div>
        <div>
          <div className="text-2xl font-extralight">
            <h1 className="text-3xl font-bold text-blue-950 mb-5">
              Intuitive organization
            </h1>
            Ready to lock in your plans? Simply drag and<br></br>
            drop your tasks into the right boards, making<br></br>
            organization a breeze.
          </div>
        </div>
      </div>

      <div className="flex justify-around">
        <div>
          <div className="text-2xl font-extralight">
            <h1 className="text-3xl text-blue-950 font-bold mb-5">
              Stay on track
            </h1>
            Got quick tasks? Mark them "Done" straight <br></br>
            from the Planner and keep your productivity<br></br>
            flowing!
          </div>
        </div>
        <div>
          <img
            className="w-150 mb-30 "
            src="https://images.ctfassets.net/rz1oowkt5gyp/1EAMkyBfaJLQgiLvUqMiqQ/2c1013ad6d07c9d3a4ab1ef77d3a049e/stay-on-track.png?w=1440&fm=webp"
            alt="this img is not available"
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

export default Planner


