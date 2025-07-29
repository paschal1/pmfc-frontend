"use client";
import { useParams } from "next/navigation";
import { quotation } from "../../utils/quotation";
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

const QuotationId = () => {
  const { id: quotationId } = useParams();
  const [quotation, setQuotation] = useState<QuoteType | null>(null);

  useEffect(() => {
    const fetchQuotation = async () => {
      try {
        const token = Cookies.get("adminToken");

        if (!token) {
          return;
        }

        const response = await axios.get(
          `https://api.princem-fc.com/api/quotes/${quotationId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const { data } = response.data;
        setQuotation(data);
        console.log("Fetched quotation:", data);
      } catch (error) {
        console.error("Error fetching Quotation", error);
      }
    };

    if (quotationId) fetchQuotation();
  }, [quotationId]);

  return (
    <div className="bg-white flex flex-col h-[100vh]">
      <div className="xl:ml-[20rem] mt-8 bg-[#F2F2F2] flex flex-col px-4 w-[90%] lg:w-[1014px] rounded-xl mx-auto mb-8 pb-8 overflow-x-auto">
        {quotation ? (
          <>
            <div className="mt-4">
              <h1 className="font-semibold sm:text-xl text-lg">
                Quotation #{quotation.id}
              </h1>
            </div>
            <div className="mt-8 overflow-x-auto">
              <table className="min-w-full border-collapse border border-gray-300">
                <tbody>
                  <tr className="border border-gray-300">
                    <td className="p-2 font-semibold bg-gray-200">Email</td>
                    <td className="p-2">{quotation.email}</td>
                  </tr>
                  <tr className="border border-gray-300">
                    <td className="p-2 font-semibold bg-gray-200">Name</td>
                    <td className="p-2">{quotation.name}</td>
                  </tr>
                  <tr className="border border-gray-300">
                    <td className="p-2 font-semibold bg-gray-200">Phone</td>
                    <td className="p-2">{quotation.phone}</td>
                  </tr>
                  <tr className="border border-gray-300">
                    <td className="p-2 font-semibold bg-gray-200">Message</td>
                    <td className="p-2">{quotation.message}</td>
                  </tr>
                  <tr className="border border-gray-300">
                    <td className="p-2 font-semibold bg-gray-200">Area Size</td>
                    <td className="p-2">{quotation.areasize}</td>
                  </tr>
                  <tr className="border border-gray-300">
                    <td className="p-2 font-semibold bg-gray-200">
                      Square Feet
                    </td>
                    <td className="p-2">{quotation.squarefeet}</td>
                  </tr>
                  <tr className="border border-gray-300">
                    <td className="p-2 font-semibold bg-gray-200">Budget</td>
                    <td className="p-2">{quotation.budget}</td>
                  </tr>
                  <tr className="border border-gray-300">
                    <td className="p-2 font-semibold bg-gray-200">
                      Service Titles
                    </td>
                    <td className="p-2">{quotation.service_titles}</td>
                  </tr>
                  <tr className="border border-gray-300">
                    <td className="p-2 font-semibold bg-gray-200">
                      Service Prices
                    </td>
                    <td className="p-2">{quotation.service_prices}</td>
                  </tr>
                  <tr className="border border-gray-300">
                    <td className="p-2 font-semibold bg-gray-200">Status</td>
                    <td className="p-2">{quotation.status}</td>
                  </tr>
                  <tr className="border border-gray-300">
                    <td className="p-2 font-semibold bg-gray-200">Address</td>
                    <td className="p-2">{quotation.address}</td>
                  </tr>
                  <tr className="border border-gray-300">
                    <td className="p-2 font-semibold bg-gray-200">
                      Total Price
                    </td>
                    <td className="p-2">{quotation.total_price}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <h1 className="text-gray-600 text-lg text-center mt-8">
            Quotation not found.
          </h1>
        )}
      </div>
    </div>
  );
};

export default QuotationId;
