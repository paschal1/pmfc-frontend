'use client'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { BsChevronLeft } from 'react-icons/bs'
import { BsChevronRight } from 'react-icons/bs'
import { motion, AnimatePresence } from 'framer-motion'
import { RiArrowRightSLine } from 'react-icons/ri'

const Banner: React.FC = () => {
  const slides = [
    {
      src: '/wide1.jpg',
      text: 'Interior Remodelling to make',
      text1: 'Your Life Easier',
      text2: 'Our Portfolio',
    },
    {
      src: '/wide2.jpg',
      text: 'Our Expertise for',
      text1: 'Interior Design',
      text2: 'Our Portfolio',
    },
    {
      src: '/wide3.jpg',
      text: 'Featured Project',
      text1: 'Green Interior',
      text2: 'Our Portfolio',
    },
  ]

  const [currentIndex, setCurrentIndex] = useState(0)

  const handlePrev = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + slides.length) % slides.length
    )
  }

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length)
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [slides.length])

  const variants = {
    enter: { opacity: 0, y: -20 },
    center: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 },
  }

  return (
    <>
      <div className="w-[100%] h-[560px] relative lg:group">
        <div className="relative w-full h-full transition-all duration-300 ease">
          <Image
            src={slides[currentIndex].src}
            alt="wide-1"
            layout="fill"
            objectFit="cover"
          />
          <AnimatePresence initial={false}>
            <motion.div
              key={currentIndex}
              initial="enter"
              animate="center"
              exit="exit"
              variants={variants}
              transition={{ duration: 0.5 }}
              className="absolute top-1/3 lg:left-24 left-5 flex flex-col mt-[-2rem] lg:gap-10 gap-1"
            >
              <div className="text-white text uppercase mt-5 sm:ml-0 lg:ml-0 text-[8px]">
                {slides[currentIndex].text}
              </div>
              <div className="text-white text1 uppercase lg:text-[54px] sm:text-[36px] text-[20px] sm:ml-0 lg:ml-0 mt-5 text-nowrap">
                {slides[currentIndex].text1}
              </div>
              <button className="left-24 text-white border border-white uppercase w-[200px] h-[35px] flex items-center justify-center mt-[1rem] text3">
                {slides[currentIndex].text2}
                <RiArrowRightSLine className="h-[20px] w-[20px] mt-[-0.1rem] text-[#fab702]" />
              </button>
            </motion.div>
          </AnimatePresence>
        </div>
        <BsChevronLeft
          className="text-white absolute top-1/2 left-4 h-[50px] w-[50px] font-thin cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          onClick={handlePrev}
        />
        <BsChevronRight
          className="text-white text-sm absolute top-1/2 right-4 h-[50px] w-[50px] font-thin cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          onClick={handleNext}
        />
      </div>
    </>
  )
}

export default Banner
