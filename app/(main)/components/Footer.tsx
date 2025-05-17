import { FaInstagram } from 'react-icons/fa'
import { FaFacebookF } from 'react-icons/fa'
import Link from 'next/link'

const Footer = () => {
  return (
    <div className="bg-black h-[80px] flex items-center justify-between mt-20 px-6 md:px-20">
      <div className="">
        <p className="text-white text-[12px] lg:text-[16px] whitespace-nowrap">
          Copyright <span className="text-[#fab702]">2024</span> - All Rights
          Reserved
        </p>
      </div>
      <div className="flex items-center gap-4">
        <div>
          <Link
            href=" https://www.instagram.com/princem_the_housemaster?igsh=OHl3dG5qdWw1ZXlm&utm_source=qr"
            passHref
            legacyBehavior
          >
            <a target="_blank" rel="noopener noreferrer">
              <FaInstagram className="text-white h-[30px] w-[30px]" />
            </a>
          </Link>
        </div>
        <div>
          <Link
            href="https://www.facebook.com/PrinceMFurnishingConcept"
            passHref
            legacyBehavior
          >
            <a target="_blank" rel="noopener noreferrer">
              <FaFacebookF className="text-white h-[30px] w-[30px]" />
            </a>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Footer
