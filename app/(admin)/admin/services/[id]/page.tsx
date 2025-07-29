"use client";
import { useParams } from "next/navigation";
import { service } from "../../utils/services";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import Image from "next/image";

type ServiceType = {
  id: number;
  title: string;
  description: string;
  image1: string;
  image2: string;
  price: string;
  min_price: string;
  max_price: string;
};

const ServiceId = () => {
  const { id: serviceId } = useParams();
  const [service, setService] = useState<ServiceType | null>(null);

  useEffect(() => {
    const fetchService = async () => {
      try {
        const token = Cookies.get("adminToken");

        if (!token) {
          console.error("No token found");
          return;
        }

        const response = await axios.get(
          `https://api.princem-fc.com/api/services/${serviceId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const serviceData = response.data.data;
        setService(serviceData);
      } catch (error) {
        return
      }
    };

    if (serviceId) fetchService();
  }, [serviceId]);
  return (
    <div className="bg-white flex flex-col h-[100vh]">
      <div className="xl:ml-[20rem] mt-8 bg-[#F2F2F2] flex flex-col px-4 w-[90%] lg:w-[1014px] rounded-xl mx-auto mb-8 pb-8 overflow-x-auto">
        {service ? (
          <>
            <div className="mt-4">
              <h1 className="font-semibold sm:text-xl text-lg">
                Service #{service.id}
              </h1>
            </div>
            <div className="mt-8 overflow-x-auto">
              <table className="min-w-full border-collapse border border-gray-300">
                <tbody>
                  <tr className="border border-gray-300">
                    <td className="p-2 font-semibold bg-gray-200">Title</td>
                    <td className="p-2">{service.title}</td>
                  </tr>
                  <tr className="border border-gray-300">
                    <td className="p-2 font-semibold bg-gray-200">
                      Description
                    </td>
                    <td className="p-2">{service.description}</td>
                  </tr>
                  <tr className="border border-gray-300">
                    <td className="p-2 font-semibold bg-gray-200">Image 1</td>
                    <td className="p-2">
                      <Image
                        width={250}
                        height={32}
                        src={service.image1}
                        alt="Service Image 1"
                        className="w-[250px] h-32 object-cover rounded-md"
                        unoptimized
                      />
                    </td>
                  </tr>
                  <tr className="border border-gray-300">
                    <td className="p-2 font-semibold bg-gray-200">Image 2</td>
                    <td className="p-2">
                      <Image
                        width={250}
                        height={32}
                        src={service.image2}
                        alt="Service Image 2"
                        className="w-[250px] h-32 object-cover rounded-md"
                        unoptimized
                      />
                    </td>
                  </tr>
                  <tr className="border border-gray-300">
                    <td className="p-2 font-semibold bg-gray-200">Price</td>
                    <td className="p-2">{service.price}</td>
                  </tr>
                  <tr className="border border-gray-300">
                    <td className="p-2 font-semibold bg-gray-200">Maximum Price</td>
                    <td className="p-2">{service.max_price}</td>
                  </tr>
                  <tr className="border border-gray-300">
                    <td className="p-2 font-semibold bg-gray-200">Minimum Price</td>
                    <td className="p-2">{service.min_price}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <h1 className="text-gray-600 text-lg text-center mt-8">
            Service not found.
          </h1>
        )}
      </div>
    </div>
  );
};

export default ServiceId;
