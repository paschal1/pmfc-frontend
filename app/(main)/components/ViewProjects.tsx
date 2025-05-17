import { RiArrowRightSLine } from 'react-icons/ri'
import { Parallax } from 'react-parallax'

const ViewProjects = () => {
  return (
    <>
          <div className="h-[120px] w-[100%] bg-[#fab702] flex items-center">
            <button className="flex items-center mx-auto text-[11px] border border-black uppercase p-[0.4rem] px-[0.8rem] pr-10 font-semibold relative hover:bg-black hover:text-white group transition-all duration-300 ease">
              <h1>View All Projects</h1>
              <RiArrowRightSLine className="absolute right-3 h-[25px] w-[25px] font-bold transition-all duration-300 ease  group-hover:right-1" />
            </button>
          </div>
    </>
  )
}

export default ViewProjects
