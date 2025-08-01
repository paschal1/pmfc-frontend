import React from 'react'

const AddTestimonial = () => {
  return (
    <div className="bg-white flex flex-col pb-[4rem]">
      <form>
        <div className="xl:ml-[20rem] mt-8 bg-[#F2F2F2] flex flex-col px-4 w-[90%] lg:w-[777px] rounded-xl mx-auto mb-8 pb-8 overflow-x-auto">
          <div className="mt-4">
            <h1 className="font-semibold sm:text-xl text-lg">
              Add Testimonial
            </h1>
          </div>
          <div className="mt-8 flex flex-col">
            <h1 className="font-semibold">Testimonial Details</h1>
            <div className="flex mt-4 flex-col lg:flex-row lg:items-center justify-between gap-3 lg:gap-0">
              <div className="flex gap-1">
                <h1 className="text-gray-600 font-semibold">Name</h1>
                <h1 className="text-red-600 font-semibold">*</h1>
              </div>
              <input
                type="text"
                placeholder="Name"
                className="border border-[#EFEFEF] bg-[#F9F9F6] lg:w-[539px] w-full py-[10px] pl-3 focus:outline-none rounded-[5px] text-[#4A5568]"
                required
              />
            </div>
            <div className="flex flex-col lg:flex-row justify-between mt-4 gap-3 lg:gap-0">
              <div className="flex gap-1">
                <h1 className="text-gray-600 font-semibold">Review</h1>
                <h1 className="text-red-600 font-semibold">*</h1>
              </div>
              <textarea
                title="text"
                placeholder="Review..."
                rows={3}
                className="border border-[#EFEFEF] bg-[#F9F9F6] lg:w-[539px] w-full py-[10px] pl-3 focus:outline-none rounded-[5px] text-[#4A5568]"
                required
              />
            </div>
          </div>
        </div>
        <button
          type="submit"
          className="bg-[#fab702] flex items-center justify-center h-[40px] w-[140px] text-white rounded-[5px] mb-10 text-[14px] font-semibold xl:ml-[20rem] mx-auto hover:text-black hover:opacity-75 active:opacity-55 transition-all duration-500 ease-in-out"
        >
          Add
        </button>
      </form>
    </div>
  )
}

export default AddTestimonial
