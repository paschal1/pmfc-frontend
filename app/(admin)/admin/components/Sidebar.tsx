'use client'

import { useEffect, Dispatch, SetStateAction } from 'react'
import { MdSpaceDashboard, MdMenu, MdClose, MdKeyboardArrowRight } from 'react-icons/md'
import Link from 'next/link'
import { useAppDispatch } from '../store/hooks'
import { closeAllSections } from '../store/sidebarSlice'

import ProductSidebarSection from './product/ProductSidebarSection'
import CategorySidebarSection from './category/CategorySidebarSection'
import TrainingSidebarSection from './training/TrainingSidebarSection'
import OrderSidebarSection from './order/OrderSidebarSection'
import TrainingProgramSidebarSection from './training_program/TrainingProgramSidebarSection'
import EnrollmentSidebarSection from './enrollment/EnrollmentSidebarSection'
import TestimonialSidebarSection from './testimonial/TestimonialSidebarSection'
import QuotationSidebarSection from './quotation/QuotationSidebarSection'
import ServiceSidebarSection from './services/ServiceSidebarSection'
import ProjectSidebarSection from './projects/ProjectSidebarSection'

type SidebarState = 'open' | 'collapsed' | 'hidden'

interface SidebarProps {
  sidebarState: SidebarState
  setSidebarState: Dispatch<SetStateAction<SidebarState>>
}

const Sidebar = ({ sidebarState, setSidebarState }: SidebarProps) => {
  const dispatch = useAppDispatch()

  const toggleSidebar = () => {
    setSidebarState((prev) => {
      if (prev === 'open') return 'collapsed'
      if (prev === 'collapsed') return 'hidden'
      return 'open'
    })
  }

  const isCollapsed = sidebarState === 'collapsed'
  const isHidden = sidebarState === 'hidden'
  const isOpen = sidebarState === 'open'

  useEffect(() => {
    if (!isOpen) {
      dispatch(closeAllSections())
    }
  }, [isOpen, dispatch])

  // === MOBILE: Completely hide the main sidebar on screens < xl ===
  // We don't render anything at all on mobile — MobileSidebar handles it
  return (
    <div className="hidden xl:block">
      {/* Hidden state: only floating button on desktop */}
      {isHidden && (
        <button
          onClick={toggleSidebar}
          className="fixed top-8 left-4 z-50 p-3 bg-white rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110"
          aria-label="Open sidebar"
        >
          <MdKeyboardArrowRight className="h-6 w-6 text-gray-700" />
        </button>
      )}

      {/* Visible sidebar (open or collapsed) - only on xl+ */}
      {!isHidden && (
        <div
          className={`bg-white fixed top-2 bottom-0 left-3 rounded-xl shadow-2xl z-50 overflow-y-auto transition-all duration-300 ease-in-out flex flex-col ${
            isCollapsed ? 'w-20' : 'w-[300px]'
          }`}
        >
          <div className="h-[120px] flex items-center justify-between px-6 relative">
            <h1
              className={`text-2xl font-semibold transition-all duration-300 ${
                isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'
              }`}
            >
              PMFC
            </h1>

            <button
              onClick={toggleSidebar}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors absolute right-4 top-1/2 -translate-y-1/2"
              aria-label={isOpen ? 'Collapse sidebar' : 'Hide sidebar'}
            >
              {isOpen ? (
                <MdClose className="h-6 w-6 text-gray-700" />
              ) : (
                <MdMenu className="h-6 w-6 text-gray-700" />
              )}
            </button>
          </div>

          <div className="flex flex-col gap-4 px-6 pb-8">
            <Link
              href="/admin"
              className="flex items-center gap-4 w-full group"
              title={isCollapsed ? 'Dashboard' : undefined}
            >
              <MdSpaceDashboard className="h-6 w-6 text-gray-700 flex-shrink-0" />
              <span
                className={`font-medium text-gray-800 transition-all duration-200 ${
                  isCollapsed ? 'w-0 opacity-0 overflow-hidden' : 'opacity-100'
                }`}
              >
                Dashboard
              </span>
            </Link>

            <ProductSidebarSection isSidebarCollapsed={isCollapsed} />
            <CategorySidebarSection isSidebarCollapsed={isCollapsed} />
            <TrainingSidebarSection isSidebarCollapsed={isCollapsed} />
            <OrderSidebarSection isSidebarCollapsed={isCollapsed} />
            <TrainingProgramSidebarSection isSidebarCollapsed={isCollapsed} />
            <EnrollmentSidebarSection isSidebarCollapsed={isCollapsed} />
            <TestimonialSidebarSection isSidebarCollapsed={isCollapsed} />
            <QuotationSidebarSection isSidebarCollapsed={isCollapsed} />
            <ServiceSidebarSection isSidebarCollapsed={isCollapsed} />
            <ProjectSidebarSection isSidebarCollapsed={isCollapsed} />
          </div>
        </div>
      )}
    </div>
  )
}

export default Sidebar