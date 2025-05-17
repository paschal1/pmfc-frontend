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
  const sidebar = useAppSelector((state) => state.mobileSidebar.mobileSidebar)

  const handleCloseSidebar = () => {
    dispatch(closeSidebar())
  }

  return (
    <AnimatePresence>
      {sidebar && (
        <motion.div
          initial={{ x: '-100%' }}
          animate={{ x: 0 }}
          exit={{ x: '-100%' }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          className="bg-white w-[300px] xl:hidden flex-col flex fixed top-2 bottom-2 left-3 rounded-xl shadow-lg z-10"
        >
          <div className="fixed h-[120px] w-[300px] flex items-center justify-between px-8">
            <h1 className="text-2xl font-semibold">PMFC</h1>
            <FaXmark
              onClick={() => handleCloseSidebar()}
              className="h-[30px] w-[30px]"
            />
          </div>
          <div className="flex flex-col items-start ml-8 mt-[130px] gap-4">
            <div className="flex items-center justify-between w-[230px]">
              <Link
                onClick={() => handleCloseSidebar()}
                href={'/admin'}
                className="flex flex-row items-center justify-between gap-8"
              >
                <MdSpaceDashboard className="h-[20px] w-[20px]" />
                <h1>Dashboard</h1>
              </Link>
            </div>
            <ProductDropdown />
            <CategoryDropdown />   
            <TrainingDropdown />
            <OrderDropdown />
            <TrainingProgramDropdown />
            <EnrollmentDropdown />
            <QuotationDropdown />
            <ServiceDropdown />
            <ProjectDropdown />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default MobileSidebar
