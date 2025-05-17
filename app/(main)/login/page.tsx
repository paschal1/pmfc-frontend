'use client'
import Link from 'next/link'
import { Parallax } from 'react-parallax'
import SecondaryFooter from '../components/SecondaryFooter'

const Login = () => {
  return (
    <div className="flex flex-col">
      <Parallax
        strength={300}
        className="h-[230px] w-[100%] bg-cover bg-center lg:flex hidden items-center"
        bgImage={'/account-bg.jpg'}
      >
        <h1 className="font-bold text-3xl text-white lg:ml-20 ml-10">Login</h1>
      </Parallax>
      <div className="h-[230px] w-[100%] lg:hidden block relative">
        <img
          src={'/account-bg.jpg'}
          alt="img"
          className="h-full w-full object-cover"
        />
        <h1 className="font-bold text-3xl text-white z-10 absolute top-24 left-3">
          Login
        </h1>
      </div>
      <div className="flex lg:flex-row flex-col lg:px-20 mt-10 gap-6 ml-4 lg:ml-0">
        <div className="flex flex-col">
          <h1 className="text-white font-bold lg:text-2xl text-lg">Login</h1>
          <div className="flex flex-col gap-5 lg:w-[570px] w-[90%] mt-5">
            <div className="flex flex-col gap-2 text-white">
              <label>Email:</label>
              <input
                type="email"
                title="email"
                placeholder="example@gmail.com"
                className=" placeholder-gray-400 bg-inherit border border-white px-4 py-2 focus:border-[#fab702] focus:outline-none placeholder:text-white"
                required
              />
            </div>
            <div className="flex flex-col gap-2 text-white">
              <label>Password:</label>
              <input
                type="password"
                title="password"
                placeholder="Password"
                className=" placeholder-gray-400 bg-inherit border border-white px-4 py-2 focus:border-[#fab702] focus:outline-none placeholder:text-white"
                required
              />
            </div>
            <button className="border border-white py-2 font-bold text-white hover:bg-[#fab702] hover:text-black hover:border-none transition-all duration-500 ease-in-out">
              Login
            </button>
            <h1 className="font-bold text-sm text-white text-center hover:underline cursor-pointer">
              Lost your password?
            </h1>
          </div>
        </div>
        <div className="flex flex-col">
          <h1 className="text-white font-bold lg:text-2xl text-lg">Sign Up</h1>
          <h1 className="mt-4 md:text-lg text-sm text-white lg:w-auto w-[90%]">
            By creating an account with our store, you will be able to move
            through the checkout process faster, store multiple shipping
            addresses, view and track your orders in your account and more.
          </h1>
          <Link
            href={'/create_account'}
            className="mt-8 text-lg text-[#fab702] hover:opacity-75 transition-all duration-500 ease-in-out"
          >
            No account? Create one here
          </Link>
        </div>
      </div>
      <SecondaryFooter />
    </div>
  )
}

export default Login
