import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { AnimatePresence, motion } from 'framer-motion'
import { IoIosArrowDown } from 'react-icons/io'
import { MdOutlineRateReview } from 'react-icons/md'
import Link from 'next/link'
import { toggleTestimonial } from '../../store/sidebarSlice'

const TestimonialSidebarSection = () => {
  const sections = useAppSelector((state) => state.sidebar)
  const dispatch = useAppDispatch()

  const handleTestimonialClick = () => {
    dispatch(toggleTestimonial())
  }
  return (
    <>
      <div
        onClick={() => handleTestimonialClick()}
        className="flex items-center justify-between w-[230px] cursor-pointer"
      >
        <div className="flex flex-row items-center justify-between gap-8">
          <MdOutlineRateReview className="h-[20px] w-[20px]" />
          <h1>Testimonials</h1>
        </div>
        <div className="">
          <motion.div
            animate={{ rotate: sections.testimonial ? 180 : 0 }}
            initial={{ rotate: 0 }}
            transition={{ duration: 0.3 }}
          >
            <IoIosArrowDown className="cursor-pointer" />
          </motion.div>
        </div>
      </div>
      <AnimatePresence>
        {sections.testimonial && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden flex flex-col gap-4 mt-2 ml-14"
          >
            <Link href={'/admin/testimonial'}>Testimonials</Link>
            <Link href={'/admin/add-testimonial'}>Add Testimonial</Link>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default TestimonialSidebarSection
