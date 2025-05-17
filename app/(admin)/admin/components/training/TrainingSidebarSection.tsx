import React from 'react'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { toggleTraining } from '../../store/sidebarSlice'
import { AnimatePresence, motion } from 'framer-motion'
import { IoIosArrowDown } from 'react-icons/io'
import { IoCodeWorkingSharp } from 'react-icons/io5'
import Link from 'next/link'

const TrainingSidebarSection = () => {
  const sections = useAppSelector((state) => state.sidebar)
  const dispatch = useAppDispatch()

  const handleTrainingClick = () => {
    dispatch(toggleTraining())
  }
  return (
    <>
      <div
        onClick={() => handleTrainingClick()}
        className="flex items-center justify-between w-[230px] cursor-pointer"
      >
        <div className="flex flex-row items-center justify-between gap-8">
          <IoCodeWorkingSharp className="h-[20px] w-[20px]" />
          <h1>Training</h1>
        </div>
        <div className="">
          <motion.div
            animate={{ rotate: sections.training ? 180 : 0 }}
            initial={{ rotate: 0 }}
            transition={{ duration: 0.3 }}
          >
            <IoIosArrowDown className="cursor-pointer" />
          </motion.div>
        </div>
      </div>
      <AnimatePresence>
        {sections.training && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden flex flex-col gap-4 mt-2 ml-14"
          >
            <Link href={'/admin/training'}>Training List</Link>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default TrainingSidebarSection
