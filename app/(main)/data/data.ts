// import pic1 from "../../public/pic_1.jpg"
// import pic2 from "../../public/pic_2.jpg"
// import pic3 from "../../public/pic_3.jpg"
import { StaticImageData } from "next/image";

export interface DataItem {
    id: number;
    title1: string;
    title2: string;
    content: string;
    image:  string;
}

export const data: DataItem[] = [
  {
    id: 0,
    title1: 'Residential',
    title2: 'Design',
    content:
      'The art and science of creating functional, aesthetically pleasing living spaces within homes. It involves carefully planning and organizing the layout, selecting and arranging furniture, choosing color schemes, and incorporating decorative elements to create an inviting environment.',
    image: "/pic_1.jpg",
  },
  {
    id: 1,
    title1: 'Office',
    title2: 'Design',
    content:
      "Establishing a conducive and efficient workspace that aligns with the organizations objectives. It encompasses creating a functional and well-organized environment that enhances productivity, supports effective collaboration, and prioritizes employee well-being and motivation.",
    image: "/pic_2.jpg",
  },
  {
    id: 2,
    title1: 'Commercial',
    title2: 'Design',
    content:
      'Creating functional and visually appealing spaces for businesses, retail stores, and other commercial establishments. It involves understanding the unique needs and goals of the business and translating them into a well-designed space that enhances the customer experience.',
    image: "/pic_3.jpg",
  },
]