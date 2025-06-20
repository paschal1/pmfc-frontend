import '../../globals.css'
export const metadata = {
  title: 'PMFC Furniture',
  description: 'Login to the admin dashboard',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
      <>{children}</>
  )
}
