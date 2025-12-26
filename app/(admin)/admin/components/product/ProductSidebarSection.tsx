import { AnimatePresence, motion } from 'framer-motion'
import Link from 'next/link'
import { BsBag } from 'react-icons/bs'
import { IoIosArrowDown } from 'react-icons/io'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { toggleProducts } from '../../store/sidebarSlice'

interface ProductSidebarSectionProps {
  isSidebarCollapsed: boolean
}

const ProductSidebarSection = ({ isSidebarCollapsed }: ProductSidebarSectionProps) => {
  const sections = useAppSelector((state) => state.sidebar)
  const dispatch = useAppDispatch()

  const handleProductClick = () => {
    dispatch(toggleProducts())
  }

  return (
    <div className="w-full">
      {/* Main clickable item */}
      <div
        onClick={handleProductClick}
        className="flex items-center justify-between w-full cursor-pointer group py-1"
        title={isSidebarCollapsed ? 'Products' : undefined}
      >
        <div className="flex items-center gap-4">
          <BsBag className="h-6 w-6 text-gray-700 flex-shrink-0" />
          <span
            className={`font-medium text-gray-800 transition-all duration-200 ${
              isSidebarCollapsed
                ? 'w-0 opacity-0 overflow-hidden'
                : 'opacity-100'
            }`}
          >
            Products
          </span>
        </div>

        {/* Arrow - only show when not collapsed */}
        {!isSidebarCollapsed && (
          <motion.div
            animate={{ rotate: sections.products ? 180 : 0 }}
            initial={{ rotate: 0 }}
            transition={{ duration: 0.3 }}
          >
            <IoIosArrowDown className="h-5 w-5 text-gray-600" />
          </motion.div>
        )}
      </div>

      {/* Submenu - only visible when sidebar is expanded */}
      <AnimatePresence>
        {!isSidebarCollapsed && sections.products && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden flex flex-col gap-3 mt-2 ml-10"
          >
            <Link
              href="/admin/products"
              className="text-gray-600 hover:text-gray-900 transition-colors text-sm"
            >
              All Products
            </Link>
            <Link
              href="/admin/add-new-products"
              className="text-gray-600 hover:text-gray-900 transition-colors text-sm"
            >
              Add New Product
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ProductSidebarSection