export interface TrainingData {
  id: number
  fullname: string
  age: number
  gender: string
  contact_number: number
  email: string
  address: string
  date_of_birth: number
  emergency_contact: number
  previous_contact: number
  previous_experience: string
  joining_date: string
  current_skill_level: string
  goals: string
  id_proof: string
  resume: string
}


export const training: TrainingData[] = [
  {
    id: 0,
    fullname: 'John Doe',
    age: 25,
    gender: 'Male',
    contact_number: 1234567890,
    email: 'johndoe@example.com',
    address: '123 Main St, New York, NY',
    date_of_birth: 19990115,
    emergency_contact: 9876543210,
    previous_contact: 1122334455,
    previous_experience: 'Basic carpentry skills',
    joining_date: '2024-02-10',
    current_skill_level: 'Beginner',
    goals: 'Become a professional furniture designer',
    id_proof: 'johndoe_id.jpg',
    resume: 'johndoe_resume.pdf',
  },
  {
    id: 1,
    fullname: 'Jane Smith',
    age: 28,
    gender: 'Female',
    contact_number: 1022334455,
    email: 'janesmith@example.com',
    address: '456 Oak St, Los Angeles, CA',
    date_of_birth: 19960322,
    emergency_contact: 2233445566,
    previous_contact: 3344556677,
    previous_experience: 'Wood carving',
    joining_date: '2024-03-15',
    current_skill_level: 'Intermediate',
    goals: 'Start a custom furniture business',
    id_proof: 'janesmith_id.jpg',
    resume: 'janesmith_resume.pdf',
  },
  {
    id: 2,
    fullname: 'Robert Johnson',
    age: 30,
    gender: 'Male',
    contact_number: 9988776655,
    email: 'robertj@example.com',
    address: '789 Pine St, Chicago, IL',
    date_of_birth: 19940210,
    emergency_contact: 5566778899,
    previous_contact: 662688991,
    previous_experience: 'Worked in a furniture store',
    joining_date: '2024-04-20',
    current_skill_level: 'Advanced',
    goals: 'Enhance woodworking craftsmanship',
    id_proof: 'robertjohnson_id.jpg',
    resume: 'robertjohnson_resume.pdf',
  },
  {
    id: 3,
    fullname: 'Emily Davis',
    age: 26,
    gender: 'Female',
    contact_number: 5544332211,
    email: 'emilyd@example.com',
    address: '321 Cedar St, Houston, TX',
    date_of_birth: 19980512,
    emergency_contact: 7788990011,
    previous_contact: 8899001122,
    previous_experience: 'None',
    joining_date: '2024-05-18',
    current_skill_level: 'Beginner',
    goals: 'Learn furniture restoration',
    id_proof: 'emilydavis_id.jpg',
    resume: 'emilydavis_resume.pdf',
  },
  {
    id: 4,
    fullname: 'Michael Brown',
    age: 35,
    gender: 'Male',
    contact_number: 6677889900,
    email: 'michaelb@example.com',
    address: '654 Maple St, Phoenix, AZ',
    date_of_birth: 19890630,
    emergency_contact: 1122446688,
    previous_contact: 9988223344,
    previous_experience: 'Self-taught carpenter',
    joining_date: '2024-06-22',
    current_skill_level: 'Intermediate',
    goals: 'Open a workshop',
    id_proof: 'michaelbrown_id.jpg',
    resume: 'michaelbrown_resume.pdf',
  },
  {
    id: 5,
    fullname: 'Sophia Wilson',
    age: 24,
    gender: 'Female',
    contact_number: 7766554433,
    email: 'sophiaw@example.com',
    address: '789 Birch St, Miami, FL',
    date_of_birth: 20000909,
    emergency_contact: 2233557799,
    previous_contact: 3344778899,
    previous_experience: 'Built DIY furniture',
    joining_date: '2024-07-10',
    current_skill_level: 'Beginner',
    goals: 'Gain professional training',
    id_proof: 'sophiawilson_id.jpg',
    resume: 'sophiawilson_resume.pdf',
  },
  {
    id: 6,
    fullname: 'Daniel Martinez',
    age: 29,
    gender: 'Male',
    contact_number: 8899776655,
    email: 'danielm@example.com',
    address: '159 Spruce St, Denver, CO',
    date_of_birth: 19950305,
    emergency_contact: 5566772233,
    previous_contact: 6677991122,
    previous_experience: 'Worked in a construction company',
    joining_date: '2024-08-05',
    current_skill_level: 'Advanced',
    goals: 'Specialize in custom furniture making',
    id_proof: 'danielmartinez_id.jpg',
    resume: 'danielmartinez_resume.pdf',
  },
]
