'use client'
import { useState } from 'react'
import { Parallax } from 'react-parallax'
import SecondaryFooter from '../components/SecondaryFooter'
import Link from 'next/link'

const CreateAccount = () => {
  const [offers, setOffers] = useState(false)
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [terms, setTerms] = useState(false)

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsSubscribed(event.target.checked)
  }

  const handleOffersChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setOffers(event.target.checked)
  }

  const handleTermsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTerms(event.target.checked)
  }

  const generateOPtions = (start: number, end: number) => {
    return Array.from({ length: end - start + 1 }, (_, i) => start + i)
  }

  const days = generateOPtions(1, 31)
  const months = generateOPtions(1, 12)
  const years = generateOPtions(1900, new Date().getFullYear())
  return (
    <div className="flex flex-col">
      <Parallax
        strength={300}
        className="h-[230px] w-[100%] bg-cover bg-center lg:flex hidden items-center"
        bgImage={'/account-bg.jpg'}
      >
        <h1 className="font-bold text-3xl text-white lg:ml-20 ml-10">
          Create an account
        </h1>
      </Parallax>
      <div className="h-[230px] w-[100%] lg:hidden block relative">
        <img
          src={'/account-bg.jpg'}
          alt="img"
          className="h-full w-full object-cover"
        />
        <h1 className="font-bold text-3xl text-white z-10 absolute top-24 left-3">
          Create an account
        </h1>
      </div>
      <h1 className="mt-10 lg:ml-20 ml-4 lg:text-xl text-lg text-gray-300">
        Already have an account?{' '}
        <Link href={'/login'}>
          <span className="text-[#fab702] hover:opacity-75 cursor-pointer">
            Login instead!
          </span>
        </Link>
      </h1>
      <form className="lg:ml-20 ml-4 mt-10">
        <div className="flex flex-col gap-2 text-white">
          <label>Social Title:</label>
          <div className="flex lg:flex-row flex-col gap-4">
            <label htmlFor="Mr" className="flex items-center gap-2">
              <input
                type="radio"
                name="title"
                value="mr"
                id="mr"
                className="text-[#fab702]"
              />
              Mr
            </label>
            <label htmlFor="Mrs" className="flex items-center gap-2">
              <input
                type="radio"
                id="mrs"
                name="title"
                value="mrs"
                className="form-radio text-[#fab702]"
              />
              Mrs
            </label>
          </div>
        </div>
        <div className="lg:w-[85%] w-[90%] flex flex-col mt-5 text-white gap-6">
          <div className="flex flex-col gap-2">
            <label>First Name:</label>
            <input
              type="text"
              title="first-name"
              placeholder="First Name"
              className=" placeholder-gray-400 bg-inherit border border-white px-4 py-2 focus:border-[#fab702] focus:outline-none placeholder:text-white"
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <label>Last Name:</label>
            <input
              type="text"
              title="last-name"
              placeholder="Last Name"
              className=" placeholder-gray-400 bg-inherit border border-white px-4 py-2 focus:border-[#fab702] focus:outline-none placeholder:text-white"
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <label>Email:</label>
            <input
              type="email"
              title="email"
              placeholder="example@gmail.com"
              className=" placeholder-gray-400 bg-inherit border border-white px-4 py-2 focus:border-[#fab702] focus:outline-none placeholder:text-white"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label>Password:</label>
            <input
              type="password"
              title="password"
              placeholder="password"
              className=" placeholder-gray-400 bg-inherit border border-white px-4 py-2 focus:border-[#fab702] focus:outline-none placeholder:text-white"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label>Date Of Birth:</label>
            <div className="flex gap-4">
              <select
                title="day"
                name="day"
                id="day"
                className="bg-inherit border border-white px-4 py-2 focus:border-[#fab702] focus:outline-none"
              >
                {days.map((day) => (
                  <option key={day} value={day} className="text-black">
                    {day}
                  </option>
                ))}
              </select>
              <select
                title="month"
                name="month"
                id="month"
                className="bg-inherit border border-white px-4 py-2 focus:border-[#fab702] focus:outline-none"
              >
                {months.map((month) => (
                  <option key={month} value={month} className="text-black">
                    {month}
                  </option>
                ))}
              </select>
              <select
                title="year"
                name="year"
                id="year"
                className="bg-inherit border border-white px-4 py-2 focus:border-[#fab702] focus:outline-none"
              >
                {years.map((year) => (
                  <option key={year} value={year} className="text-black">
                    {year}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={offers}
                onChange={handleOffersChange}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              Receive offers from our partners
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={isSubscribed}
                onChange={handleCheckboxChange}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              Sign up for our newsletter
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={terms}
                onChange={handleTermsChange}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                required
              />
              I agree to the terms and conditions and the privacy policy
            </label>
          </div>
          <button className="uppercase mt-4 border border-white py-2 lg:w-[200px] hover:border-none hover:bg-[#fab702] hover:text-black hover:font-semibold transition-all duration-500 ease-in-out">
            Submit
          </button>
        </div>
      </form>
      <SecondaryFooter />
    </div>
  )
}

export default CreateAccount
