import { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { HiStar, HiLocationMarker, HiX } from 'react-icons/hi'
import { supabase } from '../lib/supabase'

const categories = ['رستوران', 'سوپرمارکت', 'پزشک', 'وکیل', 'آرایشگاه', 'مدرسه', 'رویدادها', 'سایر']
const cities = ['London', 'Manchester', 'Birmingham', 'Leeds', 'Glasgow', 'Liverpool', 'Bristol', 'Edinburgh']

function BusinessCard({ b }) {
  return (
    <Link to={`/business/${b.id}`} className="group block">
      <div className="aspect-square rounded-2xl overflow-hidden bg-gray-100 mb-3 relative">
        {b.image_url
          ? <img src={b.image_url} alt={b.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          : <div className="w-full h-full flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #EDE9FE, #DDD6FE)' }}>
              <span className="text-5xl opacity-20">🏢</span>
            </div>
        }
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-2.5 py-1 text-xs font-bold text-purple-700 shadow-sm">
          {b.category}
        </div>
      </div>
      <div className="px-1">
        <div className="flex items-start justify-between mb-1">
          <h3 className="font-bold text-gray-900 text-sm leading-snug">{b.name}</h3>
          {b.rating && (
            <div className="flex items-center gap-0.5 shrink-0 mr-2">
              <HiStar size={13} className="text-yellow-500" />
              <span className="text-xs font-bold text-gray-700">{b.rating.toFixed(1)}</span>
            </div>
          )}
        </div>
        <p className="text-xs text-gray-400">{b.city}</p>
        {b.address && <p className="text-xs text-gray-400 truncate">{b.address}</p>}
      </div>
    </Link>
  )
}

export default function Businesses() {
  const [searchParams, setSearchParams] = useSearchParams()
  const query = searchParams.get('q') || ''
  const category = searchParams.get('cat') || ''
  const city = searchParams.get('city') || ''

  const [businesses, setBusinesses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      let q = supabase.from('businesses').select('*')
      if (category) q = q.eq('category', category)
      if (city) q = q.eq('city', city)
      if (query) q = q.ilike('name', `%${query}%`)
      const { data, error } = await q
      if (error) setError(error.message)
      else setBusinesses(data)
      setLoading(false)
    }
    fetchData()
  }, [query, category, city])

  const hasFilter = category || city || query
  const updateParam = (key, val) => {
    setSearchParams(p => {
      const n = new URLSearchParams(p)
      val ? n.set(key, val) : n.delete(key)
      return n
    })
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-6xl mx-auto px-6 py-8">

        {/* Filter chips */}
        <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2 border-b border-gray-100">
          <button
            onClick={() => setSearchParams({})}
            className={`shrink-0 px-4 py-2 rounded-full text-sm font-semibold border transition-all
              ${!hasFilter ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-500 border-gray-200 hover:border-gray-400'}`}
          >
            همه
          </button>
          {categories.map(c => (
            <button
              key={c}
              onClick={() => updateParam('cat', category === c ? '' : c)}
              className={`shrink-0 px-4 py-2 rounded-full text-sm font-semibold border transition-all
                ${category === c ? 'text-white border-transparent' : 'bg-white text-gray-500 border-gray-200 hover:border-gray-400'}`}
              style={category === c ? { background: 'linear-gradient(135deg, #5B21B6, #7C3AED)' } : {}}
            >
              {c}
            </button>
          ))}
          <div className="w-px h-5 bg-gray-200 shrink-0 mx-1" />
          <select
            value={city}
            onChange={e => updateParam('city', e.target.value)}
            className="shrink-0 px-4 py-2 rounded-full text-sm font-semibold border border-gray-200 bg-white text-gray-500 outline-none hover:border-gray-400"
          >
            <option value="">همه شهرها</option>
            {cities.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          {hasFilter && (
            <button onClick={() => setSearchParams({})} className="shrink-0 flex items-center gap-1 text-xs text-gray-400 hover:text-red-500 px-2 transition-colors">
              <HiX size={13} /> پاک کردن
            </button>
          )}
        </div>

        {!loading && (
          <p className="text-sm text-gray-400 mb-6">
            <span className="font-semibold text-gray-700">{businesses.length}</span> کسب‌وکار
          </p>
        )}

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {[1,2,3,4,5,6,7,8].map(i => (
              <div key={i} className="animate-pulse">
                <div className="aspect-square rounded-2xl bg-gray-100 mb-3"></div>
                <div className="h-3.5 bg-gray-100 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-100 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-20 text-red-400">
            <p className="text-4xl mb-3">⚠️</p><p className="text-sm">{error}</p>
          </div>
        ) : businesses.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-5xl mb-4">🔍</p>
            <p className="font-bold text-gray-800 text-xl mb-2">نتیجه‌ای پیدا نشد</p>
            <p className="text-gray-400 text-sm">دسته‌بندی یا شهر دیگه‌ای امتحان کن</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {businesses.map(b => <BusinessCard key={b.id} b={b} />)}
          </div>
        )}
      </div>
    </div>
  )
}
