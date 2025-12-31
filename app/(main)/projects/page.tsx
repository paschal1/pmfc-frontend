'use client'

import React, { useState, useEffect } from 'react'
import { Parallax } from 'react-parallax'
import { motion } from 'framer-motion'
import Projects from './components/Projects'
import GetQuote from './components/GetQuote'
import SecondaryFooter from '../components/SecondaryFooter'
import * as projectsApi from '../../services/projectsApi.service'
import { Loader, AlertCircle } from 'lucide-react'

export interface ProjectDataStructure {
  id: number
  section: string
  image: string
  title: string
  description?: string
  status?: string
  slug?: string
}

const Project = () => {
  const [currentSet, setCurrentSet] = useState<ProjectDataStructure[]>([])
  const [activeSection, setActiveSection] = useState<projectsApi.ProjectType>('all')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState({
    currentPage: 1,
    lastPage: 1,
    total: 0,
  })

  // Fetch projects from API
  const fetchProjects = async (type: projectsApi.ProjectType = 'all', page: number = 1) => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await projectsApi.getProjects({
        type,
        per_page: 12, // Show 12 projects per page for better grid layout
        page,
      })

      // Convert API projects to ProjectDataStructure format
      const projects = response.data.map(projectsApi.convertToProjectData)
      
      setCurrentSet(projects)
      setPagination({
        currentPage: response.current_page,
        lastPage: response.last_page,
        total: response.total,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load projects')
      setCurrentSet([])
    } finally {
      setLoading(false)
    }
  }

  // Initial load
  useEffect(() => {
    fetchProjects()
  }, [])

  // Handle filter button click
  const handleButtonClick = (section: projectsApi.ProjectType) => {
    setActiveSection(section)
    fetchProjects(section, 1) // Reset to page 1 when filtering
  }

  // Handle pagination
  const handlePageChange = (page: number) => {
    fetchProjects(activeSection, page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const buttonVariants = {
    initial: { scale: 1 },
    tap: { scale: 0.9 },
  }

  const buttonClass = (section: projectsApi.ProjectType) => {
    const commonClasses =
      'p-[0.6rem] sm:px-[1rem] px-[1.5rem] text-[11px] uppercase transition-all duration-200'
    const activeClasses = 'bg-[#fab702] text-[#000000]'
    const inactiveClasses = 'lg:hover:bg-black text-[#888888] bg-none'

    return `${commonClasses} ${
      activeSection === section ? activeClasses : inactiveClasses
    }`
  }

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
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
          alt="Projects"
          className="h-full w-full object-cover"
        />
        <h1 className="font-bold text-2xl text-white z-10 absolute top-24 left-3">
          Projects
        </h1>
      </div>

      {/* Filter Buttons */}
      <div className="flex flex-col mt-16 lg:mt-10 mb-6 lg:mb-0 items-center h-[50px] md:h-[30px] justify-center gap-3 text-[13px]">
        <div className="flex flex-row lg:gap-6 gap-16">
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
            className={`${buttonClass('hospitality')} hidden lg:block`}
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
        <div className="flex flex-row lg:hidden gap-16">
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
            className={buttonClass('office')}
            onClick={() => handleButtonClick('office')}
            whileTap="tap"
            variants={buttonVariants}
            disabled={loading}
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
            disabled={loading}
          >
            Commercial
          </motion.button>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center min-h-[400px]">
          <Loader className="w-12 h-12 text-[#fab702] animate-spin" />
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="flex justify-center items-center min-h-[400px] px-4">
          <div className="bg-red-900/30 border border-red-500 rounded-lg p-6 max-w-md">
            <div className="flex items-start gap-4">
              <AlertCircle className="w-6 h-6 text-red-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-bold text-red-400 mb-1">Error Loading Projects</h3>
                <p className="text-red-300">{error}</p>
                <button
                  onClick={() => fetchProjects(activeSection, pagination.currentPage)}
                  className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Projects Grid */}
      {!loading && !error && (
        <>
          {currentSet.length === 0 ? (
            <div className="flex justify-center items-center min-h-[400px] text-gray-400">
              <p className="text-xl">No projects found in this category.</p>
            </div>
          ) : (
            <Projects currentSet={currentSet} />
          )}

          {/* Pagination */}
          {pagination.lastPage > 1 && (
            <div className="flex justify-center items-center gap-4 my-12">
              <button
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={pagination.currentPage === 1 || loading}
                className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-[#fab702] hover:text-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              
              <div className="flex gap-2">
                {Array.from({ length: pagination.lastPage }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    disabled={loading}
                    className={`px-4 py-2 rounded transition-colors ${
                      page === pagination.currentPage
                        ? 'bg-[#fab702] text-black'
                        : 'bg-gray-800 text-white hover:bg-gray-700'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                disabled={pagination.currentPage === pagination.lastPage || loading}
                className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-[#fab702] hover:text-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}

          {/* Results Count */}
          <div className="text-center text-gray-400 mb-8">
            Showing {currentSet.length} of {pagination.total} projects
          </div>
        </>
      )}

      <GetQuote />
      <SecondaryFooter />
    </div>
  )
}

export default Project