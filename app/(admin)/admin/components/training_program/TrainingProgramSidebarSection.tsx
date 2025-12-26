import React from 'react'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { toggleTrainingProgram } from '../../store/sidebarSlice'
import { AnimatePresence, motion } from 'framer-motion'
import { IoIosArrowDown } from 'react-icons/io'
import { IoCodeWorkingSharp } from 'react-icons/io5'
import Link from 'next/link'

interface TrainingProgramSidebarSectionProps {
  isSidebarCollapsed: boolean
}

const TrainingProgramSidebarSection = ({ isSidebarCollapsed }: TrainingProgramSidebarSectionProps) => {
  const sections = useAppSelector((state) => state.sidebar)
  const dispatch = useAppDispatch()

  const handleTrainingProgramClick = () => {
    dispatch(toggleTrainingProgram())
  }

  return (
    <div className="w-full">
      {/* Main clickable item */}
      <div
        onClick={handleTrainingProgramClick}
        className="flex items-center justify-between w-full cursor-pointer group py-1"
        title={isSidebarCollapsed ? 'Training Program' : undefined}
      >
        <div className="flex items-center gap-4">
          <IoCodeWorkingSharp className="h-6 w-6 text-gray-700 flex-shrink-0" />
          <span
            className={`font-medium text-gray-800 transition-all duration-200 ${
              isSidebarCollapsed
                ? 'w-0 opacity-0 overflow-hidden'
                : 'opacity-100'
            }`}
          >
            Training Program
          </span>
        </div>

        {/* Arrow - only visible when sidebar is expanded */}
        {!isSidebarCollapsed && (
          <motion.div
            animate={{ rotate: sections.training_program ? 180 : 0 }}
            initial={{ rotate: 0 }}
            transition={{ duration: 0.3 }}
          >
            <IoIosArrowDown className="h-5 w-5 text-gray-600" />
          </motion.div>
        )}
      </div>

      {/* Submenu - only shown when sidebar is expanded and section is open */}
      <AnimatePresence>
        {!isSidebarCollapsed && sections.training_program && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden flex flex-col gap-3 mt-2 ml-10"
          >
            <Link
              href="/admin/training-program"
              className="text-gray-600 hover:text-gray-900 transition-colors text-sm"
            >
              Training Program List
            </Link>
            <Link
              href="/admin/add-new-training-program"
              className="text-gray-600 hover:text-gray-900 transition-colors text-sm"
            >
              Add New Training Program
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default TrainingProgramSidebarSection