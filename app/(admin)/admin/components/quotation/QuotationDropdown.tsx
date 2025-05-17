import { AnimatePresence, motion } from 'framer-motion'
import Link from 'next/link'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { closeSidebar } from '../../store/mobileSidebarSlice'
import { IoIosArrowDown } from 'react-icons/io'
import { BiSolidQuoteLeft } from 'react-icons/bi'
import { toggleQuotation } from '../../store/sidebarSlice'

const QuotationDropdown = () => {
  const sections = useAppSelector((state) => state.sidebar)
  const dispatch = useAppDispatch()

  const handleCloseSidebar = () => {
    dispatch(closeSidebar())
  }

  const handleQuotationClick = () => {
    dispatch(toggleQuotation())
  }
  return (
    <>
      <div
        onClick={() => handleQuotationClick()}
        className="flex items-center justify-between w-[230px]"
      >
        <div className="flex flex-row items-center justify-between gap-8">
          <BiSolidQuoteLeft className="h-[20px] w-[20px]" />
          <h1>Quotation</h1>
        </div>
        <div className="">
          <motion.div
            animate={{ rotate: sections.quotation ? 180 : 0 }}
            initial={{ rotate: 0 }}
            transition={{ duration: 0.3 }}
          >
            <IoIosArrowDown className="cursor-pointer" />
          </motion.div>
        </div>
      </div>
      <AnimatePresence>
        {sections.quotation && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden flex flex-col gap-4 mt-2 ml-14"
          >
            <Link
              href={'/admin/quotation'}
              onClick={() => handleCloseSidebar()}
            >
              Quotation List
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default QuotationDropdown
