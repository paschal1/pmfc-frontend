"use client";

import { MdOutlineEdit, MdOutlineRemoveRedEye } from "react-icons/md";
import { quotation } from "../utils/quotation";
import { RiDeleteBin5Line } from "react-icons/ri";
import Link from "next/link";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";

type QuoteType = {
  id: number;
  email: string;
  name: string;
  phone: number;
  message: string;
  areasize: number;
  squarefeet: number;
  budget: number;
  service_titles: string;
  service_prices: string;
  status: string;
  address: string;
  total_price: number;
};

const Quotation = () => {
  const [quotation, setQuotation] = useState<QuoteType[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchQuotation = async () => {
      try {
        const token = Cookies.get("adminToken");

        if (!token) {
          console.error("No token found");
          return;
        }

        const response = await axios.get(
          "https://api.princem-fc.com/api/quotes",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const { data } = response.data;
        setQuotation(data);
      } catch (error) {
        console.error("Error fetching category:", error);
      }
    };

    fetchQuotation();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      const token = Cookies.get("adminToken");
      if (!token) {
        return;
      }

      await axios.delete(`https://api.princem-fc.com/api/quotes/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Remove deleted category from UI
      setQuotation((prev) => prev.filter((cat) => cat.id !== id));
    } catch (error: any) {
      setError(error.response.data.message);
    }
  };

  return (
    <div className="bg-white min-h-screen flex flex-col pb-[3rem]">
      <div className="xl:ml-[20rem] mt-8 bg-[#F2F2F2] flex flex-col px-4 w-[90%] lg:w-[1014px] rounded-xl mx-auto mb-8 pb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mt-4">
          <h1 className="font-semibold sm:text-xl text-lg">Quotation List</h1>
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
                <th className="lg:px-16 px-8 py-2 whitespace-nowrap">Email</th>
                <th className="lg:px-24 px-8 py-2 whitespace-nowrap">Name</th>
                <th className="lg:px-16 px-8 py-2 whitespace-nowrap">
                  Phone Number
                </th>
                <th className="lg:px-16 px-8 py-2 whitespace-nowrap">
                  Message
                </th>
                <th className="lg:px-16 px-8 py-2 whitespace-nowrap">
                  Area Size
                </th>
                <th className="lg:px-16 px-8 py-2 whitespace-nowrap">
                  Square Feet
                </th>
                <th className="lg:px-16 px-8 py-2 whitespace-nowrap">Budget</th>
                <th className="lg:px-16 px-8 py-2 whitespace-nowrap">
                  Service Titles
                </th>
                <th className="lg:px-16 px-8 py-2 whitespace-nowrap">
                  Service Prices
                </th>
                <th className="lg:px-16 px-8 py-2 whitespace-nowrap">Status</th>
                <th className="lg:px-16 px-8 py-2 whitespace-nowrap">
                  Address
                </th>
                <th className="lg:px-16 px-8 py-2 whitespace-nowrap">
                  total Price
                </th>
                <th className="lg:px-16 px-8 py-2 whitespace-nowrap">Option</th>
              </tr>
            </thead>
            <tbody>
              {quotation.map((item) => (
                <tr key={item.id} className="even:bg-white odd:bg-[#F2F2F2]">
                  <td className="lg:px-16 px-8 py-3">
                    <h1 className="text-md text-[#4A5568] whitespace-nowrap">
                      {item.email}
                    </h1>
                  </td>
                  <td className="lg:px-24 px-8 py-3">
                    <h1 className="text-md text-[#4A5568]">{item.name}</h1>
                  </td>
                  <td className="lg:px-16 px-8 py-3">
                    <h1 className="text-md text-[#4A5568]">{item.phone}</h1>
                  </td>
                  <td className="lg:px-16 px-8 py-3">
                    <h1 className="text-md text-[#4A5568] whitespace-nowrap">
                      {item.message}
                    </h1>
                  </td>
                  <td className="lg:px-16 px-8 py-3">
                    <h1 className="text-md text-[#4A5568] whitespace-nowrap">
                      {item.areasize}
                    </h1>
                  </td>
                  <td className="lg:px-16 px-8 py-3">
                    <h1 className="text-md text-[#4A5568]">
                      {item.squarefeet}
                    </h1>
                  </td>
                  <td className="lg:px-16 px-8 py-3">
                    <h1 className="text-md text-[#4A5568]">{item.budget}</h1>
                  </td>
                  <td className="lg:px-16 px-8 py-3">
                    <h1 className="text-md text-[#4A5568] w-[300px]">
                      {item.service_titles}
                    </h1>
                  </td>
                  <td className="lg:px-16 px-8 py-3">
                    <h1 className="text-md text-[#4A5568] w-[300px]">
                      {item.service_prices}
                    </h1>
                  </td>
                  <td className="lg:px-16 px-8 py-3">
                    <h1 className="text-md text-[#4A5568] w-[300px]">
                      {item.status}
                    </h1>
                  </td>
                  <td className="lg:px-16 px-8 py-3">
                    <h1 className="text-md text-[#4A5568] w-[300px]">
                      {item.address}
                    </h1>
                  </td>
                  <td className="lg:px-16 px-8 py-3">
                    <h1 className="text-md text-[#4A5568] w-[300px]">
                      {item.total_price}
                    </h1>
                  </td>
                  <td className="lg:px-16 px-8 py-3 flex mt-9 gap-3">
                    <Link href={`/admin/quotation/${item.id}`}>
                      <MdOutlineRemoveRedEye
                        className="h-[20px] w-[20px] text-purple-400"
                        data-testid="view-icon"
                      />
                    </Link>
                    {/* <Link href={`/admin/quotation/edit/${item.id}`}>
                      <MdOutlineEdit
                        className="h-[20px] w-[20px] text-blue-400"
                        data-testid="edit-icon"
                      />
                    </Link> */}
                    <RiDeleteBin5Line
                      onClick={() => handleDelete(item.id)}
                      className="h-[20px] w-[20px] text-red-400 cursor-pointer"
                      data-testid="delete-icon"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Quotation;
