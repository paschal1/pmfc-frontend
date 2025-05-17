'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

const ServiceController = () => {
  const pathname = usePathname()
  const [activeLink, setActiveLink] = useState('')

  useEffect(() => {
    if (pathname) {
      switch (pathname) {
        case '/services/residential-design':
          setActiveLink('residential-design')
          break
        case '/services/hospitality-design':
          setActiveLink('hospitality-design')
          break
        case '/services/office-design':
          setActiveLink('office-design')
          break
        case '/services/commercial-design':
          setActiveLink('commercial-design')
          break
        default:
          setActiveLink('')
      }
    }
  }, [pathname])

  const handleLinkClick = (linkName: string) => {
    setActiveLink(linkName)
  }
  return (
    <div className="flex flex-col gap-2 lg:w-full w-[85%] ">
      <Link href={'/services/residential-design'} passHref>
        <div
          onClick={() => handleLinkClick('residential-design')}
          className={`w-full py-6 hover:bg-[#fab702] hover:text-black transition-all duration-500 ease-in-out ${
            activeLink === 'residential-design'
              ? 'text-black bg-[#fab702]'
              : 'bg-[#0000004D] text-white'
          }`}
        >
          <h1 className="font-bold ml-5 text-lg">Residential Design</h1>
        </div>
      </Link>
      <Link href={'/services/hospitality-design'}>
        <div
          onClick={() => handleLinkClick('hospitality-design')}
          className={`w-full py-6 hover:bg-[#fab702] hover:text-black transition-all duration-500 ease-in-out  ${
            activeLink === 'hospitality-design'
              ? 'text-black bg-[#fab702]'
              : 'bg-[#0000004D] text-white'
          }`}
        >
          <h1 className="font-bold ml-5 text-lg">Hospitality Design</h1>
        </div>
      </Link>
      <Link href={'/services/office-design'}>
        <div
          onClick={() => handleLinkClick('office-design')}
          className={`w-full py-6 hover:bg-[#fab702] hover:text-black transition-all duration-500 ease-in-out ${
            activeLink === 'office-design'
              ? 'text-black bg-[#fab702]'
              : 'bg-[#0000004D] text-white'
          }`}
        >
          <h1 className="font-bold ml-5 text-lg">Office Design</h1>
        </div>
      </Link>
      <Link href={'/services/commercial-design'}>
        <div
          onClick={() => handleLinkClick('commercial-design')}
          className={`w-full py-6 hover:bg-[#fab702] hover:text-black transition-all duration-500 ease-in-out ${
            activeLink === 'commercial-design'
              ? 'text-black bg-[#fab702]'
              : 'bg-[#0000004D] text-white'
          }`}
        >
          <h1 className="font-bold ml-5 text-lg">Commercial Design</h1>
        </div>
      </Link>
    </div>
  )
}

export default ServiceController
