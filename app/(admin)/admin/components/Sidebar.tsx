'use client'
import { useAppSelector, useAppDispatch } from '../store/hooks'
import { toggleCategory, toggleProducts } from '../store/sidebarSlice'
import { MdSpaceDashboard } from 'react-icons/md'
import Link from 'next/link'
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


const Sidebar = () => {
  const sections = useAppSelector((state) => state.sidebar)
  const dispatch = useAppDispatch()

  const handleCategoryClick = () => {
    dispatch(toggleCategory())
  }

  return (
    <>
      <div className="bg-white fixed w-[300px] xl:flex flex-col hidden top-2 bottom-0 left-3 rounded-xl shadow-2xl z-50 overflow-y-auto">
        <div className=" h-[120px] w-[300px] flex items-center justify-center">
          <h1 className="text-2xl font-semibold">PMFC</h1>
        </div>
        <div className="flex flex-col items-start ml-8 gap-4">
          <div className="flex items-center justify-between w-[230px]">
            <Link
              href={'/admin'}
              className="flex flex-row items-center justify-between gap-8"
            >
              <MdSpaceDashboard className="h-[20px] w-[20px]" />
              <h1>Dashboard</h1>
            </Link>
          </div>
          <ProductSidebarSection />
          <CategorySidebarSection />
          <TrainingSidebarSection />
          <OrderSidebarSection />
          <TrainingProgramSidebarSection />
          <EnrollmentSidebarSection />
          <TestimonialSidebarSection />
          <QuotationSidebarSection />
          <ServiceSidebarSection />
          <ProjectSidebarSection />
        </div>
      </div>
    </>
  )
}

export default Sidebar
