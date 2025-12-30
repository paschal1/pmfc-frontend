'use client'
import React from 'react'
import Image from 'next/image'
import { Parallax } from 'react-parallax'
import { Product } from '../data/product'
import { RiArrowRightSLine } from 'react-icons/ri'
import bgProduct from '../../../public/bg-product.jpg'
import SecondaryFooter from '../components/SecondaryFooter'

const Page: React.FC = () => {
  return (
    <>
      <div className="flex flex-col ">
        <Parallax
          strength={300}
          className="h-[230px] w-[100%] bg-cover bg-center lg:flex hidden items-center"
          bgImage={bgProduct.src}
        >
          <h1 className="font-bold text-3xl text-white ml-20">Our Products</h1>
        </Parallax>
        <div className="h-[230px] w-[100%] lg:hidden block relative">
          <img
            src={bgProduct.src}
            alt="img"
            className="h-full w-full object-cover"
          />
          <h1 className="font-bold text-2xl text-white z-10 absolute top-24 left-3">Our Products</h1>
        </div>
        <div className="mt-28 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mb-10">
          {Product.map((item) => (
            <div
              key={item.id}
              className="flex flex-col justify-between w-[85%] lg:w-[240px] lg:h-[380px] md:h-[400px] sm:h-[470px] h-[605px] mx-auto rounded-xl shadow-custom "
            >
              <div className="w-[90%] h-[180px] mx-auto">
                <Image
                  src={item.image}
                  alt="image"
                  objectFit="cover"
                  className="rounded-xl mt-4"
                />
                <div className="flex flex-col text-left ml-0 mt-4 lg:mt-2">
                  <h1 className="text-white font-semibold">{item.name}</h1>
                  <h1 className="text-[#fab702] mt-2 font-semibold">
                    ₦{item.price}
                  </h1>
                </div>
              </div>
              <div className="flex flex-col mb-4">
                <button className="mx-auto text-white font-semibold border sm:p-2 p-0 flex w-[90%] items-center justify-center relative hover:bg-[#fab702] hover:border-none group">
                  <p>Add To Cart</p>
                  <RiArrowRightSLine className="absolute text-[#fab702] right-6 h-[25px] w-[25px] font-bold transition-all duration-300 ease  group-hover:right-3 group-hover:text-black" />
                </button>
              </div>
            </div>
          ))}
        </div>
        <SecondaryFooter />
      </div>
    </>
  )
}

export default Page