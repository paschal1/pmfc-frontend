'use client'

import { MdOutlineEdit, MdOutlineRemoveRedEye } from 'react-icons/md'
import { trainingProgram } from '../utils/training_program'
import { RiDeleteBin5Line } from 'react-icons/ri'
import Link from 'next/link'

const TrainingProgram = () => {
  return (
    <div className="bg-white flex flex-col pb-[3rem]">
      <div className="xl:ml-[20rem] mt-8 bg-[#F2F2F2] flex flex-col px-4 w-[90%] lg:w-[1014px] rounded-xl mx-auto mb-8 pb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mt-4">
          <h1 className="font-semibold sm:text-xl text-lg">Training Program</h1>
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
                <th className="lg:px-16 px-8 py-2 whitespace-nowrap">Title</th>
                <th className="lg:px-24 px-8 py-2 whitespace-nowrap">
                  Description
                </th>
                <th className="lg:px-16 px-8 py-2 whitespace-nowrap">
                  Start Date
                </th>
                <th className="lg:px-16 px-8 py-2 whitespace-nowrap">
                  End Date
                </th>
                <th className="lg:px-16 px-8 py-2 whitespace-nowrap">Price</th>
                <th className="lg:px-16 px-8 py-2 whitespace-nowrap">Option</th>
              </tr>
            </thead>
            <tbody>
              {trainingProgram.map((item) => (
                <tr key={item.id} className="even:bg-white odd:bg-[#F2F2F2]">
                  <td className="lg:px-16 px-8 py-3">
                    <h1 className="text-md text-[#4A5568]">{item.title}</h1>
                  </td>
                  <td className="lg:px-24 px-8 py-3">
                    <h1 className="text-md text-[#4A5568] w-[300px]">
                      {item.description}
                    </h1>
                  </td>
                  <td className="lg:px-16 px-8 py-3">
                    <h1 className="text-md text-[#4A5568]">
                      {item.start_date}
                    </h1>
                  </td>
                  <td className="lg:px-16 px-8 py-3">
                    <h1 className="text-md text-[#4A5568]">{item.end_date}</h1>
                  </td>
                  <td className="lg:px-16 px-8 py-3">
                    <h1 className="text-md text-[#4A5568]">{item.price}</h1>
                  </td>
                  <td className="lg:px-16 px-8 py-3 flex mt-9 gap-3">
                    <Link href={`/admin/training-program/${item.id}`}>
                      <MdOutlineRemoveRedEye
                        className="h-[20px] w-[20px] text-purple-400"
                        data-testid="view-icon"
                      />
                    </Link>
                    <Link href={`/admin/training-program/edit/${item.id}`}>
                      <MdOutlineEdit className="h-[20px] w-[20px] text-blue-400"
                      data-testid="edit-icon" 
                      />
                    </Link>
                    <RiDeleteBin5Line className="h-[20px] w-[20px] text-red-400 cursor-pointer"
                    data-testid="delete-icon" />
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

export default TrainingProgram
