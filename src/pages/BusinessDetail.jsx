import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'

function StarRating({ rating }) {
  const stars = Math.round(rating || 0)
  return (
    <div className="flex items-center gap-1">
      <span className="text-yellow-400">{'★'.repeat(stars)}{'☆'.repeat(5 - stars)}</span>
      <span className="text-gray-600 font-medium">{rating || '—'}</span>
    </div>
  )
}

export default function BusinessDetail() {
  const { id } = useParams()
  const [business, setBusiness] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchBusiness() {
      const { data } = await supabase
        .from('businesses')
        .select('*')
        .eq('id', id)
        .single()
      setBusiness(data)
      setLoading(false)
    }
    fetchBusiness()
  }, [id])

  if (loading) return (
    <div className="max-w-3xl mx-auto px-4 py-8 animate-pulse">
      <div className="bg-white rounded-2xl overflow-hidden">
        <div className="h-48 bg-gray-200"></div>
        <div className="p-6 space-y-3">
          <div className="h-6 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
        </div>
      </div>
    </div>
  )

  if (!business) return (
    <div className="text-center py-20 text-gray-400">
      <p className="text-5xl mb-4">😕</p>
      <p>کسب‌وکار پیدا نشد</p>
      <Link to="/businesses" className="text-red-600 mt-4 inline-block">برگشت به لیست</Link>
    </div>
  )

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Link to="/businesses" className="text-red-600 text-sm mb-4 inline-block">← برگشت</Link>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="h-48 bg-gray-100 flex items-center justify-center text-7xl overflow-hidden">
          {business.image_url
            ? <img src={business.image_url} alt={business.name} className="w-full h-full object-cover" />
            : '🏢'}
        </div>
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">{business.name}</h1>
              <p className="text-red-600 text-sm mt-1">{business.category} · {business.city}</p>
            </div>
            <StarRating rating={business.rating} />
          </div>

          <p className="text-gray-600 mb-6">{business.description}</p>

          <div className="space-y-3 text-sm text-gray-600">
            {business.address && (
              <div className="flex items-center gap-2">
                <span>📍</span><span>{business.address}</span>
              </div>
            )}
            {business.phone && (
              <div className="flex items-center gap-2">
                <span>📞</span><span>{business.phone}</span>
              </div>
            )}
          </div>

          <div className="mt-6 pt-6 border-t border-gray-100">
            <h3 className="font-bold text-gray-800 mb-4">نظرات</h3>
            <p className="text-gray-400 text-sm">برای دیدن و نوشتن نظر وارد شوید</p>
          </div>
        </div>
      </div>
    </div>
  )
}
