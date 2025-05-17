import React from 'react'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { toggleTrainingProgram } from '../../store/sidebarSlice'
import { AnimatePresence, motion } from 'framer-motion'
import { IoIosArrowDown } from 'react-icons/io'
import { IoCodeWorkingSharp } from 'react-icons/io5'
import Link from 'next/link'

const TrainingProgramSidebarSection = () => {
  const sections = useAppSelector((state) => state.sidebar)
  const dispatch = useAppDispatch()

  const handleTrainingProgramClick = () => {
    dispatch(toggleTrainingProgram())
  }
  return (
    <>
      <div
        onClick={() => handleTrainingProgramClick()}
        className="flex items-center justify-between w-[230px] cursor-pointer"
      >
        <div className="flex flex-row items-center justify-between gap-8">
          <IoCodeWorkingSharp className="h-[20px] w-[20px]" />
          <h1>Training Program</h1>
        </div>
        <div className="">
          <motion.div
            animate={{ rotate: sections.training_program ? 180 : 0 }}
            initial={{ rotate: 0 }}
            transition={{ duration: 0.3 }}
          >
            <IoIosArrowDown className="cursor-pointer" />
          </motion.div>
        </div>
      </div>
      <AnimatePresence>
        {sections.training_program && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden flex flex-col gap-4 mt-2 ml-14"
          >
            <Link href={'/admin/training-program'}>Training Program List</Link>
            <Link href={'/admin/add-new-training-program'}>
              Add New Training Program
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default TrainingProgramSidebarSection
