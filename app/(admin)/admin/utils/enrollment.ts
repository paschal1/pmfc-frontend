export interface EnrollmentData {
  id: number
  name: string
  email: string
  contact: number
  studentId: number
  trainingProgramId: number
  enrollmentDate: string
}

export const enrollment: EnrollmentData[] = [
  {
    id: 0,
    name: 'John Doe',
    email: 'johndoe@example.com',
    contact: +1234567890,
    studentId: 1001,
    trainingProgramId: 2001,
    enrollmentDate: '2024-02-01',
  },
  {
    id: 1,
    name: 'Jane Smith',
    email: 'janesmith@example.com',
    contact: +1234567891,
    studentId: 1002,
    trainingProgramId: 2002,
    enrollmentDate: '2024-02-05',
  },
  {
    id: 2,
    name: 'Alice Johnson',
    email: 'alicejohnson@example.com',
    contact: +1234567892,
    studentId: 1003,
    trainingProgramId: 2001,
    enrollmentDate: '2024-02-10',
  },
  {
    id: 3,
    name: 'Bob Williams',
    email: 'bobwilliams@example.com',
    contact: +1234567893,
    studentId: 1004,
    trainingProgramId: 2003,
    enrollmentDate: '2024-02-15',
  },
  {
    id: 4,
    name: 'Charlie Brown',
    email: 'charliebrown@example.com',
    contact: +1234567894,
    studentId: 1005,
    trainingProgramId: 2002,
    enrollmentDate: '2024-02-20',
  },
  {
    id: 5,
    name: 'David Wilson',
    email: 'davidwilson@example.com',
    contact: +1234567895,
    studentId: 1006,
    trainingProgramId: 2003,
    enrollmentDate: '2024-02-25',
  },
  {
    id: 6,
    name: 'Emma Davis',
    email: 'emmadavis@example.com',
    contact: +1234567896,
    studentId: 1007,
    trainingProgramId: 2001,
    enrollmentDate: '2024-03-01',
  },
  {
    id: 7,
    name: 'Frank Miller',
    email: 'frankmiller@example.com',
    contact: +1234567897,
    studentId: 1008,
    trainingProgramId: 2002,
    enrollmentDate: '2024-03-05',
  },
]
