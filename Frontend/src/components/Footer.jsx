// Footer component: renders a focused piece of the Trello clone UI.
function Footer() {
  return (
    <div className="flex justify-around bg-[#1C2F4E] h-40 ">
      <div className="flex justify-between mt-2.5 pl-12">
        <img
          className="size-12 mt-14 ml-12 "
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQpk9ifUX_iS-klyfXAfpIpkElw_dY69Nm1Fg&s"
          alt="Not Found"
        />
        <ul className="p-5 mt-7">
          <li className="text-[#d8dee6] font-semibold text-2xl">Atlassian</li>
          <li className="text-[#d8dee6] font-semibold text-2xl">Trello</li>
        </ul>
      </div>
      <div className="flex justify-around">
        <ul className="border-white flex justify-between m-5 p-5 text-[#d8dee6]">
          <li>
            <ul className="hover:bg-[#344563] p-2.5">
              <li className="text-2xl">About Trello</li>
              <li className="text-2xs">What's behind the board</li>
            </ul>
          </li>
          <li>
            <ul className="hover:bg-[#344563] p-2.5">
              <li className="text-2xl">Jobs</li>
              <li>Learn about open roles on the Trello team.</li>
            </ul>
          </li>
          <li>
            <ul className="hover:bg-[#344563] p-2.5">
              <li className="text-2xl">Apps</li>
              <li>
                Download the Trello App for your Desktop or Mobile devices.
              </li>
            </ul>
          </li>
          <li>
            <ul className="hover:bg-[#344563] p-2.5">
              <li className="text-2xl">Contact us</li>
              <li>Need anything? Get in touch and we can help.</li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default Footer


