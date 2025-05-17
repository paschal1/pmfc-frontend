'use client'
import { RiArrowRightSLine } from 'react-icons/ri'
import { IoMenuSharp } from 'react-icons/io5'
import { VscCircleFilled } from 'react-icons/vsc'
import { FaAngleUp, FaXmark } from 'react-icons/fa6'
import Link from 'next/link'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { closeMenu, toggleSwitch } from '../store/menubarSlice'
import { motion } from 'framer-motion'
import PageDropdown from './PageDropdown'
import { toggleDropdown } from '../store/pageDropdownSlice'
import { FaAngleDown } from 'react-icons/fa6'
import AccountDropdown from './AccountDropdown'
import { toggleAccountDropdown } from '../store/accountDropdownSlice'
import ServiceDropdown from './ServiceDropdown'
import { serviceToggleDropdown } from '../store/serviceDropdownSlice'

const Navbar = () => {
  const dispatch = useAppDispatch()
  const menubarOpen = useAppSelector((state) => state.menubar.menubarOpen)
  const dropdown = useAppSelector((state) => state.pageDropdown.dropdown)
  const accountDropdown = useAppSelector(
    (state) => state.accountDropdown.dropdown
  )
  const serviceDropdown = useAppSelector(
    (state) => state.serviceDropdown.dropdown
  )

  const handleSwitch = () => {
    dispatch(toggleSwitch())
  }

  const closeMenubar = () => {
    dispatch(closeMenu())
  }

  const dropDownToggle = () => {
    dispatch(toggleDropdown())
  }

  const accountToggle = () => {
    dispatch(toggleAccountDropdown())
  }

  const serviceToggle = () => {
    dispatch(serviceToggleDropdown())
  }

  const sidebarVariants = {
    hidden: {
      opacity: 0,
      x: '-100%',
    },
    visible: {
      opacity: 1,
      x: 0,
    },
  }

  return (
    <>
      <div className="bg-[rgb(24, 25, 27)] flex flex-col">
        <div className="flex flex-row h-[90px] items-center lg:px-20 px-6 lg:justify-around justify-between">
          <div className="">
            <h1 className="text-white text-2xl">PMFC</h1>
          </div>
          <div className="lg:flex hidden text-white text-xs uppercase gap-6 font-semibold items-center relative">
            <Link href={'/'}>
              <h1 className="cursor-pointer hover:text-[#fab702] transition-all duration-300 ease">
                Home
              </h1>
            </Link>
            <VscCircleFilled className="text-[#fab702]" />
            <div className="group">
              <div className="cursor-pointer leading-[80px]">
                <h1
                  className={`cursor-pointer hover:text-[#fab702] transition-all duration-300 ease`}
                >
                  Pages
                </h1>
              </div>
              <PageDropdown />
            </div>
            <VscCircleFilled className="text-[#fab702]" />
            <div className="group">
              <div className="cursor-pointer leading-[80px]">
                <h1 className="cursor-pointer hover:text-[#fab702] transition-all duration-300 ease">
                  Services
                </h1>
              </div>
              <ServiceDropdown />
            </div>
            <VscCircleFilled className="text-[#fab702]" />
            <Link href={'/shop'}>
              <h1 className="cursor-pointer hover:text-[#fab702] transition-all duration-300 ease">
                Shop
              </h1>
            </Link>
            <VscCircleFilled className="text-[#fab702]" />
            <Link href={'/contact'}>
              <h1 className="cursor-pointer hover:text-[#fab702] transition-all duration-300 ease">
                Contact
              </h1>
            </Link>
            <VscCircleFilled className="text-[#fab702]" />
            <Link href={''}>
              <h1 className="cursor-pointer hover:text-[#fab702] transition-all duration-300 ease">
                Wishlist
              </h1>
            </Link>
            <VscCircleFilled className="text-[#fab702]" />
            <div className="group">
              <div className="cursor-pointer leading-[80px]">
                <h1 className="cursor-pointer hover:text-[#fab702] transition-all duration-300 ease">
                  Account
                </h1>
              </div>
              <AccountDropdown />
            </div>
          </div>
          <Link href={'/get-quote'}>
            <div className="hidden lg:block hover:bg-[#fab702]">
              <button className="flex items-center justify-center w-[150px] h-[35px] text-white border border-white text-sm gap-1 hover:text-black hover:font-semibold hover:border-black transition-all duration-300 ease group">
                <h1 className="">Get Quote</h1>
                <RiArrowRightSLine className="h-[25px] w-[25px] text-[#fab702] font-bold transition-all duration-300 ease group-hover:text-black group-hover:ml-4" />
              </button>
            </div>
          </Link>
          <div className="block lg:hidden">
            {menubarOpen ? (
              <FaXmark
                onClick={() => handleSwitch()}
                className="text-white h-[40px] w-[40px] hover:bg-[#fab702] hover:text-black transition-all duration-300 ease cursor-pointer"
              />
            ) : (
              <IoMenuSharp
                onClick={() => handleSwitch()}
                className="text-white h-[40px] w-[40px] hover:bg-[#fab702] hover:text-black transition-all duration-300 ease cursor-pointer"
              />
            )}
          </div>
        </div>
        {/* {menubarOPen && ( */}
        <motion.div
          initial="hidden"
          animate={menubarOpen ? 'visible' : 'hidden'}
          variants={sidebarVariants}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          className={`flex flex-col items-start text-white text-xs uppercase gap-6 font-semibold px-10 overflow-hidden transition-all duration-500 ease-in-out ${
            menubarOpen
              ? 'max-h-[100%] opacity-100 pb-20 mt-8'
              : 'max-h-0 opacity-0'
          }`}
        >
          <Link href={'/'} onClick={() => closeMenubar()}>
            <h1 className="cursor-pointer hover:text-[#fab702] transition-all duration-300 ease">
              Home
            </h1>
          </Link>
          <div className="w-full h-[1px] border-t border-t-[#333333]"></div>
          <div onClick={dropDownToggle} className="w-full cursor-pointer">
            <div className="flex items-center justify-between">
              <h1 className="cursor-pointer hover:text-[#fab702] transition-all duration-300 ease">
                Pages
              </h1>
              {dropdown ? <FaAngleUp /> : <FaAngleDown />}
            </div>
            <PageDropdown />
          </div>
          <div className="w-full h-[1px] border-t border-t-[#333333]"></div>
          <div onClick={serviceToggle} className="w-full cursor-pointer">
            <div className="flex items-center justify-between">
              <h1 className="cursor-pointer hover:text-[#fab702] transition-all duration-300 ease">
                Services
              </h1>
              {serviceDropdown ? <FaAngleUp /> : <FaAngleDown />}
            </div>
            <ServiceDropdown />
          </div>
          <div className="w-full h-[1px] border-t border-t-[#333333]"></div>
          <Link href={'/shop'} onClick={() => closeMenubar()}>
            <h1 className="cursor-pointer hover:text-[#fab702] transition-all duration-300 ease">
              Shop
            </h1>
          </Link>
          <div className="w-full h-[1px] border-t border-t-[#333333]"></div>
          <Link href={'/contact'} onClick={() => closeMenubar()}>
            <h1 className="cursor-pointer hover:text-[#fab702] transition-all duration-300 ease">
              Contact
            </h1>
          </Link>
          <div className="w-full h-[1px] border-t border-t-[#333333]"></div>
          <Link href={''}>
            <h1 className="cursor-pointer hover:text-[#fab702] transition-all duration-300 ease">
              Wishlist
            </h1>
          </Link>
          <div className="w-full h-[1px] border-t border-t-[#333333]"></div>
          <div onClick={accountToggle} className="w-full cursor-pointer">
            <div className="flex items-center justify-between">
              <h1 className="cursor-pointer hover:text-[#fab702] transition-all duration-300 ease">
                Account
              </h1>
              {accountDropdown ? <FaAngleUp /> : <FaAngleDown />}
            </div>
            <AccountDropdown />
          </div>
          <div className="w-full h-[1px] border-t border-t-[#333333]"></div>
          <Link href={'/get-quote'} onClick={() => closeMenubar()}>
            <div className="block lg:hidden hover:bg-[#fab702]">
              <button className="flex items-center justify-center w-[150px] h-[35px] text-white border border-white text-sm gap-1 hover:text-black hover:font-semibold hover:border-black transition-all duration-300 ease group">
                <h1 className="">Get Quote</h1>
                <RiArrowRightSLine className="h-[25px] w-[25px] text-[#fab702] font-bold transition-all duration-300 ease group-hover:text-black group-hover:ml-4" />
              </button>
            </div>
          </Link>
        </motion.div>
        {/* )} */}
      </div>
    </>
  )
}

export default Navbar
