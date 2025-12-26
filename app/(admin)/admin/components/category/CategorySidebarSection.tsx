import React from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { MdWidgets } from 'react-icons/md'
import { IoIosArrowDown } from 'react-icons/io'
import Link from 'next/link'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { toggleCategory } from '../../store/sidebarSlice'

interface CategorySidebarSectionProps {
  isSidebarCollapsed: boolean
}

const CategorySidebarSection = ({ isSidebarCollapsed }: CategorySidebarSectionProps) => {
  const sections = useAppSelector((state) => state.sidebar)
  const dispatch = useAppDispatch()

  const handleCategoryClick = () => {
    dispatch(toggleCategory())
  }

  return (
    <div className="w-full">
      {/* Main clickable item */}
      <div
        onClick={handleCategoryClick}
        className="flex items-center justify-between w-full cursor-pointer group py-1"
        title={isSidebarCollapsed ? 'Category' : undefined}
      >
        <div className="flex items-center gap-4">
          <MdWidgets className="h-6 w-6 text-gray-700 flex-shrink-0" />
          <span
            className={`font-medium text-gray-800 transition-all duration-200 ${
              isSidebarCollapsed
                ? 'w-0 opacity-0 overflow-hidden'
                : 'opacity-100'
            }`}
          >
            Category
          </span>
        </div>

        {/* Arrow icon - hidden when sidebar is collapsed */}
        {!isSidebarCollapsed && (
          <motion.div
            animate={{ rotate: sections.category ? 180 : 0 }}
            initial={{ rotate: 0 }}
            transition={{ duration: 0.3 }}
          >
            <IoIosArrowDown className="h-5 w-5 text-gray-600" />
          </motion.div>
        )}
      </div>

      {/* Submenu - only shown when sidebar is expanded */}
      <AnimatePresence>
        {!isSidebarCollapsed && sections.category && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden flex flex-col gap-3 mt-2 ml-10"
          >
            <Link
              href="/admin/category"
              className="text-gray-600 hover:text-gray-900 transition-colors text-sm"
            >
              Category List
            </Link>
            <Link
              href="/admin/add-new-category"
              className="text-gray-600 hover:text-gray-900 transition-colors text-sm"
            >
              Add New Category
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default CategorySidebarSection