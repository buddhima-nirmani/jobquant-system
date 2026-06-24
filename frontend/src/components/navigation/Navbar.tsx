export default function Navbar() {
  return (
    <header className="h-16 border-b bg-white flex items-center justify-between px-6">
      <div>
        <h1 className="font-semibold text-lg">
          JobQuant
        </h1>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-600">
          Admin User
        </span>

        <div className="h-9 w-9 rounded-full bg-gray-300" />
      </div>
    </header>
  );
}