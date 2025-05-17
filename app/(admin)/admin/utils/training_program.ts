export interface TrainingProgramData {
  id: number
  title: string
  description: string
  start_date: string
  end_date: string
  price: number
}

export const trainingProgram: TrainingProgramData[] = [
  {
    id: 0,
    title: 'Basic Woodworking Techniques',
    description:
      'Learn fundamental woodworking skills, including measuring, cutting, and assembling wooden structures.',
    start_date: '2024-03-05',
    end_date: '2024-05-05',
    price: 30000,
  },
  {
    id: 1,
    title: 'Advanced Furniture Making',
    description:
      'Master the art of crafting high-quality furniture, from design to finishing touches.',
    start_date: '2024-04-10',
    end_date: '2024-07-10',
    price: 60000,
  },
  {
    id: 2,
    title: 'Upholstery and Cushioning',
    description:
      'Learn how to upholster chairs, sofas, and other furniture pieces with different fabric and foam techniques.',
    start_date: '2024-05-15',
    end_date: '2024-08-15',
    price: 50000,
  },
  {
    id: 3,
    title: 'Cabinet and Wardrobe Construction',
    description:
      'A hands-on course focused on designing and building cabinets and wardrobes for homes and offices.',
    start_date: '2024-06-01',
    end_date: '2024-09-01',
    price: 70000,
  },
  {
    id: 4,
    title: 'Furniture Restoration and Refinishing',
    description:
      'Learn how to restore old furniture pieces and apply professional refinishing techniques.',
    start_date: '2024-07-20',
    end_date: '2024-10-20',
    price: 45000,
  },
  {
    id: 5,
    title: 'CNC and Modern Woodworking Technology',
    description:
      'Explore the use of CNC machines and modern technology in furniture making.',
    start_date: '2024-08-05',
    end_date: '2024-11-05',
    price: 90000,
  },
  {
    id: 6,
    title: 'Bamboo and Rattan Furniture Crafting',
    description:
      'Specialize in crafting eco-friendly furniture using bamboo and rattan materials.',
    start_date: '2024-09-01',
    end_date: '2024-12-01',
    price: 55000,
  },
  {
    id: 7,
    title: 'Custom Furniture Design and Prototyping',
    description:
      'Learn how to design custom furniture and create prototypes using digital and traditional methods.',
    start_date: '2024-10-10',
    end_date: '2025-01-10',
    price: 75000,
  },
]
