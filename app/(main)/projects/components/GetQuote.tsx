import Link from 'next/link'
import React from 'react'
import { RiArrowRightSLine } from 'react-icons/ri'

const GetQuote = () => {
  return (
    <div className="h-[130px] w-[100%] bg-[#fab702] flex items-center justify-center">
      <Link href={'/get-quote'}>
        <button className="flex items-center  mx-auto text-[11px] border border-black uppercase p-[0.6rem] px-[3rem] pr-10 font-bold relative hover:bg-black hover:text-white group transition-all duration-300 ease">
          <h1 className="text-center text-lg mr-2">Get Quotation</h1>
          <RiArrowRightSLine className="absolute right-6 h-[25px] w-[25px] font-bold transition-all duration-300 ease  group-hover:right-4" />
        </button>
      </Link>
    </div>
  )
}

export default GetQuote
