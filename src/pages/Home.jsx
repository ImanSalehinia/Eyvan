import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { HiSearch, HiLocationMarker, HiArrowLeft } from 'react-icons/hi'
import {
  MdRestaurant, MdLocalGroceryStore, MdLocalHospital, MdGavel,
  MdContentCut, MdSchool, MdCelebration, MdMoreHoriz
} from 'react-icons/md'

const categories = [
  { name: 'رستوران',    icon: MdRestaurant,        color: 'bg-orange-100 text-orange-500' },
  { name: 'سوپرمارکت', icon: MdLocalGroceryStore,  color: 'bg-emerald-100 text-emerald-600' },
  { name: 'پزشک',      icon: MdLocalHospital,      color: 'bg-sky-100 text-sky-600' },
  { name: 'وکیل',      icon: MdGavel,              color: 'bg-purple-100 text-purple-600' },
  { name: 'آرایشگاه',  icon: MdContentCut,         color: 'bg-pink-100 text-pink-500' },
  { name: 'مدرسه',     icon: MdSchool,             color: 'bg-yellow-100 text-yellow-600' },
  { name: 'رویدادها',  icon: MdCelebration,        color: 'bg-red-100 text-red-500' },
  { name: 'سایر',      icon: MdMoreHoriz,          color: 'bg-gray-100 text-gray-500' },
]

const cities = ['London', 'Manchester', 'Birmingham', 'Leeds', 'Glasgow', 'Liverpool', 'Bristol', 'Edinburgh']

export default function Home() {
  const [search, setSearch] = useState('')
  const navigate = useNavigate()

  return (
    <div className="bg-white">

      {/* Hero */}
      <div className="relative overflow-hidden py-24 px-4"
        style={{ background: 'linear-gradient(135deg, #1E0A3C 0%, #2D1057 40%, #4C1D95 100%)' }}>
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full opacity-10 blur-3xl"
          style={{ background: '#F59E0B' }} />
        <div className="absolute bottom-0 right-1/4 w-72 h-72 rounded-full opacity-10 blur-3xl"
          style={{ background: '#7C3AED' }} />

        <div className="relative max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-yellow-400/20 border border-yellow-400/30 text-yellow-300 text-xs font-semibold px-4 py-1.5 rounded-full mb-5">
            <span className="text-yellow-400">✦</span>
            بهترین دایرکتوری ایرانی در انگلستان
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-white mb-4 tracking-tight">
            Eyvan
          </h1>
          <p className="text-purple-200 text-lg mb-10 font-light">
            کسب‌وکارها، خدمات و رویدادهای ایرانی را پیدا کن
          </p>

          <div className="flex max-w-2xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden"
            style={{ border: '2px solid rgba(251,191,36,0.2)' }}>
            <div className="flex items-center px-4 text-gray-400 border-r border-gray-100">
              <HiSearch size={22} />
            </div>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && navigate(`/businesses?q=${search}`)}
              placeholder="دنبال چی می‌گردی؟ رستوران، دکتر، وکیل..."
              className="flex-1 px-4 py-4 text-gray-800 text-base outline-none"
            />
            <button
              onClick={() => navigate(`/businesses?q=${search}`)}
              className="text-white px-8 font-bold text-sm"
              style={{ background: 'linear-gradient(135deg, #5B21B6, #7C3AED)' }}
            >
              جستجو
            </button>
          </div>

          <div className="flex items-center justify-center gap-2 mt-5 text-purple-300 text-sm">
            <HiLocationMarker size={15} />
            <span>لندن · منچستر · بیرمنگام · لیدز · گلاسگو و بیشتر</span>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="max-w-5xl mx-auto px-4 py-10">
        <h2 className="text-xl font-bold text-gray-900 mb-6">دسته‌بندی‌ها</h2>
        <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
          {categories.map(cat => (
            <button
              key={cat.name}
              onClick={() => navigate(`/businesses?cat=${cat.name}`)}
              className="flex flex-col items-center gap-2.5 p-4 bg-white rounded-2xl border border-gray-100 hover:shadow-md hover:-translate-y-1 transition-all group"
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${cat.color} group-hover:scale-110 transition-transform`}>
                <cat.icon size={24} />
              </div>
              <span className="text-xs font-medium text-gray-600">{cat.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="border-t border-gray-100 max-w-5xl mx-auto"></div>

      {/* Cities */}
      <div className="max-w-5xl mx-auto px-4 py-10">
        <h2 className="text-xl font-bold text-gray-900 mb-6">شهرها</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {cities.map(city => (
            <button
              key={city}
              onClick={() => navigate(`/businesses?city=${city}`)}
              className="flex items-center gap-3 bg-white border border-gray-100 rounded-xl p-4 hover:shadow-md hover:border-purple-100 hover:-translate-y-0.5 transition-all group"
            >
              <div className="w-9 h-9 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform"
                style={{ background: 'linear-gradient(135deg, #EDE9FE, #DDD6FE)' }}>
                <HiLocationMarker size={17} className="text-purple-600" />
              </div>
              <span className="text-sm font-semibold text-gray-700">{city}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="border-t border-gray-100 max-w-5xl mx-auto"></div>

      {/* CTA */}
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="relative overflow-hidden rounded-3xl px-8 py-10 flex flex-col md:flex-row items-center justify-between gap-6"
          style={{ background: 'linear-gradient(135deg, #1E0A3C 0%, #4C1D95 100%)' }}>
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10 blur-3xl"
            style={{ background: '#F59E0B' }} />
          <div className="relative">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-yellow-400 text-lg">✦</span>
              <span className="text-yellow-300 text-sm font-semibold">رایگان</span>
            </div>
            <h3 className="text-2xl font-black text-white mb-1">کسب‌وکار ایرانی داری؟</h3>
            <p className="text-purple-300 text-sm">الان ثبت کن و مشتری‌های بیشتری پیدا کن</p>
          </div>
          <Link
            to="/add-business"
            className="relative flex items-center gap-2 font-black text-sm px-7 py-3.5 rounded-2xl transition-all shadow-lg whitespace-nowrap hover:scale-105"
            style={{ background: 'linear-gradient(135deg, #F59E0B, #FBBF24)', color: '#1E0A3C' }}
          >
            ثبت رایگان
            <HiArrowLeft size={16} />
          </Link>
        </div>
      </div>
    </div>
  )
}
