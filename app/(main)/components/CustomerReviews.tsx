'use client'
import React, { useEffect, useState } from 'react'
import { Parallax } from 'react-parallax'
import Image from 'next/image'
import { DataReview, reviewData } from "../data/reviews"
import { RiDoubleQuotesL } from 'react-icons/ri'

const CustomerReviews: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isLargeScreen, setIsLargeScreen] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth >= 1024)
    }

    window.addEventListener('resize', handleResize)
    handleResize()

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  const nextReview = () => {
    setCurrentIndex(
      (currentIndex + (isLargeScreen ? 2 : 1)) % reviewData.length
    )
  }

  const prevReview = () => {
    setCurrentIndex(
      (currentIndex - (isLargeScreen ? 2 : 1) + reviewData.length) %
        reviewData.length
    )
  }

  const showReviewAt = (index: number) => {
    setCurrentIndex(index)
  }

  return (
    <>
      <Parallax
        strength={300}
        className="lg:h-[613px] md:h-[635px] sm:h-[692px] h-[750px] w-full relative"
        bgImage={"/wide1.jpg"}
      >
        <div className="flex flex-col items-center">
          <div className="mt-20">
            <h1 className="uppercase text-white text-[26px] font-thin text2">
              Customer Says
            </h1>
          </div>
          <div className="flex mt-10 mx-auto gap-5 items-center">
            <div className="w-[150px] sm:w-[200px] md:w-[300px] border-b-[rgb(248, 249, 250)] border-b"></div>
            <div className="h-[8px] w-[8px] rounded-full bg-[#fab702]"></div>
            <div className="w-[150px] sm:w-[200px] md:w-[300px] border-b-[rgb(248, 249, 250)] border-b"></div>
          </div>
        </div>
        <div className="mt-20 mx-auto overflow-hidden relative w-[85%] lg:w-[1100px] lg:gap-10">
          <div
            className="flex justify-between transition-transform duration-500 ease-in-out lg:gap-16"
            style={{
              transform: `translateX(-${
                currentIndex * (isLargeScreen ? 50 : 100)
              }%)`,
            }}
          >
            {reviewData.map((review: DataReview) => (
              <div
                key={review.id}
                className="h-[386px] md:h-[242px] lg:h-[271px] w-[100%] lg:w-[45%] bg-black opacity-75 flex-shrink-0"
              >
                <div className="w-[70px] h-[60px] bg-[#fab702] align-top text-left z-10 flex items-center justify-center">
                  <RiDoubleQuotesL className="text-black h-[40px] w-[40px]" />
                </div>
                <div className="w-[80%] mx-auto">
                  <p className="text-white w-full ml-2 mt-4">{review.review}</p>
                  <p className="text-[#fab702] ml-2 mt-8 text-[12px]">
                    {review.name}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex items-center mt-8 mx-auto">
          {isLargeScreen ? (
            <div className="flex items-center gap-2 mx-auto">
              {Array.from({ length: Math.ceil(reviewData.length / 2) }).map(
                (_, index) => (
                  <div
                    key={index}
                    onClick={() => showReviewAt(index * 2)}
                    className={`h-[5px] w-[5px] rounded-full cursor-pointer ${
                      Math.floor(currentIndex / 2) === index
                        ? 'bg-[#fab702]'
                        : 'bg-white'
                    }`}
                  ></div>
                )
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2 mx-auto">
              {reviewData.map((_, index) => (
                <div
                  key={index}
                  onClick={() => showReviewAt(index)}
                  className={`h-[5px] w-[5px] rounded-full  cursor-pointer ${
                    currentIndex === index ? 'bg-[#fab702]' : 'bg-white'
                  }`}
                ></div>
              ))}
            </div>
          )}
        </div>
      </Parallax>
    </>
  )
}

export default CustomerReviews
