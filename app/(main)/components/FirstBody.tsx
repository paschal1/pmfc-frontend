'use client'
import { data, } from '../data/data'
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
          objectFit: 'cover', // Ensures the image maintains its aspect ratio
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
            <div className="h-[180px] w-[180px] bg-[#fab702] rounded-full cursor-pointer flex items-center  hover:bg-black transition-all duration-300 ease group">
              <h1 className="text-black mx-auto uppercase font-bold text-[14px] group-hover:text-[#fab702]">
                Idea & Concept
              </h1>
            </div>
            <div className="h-[180px] w-[180px] bg-[#fab702] rounded-full cursor-pointer flex items-center  hover:bg-black transition-all duration-300 ease group">
              <h1 className="text-black mx-auto uppercase font-bold text-[14px] group-hover:text-[#fab702]">
                Design & Create
              </h1>
            </div>
            <div className="h-[180px] w-[180px] bg-[#fab702] rounded-full cursor-pointer flex items-center  hover:bg-black transition-all duration-300 ease group">
              <h1 className="text-black mx-auto uppercase font-bold text-[14px] group-hover:text-[#fab702]">
                Build & install
              </h1>
            </div>
          </div>
          <div className="w-[300px] lg:w-[1050px] sm:w-[600px] border-b-[rgb(248, 249, 250)] border-b mt-28 sm:mt-24 lg:mt-28"></div>
          <div className="w-[300px] lg:w-[1050px] sm:w-[600px] mt-10 text-[13px] lg:text-[13px] sm:text-[14ypx] font-thin">
            <h1 className="text-white ">
              Sed ut perspiciatis unde omnis iste natus error sit voluptatem
              accusantium doloremque laudantium, totam rem aperiam, eaque ipsa
              quae ab illo inventore veritatis et quasi architecto beatae vitae
              dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit
              aspernatur aut odit aut fugit, sed quia consequuntur magni dolores
              eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam
              est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci
              velit, sed quia non numquam eius modi tempora incidunt ut labore
              et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima
              veniam.
            </h1>
          </div>
        </div>
      </Parallax>
    </>
  )
}

export default FirstBody
