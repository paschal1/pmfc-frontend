'use client'

import React from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'

export interface ProjectDataStructure {
  id: number
  section: string
  image: string
  title: string
  description?: string
  status?: string
  slug?: string
}

interface ProjectSectionProps {
  currentSet: ProjectDataStructure[]
}

const Projects: React.FC<ProjectSectionProps> = ({ currentSet }) => {
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.8, x: 50 },
    visible: { opacity: 1, scale: 1, x: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, scale: 0.8, x: -50, transition: { duration: 0.5 } },
  }

  const hoverEffect = {
    rest: { opacity: 1, scale: 1 },
    hover: { opacity: 0.7, scale: 1.1 },
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mt-10 w-full">
      <AnimatePresence mode="wait">
        {currentSet.map((item) => (
          <motion.div
            key={`${item.id}-${item.section}`}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative h-[250px] w-full overflow-hidden group"
          >
            <motion.div
              className="relative w-full h-full"
              initial="rest"
              whileHover="hover"
              animate="rest"
              variants={hoverEffect}
            >
              {/* Project Image */}
              <Image
                src={item.image}
                alt={item.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="object-cover cursor-pointer"
                onError={(e) => {
                  // Fallback to placeholder if image fails to load
                  const target = e.target as HTMLImageElement
                  target.src = '/placeholder-project.jpg'
                }}
              />

              {/* Hover Overlay */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex flex-col items-center justify-center opacity-0 cursor-pointer px-4"
                initial="rest"
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
              >
                <span className="text-[#fab702] text-lg font-bold uppercase text-center mb-2">
                  {item.title}
                </span>
                
                {item.description && (
                  <p className="text-white text-sm text-center line-clamp-2 mb-3">
                    {item.description}
                  </p>
                )}

                {item.status && (
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      item.status === 'completed'
                        ? 'bg-green-600 text-white'
                        : 'bg-yellow-600 text-white'
                    }`}
                  >
                    {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                  </span>
                )}
              </motion.div>

              {/* Type Badge (Always Visible) */}
              <div className="absolute top-4 left-4 z-10">
                <span className="px-3 py-1 bg-[#fab702] text-black text-xs font-bold uppercase rounded">
                  {item.section}
                </span>
              </div>

              {/* Title Bar at Bottom (Always Visible on Mobile) */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300">
                <h3 className="text-white font-semibold text-sm">{item.title}</h3>
              </div>
            </motion.div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

export default Projects