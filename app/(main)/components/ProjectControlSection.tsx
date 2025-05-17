'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { imageData, ImageDataStructure } from '../data/imageData'
import React, { useState } from 'react'
import ProjectSection from './ProjectSection'

const ProjectControlSection = () => {
  const [currentSet, setCurrentSet] = useState<ImageDataStructure[]>(imageData)
  const [activeSection, setActiveSection] = useState<string>('all')

  const handleButtonClick = (section: string) => {
    setActiveSection(section)
    if (section === 'all') {
      setCurrentSet(imageData)
    } else {
      setCurrentSet(imageData.filter((item) => item.section === section))
    }
  }

  const buttonVariants = {
    initial: { scale: 1 },
    tap: { scale: 0.9 },
  }

  const buttonClass = (section: string) => {
    return ` ${
      activeSection === section
        ? 'bg-[#fab702] p-[0.5rem] sm:p-[0.2rem] text-[#000000] uppercase'
        : 'hover:bg-black p-[0.5rem] sm:p-[0.2rem] text-[#888888] uppercase'
    }`
  }

  const projectSectionProps = { currentSet };

  return (
    <>
      <div className="flex flex-col mt-10 items-center h-[50px] md:h-[30px] justify-center gap-6 text-[13px]">
        <div className="flex flex-row gap-6">
          <motion.button
            className={buttonClass('all')}
            onClick={() => handleButtonClick('all')}
            whileTap="tap"
            variants={buttonVariants}
          >
            All Projects
          </motion.button>
          <motion.button
            className={buttonClass('residential')}
            onClick={() => handleButtonClick('residential')}
            whileTap="tap"
            variants={buttonVariants}
          >
            Residential
          </motion.button>
          <motion.button
            className={buttonClass('hospitality')}
            onClick={() => handleButtonClick('hospitality')}
            whileTap="tap"
            variants={buttonVariants}
          >
            Hospitality
          </motion.button>
          <motion.button
            className={`${buttonClass('office')} hidden lg:block`}
            onClick={() => handleButtonClick('office')}
            whileTap="tap"
            variants={buttonVariants}
          >
            Office
          </motion.button>
          <motion.button
            className={`${buttonClass('commercial')} hidden lg:block`}
            onClick={() => handleButtonClick('commercial')}
            whileTap="tap"
            variants={buttonVariants}
          >
            Commercial
          </motion.button>
        </div>
        <div className="flex flex-row lg:hidden gap-10">
          <motion.button
            className={buttonClass('office')}
            onClick={() => handleButtonClick('office')}
            whileTap="tap"
            variants={buttonVariants}
          >
            Office
          </motion.button>
          <motion.button
            className={buttonClass('commercial')}
            onClick={() => handleButtonClick('commercial')}
            whileTap="tap"
            variants={buttonVariants}
          >
            Commercial
          </motion.button>
        </div>
      </div>
      <ProjectSection currentSet={currentSet} />
    </>
  )
}

export default ProjectControlSection
