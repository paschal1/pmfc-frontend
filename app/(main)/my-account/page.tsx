'use client'
import React from 'react'
import { Parallax } from 'react-parallax'
import { GrCircleInformation } from 'react-icons/gr'
import { AiOutlineHistory } from 'react-icons/ai'
import { GoCreditCard } from 'react-icons/go'
import { GoGift } from 'react-icons/go'
import { LiaDigitalTachographSolid } from 'react-icons/lia'
import SecondaryFooter from '../components/SecondaryFooter'

const page = () => {
  return (
    <div className="flex flex-col">
      <Parallax
        strength={300}
        className="h-[230px] w-[100%] bg-cover bg-center lg:flex hidden items-center"
        bgImage={'/user-bg.jpg'}
      >
        <h1 className="font-bold text-3xl text-white lg:ml-20 ml-10">
          Your account
        </h1>
      </Parallax>
      <div className="h-[230px] w-[100%] lg:hidden block relative">
        <img
          src={'/user-bg.jpg'}
          alt="img"
          className="h-full w-full object-cover"
        />
        <h1 className="font-bold text-3xl text-white z-10 absolute top-24 left-3">
          Your account
        </h1>
      </div>
      <div className="mt-20 text-white mx-auto lg:w-auto w-full px-4 lg:px-0">
        <div className=" grid lg:grid-cols-3 grid-cols-1 gap-8 lg:w-auto w-full">
          <div className="lg:w-[370px] w-full h-[86px] border border-[#333333] flex flex-col items-center justify-center uppercase gap-2 cursor-pointer">
            <GrCircleInformation className="h-[20px] w-[20px]" />
            <h1>Information</h1>
          </div>
          <div className="lg:w-[370px] w-full h-[86px] border border-[#333333] flex flex-col items-center justify-center uppercase gap-2 cursor-pointer">
            <AiOutlineHistory className="h-[20px] w-[20px]" />
            <h1>History</h1>
          </div>
          <div className="lg:w-[370px] w-full h-[86px] border border-[#333333] flex flex-col items-center justify-center uppercase gap-2 cursor-pointer">
            <GoCreditCard className="h-[20px] w-[20px]" />
            <h1>Credit slips</h1>
          </div>
          <div className="lg:w-[370px] w-full h-[86px] border border-[#333333] flex flex-col items-center justify-center uppercase gap-2 cursor-pointer">
            <GoGift className="h-[20px] w-[20px]" />
            <h1>Voucher</h1>
          </div>
          <div className="lg:w-[370px] w-full h-[86px] border border-[#333333] flex flex-col items-center justify-center uppercase gap-2 cursor-pointer">
            <LiaDigitalTachographSolid className="h-[20px] w-[20px]" />
            <h1>GDPR - Personal data</h1>
          </div>
          <div className="lg:w-[370px] w-full h-[86px] border border-[#333333] flex flex-col items-center justify-center uppercase gap-2 cursor-pointer">
            My wishlists
          </div>
        </div>
      </div>
      <SecondaryFooter />
    </div>
  )
}

export default page
