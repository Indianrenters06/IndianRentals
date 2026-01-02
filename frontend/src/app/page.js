export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section Placeholder */}
      <section className="bg-indigo-600 text-white py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Rent Top Quality Gear
          </h1>
          <p className="text-xl md:text-2xl text-indigo-100 mb-8 max-w-2xl mx-auto">
            From Laptops to DSLRs, get everything you need on flexible rental plans.
          </p>
          <button className="bg-white text-indigo-600 px-8 py-3 rounded-full font-bold hover:bg-gray-100 transition-colors">
            Explore Categories
          </button>
        </div>
      </section>

      {/* Categories Placeholder */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">Popular Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-40 bg-gray-200 rounded-xl flex items-center justify-center text-gray-500 font-medium">
              Category {i}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
