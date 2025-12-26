'use client'
import { useAppSelector, useAppDispatch } from '../store/hooks'
import { motion, AnimatePresence } from 'framer-motion'
import { MdSpaceDashboard } from 'react-icons/md'
import Link from 'next/link'
import { FaXmark } from 'react-icons/fa6'
import { closeSidebar } from '../store/mobileSidebarSlice'
import ProductDropdown from './product/ProductDropdown'
import CategoryDropdown from './category/CategoryDropdown'
import TrainingDropdown from './training/TrainingDropdown'
import OrderDropdown from './order/OrderDropdown'
import TrainingProgramDropdown from './training_program/TrainingProgramDropdown'
import EnrollmentDropdown from './enrollment/EnrollmentDropdown'
import QuotationDropdown from './quotation/QuotationDropdown'
import ServiceDropdown from './services/ServiceDropdown'
import ProjectDropdown from './projects/ProjectDropdown'

const MobileSidebar = () => {
  const dispatch = useAppDispatch()
  const isOpen = useAppSelector((state) => state.mobileSidebar.mobileSidebar)

  const handleCloseSidebar = () => {
    dispatch(closeSidebar())
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleCloseSidebar}
            className="fixed inset-0 bg-black/50 z-40 xl:hidden"
          />

          {/* Sidebar Panel */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            className="fixed inset-y-2 left-3 w-[300px] bg-white rounded-xl shadow-2xl z-50 flex flex-col xl:hidden"
          >
            {/* Header */}
            <div className="h-[120px] flex items-center justify-between px-8 border-b">
              <h1 className="text-2xl font-semibold">PMFC</h1>
              <button
                onClick={handleCloseSidebar}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Close menu"
              >
                <FaXmark className="h-7 w-7 text-gray-700" />
              </button>
            </div>

            {/* Navigation */}
            <div className="flex-1 overflow-y-auto px-6 pt-6 pb-8">
              <nav className="space-y-4">
                <Link
                  onClick={handleCloseSidebar}
                  href="/admin"
                  className="flex items-center gap-4 py-3 px-4 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <MdSpaceDashboard className="h-6 w-6 text-gray-700" />
                  <span className="text-lg font-medium">Dashboard</span>
                </Link>

                <ProductDropdown />
                <CategoryDropdown />
                <TrainingDropdown />
                <OrderDropdown />
                <TrainingProgramDropdown />
                <EnrollmentDropdown />
                <QuotationDropdown />
                <ServiceDropdown />
                <ProjectDropdown />
              </nav>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default MobileSidebar