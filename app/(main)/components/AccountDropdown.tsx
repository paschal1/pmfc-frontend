import Link from 'next/link'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { motion, AnimatePresence } from 'framer-motion'
import { closeMenu } from '../store/menubarSlice'

const AccountDropdown = () => {
  const dispatch = useAppDispatch()
  const dropdown = useAppSelector((state) => state.accountDropdown.dropdown)

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
      <div className="w-[230px] group-hover:flex hidden absolute top-20 ml-[-3rem] text-white bg-[#18191B] flex-col items-start  z-10 gap-2 p-4">
        <Link href={'/create_account'}>
          <h1 className="cursor-pointer hover:text-[#fab702]">Sign Up</h1>
        </Link>
        <div className="h-[1px] w-full border-t border-t-[#333333]"></div>
        <Link href={'/login'}>
          <h1 className="cursor-pointer hover:text-[#fab702]">Login</h1>
        </Link>
        <div className="h-[1px] w-full border-t border-t-[#333333]"></div>
      </div>

      {/* Mobile section */}
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
            <Link href={'/create_account'} onClick={() => closeMenubar()}>
              <h1 className="cursor-pointer hover:text-[#fab702]">Sign Up</h1>
            </Link>
            <div className="h-[1px] w-full border-t border-t-[#333333]"></div>
            <Link href={'/login'} onClick={() => closeMenubar()}>
              <h1 className="cursor-pointer hover:text-[#fab702]">Login</h1>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default AccountDropdown
