import { AnimatePresence, motion } from 'framer-motion'
import Link from 'next/link'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { closeSidebar } from '../../store/mobileSidebarSlice'
import { IoIosArrowDown } from 'react-icons/io'
import { toggleProducts } from '../../store/sidebarSlice'
import { BsBag } from 'react-icons/bs'

const ProductDropdown = () => {
  const sections = useAppSelector((state) => state.sidebar)
  const dispatch = useAppDispatch()

  const handleCloseSidebar = () => {
    dispatch(closeSidebar())
  }

  const handleProductClick = () => {
    dispatch(toggleProducts())
  }

  return (
    <>
      <div
        onClick={() => handleProductClick()}
        className="flex items-center justify-between w-[230px]"
      >
        <div className="flex flex-row items-center justify-between gap-8">
          <BsBag className="h-[20px] w-[20px]" />
          <h1>Products</h1>
        </div>
        <div className="">
          <motion.div
            animate={{ rotate: sections.products ? 180 : 0 }}
            initial={{ rotate: 0 }}
            transition={{ duration: 0.3 }}
          >
            <IoIosArrowDown className="cursor-pointer" />
          </motion.div>
        </div>
      </div>
      <AnimatePresence>
        {sections.products && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden flex flex-col gap-4 mt- ml-14"
          >
            <Link href={'/admin/products'} onClick={() => handleCloseSidebar()}>
              Products
            </Link>
            <Link
              href={'/admin/add-new-products'}
              onClick={() => handleCloseSidebar()}
            >
              Add New Product
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default ProductDropdown
