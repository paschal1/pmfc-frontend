'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import * as serviceApi from '../../../services/serviceApi.service'

const ServiceController = () => {
  const pathname = usePathname()
  const [activeLink, setActiveLink] = useState('')
  const [services, setServices] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const serviceTypes = [
    { type: 'Residential Design', slug: 'residential-design' },
    { type: 'Hospitality Design', slug: 'hospitality-design' },
    { type: 'Office Design', slug: 'office-design' },
    { type: 'Commercial Design', slug: 'commercial-design' },
  ]

  useEffect(() => {
    // Set active link based on pathname
    const activeService = serviceTypes.find(
      (s) => pathname === `/services/${s.slug}`
    )
    if (activeService) {
      setActiveLink(activeService.slug)
    }
  }, [pathname])

  useEffect(() => {
    // Fetch services for the active type
    const fetchServices = async () => {
      const activeService = serviceTypes.find((s) => s.slug === activeLink)
      if (!activeService) return

      try {
        setLoading(true)
        const response = await serviceApi.getServices(activeService.type)
        setServices(response.data || [])
      } catch (error) {
        console.error('Error fetching services:', error)
        setServices([])
      } finally {
        setLoading(false)
      }
    }

    if (activeLink) {
      fetchServices()
    }
  }, [activeLink])

  const handleLinkClick = (slug: string) => {
    setActiveLink(slug)
  }

  return (
    <div className="flex flex-col gap-2 lg:w-full w-[85%]">
      {serviceTypes.map((service) => (
        <Link key={service.slug} href={`/services/${service.slug}`} passHref>
          <div
            onClick={() => handleLinkClick(service.slug)}
            className={`w-full py-6 hover:bg-[#fab702] hover:text-black transition-all duration-500 ease-in-out cursor-pointer ${
              activeLink === service.slug
                ? 'text-black bg-[#fab702]'
                : 'bg-[#0000004D] text-white'
            }`}
          >
            <h1 className="font-bold ml-5 text-lg">{service.type}</h1>
            {activeLink === service.slug && services.length > 0 && (
              <p className="ml-5 text-sm opacity-80 mt-1">
                ({services.length} service{services.length !== 1 ? 's' : ''})
              </p>
            )}
          </div>
        </Link>
      ))}
    </div>
  )
}

export default ServiceController