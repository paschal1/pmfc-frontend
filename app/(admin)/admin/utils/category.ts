import { IconType } from "react-icons/lib"
import { RiArmchairLine } from 'react-icons/ri'
import { IoBedOutline } from 'react-icons/io5'
import { BiCabinet } from 'react-icons/bi'
import { PiDeskBold } from 'react-icons/pi'
import { RiSofaFill } from 'react-icons/ri'
import { MdOutlineMiscellaneousServices } from 'react-icons/md'

export interface CategoryData {
  id: number
  name: string
  image: string
  icon: IconType
}

export const categories: CategoryData[] = [
  {
    id: 0,
    name: 'Chair',
    image: '/chair.webp',
    icon: RiArmchairLine,
  },
  {
    id: 1,
    name: 'Bed',
    image: '/bed.png',
    icon: IoBedOutline,
  },
  {
    id: 2,
    name: 'Cabinet',
    image: '/cabinet.jpg',
    icon: BiCabinet,
  },
  {
    id: 3,
    name: 'Desk',
    image: '/img5.jpg',
    icon: PiDeskBold,
  },
  {
    id: 4,
    name: 'Sofa',
    image: '/img1.jpg',
    icon: RiSofaFill,
  },
  {
    id: 5,
    name: 'Misc',
    image: '/misc.png',
    icon: MdOutlineMiscellaneousServices,
  },
]