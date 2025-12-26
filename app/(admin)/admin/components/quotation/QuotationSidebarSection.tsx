import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { AnimatePresence, motion } from 'framer-motion'
import { IoIosArrowDown } from 'react-icons/io'
import { BiSolidQuoteLeft } from 'react-icons/bi'
import Link from 'next/link'
import { toggleQuotation } from '../../store/sidebarSlice'

interface QuotationSidebarSectionProps {
  isSidebarCollapsed: boolean
}

const QuotationSidebarSection = ({ isSidebarCollapsed }: QuotationSidebarSectionProps) => {
  const sections = useAppSelector((state) => state.sidebar)
  const dispatch = useAppDispatch()

  const handleQuotationClick = () => {
    dispatch(toggleQuotation())
  }

  return (
    <div className="w-full">
      {/* Main clickable item */}
      <div
        onClick={handleQuotationClick}
        className="flex items-center justify-between w-full cursor-pointer group py-1"
        title={isSidebarCollapsed ? 'Quotation' : undefined}
      >
        <div className="flex items-center gap-4">
          <BiSolidQuoteLeft className="h-6 w-6 text-gray-700 flex-shrink-0" />
          <span
            className={`font-medium text-gray-800 transition-all duration-200 ${
              isSidebarCollapsed
                ? 'w-0 opacity-0 overflow-hidden'
                : 'opacity-100'
            }`}
          >
            Quotation
          </span>
        </div>

        {/* Arrow - only visible when sidebar is expanded */}
        {!isSidebarCollapsed && (
          <motion.div
            animate={{ rotate: sections.quotation ? 180 : 0 }}
            initial={{ rotate: 0 }}
            transition={{ duration: 0.3 }}
          >
            <IoIosArrowDown className="h-5 w-5 text-gray-600" />
          </motion.div>
        )}
      </div>

      {/* Submenu - only shown when expanded and section is open */}
      <AnimatePresence>
        {!isSidebarCollapsed && sections.quotation && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden flex flex-col gap-3 mt-2 ml-10"
          >
            <Link
              href="/admin/quotation"
              className="text-gray-600 hover:text-gray-900 transition-colors text-sm"
            >
              Quotation List
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default QuotationSidebarSection