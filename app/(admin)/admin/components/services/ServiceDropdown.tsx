import { AnimatePresence, motion } from 'framer-motion'
import Link from 'next/link'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { closeSidebar } from '../../store/mobileSidebarSlice'
import { IoIosArrowDown } from 'react-icons/io'
import { MdMiscellaneousServices } from 'react-icons/md'
import { toggleServices } from '../../store/sidebarSlice'

const ServiceDropdown = () => {
  const sections = useAppSelector((state) => state.sidebar)
  const dispatch = useAppDispatch()

  const handleCloseSidebar = () => {
    dispatch(closeSidebar())
  }

  const handleServiceClick = () => {
    dispatch(toggleServices())
  }
  return (
    <>
      <div
        onClick={() => handleServiceClick()}
        className="flex items-center justify-between w-[230px]"
      >
        <div className="flex flex-row items-center justify-between gap-8">
          <MdMiscellaneousServices className="h-[20px] w-[20px]" />
          <h1>Services</h1>
        </div>
        <div className="">
          <motion.div
            animate={{ rotate: sections.services ? 180 : 0 }}
            initial={{ rotate: 0 }}
            transition={{ duration: 0.3 }}
          >
            <IoIosArrowDown className="cursor-pointer" />
          </motion.div>
        </div>
      </div>
      <AnimatePresence>
        {sections.services && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden flex flex-col gap-4 mt-2 ml-14"
          >
            <Link href={'/admin/services'} onClick={() => handleCloseSidebar()}>
              Services
            </Link>
            <Link
              href={'/admin/add-service'}
              onClick={() => handleCloseSidebar()}
            >
              Add Service
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default ServiceDropdown
