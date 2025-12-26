import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { AnimatePresence, motion } from 'framer-motion'
import { IoIosArrowDown } from 'react-icons/io'
import { MdMiscellaneousServices } from 'react-icons/md'
import Link from 'next/link'
import { toggleServices } from '../../store/sidebarSlice'

interface ServiceSidebarSectionProps {
  isSidebarCollapsed: boolean
}

const ServiceSidebarSection = ({ isSidebarCollapsed }: ServiceSidebarSectionProps) => {
  const sections = useAppSelector((state) => state.sidebar)
  const dispatch = useAppDispatch()

  const handleServiceClick = () => {
    dispatch(toggleServices())
  }

  return (
    <div className="w-full">
      {/* Main clickable item */}
      <div
        onClick={handleServiceClick}
        className="flex items-center justify-between w-full cursor-pointer group py-1"
        title={isSidebarCollapsed ? 'Services' : undefined}
      >
        <div className="flex items-center gap-4">
          <MdMiscellaneousServices className="h-6 w-6 text-gray-700 flex-shrink-0" />
          <span
            className={`font-medium text-gray-800 transition-all duration-200 ${
              isSidebarCollapsed
                ? 'w-0 opacity-0 overflow-hidden'
                : 'opacity-100'
            }`}
          >
            Services
          </span>
        </div>

        {/* Arrow - only visible when sidebar is expanded */}
        {!isSidebarCollapsed && (
          <motion.div
            animate={{ rotate: sections.services ? 180 : 0 }}
            initial={{ rotate: 0 }}
            transition={{ duration: 0.3 }}
          >
            <IoIosArrowDown className="h-5 w-5 text-gray-600" />
          </motion.div>
        )}
      </div>

      {/* Submenu - only shown when expanded and section is open */}
      <AnimatePresence>
        {!isSidebarCollapsed && sections.services && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden flex flex-col gap-3 mt-2 ml-10"
          >
            <Link
              href="/admin/services"
              className="text-gray-600 hover:text-gray-900 transition-colors text-sm"
            >
              Services List
            </Link>
            <Link
              href="/admin/add-service"
              className="text-gray-600 hover:text-gray-900 transition-colors text-sm"
            >
              Add Service
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ServiceSidebarSection