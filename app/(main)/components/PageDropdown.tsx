import Link from 'next/link'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { motion, AnimatePresence } from 'framer-motion'
import { closeMenu } from '../store/menubarSlice'

const PageDropdown = () => {
  const dispatch = useAppDispatch()
  const dropdown = useAppSelector((state) => state.pageDropdown.dropdown)

  const closeMenubar = () => {
    dispatch(closeMenu())
  }

  const dropdownVariants = {
    hidden: {
      opacity: 0,
      height: 0,
    },
    visible: {
      opacity: 1,
      height: 'auto',
    },
  }
  return (
    <>
      <div className="w-[230px] group-hover:flex hidden absolute top-20 left-5 text-white bg-[#18191B] flex-col items-start  z-10 gap-2 p-4">
        <Link href={'/projects'}>
          <h1 className="cursor-pointer hover:text-[#fab702]">Projects</h1>
        </Link>
        <div className="h-[1px] w-full border-t border-t-[#333333]"></div>
        <Link href={'/training'}>
          <h1 className="cursor-pointer hover:text-[#fab702]">Training</h1>
        </Link>
        <div className="h-[1px] w-full border-t border-t-[#333333]"></div>
      </div>
      {/* Mobile part*/}
      <AnimatePresence>
        {dropdown && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={dropdownVariants}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            className="lg:hidden flex text-white bg-[#18191B] flex-col items-start pl-6 z-10 gap-5 mt-4 w-[100%]"
          >
            <Link href={'/projects'} onClick={() => closeMenubar()}>
              <h1 className="cursor-pointer hover:text-[#fab702]">Projects</h1>
            </Link>
            <div className="h-[1px] w-full border-t border-t-[#333333]"></div>
            <Link href={'/training'} onClick={() => closeMenubar()}>
              <h1 className="cursor-pointer hover:text-[#fab702]">Training</h1>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default PageDropdown
