'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { Parallax } from 'react-parallax'
import { RiArrowRightSLine } from 'react-icons/ri'
import { Heart, ShoppingCart, X, Loader, Package, Tag, CheckCircle, AlertCircle } from 'lucide-react'
import bgProduct from '../../../public/bg-product.jpg'
import SecondaryFooter from '../components/SecondaryFooter'
import * as productsApi from '../../services/productsApi.service'
import * as cartApi from '../../services/cartApi.service'

const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<productsApi.Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedProduct, setSelectedProduct] = useState<productsApi.Product | null>(null)
  const [wishlistItems, setWishlistItems] = useState<Set<number>>(new Set())
  const [actionLoading, setActionLoading] = useState<number | null>(null)
  const [notification, setNotification] = useState<{
    type: 'success' | 'error'
    message: string
  } | null>(null)

  // Fetch products on mount
  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await productsApi.getProducts({
        per_page: 50,
        available_only: true,
      })
      setProducts(response.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  // Show notification
  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message })
    setTimeout(() => setNotification(null), 3000)
  }

  // Handle add to cart
  const handleAddToCart = async (productId: number, e: React.MouseEvent) => {
    e.stopPropagation()
    try {
      setActionLoading(productId)
      await cartApi.addToCart(productId, 1)
      showNotification('success', 'Product added to cart!')
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add to cart'
      showNotification('error', errorMessage)
      
      // If user is not logged in, you might want to redirect to login
      if (errorMessage.includes('login')) {
        // Optional: redirect to login page
        // window.location.href = '/login'
      }
    } finally {
      setActionLoading(null)
    }
  }

  // Handle toggle wishlist
  const handleToggleWishlist = async (productId: number, e: React.MouseEvent) => {
    e.stopPropagation()
    try {
      setActionLoading(productId)
      
      if (wishlistItems.has(productId)) {
        // Remove from wishlist (you'd need the wishlist item ID from backend)
        showNotification('success', 'Removed from wishlist')
        setWishlistItems(prev => {
          const newSet = new Set(prev)
          newSet.delete(productId)
          return newSet
        })
      } else {
        // Add to wishlist
        await productsApi.addToWishlist(productId)
        showNotification('success', 'Added to wishlist!')
        setWishlistItems(prev => new Set(prev).add(productId))
      }
    } catch (err) {
      showNotification('error', err instanceof Error ? err.message : 'Failed to update wishlist')
    } finally {
      setActionLoading(null)
    }
  }

  // Open product modal
  const openProductModal = (product: productsApi.Product) => {
    setSelectedProduct(product)
  }

  // Close modal
  const closeModal = () => {
    setSelectedProduct(null)
  }

  return (
    <>
      <div className="flex flex-col">
        {/* Notification */}
        {notification && (
          <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top">
            <div
              className={`flex items-center gap-3 px-6 py-3 rounded-lg shadow-lg ${
                notification.type === 'success'
                  ? 'bg-green-900/90 border border-green-500'
                  : 'bg-red-900/90 border border-red-500'
              }`}
            >
              {notification.type === 'success' ? (
                <CheckCircle className="w-5 h-5 text-green-400" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-400" />
              )}
              <p className="text-white font-medium">{notification.message}</p>
            </div>
          </div>
        )}

        {/* Hero Section */}
        <Parallax
          strength={300}
          className="h-[230px] w-full bg-cover bg-center lg:flex hidden items-center"
          bgImage={bgProduct.src}
        >
          <h1 className="font-bold text-3xl text-white ml-20">Our Products</h1>
        </Parallax>
        <div className="h-[230px] w-full lg:hidden block relative">
          <img
            src={bgProduct.src}
            alt="Products"
            className="h-full w-full object-cover"
          />
          <h1 className="font-bold text-2xl text-white z-10 absolute top-24 left-3">
            Our Products
          </h1>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center min-h-[400px]">
            <Loader className="w-12 h-12 text-[#fab702] animate-spin" />
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="flex justify-center items-center min-h-[400px] px-4">
            <div className="bg-red-900/30 border border-red-500 rounded-lg p-6 max-w-md">
              <p className="text-red-400">{error}</p>
              <button
                onClick={fetchProducts}
                className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Products Grid */}
        {!loading && !error && (
          <div className="mt-28 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mb-10 px-4">
            {products.map((product) => (
              <div
                key={product.id}
                onClick={() => openProductModal(product)}
                className="flex flex-col justify-between w-full max-w-[280px] mx-auto rounded-xl shadow-custom bg-gray-900 border border-gray-800 hover:border-[#fab702] transition-all duration-300 cursor-pointer group"
              >
                {/* Product Image */}
                <div className="relative w-full h-[220px] overflow-hidden rounded-t-xl">
                  <Image
                    src={product.image || '/placeholder-product.jpg'}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  
                  {/* Wishlist Button */}
                  <button
                    onClick={(e) => handleToggleWishlist(product.id, e)}
                    disabled={actionLoading === product.id}
                    className="absolute top-3 right-3 p-2 bg-black/50 backdrop-blur-sm rounded-full hover:bg-[#fab702] transition-all duration-200 group/wishlist"
                  >
                    <Heart
                      className={`w-5 h-5 ${
                        wishlistItems.has(product.id)
                          ? 'fill-red-500 text-red-500'
                          : 'text-white group-hover/wishlist:text-black'
                      }`}
                    />
                  </button>

                  {/* Stock Badge */}
                  {product.stock <= 5 && product.stock > 0 && (
                    <div className="absolute top-3 left-3 px-2 py-1 bg-yellow-600 text-white text-xs font-bold rounded">
                      Only {product.stock} left
                    </div>
                  )}

                  {product.stock === 0 && (
                    <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                      <span className="text-white font-bold text-lg">Out of Stock</span>
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="p-4 flex flex-col gap-3">
                  <h2 className="text-white font-semibold text-lg line-clamp-2 min-h-[56px]">
                    {product.name}
                  </h2>
                  
                  <div className="flex items-center justify-between">
                    <p className="text-[#fab702] text-xl font-bold">
                      ₦{typeof product.price === 'number' 
                        ? product.price.toLocaleString() 
                        : parseFloat(product.price).toLocaleString()}
                    </p>
                    {product.category && (
                      <span className="text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded">
                        {product.category.name}
                      </span>
                    )}
                  </div>

                  {/* Add to Cart Button */}
                  <button
                    onClick={(e) => handleAddToCart(product.id, e)}
                    disabled={product.stock === 0 || actionLoading === product.id}
                    className="w-full text-white font-semibold border border-gray-600 py-2.5 px-4 flex items-center justify-center relative hover:bg-[#fab702] hover:border-[#fab702] hover:text-black disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 group/button rounded"
                  >
                    {actionLoading === product.id ? (
                      <Loader className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        <span>Add To Cart</span>
                        <RiArrowRightSLine className="absolute right-4 h-6 w-6 font-bold transition-all duration-300 group-hover/button:right-2" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Product Detail Modal */}
        {selectedProduct && (
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={closeModal}
          >
            <div
              className="bg-gray-900 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-gray-800"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 p-2 bg-black/50 backdrop-blur-sm rounded-full hover:bg-red-600 transition-colors"
              >
                <X className="w-6 h-6 text-white" />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 md:p-8">
                {/* Product Image */}
                <div className="relative h-[400px] rounded-xl overflow-hidden">
                  <Image
                    src={selectedProduct.image || '/placeholder-product.jpg'}
                    alt={selectedProduct.name}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Product Details */}
                <div className="flex flex-col gap-6">
                  <div>
                    <h2 className="text-3xl font-bold text-white mb-2">
                      {selectedProduct.name}
                    </h2>
                    {selectedProduct.category && (
                      <div className="flex items-center gap-2 text-gray-400">
                        <Tag className="w-4 h-4" />
                        <span>{selectedProduct.category.name}</span>
                      </div>
                    )}
                  </div>

                  <div className="text-4xl font-bold text-[#fab702]">
                    ₦{typeof selectedProduct.price === 'number' 
                      ? selectedProduct.price.toLocaleString() 
                      : parseFloat(selectedProduct.price).toLocaleString()}
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Package className="w-5 h-5 text-gray-400" />
                      <span className="text-white">
                        {selectedProduct.stock > 0 
                          ? `${selectedProduct.stock} in stock` 
                          : 'Out of stock'}
                      </span>
                    </div>
                  </div>

                  <div className="border-t border-gray-800 pt-4">
                    <h3 className="text-white font-semibold mb-2">Description</h3>
                    <p className="text-gray-400 leading-relaxed">
                      {selectedProduct.description || 'No description available.'}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-4 mt-auto">
                    <button
                      onClick={(e) => handleAddToCart(selectedProduct.id, e)}
                      disabled={selectedProduct.stock === 0}
                      className="flex-1 bg-[#fab702] text-black font-bold py-3 px-6 rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      <ShoppingCart className="w-5 h-5" />
                      Add to Cart
                    </button>

                    <button
                      onClick={(e) => handleToggleWishlist(selectedProduct.id, e)}
                      className={`p-3 border rounded-lg transition-all duration-300 ${
                        wishlistItems.has(selectedProduct.id)
                          ? 'bg-red-600 border-red-600 text-white'
                          : 'border-gray-600 text-white hover:border-[#fab702]'
                      }`}
                    >
                      <Heart
                        className={`w-6 h-6 ${
                          wishlistItems.has(selectedProduct.id) ? 'fill-white' : ''
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <SecondaryFooter />
      </div>
    </>
  )
}

export default ProductsPage