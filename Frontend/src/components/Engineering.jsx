// Engineering component: renders a focused piece of the Kanvora UI.
import { useNavigate } from 'react-router-dom'
import {
  accentText,
  primaryText,
  accentBg,
  pageBg,
  successBg,
  errorBg,
  surfaceBg
} from '../Styles/common'
function Engineering() {
  const navigate = useNavigate()
  return (
    <div>
      <div className="text-center mt-3">
        <button
          className={`pb-20 ${accentText} cursor-pointer underline font-light text-lg`}
          onClick={() => navigate('/solutions')}
        >
          Back to solutions
        </button>
        <h1 className={`text-5xl font-bold ${primaryText} mt-5`}>
          Kanvora for Engineering Teams
        </h1>
        <p className={`mt-5 ${primaryText} text-lg`}>
          Enable your engineering team to be agile, ship more with less<br></br>
          stress, and collaborate on product launches and bug fixes<br></br>
          seamlessly with Kanvora.
        </p>
      </div>

      <div className="flex gap-30 mt-30">
        <div>
          <img
            className="w-100 ml-30 transition-all duration-400 hover:-translate-x-6 hover:rotate-5  rounded-2xl"
            src="https://images.ctfassets.net/rz1oowkt5gyp/36PnpdmXvcwbAeIrYlONqB/41927205eb9a3cdcfb08320bc95dd806/Card4_2x.png?w=704&fm=webp"
            alt="this image is not available"
          />
        </div>
        <div className="pr-50 mb-30">
          <p className="text-2xl">
            Kanvora's boards, lists, and cards enable teams to go from ideas
            <br></br>
            to action in seconds. Visual and easy-to-use, Kanvora helps teams
            <br></br>
            bring projects to life and keep them moving forward.
          </p>
          <button
            className={`mt-10 p-4 rounded-2xl ${accentBg} cursor-pointer text-white`}
            onClick={() => navigate('/register')}
          >
            Signup it's free
          </button>
        </div>
      </div>
      <div className={`${pageBg} py-30 mt-12 mb-10`}>
        <div className="-mt-25">
          <h1 className="text-center text-lg">
            Join over 2,000,000 teams worldwide who are using Kanvora to get
            more done
          </h1>
        </div>
        <div>
          <ul className="flex gap-30 justify-center mt-10">
            <li>
              <img
                className="transition-all duration-300 hover:-translate-y-3 hover:rotate-1 hover:scale-106"
                src="https://images.ctfassets.net/rz1oowkt5gyp/7nR3kQlx8IP5mfCCBTatsy/0b3952a6be3ebb10116d62aa93be7bbb/coinbase.svg"
                alt=""
              />
            </li>
            <li>
              <img
                className="transition-all duration-300 hover:-translate-y-3 hover:rotate-1 hover:scale-106"
                src="https://images.ctfassets.net/rz1oowkt5gyp/6VwRn7PI4zrZo84Uoa8rnt/b0ae3da34916a3ff02d26e2120efe9b8/johnDeere.svg"
                alt=""
              />
            </li>
            <li>
              <img
                className="transition-all duration-300 hover:-translate-y-3 hover:rotate-1 hover:scale-106"
                src="https://images.ctfassets.net/rz1oowkt5gyp/5KdQPApAFJpLMv9AntiNLk/530cef2a4b56ad758c1e91fad5c3e7ac/Grand-Hyatt.svg"
                alt=""
              />
            </li>
          </ul>
        </div>
        <div className="mt-10">
          <ul className="flex justify-center gap-30">
            <li>
              <img
                className="transition-all duration-300 hover:-translate-y-3 hover:rotate-1 hover:scale-106"
                src="https://images.ctfassets.net/rz1oowkt5gyp/1zdBcYqeqkDsLUfggfKFRO/a732e0001ca5153ef7195eea63ff6a3b/Visa.svg"
                alt=""
              />
            </li>
            <li>
              <img
                className="w-55 -mt-4 transition-all duration-300 hover:-translate-y-3 hover:rotate-1 hover:scale-106"
                src="https://images.ctfassets.net/rz1oowkt5gyp/2Im844Kon73pvCD2ljoxeL/4073e041eb8eb961a0f9505965dec09b/Zoom.png?w=324&fm=webp"
                alt=""
              />
            </li>
          </ul>
        </div>
      </div>
      <div className="text-center mb-19 text-lg">
        <p className={`text-3xl ${primaryText} font-semibold mb-5`}>
          Your Team's Workspace For Engineering<br></br>
          Excellence
        </p>
        <p>
          Whether the team is planning a new product roadmap, running sprint
          <br></br>
          retrospectives, collaborating on bug fixes, or celebrating a go-live,
          there's a<br></br>
          Kanvora board to help with every aspect of an engineer's day (or
          all-nighter).
        </p>
      </div>
      <div className="flex justify-around mb-20">
        <div className=" p-5   hover:shadow-2xl transition-all duration-300 border rounded-2xl  text-center">
          <h1>
            <strong>SPRINT RETROSPECTIVE</strong>
          </h1>
          <p>
            Celebrate what went well, what needs improvement,<br></br>
            and any action items required to improve communication and <br></br>
            collaboration with this template<br></br>
          </p>
        </div>
        <div className=" p-5   hover:shadow-2xl transition-all duration-300 border rounded-2xl   text-center">
          <h1>
            <strong>SITE RELIABILITY</strong>
          </h1>
          <p>
            Celebrate what went well, what needs improvement,<br></br>
            architure,and development with thisk template
          </p>
        </div>
        <div className=" p-5   hover:shadow-2xl transition-all duration-300 border rounded-2xl   text-center">
          <h1>
            <strong>SOFTWARE DEVELOPMENT</strong>
          </h1>
          <p>
            A one-stop-shop for software development teams looking to <br></br>
            organize, manage tasks, and manage deadlines and features <br></br>
            for their IT development projects.
          </p>
        </div>
      </div>
      <div className="flex justify-around mb-30">
        <div className="mt-50 ml-30">
          <div className="text-lg">
            <h1 className={`text-3xl ${primaryText} font-bold`}>
              Build things better, together, and on time.
            </h1>
            With Timeline View, your Engineering team<br></br>
            can easily sync for sprints and align on project<br></br>
            deadlines.
          </div>
          <button
            className={`text-lg ${accentText}`}
            onClick={() => navigate('/login')}
          >
            Learn more about view
          </button>
        </div>
        <div>
          <img
            className="w-full transition-all duration-500 hover:-translate-y-3 hover:rotate-1 hover:scale-105"
            src="https://images.ctfassets.net/rz1oowkt5gyp/6zrD22xQAngEpRDcvQhRRS/268bec622423c5baa0ad4e1e5395f0ac/Timeline_View_Illo_4.png?w=1081&fm=webp"
            alt="this image is not available"
          />
        </div>
      </div>
      <div className="flex justify-around mb-30">
        <div>
          <img
            className="w-100 transition-all duration-500 hover:-translate-y-3 hover:rotate-1 hover:scale-105"
            src="https://images.ctfassets.net/rz1oowkt5gyp/3ckrK4xwt7siEpoqbi2eSJ/5094464c2f3f376d9749c127de9cf03e/Engineering_Template_2x.png?w=740&fm=webp"
            alt="this img is not available"
          />
        </div>
        <div className="mt-20 mr-40">
          <div className="text-2xl font-sans">
            <h1 className={`text-3xl font-semibold ${primaryText} pt-2`}>
              Power-Up Your Development Process
            </h1>
            Simple, adaptable, customizable. Make Kanvora<br></br>
            your official engineering hub with Power-Ups<br></br>
            like Github, Jira, Gitlab, and Custom Fields.<br></br>
            Connect your favorite apps and integrations to<br></br>
            Kanvora and gather all of the information you<br></br>
            need to get things done under one roof.
          </div>
        </div>
      </div>
      <div className="flex justify-around mb-30">
        <div>
          <div className="mt-10 font-sans text-2xl">
            <h1 className={`text-3xl ${primaryText}`}>
              Move Work Forward, Auto-magically
            </h1>
            Kanvora's built-in automation makes it easy to<br></br>
            automate the repetitive, everyday tasks that<br></br>
            keep your team from focusing on the work<br></br>
            that matters most.
          </div>
        </div>
        <div>
          <img
            className="transition-all duration-500 hover:-translate-y-3 hover:rotate-1 hover:scale-105"
            src="https://images.ctfassets.net/rz1oowkt5gyp/53ZmkLWjldHmiQO8BhOYwh/f13a27886a208118c75f7f8c34f5f5d2/Butler.svg"
            alt="this image is not available"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 m-10 gap-7">
        <div className="text-center border pb-5 m-0 transition-all duration-300 hover:-translate-y-3  hover:scale-105 cursor-pointer">
          <h1 className={`w-full ${primaryText}   py-4`}></h1>
          <img
            className="mx-auto w-50 pt-5 pb-5"
            src="https://images.ctfassets.net/rz1oowkt5gyp/5BRXfI8ghoEChfFcvYUOzT/4ae6c8c4dcaeb29a27a57a72fc67949f/magic-swagup.png?w=478&fm=webp"
            alt="This image is not available"
          />
          <h1 className={`text-2xl ${primaryText}`}>
            SwagUp: Scale Any business With Kanvora
          </h1>
          <p className="font-sans text-lg">
            "Not only did [Kanvora] unify our process and help everyone
            understand<br></br>
            their role, but we were able to automate essential steps of the
            process<br></br>
            so we could move a lot faster and grow to a multi-million dollar{' '}
            <br></br>
            company with a team of ten." <br></br>
            -Founder, SwagUp
          </p>
        </div>
        <div className="text-center border pb-5 m-0 transition-all duration-300 hover:-translate-y-3  hover:scale-105 cursor-pointer">
          <h1 className={`w-full ${successBg}   py-4`}></h1>
          <img
            className="mx-auto w-50 pt-5 pb-5"
            src="https://images.ctfassets.net/rz1oowkt5gyp/22UrV2M73SFmMQNowgR4qw/6cb8439cf6343da98e0756f2990f9cc3/magic-instinct.png?w=397&fm=webp"
            alt="This image is not available"
          />
          <h1 className={`text-2xl ${primaryText}`}>Instinct Dog Training</h1>
          <p className="font-sans text-lg">
            "As you scale, you need visibility, accountability, and
            organization. Kanvora has provided that for us." <br></br>
            -Brian Burton, Founder, Instinct Dog Training
          </p>
        </div>
        <div className="text-center border pb-5 m-0 transition-all duration-300 hover:-translate-y-3  hover:scale-105 cursor-pointer ">
          <h1 className={`w-full ${errorBg}   py-4`}></h1>
          <img
            className="mx-auto w-50 pt-5 pb-5"
            src="https://images.ctfassets.net/rz1oowkt5gyp/7JCD51g6mwxcqLgAzfvSr/86da951ec89f4f0e401cc700436c0cac/business-class-desk-plants.png?w=488&fm=webp"
            alt="This image is not available"
          />
          <h1 className={`text-2xl ${primaryText}`}>Desk Plants</h1>
          <p className="font-sans text-lg">
            "We chose Kanvora because it is well-designed-it's beautifully
            designed-intuitive, and really hit the nail on the head with what we
            needed to solve." <br></br>
            -Lawrence Hanley, founder of Desk Plants
          </p>
        </div>
        <div className="text-center border pb-5 m-0 transition-all duration-300 hover:-translate-y-3  hover:scale-105 cursor-pointer ">
          <h1 className={`w-full ${surfaceBg}   py-4`}></h1>
          <img
            className="mx-auto w-50 pt-5 pb-5"
            src="https://images.ctfassets.net/rz1oowkt5gyp/3EGeFh1CNlN0kED7PSN7D3/2524aca6067b5db8126bfc0564800e84/Scan2CAD_logo.png?w=460&fm=webp"
            alt="This image is not available"
          />
          <h1 className={`text-2xl ${primaryText}`}>Scan2Cad</h1>
          <p className="font-sans text-lg">
            "We use Kanvora because our data becomes alive. A bullet point list
            turns into real tasks that are assigned to real people with due
            dates and connections to our other apps. The power in that is
            fantastic." <br></br>
            -Luke Kennedy, CEO, Scan2Cad
          </p>
        </div>
      </div>
      <div className="text-center border pb-5 m-0 transition-all duration-300 hover:-translate-y-3  hover:scale-105 cursor-pointer w-200 ml-80 mb-30">
        <h1 className={`w-full ${successBg}   py-4`}></h1>
        <img
          className="mx-auto w-50 pt-5 pb-5"
          src="https://images.ctfassets.net/rz1oowkt5gyp/6gqLvQanbBX5bevYnHBfIr/73fdb4b05d67c16792040e8973d3abc4/palace-law.png?w=405&fm=webp"
          alt="This image is not available"
        />
        <h1 className={`text-2xl ${primaryText}`}>Palace Law</h1>
        <p className="font-sans text-lg">
          "People have generally been happier since we started using Kanvora. It
          has made our lives a lot easier. People are less stressed." <br></br>
          -Jordan Couch, attorney at Palace Law
        </p>
      </div>
    </div>
  )
}

export default Engineering
