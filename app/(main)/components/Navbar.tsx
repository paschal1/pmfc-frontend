'use client'
import { RiArrowRightSLine } from 'react-icons/ri'
import { IoMenuSharp } from 'react-icons/io5'
import { VscCircleFilled } from 'react-icons/vsc'
import { FaAngleUp, FaXmark } from 'react-icons/fa6'
import { ShoppingCart, X, Loader } from 'lucide-react'
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
import { useState, useEffect } from 'react'
import * as cartApi from '../../services/cartApi.service'

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

  // Cart state
  const [cartOpen, setCartOpen] = useState(false)
  const [cartItems, setCartItems] = useState<cartApi.CartItem[]>([])
  const [cartLoading, setCartLoading] = useState(false)
  const [cartError, setCartError] = useState<string | null>(null)
  const [cartTotal, setCartTotal] = useState(0)
  const [removingItemId, setRemovingItemId] = useState<number | null>(null)

  // Fetch cart on mount
  useEffect(() => {
    fetchCart()
  }, [])

  const fetchCart = async () => {
    try {
      setCartLoading(true)
      setCartError(null)
      const cart = await cartApi.getCart()
      setCartItems(cart.cart_items || [])
      setCartTotal(cart.total || cartApi.calculateCartTotal(cart.cart_items || []))
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to load cart'
      if (!errorMsg.includes('login')) {
        setCartError(errorMsg)
      }
      setCartItems([])
      setCartTotal(0)
    } finally {
      setCartLoading(false)
    }
  }

  const handleRemoveFromCart = async (cartItemId: number) => {
    try {
      setRemovingItemId(cartItemId)
      await cartApi.removeFromCart(cartItemId)
      setCartItems(cartItems.filter(item => item.id !== cartItemId))
      // Recalculate total
      const updatedTotal = cartItems
        .filter(item => item.id !== cartItemId)
        .reduce((total, item) => {
          const price = typeof item.product?.price === 'number'
            ? item.product.price
            : parseFloat(item.product?.price || '0')
          return total + (price * item.quantity)
        }, 0)
      setCartTotal(updatedTotal)
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to remove item'
      setCartError(errorMsg)
      setTimeout(() => setCartError(null), 3000)
    } finally {
      setRemovingItemId(null)
    }
  }

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

  const cartDropdownVariants = {
    hidden: {
      opacity: 0,
      y: -10,
    },
    visible: {
      opacity: 1,
      y: 0,
    },
  }

  return (
    <>
      <div className="bg-[rgb(24, 25, 27)] flex flex-col">
        <div className="flex flex-row h-[90px] items-center lg:px-20 px-6 lg:justify-around justify-between">
          <div className="">
            <h1 className="text-white text-2xl font-bold">PMFC</h1>
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
            
            {/* Cart Icon with Dropdown */}
            <div className="relative group">
              <button 
                onClick={() => setCartOpen(!cartOpen)}
                className="relative cursor-pointer hover:text-[#fab702] transition-all duration-300 ease flex items-center gap-2"
              >
                <ShoppingCart className="w-5 h-5" />
                {cartItems.length > 0 && (
                  <span className="absolute -top-2 -right-3 bg-[#fab702] text-black text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {cartItems.length}
                  </span>
                )}
              </button>
              
              {/* Desktop Cart Dropdown */}
              <motion.div
                initial="hidden"
                animate={cartOpen ? 'visible' : 'hidden'}
                variants={cartDropdownVariants}
                transition={{ duration: 0.2 }}
                className={`absolute right-0 top-full mt-2 w-80 bg-[rgb(24, 25, 27)] border border-[#fab702] rounded-lg shadow-2xl z-50 ${
                  cartOpen ? 'pointer-events-auto' : 'pointer-events-none'
                }`}
              >
                <div className="border-b border-[#fab702]/30 p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-white font-bold text-sm">My Cart</h3>
                    <button
                      onClick={() => setCartOpen(false)}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {cartLoading ? (
                  <div className="p-6 text-center">
                    <Loader className="w-5 h-5 animate-spin text-[#fab702] mx-auto" />
                    <p className="text-gray-400 text-xs mt-2">Loading cart...</p>
                  </div>
                ) : cartError ? (
                  <div className="p-4 text-center">
                    <p className="text-red-400 text-xs">{cartError}</p>
                  </div>
                ) : cartItems.length === 0 ? (
                  <div className="p-6 text-center">
                    <ShoppingCart className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                    <p className="text-gray-400 text-xs">Your cart is empty</p>
                  </div>
                ) : (
                  <>
                    {/* Cart Items */}
                    <div className="max-h-80 overflow-y-auto">
                      {cartItems.map((item) => (
                        <div
                          key={item.id}
                          className="border-b border-[#FFFFFF33] p-4 hover:bg-[rgba(250,183,2,0.05)] transition-colors"
                        >
                          <div className="flex gap-3 items-start">
                            {item.product?.image && (
                              <img
                                src={item.product.image}
                                alt={item.product.name}
                                className="w-12 h-12 rounded object-cover border border-[#fab702]/20"
                              />
                            )}
                            <div className="flex-1 min-w-0">
                              <h4 className="text-white text-xs font-semibold truncate">
                                {item.product?.name || 'Product'}
                              </h4>
                              <p className="text-[#fab702] text-xs font-bold mt-1">
                                ₦{typeof item.product?.price === 'number' ? item.product.price.toLocaleString() : parseFloat(item.product?.price || '0').toLocaleString()}
                              </p>
                              <p className="text-gray-400 text-xs mt-1">
                                Qty: <span className="text-white font-semibold">{item.quantity}</span>
                              </p>
                            </div>
                            <button
                              onClick={() => handleRemoveFromCart(item.id)}
                              disabled={removingItemId === item.id}
                              className="text-gray-400 hover:text-red-400 transition-colors disabled:opacity-50"
                            >
                              {removingItemId === item.id ? (
                                <Loader className="w-4 h-4 animate-spin" />
                              ) : (
                                <X className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Cart Footer */}
                    <div className="border-t border-[#fab702]/30 p-4 bg-[rgba(250,183,2,0.05)]">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-gray-400 text-xs">Subtotal:</span>
                        <span className="text-[#fab702] font-bold">₦{cartTotal.toLocaleString('en-NG', { maximumFractionDigits: 2 })}</span>
                      </div>
                      <Link href="/cart">
                        <button 
                          onClick={() => setCartOpen(false)}
                          className="w-full bg-[#fab702] text-black py-2 rounded text-xs font-bold hover:opacity-75 transition-all duration-300"
                        >
                          View Cart
                        </button>
                      </Link>
                      <Link href="/checkout" onClick={() => setCartOpen(false)}>
                        <button className="w-full mt-2 border border-[#fab702] text-[#fab702] py-2 rounded text-xs font-bold hover:bg-[#fab702]/10 transition-all duration-300">
                          Checkout
                        </button>
                      </Link>
                    </div>
                  </>
                )}
              </motion.div>
            </div>

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
          
          {/* Desktop Get Quote Button + Cart & Mobile Menu Icons */}
          <div className="flex items-center gap-4">
            {/* Mobile Cart Icon */}
            <button 
              onClick={() => setCartOpen(!cartOpen)}
              className="lg:hidden relative cursor-pointer hover:text-[#fab702] transition-all duration-300 ease flex items-center gap-2 text-white"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-3 bg-[#fab702] text-black text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItems.length}
                </span>
              )}
            </button>

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
        </div>

        {/* Mobile Cart Dropdown */}
        <motion.div
          initial="hidden"
          animate={cartOpen && menubarOpen ? 'visible' : 'hidden'}
          variants={cartDropdownVariants}
          transition={{ duration: 0.2 }}
          className={`lg:hidden bg-[rgb(24, 25, 27)] border-t border-[#fab702] mx-6 rounded-b-lg overflow-hidden z-40 ${
            cartOpen && menubarOpen ? 'pointer-events-auto' : 'pointer-events-none'
          }`}
        >
          <div className="border-b border-[#fab702]/30 p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-white font-bold text-sm">My Cart</h3>
              <button
                onClick={() => setCartOpen(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {cartLoading ? (
            <div className="p-6 text-center">
              <Loader className="w-5 h-5 animate-spin text-[#fab702] mx-auto" />
              <p className="text-gray-400 text-xs mt-2">Loading cart...</p>
            </div>
          ) : cartError ? (
            <div className="p-4 text-center">
              <p className="text-red-400 text-xs">{cartError}</p>
            </div>
          ) : cartItems.length === 0 ? (
            <div className="p-6 text-center">
              <ShoppingCart className="w-8 h-8 text-gray-600 mx-auto mb-2" />
              <p className="text-gray-400 text-xs">Your cart is empty</p>
            </div>
          ) : (
            <>
              {/* Mobile Cart Items */}
              <div className="max-h-80 overflow-y-auto">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="border-b border-[#FFFFFF33] p-4 hover:bg-[rgba(250,183,2,0.05)] transition-colors"
                  >
                    <div className="flex gap-3 items-start">
                      {item.product?.image && (
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-12 h-12 rounded object-cover border border-[#fab702]/20"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <h4 className="text-white text-xs font-semibold truncate">
                          {item.product?.name || 'Product'}
                        </h4>
                        <p className="text-[#fab702] text-xs font-bold mt-1">
                          ₦{typeof item.product?.price === 'number' ? item.product.price.toLocaleString() : parseFloat(item.product?.price || '0').toLocaleString()}
                        </p>
                        <p className="text-gray-400 text-xs mt-1">
                          Qty: <span className="text-white font-semibold">{item.quantity}</span>
                        </p>
                      </div>
                      <button
                        onClick={() => handleRemoveFromCart(item.id)}
                        disabled={removingItemId === item.id}
                        className="text-gray-400 hover:text-red-400 transition-colors disabled:opacity-50"
                      >
                        {removingItemId === item.id ? (
                          <Loader className="w-4 h-4 animate-spin" />
                        ) : (
                          <X className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Mobile Cart Footer */}
              <div className="border-t border-[#fab702]/30 p-4 bg-[rgba(250,183,2,0.05)]">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-gray-400 text-xs">Subtotal:</span>
                  <span className="text-[#fab702] font-bold">₦{cartTotal.toLocaleString('en-NG', { maximumFractionDigits: 2 })}</span>
                </div>
                <Link href="/cart">
                  <button 
                    onClick={() => setCartOpen(false)}
                    className="w-full bg-[#fab702] text-black py-2 rounded text-xs font-bold hover:opacity-75 transition-all duration-300"
                  >
                    View Cart
                  </button>
                </Link>
                <Link href="/checkout" onClick={() => setCartOpen(false)}>
                  <button className="w-full mt-2 border border-[#fab702] text-[#fab702] py-2 rounded text-xs font-bold hover:bg-[#fab702]/10 transition-all duration-300">
                    Checkout
                  </button>
                </Link>
              </div>
            </>
          )}
        </motion.div>

        {/* Mobile Sidebar Menu */}
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
      </div>
    </>
  )
}

export default Navbar