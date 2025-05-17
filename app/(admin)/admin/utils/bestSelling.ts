export interface BestSellingItem {
  id: number;
  name: string;
  price: number;
  orders: number;
  stock: number;
  amount: number;
  date: string;
  image: string;
}

export const bestSellingData: BestSellingItem[] = [
  {
    id: 0,
    name: 'Wooden Chair',
    image: '/chair.webp',
    price: 29.00,
    orders: 74,
    stock: 510,
    amount: 1759,
    date: '22-01-2025',
  },
  {
    id: 1,
    name: 'Cupboard',
    image: '/bed.png',
    price: 29.00,
    orders: 73,
    stock: 510,
    amount: 1749,
    date: '22-01-2025',
  },
  {
    id: 2,
    name: 'Sofa',
    image: '/sofa.webp',
    price: 29.00,
    orders: 72,
    stock: 500,
    amount: 1729,
    date: '22-01-2025',
  }
]