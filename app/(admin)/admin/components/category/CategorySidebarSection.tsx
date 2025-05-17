import React from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { MdWidgets } from 'react-icons/md'
import { IoIosArrowDown } from 'react-icons/io'
import Link from 'next/link'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { toggleCategory } from '../../store/sidebarSlice'

const CategorySidebarSection = () => {
  const sections = useAppSelector((state) => state.sidebar)
  const dispatch = useAppDispatch()

  const handleCategoryClick = () => {
    dispatch(toggleCategory())
  }
  return (
    <>
      <div
        onClick={() => handleCategoryClick()}
        className="flex items-center justify-between w-[230px] cursor-pointer"
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
            <Link href={'/admin/category'}>Category List</Link>
            <Link href={'/admin/add-new-category'}>Add New Category</Link>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default CategorySidebarSection
