export interface QuotationData {
  id: number
  propertyType: string
  areaSize: string
  measurement: string
  budget: string
  name: string
  email: string
  contact: number
  message: string
}

export const quotation: QuotationData[] = [
  {
    id: 1,
    propertyType: 'Residential',
    areaSize: '1500',
    measurement: 'sqft',
    budget: 'Mid Range',
    name: 'James Carter',
    email: 'james.carter@example.com',
    contact: 1234567890,
    message: 'Looking for a modern and spacious home with wooden interiors.',
  },
  {
    id: 2,
    propertyType: 'Office',
    areaSize: '200',
    measurement: 'm',
    budget: 'High End',
    name: 'Sophia Martins',
    email: 'sophia.martins@example.com',
    contact: 9876543210,
    message: 'Need a premium executive office setup with custom furniture.',
  },
  {
    id: 3,
    propertyType: 'Commercial',
    areaSize: '3000',
    measurement: 'sqft',
    budget: 'Budget Friendly',
    name: 'Michael Johnson',
    email: 'michael.johnson@example.com',
    contact: 1122334455,
    message: 'Looking for affordable furniture for my new commercial space.',
  },
  {
    id: 4,
    propertyType: 'Retail',
    areaSize: '1000',
    measurement: 'ft',
    budget: 'Mid Range',
    name: 'Emily Rodriguez',
    email: 'emily.rodriguez@example.com',
    contact: 5566778899,
    message: 'Need stylish retail store furniture with display shelves.',
  },
  {
    id: 5,
    propertyType: 'Residential',
    areaSize: '250',
    measurement: 'm',
    budget: 'High End',
    name: 'Daniel Smith',
    email: 'daniel.smith@example.com',
    contact: 6677889900,
    message: 'Interested in luxury furniture for my new apartment.',
  },
  {
    id: 6,
    propertyType: 'Other',
    areaSize: '500',
    measurement: 'sqft',
    budget: 'Budget Friendly',
    name: 'Olivia Brown',
    email: 'olivia.brown@example.com',
    contact: 7788990011,
    message: 'Looking for durable and eco-friendly furniture options.',
  },
  {
    id: 7,
    propertyType: 'Commercial',
    areaSize: '120',
    measurement: 'm',
    budget: 'Mid Range',
    name: 'William Anderson',
    email: 'william.anderson@example.com',
    contact: 9900112233,
    message: 'Need functional and aesthetic furniture for a new office setup.',
  },
  {
    id: 8,
    propertyType: 'Retail',
    areaSize: '2200',
    measurement: 'sqft',
    budget: 'High End',
    name: 'Isabella White',
    email: 'isabella.white@example.com',
    contact: 2233445566,
    message: 'Want a premium retail store layout with custom wooden counters.',
  },
]
