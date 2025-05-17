import React from 'react'

const SecondaryFooter = () => {
  return (
    <div className="mt-20 flex flex-col lg:flex-row items-center justify-around">
      <div className="flex flex-col gap-4 w-[80%] sm:w-[503px] md:[720px] lg:w-[285px]">
        <h1 className="text-white text-2xl">PMFC</h1>
        <div className="">
          <p className="text-white w-full lg:text-[14px] text-[13px]">
            We are passionate about transforming spaces into stunning,
            functional, and personalized environments. With years of experience
            in the industry, we specialize in creating exceptional interior
            designs that reflect our clients unique style and meet their
            specific needs.
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-4 w-[80%] sm:w-[503px] md:[720px] lg:w-[285px] mt-6 lg:mt-0">
        <h1 className="uppercase text-white text-2xl">Latest News</h1>
        <div className="text-[13px] lg:text-[14px]">
          <p className="text-white hover:text-[#fab702] cursor-pointer border-b border-b-gray-600 transition-all duration-300 ease pb-2">
            The Essential Interior Design Tips
          </p>
          <p className="text-white hover:text-[#fab702] cursor-pointer border-b border-b-gray-600 transition-all duration-300 ease pb-2 mt-2">
            Functional Wall-To-Wall Shelves
          </p>
          <p className="text-white hover:text-[#fab702] cursor-pointer border-b border-b-gray-600 transition-all duration-300 ease pb-2 mt-2">
            9 Unique Ways to Display Your TV
          </p>
          <p className="text-white hover:text-[#fab702] cursor-pointer border-b border-b-gray-600 transition-all duration-300 ease pb-2 mt-2">
            The 5 Secrets to Minimal Design
          </p>
          <p className="text-white hover:text-[#fab702] cursor-pointer border-b border-b-gray-600 transition-all duration-300 ease pb-2 mt-2">
            Make a Huge Impact With Multiples
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-4 w-[80%] sm:w-[503px] md:[720px] lg:w-[285px] mt-6 lg:mt-0">
        <h1 className="uppercase text-white text-2xl">Contact Us</h1>
        <div className="text-[13px] lg:text-[14px]">
          <p className="text-white border-b border-b-gray-600 transition-all duration-300 ease pb-2">
            5 decking ifite, Anambra state, Nigeria.
          </p>
          <div className="text-white cursor-pointer border-b border-b-gray-600 transition-all duration-300 ease pb-2 mt-2 flex items-center gap-2">
            <p className="text-[#fab702] font-semibold">Phone:</p>
            <p>08073161010</p>
          </div>
          <div className="text-white border-b border-b-gray-600 transition-all duration-300 ease pb-2 mt-2 flex items-center gap-2">
            <p className="text-[#fab702] font-semibold">Fax:</p>
            <p>08073161010</p>
          </div>
          <div className="text-white border-b border-b-gray-600 transition-all duration-300 ease pb-2 mt-2 flex items-center gap-2">
            <p className="text-[#fab702] font-semibold">Email:</p>
            <p className='text-[12px]'>princemfurnishingconcept@gmail.com</p>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-4 w-[80%] sm:w-[503px] md:[720px] lg:w-[285px] mt-6 lg:mt-0">
        <h1 className="uppercase text-white text-2xl">Our Service</h1>
        <div className="text-[13px] lg:text-[15px]">
          <p className="text-white hover:text-[#fab702] cursor-pointer border-b border-b-gray-600 transition-all duration-300 ease pb-2">
            Interior Design
          </p>
          <p className="text-white hover:text-[#fab702] cursor-pointer border-b border-b-gray-600 transition-all duration-300 ease pb-2 mt-2">
            Architecture
          </p>
          <p className="text-white hover:text-[#fab702] cursor-pointer border-b border-b-gray-600 transition-all duration-300 ease pb-2 mt-2">
            Industry
          </p>
          <p className="text-white hover:text-[#fab702] cursor-pointer border-b border-b-gray-600 transition-all duration-300 ease pb-2 mt-2">
            Consulting
          </p>
          <p className="text-white hover:text-[#fab702] cursor-pointer border-b border-b-gray-600 transition-all duration-300 ease pb-2 mt-2">
            Photography
          </p>
        </div>
      </div>
    </div>
  )
}

export default SecondaryFooter
