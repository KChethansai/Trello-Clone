// Solutions component: renders a focused piece of the Trello clone UI.
import { useNavigate } from 'react-router-dom'
function Solutions() {
  const navigate = useNavigate()
  return (
    <div>
      <div className="text-center bg-blue-950">
        <img
          className="mx-auto pt-15 w-50 pb-10"
          src="https://images.ctfassets.net/rz1oowkt5gyp/5AE4nXLOennRxmmUMcgMLM/747e96bdd16cf4113e4ef867bd85fd29/solutions.svg"
          alt="this image is not available"
        />

        <h1 className="text-5xl text-zinc-100 font-semibold pb-7">
          Trello Solutions For All Teams
        </h1>

        <p className="pb-30 text-zinc-50 font-semibold">
          It's easy to get your entire team up and running with Trello. Click on
          a team type
          <br />
          below to uncover all of the projects, techniques, and integrations you
          need to
          <br />
          succeed.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-5 m-20">
        <div
          className="border  rounded cursor-pointer"
          onClick={() => navigate('/engineering')}
        >
          <img
            className="w-full h-40 object-cover rounded"
            src="https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcTNxm_iQpU_G7uqkgP1hbC525fz9opnrcEX1V2bnMMxDIr6-sAG"
            alt="this image is not available"
          />
          <h1 className="mt-3 p-2 font-semibold text-xl underline cursor-pointer">
            Engineering
          </h1>
          <p className="p-2">
            Ship more code and enable your team to be more agile with Trello for
            developers
          </p>
        </div>

        <div
          className="border  rounded cursor-pointer"
          onClick={() => navigate('/design')}
        >
          <img
            className="w-full h-40 object-cover rounded"
            src="https://images.squarespace-cdn.com/content/v1/5fc6dab681da8a590dace76d/57a685be-3a73-4423-b237-f61e03ca0eb5/Hero+Background+Populus.png"
            alt="this image is not available"
          />
          <h1 className="mt-3 p-2 font-semibold text-xl underline cursor-pointer">
            Design
          </h1>
          <p className="p-2">
            From creative requets to cross-teams collaboration,leatn how trello
            helps design teams deliver with style
          </p>
        </div>

        <div
          className="border   rounded cursor-pointer"
          onClick={() => navigate('/')}
        >
          <img
            className="w-full h-40  object-cover rounded"
            src="https://framerusercontent.com/images/8YUni5hIXQdBq5IrkNfzONHyI4.png?width=2150&height=1187"
            alt="this image is not available"
          />
          <h1 className="mt-3 p-2 font-semibold text-xl underline cursor-pointer">
            Personal Productivity
          </h1>
          <p className="p-2">
            Discover how to use trello to take your personal productivity to the
            next level
          </p>
        </div>

        <div
          className="border  rounded cursor-pointer"
          onClick={() => navigate('/team-management')}
        >
          <img
            className="w-full h-40 object-cover rounded"
            src="https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcQvf8IUxeafOwLFfOyLEDYuPQMPZcG5qQE78c5oh2KFT2Mr2Zch"
            alt="this image is not available"
          />
          <h1 className="mt-3 p-2 font-semibold text-xl underline cursor-pointer">
            Team Managment
          </h1>
          <p className="p-2">
            From project coorination to your nextg virtual aprty,level up team
            productivity and management pratices with trello
          </p>
        </div>
      </div>
    </div>
  )
}

export default Solutions


