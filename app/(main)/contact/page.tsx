'use client'
import { Parallax } from 'react-parallax'
import trainingImg from '../../../public/training-img.jpg'

const page = () => {
  return (
    <div className="flex flex-col">
      <Parallax
        strength={300}
        className="h-[230px] w-[100%] bg-cover bg-center lg:flex hidden items-center"
        bgImage={trainingImg.src}
      >
        <h1 className="uppercase font-thin text-4xl text-white ml-20">
          Contact
        </h1>
      </Parallax>
      <div className="h-[230px] w-[100%] lg:hidden block relative">
        <img
          src={trainingImg.src}
          alt="img"
          className="h-full w-full object-cover"
        />
        <h1 className="font-bold text-3xl text-white z-10 absolute top-24 left-3">
          Contact
        </h1>
      </div>
      <div className="flex flex-col lg:flex-row mx-auto mt-20 gap-16">
        <form>
          <div className="flex lg:flex-row flex-col mx-auto gap-16">
            <div className="flex flex-col gap-4">
              <h1 className="text-white uppercase text-2xl ">
                SEND US MESSAGE
              </h1>
              <input
                type="text"
                title="name"
                placeholder="Your Name"
                className="bg-inherit border border-[#FFFFFF33] px-4 py-2 w-[85vw] lg:w-[350px] focus:border-[#fab702] focus:outline-none text-white placeholder:text-white placeholder:text-lg h-[55px]"
              />
              <input
                type="email"
                title="email"
                placeholder="Your Email"
                className="bg-inherit border border-[#FFFFFF33] px-4 py-2 w-[85vw] lg:w-[350px] focus:border-[#fab702] focus:outline-none text-white placeholder:text-white placeholder:text-lg h-[55px]"
              />
              <input
                type="number"
                title="phone"
                placeholder="Your Phone"
                className="bg-inherit border border-[#FFFFFF33] px-4 py-2 w-[85vw] lg:w-[350px] focus:border-[#fab702] focus:outline-none text-white placeholder:text-white placeholder:text-lg h-[55px]"
              />
              <button className="lg:block hidden border border-[#FFFFFF33] bg-inherit w-[150px] text-white p-2 text-sm hover:bg-[#fab702] hover:text-black hover:border-none transition-all duration-500 ease-in-out mt-4">
                SUBMIT FORM
              </button>
            </div>
            <textarea
              title="text"
              placeholder="Your Message"
              className="bg-inherit border border-[#FFFFFF33] px-4 py-2 w-[85vw] lg:w-[300px] focus:border-[#fab702] focus:outline-none align-top placeholder:text-white placeholder:text-lg lg:h-[195px] h-[150px] text-white lg:mt-[3rem]"
            />
            <button className="lg:hidden block border border-[#FFFFFF33] bg-inherit w-[150px] text-white p-2 text-sm hover:bg-[#fab702] hover:text-black hover:border-none transition-all duration-500 ease-in-out mt-4">
              SUBMIT FORM
            </button>
          </div>
        </form>
        <div className="flex flex-col gap-4 w-[80%] sm:w-[503px] md:[720px] lg:w-[285px] mt- lg:mt-0">
          <h1 className="uppercase text-white text-2xl">Contact Us</h1>
          <div className="text-[16px] flex flex-col gap-4">
            <p className="text-white border-b border-b-[#FFFFFF33] transition-all duration-300 ease pb-2">
              5 decking ifite, Anambra state, Nigeria.
            </p>
            <div className="text-white cursor-pointer border-b border-b-[#FFFFFF33] transition-all duration-300 ease pb-2 mt-2 flex items-center gap-2">
              <p className="text-[#fab702] font-semibold">Phone:</p>
              <p>08073161010</p>
            </div>
            <div className="text-white border-b border-b-[#FFFFFF33] transition-all duration-300 ease pb-2 mt-2 flex items-center gap-2">
              <p className="text-[#fab702] font-semibold">Fax:</p>
              <p>08073161010</p>
            </div>
            <div className="text-white border-b border-b-[#FFFFFF33] transition-all duration-300 ease pb-2 mt-2 flex items-center gap-2">
              <p className="text-[#fab702] font-semibold">Email:</p>
              <p className="text-[12px]">princemfurnishingconcept@gmail.com</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default page
