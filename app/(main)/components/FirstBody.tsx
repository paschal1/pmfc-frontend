'use client'
import { data } from '../data/data'
import Image from 'next/image'
import { Parallax } from 'react-parallax'

const FirstBody: React.FC = () => {
  return (
    <>
      <Parallax strength={800}>
        <div className="flex flex-col content">
          <div className="mt-24 flex">
            <h1 className="text-white mx-auto text4">What We Do</h1>
          </div>
          <div className="flex mt-10 mx-auto gap-5 items-center">
            <div className="w-[150px] sm:w-[200px] md:w-[300px] border-b-[#fab702] border-b"></div>
            <div className="h-[8px] w-[8px] rounded-full bg-[#fab702]"></div>
            <div className="w-[150px] sm:w-[200px] md:w-[300px] border-b-[#fab702] border-b"></div>
          </div>
          <div className="flex flex-col md:flex-row mx-auto gap-8">
            {data.map((item) => (
              <div key={item.id} className="flex flex-col gap-5 justify-around">
                <div className="flex items-center text-white gap-2 uppercase font-thin text-sm mt-10">
                  <h1 className="text-[#fab702]">{item.title1}</h1>
                  <h1>{item.title2}</h1>
                </div>
                <div className="text-sm font-thin xl:w-[380px] md:w-[240px] w-[340px] text-[#BBBBBB]">
                  {item.content}
                </div>
                <div className="w-[340px] md:w-[240px] xl:w-[380px] xl:h-[171px] md:h-[103px] h-[169px]">
                  <Image
                    src={item.image}
                    className="object-cover h-full w-full"
                    alt="item-image"
                    width={380}
                    height={171}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </Parallax>
      <Parallax
        strength={300}
        className="h-[1633px] lg:h-[700px] sm:h-[1445px] mt-20 bg2"
        bgImage={'/bg-2.jpg'}
        bgImageStyle={{
          backgroundSize: 'cover',
          backgroundPosition: 'left',
          objectFit: 'cover',
        }}
      >
        <div className="flex flex-col items-center">
          <div className="mt-20">
            <h1 className="uppercase text-white text-[26px] font-thin text2">
              Our Process
            </h1>
          </div>
          <div className="flex mt-10 mx-auto gap-5 items-center">
            <div className="w-[150px] sm:w-[200px] md:w-[300px] border-b-[rgb(248, 249, 250)] border-b"></div>
            <div className="h-[8px] w-[8px] rounded-full bg-[#fab702]"></div>
            <div className="w-[150px] sm:w-[200px] md:w-[300px] border-b-[rgb(248, 249, 250)] border-b"></div>
          </div>
          <div className="flex lg:flex-row md:flex-col flex-col items-center mt-10 gap-20">
            <div className="h-[180px] w-[180px] border border-white rounded-full cursor-pointer flex items-center group">
              <h1 className="text-white mx-auto uppercase group-hover:text-[#fab702]">
                Meet & Agree
              </h1>
            </div>
            <div className="h-[180px] w-[180px] bg-[#fab702] rounded-full cursor-pointer flex items-center hover:bg-black transition-all duration-300 ease group">
              <h1 className="text-black mx-auto uppercase font-bold text-[14px] group-hover:text-[#fab702]">
                Idea & Concept
              </h1>
            </div>
            <div className="h-[180px] w-[180px] bg-[#fab702] rounded-full cursor-pointer flex items-center hover:bg-black transition-all duration-300 ease group">
              <h1 className="text-black mx-auto uppercase font-bold text-[14px] group-hover:text-[#fab702]">
                Design & Create
              </h1>
            </div>
            <div className="h-[180px] w-[180px] bg-[#fab702] rounded-full cursor-pointer flex items-center hover:bg-black transition-all duration-300 ease group">
              <h1 className="text-black mx-auto uppercase font-bold text-[14px] group-hover:text-[#fab702]">
                Build & Install
              </h1>
            </div>
          </div>
          <div className="w-[300px] lg:w-[1050px] sm:w-[600px] border-b-[rgb(248, 249, 250)] border-b mt-28 sm:mt-24 lg:mt-28"></div>
          <div className="w-[300px] lg:w-[1050px] sm:w-[600px] mt-10 text-[13px] lg:text-[13px] sm:text-[14px] font-thin">
            <h1 className="text-white leading-relaxed">
              At Prince M Furniture Company, we believe that exceptional furniture begins with understanding your vision. Our comprehensive process ensures that every piece we create is a perfect blend of artistry, functionality, and craftsmanship. From the initial consultation where we learn about your space and style preferences, to the final installation where your dream furniture comes to life, we're with you every step of the way. Our experienced team of designers and craftsmen work collaboratively to transform ideas into stunning reality, using only premium materials and time-tested techniques. We take pride in our attention to detail, commitment to quality, and dedication to exceeding your expectations. Whether you're furnishing a home, office, or commercial space, our streamlined process guarantees a seamless experience from concept to completion. Trust us to create furniture that not only meets your needs but becomes a cherished part of your space for years to come.
            </h1>
          </div>
        </div>
      </Parallax>
    </>
  )
}

export default FirstBody