'use client'

import { training } from '../utils/training'

type StudentsType = {
  id: number
  full_name: string
  age: string
  gender: string
  contact_number: string
  email: string
  address: string
  date_of_birth: string
  emergency_contact: string
  previous_experience: string
  joining_date: string
  program_duration: string
  current_skill_level: string
  goals: string
  
}

const Training = () => {
  return (
    <div className="bg-white flex flex-col pb-[3rem]">
      <div className="xl:ml-[20rem] mt-8 bg-[#F2F2F2] flex flex-col px-4 w-[90%] lg:w-[1014px] rounded-xl mx-auto mb-8 pb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mt-4">
          <h1 className="font-semibold sm:text-xl text-lg">
            All Training List
          </h1>
          <div className="mt-4">
            <label className="mr-3">Search</label>
            <input
              type="text"
              placeholder=""
              title="search"
              className="border bg-inherit border-black focus:outline-none pl-2 h-[35px] w-[150px] rounded-[4px]"
            />
          </div>
        </div>
        <div className="mt-8 overflow-x-auto relative">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="text-left bg-gray-200 rounded-[6px] text-[#4A5568]">
                <th className="lg:px-16 px-8 py-2 whitespace-nowrap">
                  Full Name
                </th>
                <th className="lg:px-16 px-8 py-2 whitespace-nowrap">Age</th>
                <th className="lg:px-16 px-8 py-2 whitespace-nowrap">Gender</th>
                <th className="lg:px-16 px-8 py-2 whitespace-nowrap">
                  Contact
                </th>
                <th className="lg:px-16 px-8 py-2 whitespace-nowrap">Email</th>
                <th className="lg:px-16 px-8 py-2 whitespace-nowrap">
                  Address
                </th>
                <th className="lg:px-16 px-8 py-2 whitespace-nowrap">
                  Date Of Birth
                </th>
                <th className="lg:px-16 px-8 py-2 whitespace-nowrap">
                  Emergency Contact
                </th>
                <th className="lg:px-16 px-8 py-2 whitespace-nowrap">
                  Previous Contact
                </th>
                <th className="lg:px-16 px-8 py-2 whitespace-nowrap">
                  Previous Experience
                </th>
                <th className="lg:px-16 px-8 py-2 whitespace-nowrap">
                  Joining Date
                </th>
                <th className="lg:px-16 px-8 py-2 whitespace-nowrap">
                  Current Skill Level
                </th>
                <th className="lg:px-16 px-8 py-2 whitespace-nowrap">Goals</th>
                <th className="lg:px-16 px-8 py-2 whitespace-nowrap">
                  ID Proof
                </th>
                <th className="lg:px-16 px-8 py-2 whitespace-nowrap">Resume</th>
              </tr>
            </thead>
            <tbody>
              {training.map((item) => (
                <tr key={item.id} className="even:bg-white odd:bg-[#F2F2F2]">
                  <td className="lg:px-16 px-8 py-3">
                    <h1 className="text-md text-[#4A5568]">{item.fullname}</h1>
                  </td>
                  <td className="lg:px-16 px-8 py-3">
                    <h1 className="text-md text-[#4A5568]">{item.age}</h1>
                  </td>
                  <td className="lg:px-16 px-8 py-3">
                    <h1 className="text-md text-[#4A5568]">{item.gender}</h1>
                  </td>
                  <td className="lg:px-16 px-8 py-3">
                    <h1 className="text-md text-[#4A5568]">
                      {item.contact_number}
                    </h1>
                  </td>
                  <td className="lg:px-16 px-8 py-3">
                    <h1 className="text-md text-[#4A5568]">{item.email}</h1>
                  </td>
                  <td className="lg:px-16 px-8 py-3">
                    <h1 className="text-md text-[#4A5568]">{item.address}</h1>
                  </td>
                  <td className="lg:px-16 px-8 py-3">
                    <h1 className="text-md text-[#4A5568]">
                      {item.date_of_birth}
                    </h1>
                  </td>
                  <td className="lg:px-16 px-8 py-3">
                    <h1 className="text-md text-[#4A5568]">
                      {item.emergency_contact}
                    </h1>
                  </td>
                  <td className="lg:px-16 px-8 py-3">
                    <h1 className="text-md text-[#4A5568]">
                      {item.previous_contact}
                    </h1>
                  </td>
                  <td className="lg:px-16 px-8 py-3">
                    <h1 className="text-md text-[#4A5568]">
                      {item.previous_experience}
                    </h1>
                  </td>
                  <td className="lg:px-16 px-8 py-3">
                    <h1 className="text-md text-[#4A5568]">
                      {item.joining_date}
                    </h1>
                  </td>
                  <td className="lg:px-16 px-8 py-3">
                    <h1 className="text-md text-[#4A5568]">
                      {item.current_skill_level}
                    </h1>
                  </td>
                  <td className="lg:px-16 px-8 py-3">
                    <h1 className="text-md text-[#4A5568]">{item.goals}</h1>
                  </td>
                  <td className="lg:px-16 px-8 py-3">
                    <h1 className="text-md text-[#4A5568]">{item.id_proof}</h1>
                  </td>
                  <td className="lg:px-16 px-8 py-3">
                    <h1 className="text-md text-[#4A5568]">{item.resume}</h1>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Training
