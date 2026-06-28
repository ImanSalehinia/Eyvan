import { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'

function StarRating({ rating }) {
  const stars = Math.round(rating || 0)
  return (
    <div className="flex items-center gap-1">
      <span className="text-yellow-400 text-sm">
        {'★'.repeat(stars)}{'☆'.repeat(5 - stars)}
      </span>
      <span className="text-sm text-gray-600">{rating || '—'}</span>
    </div>
  )
}

export default function Businesses() {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q') || ''
  const category = searchParams.get('cat') || ''

  const [businesses, setBusinesses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchBusinesses() {
      setLoading(true)
      let q = supabase.from('businesses').select('*')

      if (category) q = q.eq('category', category)
      if (query) q = q.ilike('name', `%${query}%`)

      const { data, error } = await q
      if (error) setError(error.message)
      else setBusinesses(data)
      setLoading(false)
    }
    fetchBusinesses()
  }, [query, category])

  if (loading) return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1,2,3].map(i => (
          <div key={i} className="bg-white rounded-xl p-4 animate-pulse">
            <div className="h-28 bg-gray-200 rounded-lg mb-3"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    </div>
  )

  if (error) return (
    <div className="text-center py-20 text-red-400">
      <p className="text-5xl mb-4">⚠️</p>
      <p>{error}</p>
    </div>
  )

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        {category ? category : query ? `نتایج: ${query}` : 'همه کسب‌وکارها'}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {businesses.map((b) => (
          <Link
            key={b.id}
            to={`/business/${b.id}`}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-all"
          >
            <div className="h-28 bg-gray-100 rounded-lg mb-3 flex items-center justify-center text-4xl overflow-hidden">
              {b.image_url ? <img src={b.image_url} alt={b.name} className="w-full h-full object-cover" /> : '🏢'}
            </div>
            <h3 className="font-bold text-gray-800 mb-1">{b.name}</h3>
            <p className="text-xs text-red-600 mb-1">{b.category} · {b.city}</p>
            <StarRating rating={b.rating} />
            <p className="text-xs text-gray-400 mt-1">{b.reviews_count || 0} نظر</p>
            <p className="text-xs text-gray-500 mt-2 truncate">{b.address}</p>
          </Link>
        ))}
      </div>

      {businesses.length === 0 && (
        <div className="text-center py-20 text-gray-400">
          <p className="text-5xl mb-4">🔍</p>
          <p>نتیجه‌ای پیدا نشد</p>
        </div>
      )}
    </div>
  )
}
