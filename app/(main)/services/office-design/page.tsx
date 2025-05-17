'use client'
import { Parallax } from 'react-parallax'
import ServiceController from '../components/ServiceController'

const OfficeDesign = () => {
  return (
    <div className="flex flex-col overflow-hidden">
      <Parallax
        strength={300}
        className="h-[230px] w-[100%] bg-cover bg-center lg:flex hidden items-center"
        bgImage={'/services-bg.jpg'}
      >
        <h1 className="uppercase lg:text-4xl text-2xl text-white lg:ml-20 ml-4">
          Office Design
        </h1>
      </Parallax>
      <div className="h-[230px] w-[100%] lg:hidden block relative">
        <img
          src={'/services-bg.jpg'}
          alt="img"
          className="h-full w-full object-cover"
        />
        <h1 className="font-bold text-3xl text-white z-10 absolute top-24 left-3">
          Office Design
        </h1>
      </div>
      <div className="flex lg:flex-row flex-col justify-center lg:px-16 ml-4 lg:ml-0 gap-6 mt-20 w-full lg:w-auto">
        <ServiceController />
        <div className="flex flex-col gap-6 text-[#BBBBBB]">
          <h1 className="w-[85%] lg:w-[406px]">
            Sed ut perspiciatis unde omnis iste natus error sit voluptatem
            accusantium doloremque laudantium, totam rem aperiam, eaque ipsa
            quae ab illo inventore veritatis et quasi architecto beatae vitae
            dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit
            aspernatur aut odit aut fugit, sed quia consequuntur magni dolores
            eos qui ratione voluptatem sequi nesciunt.
          </h1>
          <h1 className="w-[85%] lg:w-[406px]">
            Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet,
            consectetur, adipisci velit, sed quia non numquam eius modi tempora
            incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut
            enim ad minima veniam, quis nostrum exercitationem ullam corporis
            suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis
            autem vel eum iure reprehenderit qui in ea voluptate velit esse quam
            nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo
            voluptas nulla pariatur.
          </h1>
          <h1 className="w-[85%] lg:w-[406px]">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
          </h1>
        </div>
        <div className="flex flex-col gap-8 w-full ">
          <img
            src={'/office-img1.jpg'}
            alt="img"
            className="h-[268px] w-[85%] lg:w-[403px]"
          />
          <img
            src={'/office-img2.jpg'}
            alt="img"
            className="h-[268px] w-[85%] lg:w-[403px]"
          />
        </div>
      </div>
    </div>
  )
}

export default OfficeDesign
