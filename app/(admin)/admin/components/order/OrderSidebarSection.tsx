import { AnimatePresence, motion } from 'framer-motion'
import Link from 'next/link'
import { RiArchiveLine } from 'react-icons/ri'
import { IoIosArrowDown } from 'react-icons/io'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { toggleOrder } from '../../store/sidebarSlice'

const OrderSidebarSection = () => {
  const sections = useAppSelector((state) => state.sidebar)
  const dispatch = useAppDispatch()

  const handleOrderClick = () => {
    dispatch(toggleOrder())
  }

  return (
    <>
      <div
        onClick={() => handleOrderClick()}
        className="flex items-center justify-between w-[230px] cursor-pointer"
      >
        <div className="flex flex-row items-center justify-between gap-8">
          <RiArchiveLine className="h-[20px] w-[20px]" />
          <h1>Order</h1>
        </div>
        <div className="">
          <motion.div
            animate={{ rotate: sections.order ? 180 : 0 }}
            initial={{ rotate: 0 }}
            transition={{ duration: 0.3 }}
          >
            <IoIosArrowDown className="cursor-pointer" />
          </motion.div>
        </div>
      </div>
      <AnimatePresence>
        {sections.order && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden flex flex-col gap-4 mt-2 ml-14"
          >
            <Link href={'/admin/order'}>Order List</Link>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default OrderSidebarSection
