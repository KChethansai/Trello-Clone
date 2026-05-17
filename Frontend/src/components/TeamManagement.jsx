// TeamManagement component: renders a focused piece of the Trello clone UI.
import { useNavigate } from 'react-router-dom'
import {
  BsInbox,
  BsCalendar,
  BsLayoutWtf
} from 'react-icons/bs'
import {
  featuresGrid,
  featureItemCard,
  featureItemIcon,
  featureItemTitle,
  featureItemDesc
} from '../Styles/common'
function TeamManagement() {
  const navigate = useNavigate()
  const featuresData = [
    {
      icon: <BsInbox />,
      title: 'Project Management',
      desc: "Big dreams turn into bigger results with a solid project plan. Use this basic structure to build your team's ideal workflow, for projects big or small.",
      onClick: () => navigate('/templates')
    },
    {
      icon: <BsCalendar />,
      title: 'Team Meeting',
      desc: 'Use this project to end the "circle back" cycle! Make the most of valuable meeting minutes with a clearer agenda, attached decks, previous meeting history, action items, and more.',
      onClick: () => {
        navigate('/templates')
      }
    },
    {
      icon: <BsLayoutWtf />,
      title: 'Team Organization Central',
      desc: 'Use this Trello project to store all the essential team resources including schedules, FAQs, project summaries, updates, and all of your yearly accomplishments.',
      onClick: () => {}
    }
  ]
  return (
    <div>
      <div
        style={{
          backgroundImage:
            'url(data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBw8PEA0NDw8NDw0NDQ0NDQ0NDQ8NDQ0NFREWFhURFRUYHSggGBolGxUVITEhJSkrLi4uFx8zODMtNygtLisBCgoKDg0OFw8PFSsZFRktKy0tKy0tLS0rKy0rLSsrNy0tKy0tKy03Ny03Ky0tKy0tLS0tLSsrLSstKy0rKysrK//AABEIAJkBSgMBIgACEQEDEQH/xAAZAAADAQEBAAAAAAAAAAAAAAAAAQIDBAX/xAAlEAEBAAIBBAMAAgMBAAAAAAAAAQIREgMhMUFRYXGBoZHB8LH/xAAZAQEBAQEBAQAAAAAAAAAAAAABAAIEAwb/xAAbEQEBAQACAwAAAAAAAAAAAAAAARECIRIxQf/aAAwDAQACEQMRAD8A6cr5LZ5eb+pfTvjz2vp3yzX0/aqWmVScWSZTaMqrp5bOI5TL2YRcoOUTcKXCnIl8oJUcKrGLIlEbGqQr3fgSswcTUJwUCVRy/F5eGNMVa43ZdQdP2Op6X0o2NgmgcrRlGorUTaO4vos6Cd2WVZzLu0pMBWmnKKEcoOUTxHE9E+UNHFaMIqM0HFq9/RswsOuvL3+pbXGDhHnrkYr6ftXCHJpagmVRaBTljs8ZIeho6i33MSAJnZS434ag6mWvr+lYRYWoMa2JSliTcHySMFAAhnlGhWKESJ6npZWJMia8YOMa1Yyalxhi0xNvgU7C0inhDyp6Fh0knOKCLLQ00B04y00OktMTmhqSlWMyag6cdiMsxnl6ZvORyNthljlprKKgLQjPyifKHKnmW9nEsABArlopl3Tn5OJfL2WOWx0z0kZWmzzur/AhVv8Af8FyRzo5tYmgLHxDBTzLmJJrYmj0hzVjdlxhS63+oqyuk45ItBxa1IscjBKluHkiZa9LCrlAm5nicJkdTlUQUyGXhEOHVXJQsAJJtPL2jlTDqt/o2nlRypxa68sdJbM8sHnK40yNMZo8cdBWkIy8+VlcdiJPf/tF+0+BzEowACV1GeeTWwrjDKkYdRonHCfClUGfU/00TljtQsRGnAcGtR4+IYDJTJ2KYnNjv9FFgOO9/tPv9HjP/UWQaZY7/U44/J1DHH2oyBLLwjv8tKjgoS7niOB6KFKmQaRckTLVa8Ym4NTEeOWzEgDScmda1HExVFC+I4NasdwTllpF6teWOVqGePUXKMQATlnpJRJ5/Q5nCoFhTCAFqLn9LEsMeW2uF7GzEYBWggM7meOZxLIyRAK0u/0koFKLUTJF6iZ1KcqalSxyOgghann9HCoI5/Q5VYlEZJogVyRlm1IdaBnhWlFMKgJyyMJhEyVtYtdHVntE7uhjljr8ZlcaW2GOonp4a73y0FpJnn5aIzxu1EgHxvwNFLw8GWMNmln1KiVp1cfbFuekqTu3kY9PH36bDkgxzvdtWPUnccUmDZa/RptNsPEMun4hsVqJvmJvarsK36KGXr9PKbKRQLnorXqYb/Wcx23KD6c33alIbNutROfhk1ynZnxpiI8fJWKxhKiyMrGWmNopWaEegadOKpYzUNitxOfhla16nhjY1BTo2Wv0aaD0gA8HOAAkQASBGESACQGhanlfhJQEuwkKAjmkskcj5nCojIEAAoABEABIgAiQAqJWABIFTpElSK5ehMvRJgBNAhbpNyWLTCeQ5E67bPulP3wpPu/w83ILj47qLZpEm5rYZ+zEvn3PmzGJxNQAySznZntqj2YjwUAEGLZloxERjTRakYYKLO413Fnca7+WkJO52Jk7+VilF3PZ8fujPwe0ixmjKXZopyuk3M+p4Z6akS5mcu2TTDwrDFEZAssvInleZYtajAAbRmleaGoCBjST0CsMnk5i4wwEgWodJIuMGjCJABIFx9mEgAEgAEk6vz/RmSIACSOPfY499qB0pmPtQCILjDCSZNGAiVLjPhRFJ4wzJEEZIlYUiiJIAJoUrDCSYYBLfPzUnn5pMuML6ftC+n7FS0dTx/K0dTx/IhRtfTZtOm1UYoDJTLf8Hy+h8l6n7Cj39f2eN2Xu/gw8JGzz8tGeflRJXhl6QePmGpoVppz8MwssqrGoyVHomqc1Jz8MQoIBtBqyas8jAyvtqxphE8xoznmNFVAm9lJzEaLd+P7Ll9Kvn+E+r+kjf0ZezRLPwzaZ+GbUVG18kBLX/9k=)',
          backgroundSize: '100%'
        }}
        className="p-5 text-white font-sans"
      >
        <p
          className="text-lg text-center font-light underline cursor-pointer"
          onClick={() => navigate('/solutions')}
        >
          Back to solutions
        </p>
        <h1 className="text-5xl font-semibold text-center mt-5">
          Trello for Team Management
        </h1>
        <p className="text-2xl text-center mt-4">
          Rule your team without the iron fist. From project management <br />
          to your next virtual party, level up your team management <br />
          practices and workflows with Trello.
        </p>
      </div>
      <div className="p-5 flex justify-center gap-7">
        <img
          src="https://images.ctfassets.net/rz1oowkt5gyp/36PnpdmXvcwbAeIrYlONqB/41927205eb9a3cdcfb08320bc95dd806/Card4_2x.png?w=704&fm=webp"
          alt=""
          className="size-75"
        />
        <div>
          <p className="text-3xl ml-5">
            Trello's projects, lists, and cards enable <br /> teams to go from
            ideas to action in <br /> seconds. Visual and easy-to-use, Trello{' '}
            <br /> helps teams bring projects to life and <br /> keep them
            moving forward.
          </p>
          <button
            className="bg-blue-600 p-5 rounded-2xl cursor-pointer border text-white ml-5 mt-12"
            onClick={() => navigate('/register')}
          >
            Sign up for free
          </button>
        </div>
      </div>
      <div className="bg-gray-200 py-30 mt-12 mb-7">
        <div className="-mt-25">
          <h1 className="text-center text-lg">
            Join over 2,000,000 teams worldwide who are using Trello to get more
            done
          </h1>
        </div>
        <div>
          <ul className="flex gap-30 justify-center mt-10">
            <li>
              <img
                src="https://images.ctfassets.net/rz1oowkt5gyp/7nR3kQlx8IP5mfCCBTatsy/0b3952a6be3ebb10116d62aa93be7bbb/coinbase.svg"
                alt=""
              />
            </li>
            <li>
              <img
                src="https://images.ctfassets.net/rz1oowkt5gyp/6VwRn7PI4zrZo84Uoa8rnt/b0ae3da34916a3ff02d26e2120efe9b8/johnDeere.svg"
                alt=""
              />
            </li>
            <li>
              <img
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
                src="https://images.ctfassets.net/rz1oowkt5gyp/1zdBcYqeqkDsLUfggfKFRO/a732e0001ca5153ef7195eea63ff6a3b/Visa.svg"
                alt=""
              />
            </li>
            <li>
              <img
                className="w-55 -mt-4"
                src="https://images.ctfassets.net/rz1oowkt5gyp/2Im844Kon73pvCD2ljoxeL/4073e041eb8eb961a0f9505965dec09b/Zoom.png?w=324&fm=webp"
                alt=""
              />
            </li>
          </ul>
        </div>
      </div>
      <div className="font-sans">
        <h1 className="text-center text-5xl font-semibold p-2">
          Workspaces for Teams of All Types
        </h1>
        <p className="text-2xl text-center p-2">
          Are your team workflows efficient? Could your digital organization use
          some <br /> love? How often do you find yourself micromanaging your
          employees? Copy <br /> these projects and make them your own to start
          collaborating, tracking, and <br /> organizing more effectively with
          your team.
        </p>
      </div>
      <div className={`${featuresGrid} mt-30 mr-7 ml-7 mb-4`}>
        {featuresData.map((f) => (
          <div key={f.title} className={featureItemCard} onClick={f.onClick}>
            <span className={featureItemIcon}>{f.icon}</span>
            <p className={featureItemTitle}>{f.title}</p>
            <p className={featureItemDesc}>{f.desc}</p>
          </div>
        ))}
      </div>
      <div className="p-5 flex justify-center gap-7 mt-6">
        <div className=" mt-5">
          <div className="text-3xl ml-5">
            <h1 className="text-4xl font-semibold text-center">
              Remove the balancing act from team workloads.
            </h1>
            Make sure burnout and bottlenecks are kept at <br /> bay by
            effectively distributing team workloads <br /> using Dashboard View.
          </div>
        </div>
        <img
          src="https://images.ctfassets.net/rz1oowkt5gyp/36PnpdmXvcwbAeIrYlONqB/41927205eb9a3cdcfb08320bc95dd806/Card4_2x.png?w=704&fm=webp"
          alt=""
          className="size-75"
        />
      </div>
      <div className="grid grid-cols-2 m-10 gap-3">
        <div className="text-center border pb-5 m-0 hover:shadow-2xl transition-all duration-300 ">
          <h1 className="w-full bg-blue-900   py-4"></h1>
          <img
            className="mx-auto w-50 pt-5 pb-5"
            src="https://images.ctfassets.net/rz1oowkt5gyp/5BRXfI8ghoEChfFcvYUOzT/4ae6c8c4dcaeb29a27a57a72fc67949f/magic-swagup.png?w=478&fm=webp"
            alt="This image is not available"
          />
          <h1 className="text-2xl text-blue-950">
            SwagUp:Scale Any business With Trello Bc
          </h1>
          <p className="font-sans text-lg">
            "Not only did [Trello] unify our process and help everyone
            understand<br></br>
            their role, but we were able to automate essential steps of the
            process<br></br>
            so we could move a lot faster and grow to a multi-million dollar{' '}
            <br></br>
            company with a team of ten." <br></br>
            -Founder, SwagUp
          </p>
        </div>
        <div className="text-center border pb-5 m-0 hover:shadow-2xl transition-all duration-300 ">
          <h1 className="w-full bg-green-900   py-4"></h1>
          <img
            className="mx-auto w-50 pt-5 pb-5"
            src="https://images.ctfassets.net/rz1oowkt5gyp/22UrV2M73SFmMQNowgR4qw/6cb8439cf6343da98e0756f2990f9cc3/magic-instinct.png?w=397&fm=webp"
            alt="This image is not available"
          />
          <h1 className="text-2xl text-blue-950">Instinct Dog Training</h1>
          <p className="font-sans text-lg">
            "As you scale, you need visibility, accountability, and
            organization. Trello has provided that for us." <br></br>
            -Brian Burton, Founder, Instinct Dog Training
          </p>
        </div>
        <div className="text-center border pb-5 m-0 hover:shadow-2xl transition-all duration-300 ">
          <h1 className="w-full bg-red-900   py-4"></h1>
          <img
            className="mx-auto w-50 pt-5 pb-5"
            src="https://images.ctfassets.net/rz1oowkt5gyp/7JCD51g6mwxcqLgAzfvSr/86da951ec89f4f0e401cc700436c0cac/business-class-desk-plants.png?w=488&fm=webp"
            alt="This image is not available"
          />
          <h1 className="text-2xl text-blue-950">Desk Plants</h1>
          <p className="font-sans text-lg">
            "We chose Trello because it is well-designed-it's beautifully
            designed-intuitive, and really hit the nail on the head with what we
            needed to solve." <br></br>
            -Lawrence Hanley, founder of Desk Plants
          </p>
        </div>
        <div className="text-center border pb-5 m-0 hover:shadow-2xl transition-all duration-300 ">
          <h1 className="w-full bg-purple-900   py-4"></h1>
          <img
            className="mx-auto w-50 pt-5 pb-5"
            src="https://images.ctfassets.net/rz1oowkt5gyp/3EGeFh1CNlN0kED7PSN7D3/2524aca6067b5db8126bfc0564800e84/Scan2CAD_logo.png?w=460&fm=webp"
            alt="This image is not available"
          />
          <h1 className="text-2xl text-blue-950">Scan2Cad</h1>
          <p className="font-sans text-lg">
            "We use Trello because our data becomes alive. A bullet point list
            turns into real tasks that are assigned to real people with due
            dates and connections to our other apps. The power in that is
            fantastic." <br></br>
            -Luke Kennedy, CEO, Scan2Cad
          </p>
        </div>
      </div>
      <div className="text-center border pb-5 m-0 hover:shadow-2xl transition-all duration-300 w-200 ml-80 mb-30">
        <h1 className="w-full bg-emerald-900   py-4"></h1>
        <img
          className="mx-auto w-50 pt-5 pb-5"
          src="https://images.ctfassets.net/rz1oowkt5gyp/6gqLvQanbBX5bevYnHBfIr/73fdb4b05d67c16792040e8973d3abc4/palace-law.png?w=405&fm=webp"
          alt="This image is not available"
        />
        <h1 className="text-2xl text-blue-950">Palace Law</h1>
        <p className="font-sans text-lg">
          "People have generally been happier since we started using Trello. It
          has made our lives a lot easier. People are less stressed." <br></br>
          -Jordan Couch, attorney at Palace Law
        </p>
      </div>
    </div>
  )
}

export default TeamManagement


