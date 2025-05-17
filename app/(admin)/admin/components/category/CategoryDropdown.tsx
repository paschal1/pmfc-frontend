import { AnimatePresence, motion } from 'framer-motion'
import React from 'react'
import Link from 'next/link'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { closeSidebar } from '../../store/mobileSidebarSlice'
import { toggleCategory } from '../../store/sidebarSlice'
import { MdWidgets } from 'react-icons/md'
import { IoIosArrowDown } from 'react-icons/io'

const CategoryDropdown = () => {
  const sections = useAppSelector((state) => state.sidebar)
  const dispatch = useAppDispatch()

  const handleCloseSidebar = () => {
    dispatch(closeSidebar())
  }
  
  const handleCategoryClick = () => {
    dispatch(toggleCategory())
  }

  return (
    <>
      <div
        onClick={() => handleCategoryClick()}
        className="flex items-center justify-between w-[230px]"
      >
        <div className="flex flex-row items-center justify-between gap-8">
          <MdWidgets className="h-[20px] w-[20px]" />
          <h1>Category</h1>
        </div>
        <div className="">
          <motion.div
            animate={{ rotate: sections.category ? 180 : 0 }}
            initial={{ rotate: 0 }}
            transition={{ duration: 0.3 }}
          >
            <IoIosArrowDown className="cursor-pointer" />
          </motion.div>
        </div>
      </div>
      <AnimatePresence>
        {sections.category && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden flex flex-col gap-4 mt-2 ml-14"
          >
            <Link href={'/admin/category'} onClick={() => handleCloseSidebar()}>
              Category List
            </Link>
            <Link
              href={'/admin/add-new-category'}
              onClick={() => handleCloseSidebar()}
            >
              Add New Category
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default CategoryDropdown
