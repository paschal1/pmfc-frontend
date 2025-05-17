import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { toggleEnrollment } from '../../store/sidebarSlice'
import { AnimatePresence, motion } from 'framer-motion'
import { IoIosArrowDown } from 'react-icons/io'
import { PiStudentDuotone } from 'react-icons/pi'
import Link from 'next/link'
const EnrollmentSidebarSection = () => {
  const sections = useAppSelector((state) => state.sidebar)
  const dispatch = useAppDispatch()

  const handleEnrollmentClick = () => {
    dispatch(toggleEnrollment())
  }
  return (
    <>
      <div
        onClick={() => handleEnrollmentClick()}
        className="flex items-center justify-between w-[230px] cursor-pointer"
      >
        <div className="flex flex-row items-center justify-between gap-8">
          <PiStudentDuotone className="h-[20px] w-[20px]" />
          <h1>Enrollment</h1>
        </div>
        <div className="">
          <motion.div
            animate={{ rotate: sections.enrollment ? 180 : 0 }}
            initial={{ rotate: 0 }}
            transition={{ duration: 0.3 }}
          >
            <IoIosArrowDown className="cursor-pointer" />
          </motion.div>
        </div>
      </div>
      <AnimatePresence>
        {sections.enrollment && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden flex flex-col gap-4 mt-2 ml-14"
          >
            <Link href={'/admin/enrollment'}>Enrollment List</Link>
            <Link href={'/admin/add-new-student'}>Add Student</Link>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default EnrollmentSidebarSection
