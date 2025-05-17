'use client'
import React, { useState } from 'react'
import { Parallax } from 'react-parallax'
// import { ImageDataStructure, imageData } from '../data/imageData'
import { ProjectDataStructure, projectData } from '../data/projects'
import { motion, AnimatePresence } from 'framer-motion'
import Projects from './components/Projects'
import GetQuote from './components/GetQuote'
import SecondaryFooter from '../components/SecondaryFooter'

const Project = () => {
  const [currentSet, setCurrentSet] =
    useState<ProjectDataStructure[]>(projectData)
  const [activeSection, setActiveSection] = useState<string>('all')

  const handleButtonClick = (section: string) => {
    setActiveSection(section)
    if (section === 'all') {
      setCurrentSet(projectData)
    } else {
      setCurrentSet(projectData.filter((item) => item.section === section))
    }
  }

  const buttonVariants = {
    initial: { scale: 1 },
    tap: { scale: 0.9 },
  }

  const buttonClass = (section: string) => {
    const commonClasses =
      'p-[0.6rem] sm:px-[1rem] px-[1.5rem] text-[11px] uppercase transition-all duration-200'
    const activeClasses = 'bg-[#fab702] text-[#000000]'
    const inactiveClasses = 'lg:hover:bg-black text-[#888888] bg-none'

    return `${commonClasses} ${
      activeSection === section ? activeClasses : inactiveClasses
    }`
  }

  const projectSectionProps = { currentSet }

  return (
    <div className="flex flex-col">
      <Parallax
        strength={300}
        className="h-[230px] w-[100%] bg-cover bg-center lg:flex hidden items-center"
        bgImage={'/projects-bg.jpg'}
      >
        <h1 className="font-bold text-3xl text-white ml-20">Projects</h1>
      </Parallax>
      <div className="h-[230px] w-[100%] lg:hidden block relative">
        <img
          src={'/projects-bg.jpg'}
          alt="img"
          className="h-full w-full object-cover"
        />
        <h1 className="font-bold text-2xl text-white z-10 absolute top-24 left-3">
          Projects
        </h1>
      </div>
      <div className="flex flex-col mt-16 lg:mt-10 mb-6 lg:mb-0 items-center h-[50px] md:h-[30px] justify-center gap-3 text-[13px]">
        <div className="flex flex-row lg:gap-6 gap-16">
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
            className={`${buttonClass('hospitality')} hidden lg:block`}
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
        <div className="flex flex-row lg:hidden gap-16">
          <motion.button
            className={buttonClass('hospitality')}
            onClick={() => handleButtonClick('hospitality')}
            whileTap="tap"
            variants={buttonVariants}
          >
            Hospitality
          </motion.button>
          <motion.button
            className={buttonClass('office')}
            onClick={() => handleButtonClick('office')}
            whileTap="tap"
            variants={buttonVariants}
          >
            Office
          </motion.button>
        </div>
        <div className="flex lg:hidden">
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
      <Projects currentSet={currentSet} />
      <GetQuote />
      <SecondaryFooter />
    </div>
  )
}

export default Project
