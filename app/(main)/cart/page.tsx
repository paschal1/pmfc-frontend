'use client'
import React from 'react'
import { Parallax } from 'react-parallax'
import { Product, ProductData } from '../data/product'

const page = () => {
  return (
    <div className="flex flex-col">
      <Parallax
        strength={300}
        className="h-[230px] w-[100%] bg-cover bg-center flex items-center"
        bgImage={'/cart-bg.jpg'}
      >
        <h1 className="text-4xl text-white font-semibold ml-20">
          Items in my cart
        </h1>
      </Parallax>
      <div className="flex lg:flex-row flex-col mx-auto mt-20 gap-8">
        <div className="flex flex-col lg:w-[855px] w-[90%] bg-[#212529] mx-auto">
          <div className="flex items-center text-white mt-2 font-semibold justify-between border-b border-b-[#FFFFFF33] py-4">
            <h1 className="ml-3 lg:mr-0">Items</h1>
            <div className="flex lg:mr-20 lg:gap-28 gap-4">
              <h1>Quantity</h1>
              <h1 className="lg:w-auto w-[70px] mr-[-2rem] lg:mr-0">
                Final Price
              </h1>
            </div>
          </div>
          {Product.slice(0, 5).map((item: ProductData) => (
            <div key={item.id} className="flex flex-col gap-8">
              <div className="flex items-center justify-between border-b border-b-[#FFFFFF33] pb-8 mt-8 gap-8">
                <div className="flex gap-5">
                  <img
                    src={item.image.src}
                    alt="img"
                    className="h-[50px] w-[50px]"
                  />
                  <div className="flex flex-col gap-2 text-[15px] md:text-[16px]">
                    <h1 className="text-white md:font-semibold w-[100px] md:w-auto">
                      {item.name}
                    </h1>
                    <h1 className="text-[#fab702]">${item.price}</h1>
                  </div>
                </div>
                <div className="flex lg:gap-[3rem] lg:mr-28 mr-2 gap-4 text-[15px] lg:text-[16px]">
                  <div className="lg:flex hidden text-white border border-[#FFFFFF33] w-[90px] h-[40px] justify-between px-2 ">
                    <div className="border-r border-[#FFFFFF33] pr-2 pt-1">
                      -
                    </div>
                    <div className="text-center pt-1">1</div>
                    <div className="border-l border-[#FFFFFF33] pl-2 pt-1">
                      +
                    </div>
                  </div>
                  <div>
                    <div className="lg:hidden flex h-[40px] w-[60px] text-white border border-[#FFFFFF33] justify-between px-2">
                      <div className="border-r border-[#FFFFFF33] pr-3 pt-1">
                        -
                      </div>
                      <div className="text-center pt-1">1</div>
                    </div>
                    <div className="lg:hidden flex items-center justify-center h-[40px] w-[28px] text-white border border-[#FFFFFF33] ">
                      +
                    </div>
                  </div>
                  <h1 className="text-white">${item.price}</h1>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="lg:w-[253px] w-[90%] bg-[#1E2024] px-4 h-[400px]">
          <h1 className="font-bold md:text-2xl text-xl text-white mt-8">
            Summary
          </h1>
          <div className="flex flex-col gap-3 mt-4">
            <div className="flex items-center justify-between text-[#BBBBBB]">
              <h1>Subtotal</h1>
              <h1>$950</h1>
            </div>
            <div className="flex items-center justify-between text-[#BBBBBB]">
              <h1>Shipping est</h1>
              <h1>$150</h1>
            </div>
          </div>
          <div className="mt-8 h-[2px] w-full bg-[#FFFFFF1A]"></div>
          <div className="flex items-center justify-between text-[#BBBBBB] mt-8">
            <h1>Total Price</h1>
            <h1>$1100</h1>
          </div>
          <div className="mt-8 h-[2px] w-full bg-[#FFFFFF1A]"></div>
          <button className="mt-8 w-full py-3 bg-[#fab702] text-sm">CHECKOUT</button>
        </div>
      </div>
    </div>
  )
}

export default page
