import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { AnimatePresence, motion } from 'framer-motion'
import { IoIosArrowDown } from 'react-icons/io'
import { GrProjects } from 'react-icons/gr'
import Link from 'next/link'
import { toggleProjects } from '../../store/sidebarSlice'

const ProjectSidebarSection = () => {
  const sections = useAppSelector((state) => state.sidebar)
  const dispatch = useAppDispatch()

  const handleProjectsClick = () => {
    dispatch(toggleProjects())
  }
  return (
    <>
      <div
        onClick={() => handleProjectsClick()}
        className="flex items-center justify-between w-[230px] cursor-pointer"
      >
        <div className="flex flex-row items-center justify-between gap-8">
          <GrProjects className="h-[20px] w-[20px]" />
          <h1>Projects</h1>
        </div>
        <div className="">
          <motion.div
            animate={{ rotate: sections.projects ? 180 : 0 }}
            initial={{ rotate: 0 }}
            transition={{ duration: 0.3 }}
          >
            <IoIosArrowDown className="cursor-pointer" />
          </motion.div>
        </div>
      </div>
      <AnimatePresence>
        {sections.projects && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden flex flex-col gap-4 mt-2 ml-14"
          >
            <Link href={'/admin/projects'}>Projects</Link>
            <Link href={'/admin/add-project'}>Add project</Link>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default ProjectSidebarSection
