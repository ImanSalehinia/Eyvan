import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const categories = [
  { name: 'رستوران', icon: '🍽️' },
  { name: 'سوپرمارکت', icon: '🛒' },
  { name: 'پزشک', icon: '🏥' },
  { name: 'وکیل', icon: '⚖️' },
  { name: 'آرایشگاه', icon: '💇' },
  { name: 'مدرسه', icon: '📚' },
  { name: 'رویدادها', icon: '🎉' },
  { name: 'سایر', icon: '📌' },
]

export default function Home() {
  const [search, setSearch] = useState('')
  const navigate = useNavigate()

  const handleSearch = (e) => {
    e.preventDefault()
    navigate(`/businesses?q=${search}`)
  }

  return (
    <div>
      {/* Hero */}
      <div className="bg-red-600 text-white py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-3">ایوان</h1>
          <p className="text-lg mb-8 text-red-100">
            دایرکتوری کسب‌وکارهای ایرانی در انگلستان
          </p>
          <form onSubmit={handleSearch} className="flex gap-2 max-w-xl mx-auto">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="جستجو: رستوران، دکتر، وکیل..."
              className="flex-1 px-4 py-3 rounded-lg text-gray-800 text-sm outline-none"
            />
            <button
              type="submit"
              className="bg-white text-red-600 px-6 py-3 rounded-lg font-bold text-sm hover:bg-red-50"
            >
              جستجو
            </button>
          </form>
        </div>
      </div>

      {/* Categories */}
      <div className="max-w-5xl mx-auto px-4 py-12">
        <h2 className="text-xl font-bold text-gray-800 mb-6 text-center">دسته‌بندی‌ها</h2>
        <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
          {categories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => navigate(`/businesses?cat=${cat.name}`)}
              className="flex flex-col items-center gap-2 p-4 bg-white rounded-xl shadow-sm hover:shadow-md hover:border-red-200 border border-gray-100 transition-all"
            >
              <span className="text-3xl">{cat.icon}</span>
              <span className="text-xs text-gray-600 font-medium">{cat.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Recent Businesses (placeholder) */}
      <div className="max-w-5xl mx-auto px-4 pb-12">
        <h2 className="text-xl font-bold text-gray-800 mb-6">تازه اضافه شده</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 animate-pulse">
              <div className="h-32 bg-gray-200 rounded-lg mb-3"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
