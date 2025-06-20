
// app/not-found.tsx
export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center mx-auto bg-white text-center">
      <div className="flex flex-col items-center justify-center mx-auto">
        <h1 className="text-7xl lg:text-9xl font-bold text-gray-700">404</h1>
        <p className="mt-4 text-gray-700 font-bold text-2xl">Not Found</p>
        <p className="mt-2 text-sm text-gray-700">
          Sorry, the page you’re looking for does not exist.
        </p>
      </div>
    </div>
  )
}
