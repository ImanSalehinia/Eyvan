import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { HiStar, HiLocationMarker, HiPhone, HiArrowRight, HiShare, HiHeart } from 'react-icons/hi'
import { supabase } from '../lib/supabase'

export default function BusinessDetail() {
  const { id } = useParams()
  const [business, setBusiness] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchBusiness() {
      const { data } = await supabase.from('businesses').select('*').eq('id', id).single()
      setBusiness(data)
      setLoading(false)
    }
    fetchBusiness()
  }, [id])

  if (loading) return (
    <div className="max-w-5xl mx-auto px-6 py-8 animate-pulse">
      <div className="h-72 bg-gray-100 rounded-3xl mb-8"></div>
      <div className="h-7 bg-gray-100 rounded-xl w-1/2 mb-3"></div>
      <div className="h-4 bg-gray-100 rounded w-1/3"></div>
    </div>
  )

  if (!business) return (
    <div className="text-center py-24">
      <p className="text-5xl mb-4">😕</p>
      <p className="font-bold text-gray-800 text-xl mb-3">کسب‌وکار پیدا نشد</p>
      <Link to="/businesses" className="text-sm text-gray-400 hover:text-gray-700 underline">← برگشت</Link>
    </div>
  )

  const stars = Math.round(business.rating || 0)

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-5xl mx-auto px-6 py-6">

        <Link to="/businesses" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-gray-700 mb-5 transition-colors font-medium">
          <HiArrowRight size={15} /> برگشت
        </Link>

        {/* Images */}
        <div className="grid grid-cols-2 gap-2 mb-8 rounded-3xl overflow-hidden h-72">
          <div className="bg-gray-100 h-full">
            {business.image_url
              ? <img src={business.image_url} alt={business.name} className="w-full h-full object-cover" />
              : <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                  <span className="text-6xl opacity-10">🏢</span>
                </div>
            }
          </div>
          <div className="grid grid-cols-2 gap-2">
            {[1,2,3,4].map(i => (
              <div key={i} className="bg-gray-50 rounded-sm flex items-center justify-center">
                <span className="text-gray-200 text-xl">+</span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">

          {/* Main content */}
          <div className="md:col-span-2 space-y-8">

            <div className="border-b border-gray-100 pb-8">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h1 className="text-2xl font-black text-gray-900 mb-1">{business.name}</h1>
                  <p className="text-gray-400 text-sm">
                    <span className="text-purple-600 font-semibold">{business.category}</span>
                    {' · '}{business.city}, UK
                  </p>
                </div>
                <div className="flex gap-1">
                  <button className="p-2.5 rounded-full hover:bg-gray-100 transition-colors">
                    <HiShare size={18} className="text-gray-500" />
                  </button>
                  <button className="p-2.5 rounded-full hover:bg-gray-100 transition-colors">
                    <HiHeart size={18} className="text-gray-500" />
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                {[1,2,3,4,5].map(s => (
                  <HiStar key={s} size={18} className={s <= stars ? 'text-yellow-500' : 'text-gray-200'} />
                ))}
                <span className="font-bold text-gray-700 text-sm mr-1">
                  {business.rating ? business.rating.toFixed(1) : '—'}
                </span>
              </div>
            </div>

            {business.description && (
              <div className="border-b border-gray-100 pb-8">
                <h3 className="text-lg font-bold text-gray-900 mb-3">درباره</h3>
                <p className="text-gray-500 leading-relaxed text-sm">{business.description}</p>
              </div>
            )}

            <div>
              <div className="flex items-center gap-2 mb-5">
                <HiStar size={20} className="text-yellow-500" />
                <span className="font-bold text-gray-900">
                  {business.rating ? business.rating.toFixed(1) : '—'}
                </span>
                <span className="text-gray-400 text-sm">· نظرات کاربران</span>
              </div>
              <div className="border border-dashed border-gray-200 rounded-3xl p-10 text-center">
                <p className="text-3xl mb-3">💬</p>
                <p className="font-semibold text-gray-700 mb-1">هنوز نظری ثبت نشده</p>
                <p className="text-xs text-gray-400">اولین نفری باش که نظر میدی!</p>
                <button
                  className="mt-5 text-white px-7 py-3 rounded-2xl text-sm font-bold hover:opacity-90 transition-opacity"
                  style={{ background: 'linear-gradient(135deg, #5B21B6, #7C3AED)' }}
                >
                  نظر بنویس
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div>
            <div className="sticky top-24 border border-gray-200 rounded-3xl p-6 space-y-5 shadow-sm">

              {business.rating && (
                <div className="flex items-center gap-1.5 pb-4 border-b border-gray-100">
                  <HiStar size={16} className="text-yellow-500" />
                  <span className="font-bold text-gray-800 text-sm">{business.rating.toFixed(1)}</span>
                  <span className="text-gray-400 text-xs">امتیاز</span>
                </div>
              )}

              {business.address && (
                <div className="flex gap-3 items-start">
                  <HiLocationMarker size={17} className="text-gray-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-400 mb-0.5">آدرس</p>
                    <p className="text-sm text-gray-700 font-medium">{business.address}</p>
                  </div>
                </div>
              )}

              {business.phone && (
                <div className="flex gap-3 items-start">
                  <HiPhone size={17} className="text-gray-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-400 mb-0.5">تلفن</p>
                    <a href={`tel:${business.phone}`} className="text-sm font-medium text-purple-600 hover:underline">{business.phone}</a>
                  </div>
                </div>
              )}

              <div className="pt-2 space-y-2.5">
                <button
                  className="w-full text-white py-3.5 rounded-2xl font-bold text-sm hover:opacity-90 transition-opacity"
                  style={{ background: 'linear-gradient(135deg, #5B21B6, #7C3AED)' }}
                >
                  ✍️ نظر بنویس
                </button>
                <button className="w-full border border-gray-200 py-3.5 rounded-2xl font-semibold text-sm text-gray-600 hover:bg-gray-50 transition-colors">
                  🔗 اشتراک‌گذاری
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
