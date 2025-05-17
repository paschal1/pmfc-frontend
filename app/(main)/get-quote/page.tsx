'use client'
import { FaHome, FaCheck, FaExpandArrowsAlt, FaUser } from 'react-icons/fa'
import { Parallax } from 'react-parallax'
import { useState } from 'react'
import SecondaryFooter from '../components/SecondaryFooter'

const Page = () => {
  const [selectedProperty, setSelectedProperty] = useState<string | null>(null)

  const handleSelect = (property: string) => {
    setSelectedProperty(property)
  }

  const images = [
    { src: '/res-img.jpg', label: 'Residential', key: 'residential' },
    { src: '/off-img.jpg', label: 'Office', key: 'office' },
    { src: '/comm-img.jpg', label: 'Commercial', key: 'commercial' },
    { src: '/ret-img.jpg', label: 'Retail', key: 'retail' },
    { src: '/other-img.jpg', label: 'Other', key: 'other' },
  ]

  return (
    <div className="flex flex-col">
      <Parallax
        strength={300}
        className="h-[230px] w-[100%] bg-cover bg-center lg:flex hidden items-center"
        bgImage={'/quote-img.jpg'}
      >
        <h1 className="uppercase text-4xl text-white ml-20">
          Renovation Budgeting
        </h1>
      </Parallax>
      <div className="h-[230px] w-[100%] lg:hidden block relative">
        <img
          src={'/quote-img.jpg'}
          alt="img"
          className="h-full w-full object-cover"
        />
        <h1 className="font-bold uppercase text-2xl text-white z-10 absolute top-24 left-3">
          Renovation Budgeting
        </h1>
      </div>
      <div className="flex items-center mt-20 mx-auto gap-4">
        <div className="h-[30px] w-[30px] rounded-full bg-[#FAB70233] flex items-center justify-center">
          <FaHome className="text-[#fab702] h-[20px] w-[20px]" />
        </div>
        <p className="text-white text-[18px]">What is your property type</p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-10 lg:w-[760px] mx-auto gap-4">
        {images.map((image) => (
          <div
            key={image.key}
            className="flex flex-col items-center gap-2"
            onClick={() => handleSelect(image.key)}
          >
            <div
              className={`w-[150px] h-[150px] relative cursor-pointer transition-all duration-500 ease-in-out ${
                selectedProperty === image.key
                  ? 'border-8 border-yellow-500'
                  : ''
              }`}
            >
              <img
                src={image.src}
                alt={image.label}
                className="w-full h-full"
              />
              <FaCheck
                className={`absolute top-2 left-3 h-[20px] w-[20px] font-bold ${
                  selectedProperty === image.key
                    ? 'text-yellow-500'
                    : 'text-[#888888]'
                }`}
              />
            </div>
            <h1
              className={`lg:text-xl text-lg font-semibold ${
                selectedProperty === image.key
                  ? 'text-yellow-500'
                  : 'text-[#BBBBBB]'
              }`}
            >
              {image.label}
            </h1>
          </div>
        ))}
      </div>
      <form className="flex flex-col mt-10 mx-auto w-full gap-4">
        <div className="flex flex-col lg:flex-row lg:gap-20 gap-10 justify-center">
          <div className="flex flex-col">
            <div className="flex items-center ml-4 lg:ml-4 gap-4">
              <div className="h-[30px] w-[30px] rounded-full bg-[#FAB70233] flex items-center justify-center">
                <FaExpandArrowsAlt className="text-[#fab702] h-[20px] w-[20px]" />
              </div>
              <p className="text-white md:text-[18px]">
                Total area size you want to renovate
              </p>
            </div>
            <div className="flex lg:flex-row flex-col mt-6 ml-4 lg:ml-0 gap-8">
              <input
                type="text"
                placeholder="Area Size"
                className="lg:w-[166px] w-[90%] focus:outline-none placeholder:text-white focus:border-[#fab702] bg-[#0000001A] border border-[#FFFFFF33] px-4 py-2 text-white font-semibold"
              />
              <select
                className="lg:w-[166px] w-[90%] focus:outline-none placeholder:text-white focus:border-[#fab702] bg-[#0000001A] border border-[#FFFFFF33] px-4 py-2 text-white font-semibold"
                defaultValue="sqft"
                title="Select Unit"
              >
                <option value="sqft" className="text-black font-semibold">
                  Square Feet (sqft)
                </option>
                <option value="m" className="text-black font-semibold">
                  Meter (m)
                </option>
                <option value="ft" className="text-black font-semibold">
                  Feet (ft)
                </option>
              </select>
            </div>
          </div>
          <div className="flex flex-col gap-6">
            <div className="flex items-center ml-4 lg:ml-0 gap-4">
              <div className="h-[30px] w-[30px] rounded-full bg-[#FAB70233] flex items-center justify-center">
                <FaExpandArrowsAlt className="text-[#fab702] h-[20px] w-[20px]" />
              </div>
              <p className="text-white md:text-[18px]">
                Select renovation budget
              </p>
            </div>
            <div className="flex flex-col ml-4 lg:ml-0">
              <select
                className="lg:w-[356px] w-[90%] focus:outline-none font-semibold placeholder:text-white focus:border-[#fab702] bg-[#0000001A] border border-[#FFFFFF33] px-4 py-2 text-white"
                defaultValue="budget-friendly"
                title="Select Unit"
              >
                <option
                  value="budget-friendly"
                  className="text-black font-semibold"
                >
                  Budget Friendly
                </option>
                <option value="mid-range" className="text-black font-semibold">
                  Mid Range
                </option>
                <option value="high-end" className="text-black font-semibold">
                  High end
                </option>
              </select>
            </div>
          </div>
        </div>
        <div className="flex flex-col lg:flex-row lg:gap-20 gap-10 justify-center">
          <div className="flex flex-col ">
            <div className="flex items-center ml-4 lg:ml-0 gap-4 mt-8">
              <div className="h-[30px] w-[30px] rounded-full bg-[#FAB70233] flex items-center justify-center">
                <FaUser className="text-[#fab702] h-[20px] w-[20px]" />
              </div>
              <p className="text-white md:text-[18px]">Enter your details </p>
            </div>
            <div className="flex flex-col ml-4 lg:ml-0 gap-6 mt-6">
              <input
                type="text"
                placeholder="Your Name"
                className="lg:w-[356px] w-[90%] focus:outline-none placeholder:text-white focus:border-[#fab702] bg-[#0000001A] border border-[#FFFFFF33] px-4 py-3 font-semibold text-white"
              />
              <input
                type="email"
                placeholder="Your Email"
                className="lg:w-[356px] w-[90%] focus:outline-none placeholder:text-white focus:border-[#fab702] bg-[#0000001A] border border-[#FFFFFF33] px-4 py-3 font-semibold text-white"
              />
              <input
                type="number"
                placeholder="Your Phone"
                className="lg:w-[356px] w-[90%] focus:outline-none placeholder:text-white focus:border-[#fab702] bg-[#0000001A] border border-[#FFFFFF33] px-4 py-3 font-semibold text-white"
              />
            </div>
          </div>
          <div className="flex flex-col ml-4 lg:ml-0">
            <textarea
              title="text"
              placeholder="Your Message"
              className="bg-[#0000001A] border border-[#FFFFFF33] px-4 py-2 w-[90%] lg:w-[356px] focus:border-[#fab702] focus:outline-none align-top placeholder:text-white placeholder:text-lg lg:h-[195px] h-[150px] text-white lg:mt-[5.5rem]"
            />
          </div>
        </div>
        <div className='lg:w-[790px] flex justify-start lg:mx-auto mt-4'>
          <button className="ml-4 lg:ml-0 text-white border border-[#FFFFFF33] w-[142px] h-[35px] uppercase text-[12px] hover:text-black hover:bg-[#fab702] hover:border-none hover:font-semibold transition-all duration-500 ease-in-out">
            Submit Form
          </button>
        </div>
      </form>
      <SecondaryFooter />
    </div>
  )
}

export default Page
