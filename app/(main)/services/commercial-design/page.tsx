'use client'
import { Parallax } from 'react-parallax'
import ServiceController from '../components/ServiceController'
import ServiceDetailModal from '../components/Servicedetailmodal'
import * as serviceApi from '../../../services/serviceApi.service'
import { useEffect, useState } from 'react'

const CommercialDesign = () => {
  const [services, setServices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedServiceId, setSelectedServiceId] = useState<number | null>(null)

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true)
        const response = await serviceApi.getServices('Commercial Design')
        setServices(response.data || [])
      } catch (err) {
        console.error('Error fetching services:', err)
        setError('Failed to load services')
      } finally {
        setLoading(false)
      }
    }

    fetchServices()
  }, [])

  return (
    <>
      <div className="flex flex-col overflow-hidden">
        <Parallax
          strength={300}
          className="h-[230px] w-[100%] bg-cover bg-center lg:flex hidden items-center"
          bgImage={'/services-bg.jpg'}
        >
          <h1 className="uppercase lg:text-4xl text-2xl text-white lg:ml-20 ml-4">
            Commercial Design
          </h1>
        </Parallax>
        <div className="h-[230px] w-[100%] lg:hidden block relative">
          <img
            src={'/services-bg.jpg'}
            alt="img"
            className="h-full w-full object-cover"
          />
          <h1 className="font-bold text-3xl text-white z-10 absolute top-24 left-3">
            Commercial Design
          </h1>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <p className="text-gray-500">Loading services...</p>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center py-20">
            <p className="text-red-500">{error}</p>
          </div>
        ) : (
          <div className="flex lg:flex-row flex-col justify-center lg:px-16 ml-4 lg:ml-0 gap-6 mt-20 w-full lg:w-auto">
            <ServiceController />

            <div className="flex flex-col gap-6 text-[#BBBBBB]">
              {services.length > 0 ? (
                <>
                  <h1 className="w-[85%] lg:w-[406px] text-lg font-semibold text-white">
                    Featured Services ({services.length})
                  </h1>
                  {services.map((service) => (
                    <div key={service.id} className="mb-4">
                      <h2 className="text-white font-bold mb-2">{service.title}</h2>
                      <p className="w-[85%] lg:w-[406px] line-clamp-3">{service.description}</p>
                      <div className="mt-2 text-sm">
                        <span className="text-[#fab702] font-semibold">
                          {serviceApi.formatPrice(service)}
                        </span>
                      </div>
                      <button
                        onClick={() => setSelectedServiceId(service.id)}
                        className="inline-block mt-2 px-4 py-2 bg-[#fab702] text-black font-semibold rounded hover:opacity-90 transition"
                      >
                        View Details
                      </button>
                    </div>
                  ))}
                </>
              ) : (
                <p className="w-[85%] lg:w-[406px]">
                  No services available for Commercial Design at this time.
                </p>
              )}
            </div>

            {services.length > 0 && (
              <div className="flex flex-col gap-8 w-full">
                {services.slice(0, 2).map((service) => (
                  <div key={service.id}>
                    {service.image1 && (
                      <img
                        src={service.image1}
                        alt={service.title}
                        className="h-[268px] w-[85%] lg:w-[403px] object-cover rounded cursor-pointer hover:opacity-80 transition"
                        onClick={() => setSelectedServiceId(service.id)}
                      />
                    )}
                    {service.image2 && (
                      <img
                        src={service.image2}
                        alt={service.title}
                        className="h-[268px] w-[85%] lg:w-[403px] object-cover rounded cursor-pointer hover:opacity-80 transition mt-4"
                        onClick={() => setSelectedServiceId(service.id)}
                      />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Service Detail Modal */}
      {selectedServiceId && (
        <ServiceDetailModal
          serviceId={selectedServiceId}
          isOpen={selectedServiceId !== null}
          onClose={() => setSelectedServiceId(null)}
        />
      )}
    </>
  )
}

export default CommercialDesign