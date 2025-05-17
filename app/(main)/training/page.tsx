'use client'
import React, { useState } from 'react'
import { Parallax } from 'react-parallax'
import trainingImg from '../../../public/training-img.jpg'
import { MdVerified } from 'react-icons/md'

const Page: React.FC = () => {
    const [file, setFile] = useState<File | null>(null)
    const [resume, setResume] = useState<File | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [resumeError, setResumeError] = useState<string | null>(null)

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFile = event.target.files?.[0]
      if (selectedFile) {
        if (selectedFile.type === 'application/msword' || selectedFile.name.endsWith('.doc')) {
          setFile(selectedFile)
          setError(null)
        } else {
          setFile(null)
          setError('Please upload a document')
        }
      }
    }

    const handleResumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFile = event.target.files?.[0]
      if (selectedFile) {
        if (
          selectedFile.type === 'application/msword' ||
          selectedFile.name.endsWith('.doc')
        ) {
          setResume(selectedFile)
          setResumeError(null)
        } else {
          setResume(null)
          setResumeError('Please upload a document')
        }
      }
    }

    const generateOPtions = (start: number, end: number) => {
        return Array.from({length: end - start + 1}, (_, i) => start + i)
    }

    const days = generateOPtions(1, 31)
    const months = generateOPtions(1, 12)
    const years = generateOPtions(1900, new Date().getFullYear())
  return (
    <>
      <div className="flex flex-col">
        <Parallax
          strength={300}
          className="h-[230px] w-[100%] bg-cover bg-center lg:flex hidden items-center"
          bgImage={trainingImg.src}
        >
          <h1 className="font-bold text-3xl text-white ml-20">
            Furniture Trainee Registration
          </h1>
        </Parallax>
        <div className="h-[230px] w-[100%] lg:hidden block relative">
          <img
            src={trainingImg.src}
            alt="img"
            className="h-full w-full object-cover"
          />
          <h1 className="font-bold text-2xl text-white z-10 absolute top-24 left-3">
            Furniture Trainee Registration
          </h1>
        </div>
        <form>
          <div className="mt-20 flex flex-col lg:flex-row lg:justify-around ml-4 lg:ml-0">
            <div className="flex flex-col text-white gap-5">
              <h1 className="text-white uppercase text-xl font-semibold">
                Trainee Details
              </h1>
              <div className="flex flex-col gap-2">
                <label>Full Name:</label>
                <input
                  type="text"
                  title="full-name"
                  placeholder="Full Name"
                  className=" placeholder-gray-400 bg-inherit border border-white px-4 py-2 w-[85vw] lg:w-[300px] focus:border-[#fab702] focus:outline-none"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label>Age:</label>
                <input
                  type="number"
                  title="age"
                  placeholder="Age"
                  className=" placeholder-gray-400 bg-inherit border border-white px-4 py-2 w-[85vw] lg:w-[300px] focus:border-[#fab702] focus:outline-none"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label>Gender:</label>
                <div className="flex items-center gap-4">
                  <label htmlFor="male" className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="gender"
                      value="male"
                      id="male"
                      className="text-[#fab702]"
                    />
                    Male
                  </label>
                  <label htmlFor="female" className="flex items-center gap-2">
                    <input
                      type="radio"
                      id="female"
                      name="gender"
                      value="female"
                      className="form-radio text-[#fab702]"
                    />
                    Female
                  </label>
                  <label htmlFor="other" className="flex items-center gap-2">
                    <input
                      type="radio"
                      id="other"
                      name="gender"
                      value="other"
                      className="form-radio text-[#fab702]"
                    />
                    Other
                  </label>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label>Contact Number:</label>
                <input
                  id="contact"
                  type="number"
                  title="contact"
                  placeholder="Contact"
                  className=" placeholder-gray-400 bg-inherit border border-white px-4 py-2 w-[85vw] lg:w-[300px] focus:border-[#fab702] focus:outline-none"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label>Email Address:</label>
                <input
                  type="text"
                  title="email"
                  placeholder="Email"
                  className=" placeholder-gray-400 bg-inherit border border-white px-4 py-2 w-[85vw] lg:w-[300px] focus:border-[#fab702] focus:outline-none"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label>Address:</label>
                <input
                  type="text"
                  title="address"
                  placeholder="Address"
                  className=" placeholder-gray-400 bg-inherit border border-white px-4 py-2 w-[85vw] lg:w-[300px] focus:border-[#fab702] focus:outline-none"
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
                <div className="flex flex-col gap-2 mt-4">
                  <label>Emergency Contact:</label>
                  <input
                    type="number"
                    title="emergency-Contact"
                    placeholder="Emergency contact"
                    className=" placeholder-gray-400 bg-inherit border border-white px-4 py-2 w-[85vw] lg:w-[300px] focus:border-[#fab702] focus:outline-none"
                  />
                </div>
                <div className="flex flex-col gap-2 mt-4">
                  <label>Previous Experience:</label>
                  <textarea
                    title="text"
                    placeholder="Previous Experience"
                    className=" placeholder-gray-400 bg-inherit border border-white px-4 py-2 w-[85vw] lg:w-[300px] focus:border-[#fab702] focus:outline-none align-top text-white"
                    rows={3}
                  />
                </div>
                <div className="flex flex-col gap-2 mt-4">
                  <label>Joining Date:</label>
                </div>
                <div className="flex flex-col gap-2 mt-4">
                  <label>Program Duration:</label>
                  <h1>1 year (Non-editable)</h1>
                </div>
              </div>
            </div>
            <div className="flex flex-col text-white gap-5 lg:mt-0 mt-10">
              <h1 className="text-white uppercase text-xl font-semibold">
                Skills Assessments
              </h1>
              <div className="flex flex-col gap-2">
                <label>Current Skill Level:</label>
                <div className="flex lg:flex-row flex-col gap-4">
                  <label htmlFor="beginner" className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="skill"
                      value="beginner"
                      id="beginner"
                      className="text-[#fab702]"
                    />
                    Beginner
                  </label>
                  <label
                    htmlFor="intermediate"
                    className="flex items-center gap-2"
                  >
                    <input
                      type="radio"
                      id="intermediate"
                      name="skill"
                      value="intermediate"
                      className="form-radio text-[#fab702]"
                    />
                    Intermediate
                  </label>
                  <label htmlFor="Advanced" className="flex items-center gap-2">
                    <input
                      type="radio"
                      id="advanced"
                      name="skill"
                      value="advanced"
                      className="form-radio text-[#fab702]"
                    />
                    Advanced
                  </label>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <h1 className="text-xl text-[#fab702] uppercase">
                  What You&apos;ll Learn
                </h1>
                <div className="flex items-center gap-2">
                  <MdVerified className="text-[#fab702]" />
                  <h1>Carpentry</h1>
                </div>
                <div className="flex items-center gap-2">
                  <MdVerified className="text-[#fab702]" />
                  <h1>Upholstery</h1>
                </div>
                <div className="flex items-center gap-2">
                  <MdVerified className="text-[#fab702]" />
                  <h1>Wood Working</h1>
                </div>
                <div className="flex items-center gap-2">
                  <MdVerified className="text-[#fab702]" />
                  <h1>Furniture Design</h1>
                </div>
              </div>
              <div className="flex flex-col gap-2 mt-4">
                <label>Goals For The Training:</label>
                <textarea
                  title="text"
                  placeholder="Goals for the training..."
                  className=" placeholder-gray-400 bg-inherit border border-white px-4 py-2 w-[85vw] lg:w-[300px] focus:border-[#fab702] focus:outline-none align-top"
                  rows={3}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="id-proof">Upload ID Proof:</label>
                <input
                  type="file"
                  id="id-proof"
                  accept=".doc,application/msword"
                  onChange={handleFileChange}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="resume">Upload Resume:</label>
                <input
                  type="file"
                  id="resume"
                  accept=".doc,application/msword"
                  onChange={handleFileChange}
                />
              </div>
            </div>
            <div></div>
          </div>
        </form>
      </div>
    </>
  )
}

export default Page