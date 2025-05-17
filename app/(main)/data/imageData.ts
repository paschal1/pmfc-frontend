const commPic = '/comm-pic.jpg'
const commPic2 = '/comm-pic2.jpg'
const hosPic =  '/hos-pic.jpg'
const hosPic1 = '/hos-pic1.jpg'
const hosPic2 = '/hos-pic2.jpg'
const officePic = '/office-pic.jpg'
const officePic1 = '/office-pic1.jpg'
const officePic2 = '/office-pic2.jpg'
const resPic = '/res-pic.jpg'
const resPic1 =  '/res-pic2.jpg'
const resPic2 = '/res-pic3.jpg'
const resPic3 = '/res-pic4.jpg'


export interface ImageDataStructure {
  id: number;
  section: string;
  image:  string;
  title: string;
}

export const imageData: ImageDataStructure[] = [
    {
        id: 0,
        section: "commercial",
        image: commPic,
        title: "Restaurant In Texas"
    },
    {
        id: 1,
        section: "hospitality",
        image: hosPic,
        title: "Modern Elegance Suite"
    },
    {
        id: 2,
        section: "hospitality",
        image: hosPic1,
        title: "Apartment Renovation"
    }, 
    {
        id: 3,
        section: "residential",
        image: resPic,
        title: "Eco Green Interior"
    },
    {
        id: 4,
        section: "residential",
        image: resPic1,
        title: "Youtube video"
    }, 
    {
        id: 5,
        section: "residential",
        image: resPic2,
        title: "Summer house"
    },
    {
        id: 6,
        section: "office",
        image: officePic,
        title: "Vimeo Video"
    },
    {
        id: 7,
        section: "office",
        image: officePic1,
        title: "Office On Space"
    }
]