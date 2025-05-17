const commPic = '/comm-pic.jpg'
const commPic1 = '/comm-pic1.jpg'
const hosPic = '/hos-pic.jpg'
const hosPic1 = '/hos-pic1.jpg'
const hosPic2 = '/hos-pic2.jpg'
const officePic = '/office-pic.jpg'
const officePic1 = '/office-pic1.jpg'
const officePic2 = '/office-pic2.jpg'
const resPic = '/res-pic.jpg'
const resPic1 = '/res-pic2.jpg'
const resPic2 = '/res-pic3.jpg'
const resPic3 = '/res-pic4.jpg'

export interface ProjectDataStructure {
  id: number
  section: string
  image: string
  title: string
}

export const projectData: ProjectDataStructure[] = [
  {
    id: 0,
    section: 'commercial',
    image: commPic,
    title: 'Restaurant In Texas',
  },
  {
    id: 1,
    section: 'commercial',
    image: commPic1,
    title: 'Restaurant In Cannes',
  },
  {
    id: 2,
    section: 'hospitality',
    image: hosPic,
    title: 'Modern Elegance Suite',
  },
  {
    id: 3,
    section: 'hospitality',
    image: hosPic1,
    title: 'Apartment Renovation',
  },
  {
    id: 4,
    section: 'hospitality',
    image: hosPic2,
    title: 'Classic Furnishing',
  },
  {
    id: 5,
    section: 'residential',
    image: resPic,
    title: 'Eco Green Interior',
  },
  {
    id: 6,
    section: 'residential',
    image: resPic1,
    title: 'Youtube video',
  },
  {
    id: 7,
    section: 'residential',
    image: resPic2,
    title: 'Summer house',
  },
  {
    id: 8,
    section: 'residential',
    image: resPic3,
    title: 'Cozy Bedroom',
  },
  {
    id: 9,
    section: 'office',
    image: officePic,
    title: 'Vimeo Video',
  },
  {
    id: 10,
    section: 'office',
    image: officePic1,
    title: 'Office On Space',
  },
  {
    id: 11,
    section: 'office',
    image: officePic2,
    title: 'Luxury Living Room',
  },
]
