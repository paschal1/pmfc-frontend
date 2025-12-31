'use client'

import { motion } from 'framer-motion'
import React, { useState, useEffect } from 'react'
import ProjectSection from './ProjectSection'
import * as projectsApi from '../../services/projectsApi.service'
import { Loader } from 'lucide-react'

export interface ImageDataStructure {
  id: number
  section: string
  image: string | null
  title: string
  description?: string
  status?: string
  slug?: string
}

const ProjectControlSection = () => {
  const [currentSet, setCurrentSet] = useState<ImageDataStructure[]>([])
  const [allProjects, setAllProjects] = useState<ImageDataStructure[]>([])
  const [activeSection, setActiveSection] = useState<projectsApi.ProjectType>('all')
  const [loading, setLoading] = useState(true)

  // Fetch projects from API on mount
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true)
        const response = await projectsApi.getProjects({
          type: 'all',
          per_page: 50, // Fetch more for homepage display
        })

        const projects = response.data.map(projectsApi.convertToProjectData)
        setAllProjects(projects)
        setCurrentSet(projects)
      } catch (error) {
        console.error('Failed to fetch projects:', error)
        setAllProjects([])
        setCurrentSet([])
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [])

  const handleButtonClick = (section: projectsApi.ProjectType) => {
    setActiveSection(section)
    if (section === 'all') {
      setCurrentSet(allProjects)
    } else {
      setCurrentSet(allProjects.filter((item) => item.section === section))
    }
  }

  const buttonVariants = {
    initial: { scale: 1 },
    tap: { scale: 0.9 },
  }

  const buttonClass = (section: projectsApi.ProjectType) => {
    return ` ${
      activeSection === section
        ? 'bg-[#fab702] p-[0.5rem] sm:p-[0.2rem] text-[#000000] uppercase transition-all duration-200'
        : 'hover:bg-black p-[0.5rem] sm:p-[0.2rem] text-[#888888] uppercase transition-all duration-200'
    }`
  }

  return (
    <>
      {/* Filter Buttons */}
      <div className="flex flex-col mt-10 items-center h-[50px] md:h-[30px] justify-center gap-6 text-[13px]">
        <div className="flex flex-row gap-6">
          <motion.button
            className={buttonClass('all')}
            onClick={() => handleButtonClick('all')}
            whileTap="tap"
            variants={buttonVariants}
            disabled={loading}
          >
            All Projects
          </motion.button>
          <motion.button
            className={buttonClass('residential')}
            onClick={() => handleButtonClick('residential')}
            whileTap="tap"
            variants={buttonVariants}
            disabled={loading}
          >
            Residential
          </motion.button>
          <motion.button
            className={buttonClass('hospitality')}
            onClick={() => handleButtonClick('hospitality')}
            whileTap="tap"
            variants={buttonVariants}
            disabled={loading}
          >
            Hospitality
          </motion.button>
          <motion.button
            className={`${buttonClass('office')} hidden lg:block`}
            onClick={() => handleButtonClick('office')}
            whileTap="tap"
            variants={buttonVariants}
            disabled={loading}
          >
            Office
          </motion.button>
          <motion.button
            className={`${buttonClass('commercial')} hidden lg:block`}
            onClick={() => handleButtonClick('commercial')}
            whileTap="tap"
            variants={buttonVariants}
            disabled={loading}
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
            disabled={loading}
          >
            Office
          </motion.button>
          <motion.button
            className={buttonClass('commercial')}
            onClick={() => handleButtonClick('commercial')}
            whileTap="tap"
            variants={buttonVariants}
            disabled={loading}
          >
            Commercial
          </motion.button>
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center items-center min-h-[400px]">
          <Loader className="w-12 h-12 text-[#fab702] animate-spin" />
        </div>
      ) : (
        <>
          {/* Projects Display */}
          {currentSet.length === 0 ? (
            <div className="flex justify-center items-center min-h-[400px] text-gray-400">
              <p className="text-lg">No projects found in this category.</p>
            </div>
          ) : (
            <ProjectSection currentSet={currentSet} />
          )}
        </>
      )}
    </>
  )
}

export default ProjectControlSection