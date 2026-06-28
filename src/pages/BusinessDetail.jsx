import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { HiStar, HiLocationMarker, HiPhone, HiArrowRight, HiShare, HiHeart } from 'react-icons/hi'
import { supabase } from '../lib/supabase'
import { useAuth } from '../lib/AuthContext'
import BusinessMap from '../components/BusinessMap'

function ReviewForm({ businessId, onSubmitted, userReview }) {
  const { user } = useAuth()
  const [rating, setRating] = useState(0)
  const [hovered, setHovered] = useState(0)
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  if (userReview) return (
    <div className="border border-green-100 bg-green-50 rounded-3xl p-6">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-green-600 text-sm font-bold">✓ نظر تو ثبت شده</span>
      </div>
      <div className="flex mb-2">
        {[1,2,3,4,5].map(s => (
          <HiStar key={s} size={18} className={s <= userReview.rating ? 'text-yellow-400' : 'text-gray-200'} />
        ))}
      </div>
      {userReview.comment && <p className="text-sm text-gray-600">{userReview.comment}</p>}
    </div>
  )

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!rating) { setError('لطفاً امتیاز بده'); return }
    setLoading(true)
    setError(null)

    const { error } = await supabase.from('reviews').insert({
      business_id: businessId,
      user_id: user.id,
      rating,
      comment,
    })

    if (error) {
      if (error.code === '23505') setError('قبلاً برای این کسب‌وکار نظر دادی')
      else setError(error.message)
    } else {
      setRating(0)
      setComment('')
      onSubmitted()
    }
    setLoading(false)
  }

  if (!user) return (
    <div className="border border-dashed border-gray-200 rounded-3xl p-8 text-center">
      <p className="text-3xl mb-3">💬</p>
      <p className="font-semibold text-gray-700 mb-1">نظر بده</p>
      <p className="text-xs text-gray-400 mb-4">برای نوشتن نظر وارد شو</p>
      <Link to="/login" className="text-white px-6 py-2.5 rounded-xl text-sm font-bold inline-block hover:opacity-90"
        style={{ background: 'linear-gradient(135deg, #5B21B6, #7C3AED)' }}>
        ورود به حساب
      </Link>
    </div>
  )

  return (
    <form onSubmit={handleSubmit} className="border border-gray-200 rounded-3xl p-6 space-y-4">
      <h4 className="font-bold text-gray-800">نظر خودت رو بنویس</h4>

      {/* Star selector */}
      <div>
        <p className="text-sm text-gray-500 mb-2">امتیاز</p>
        <div className="flex gap-1">
          {[1,2,3,4,5].map(s => (
            <button
              key={s}
              type="button"
              onClick={() => setRating(s)}
              onMouseEnter={() => setHovered(s)}
              onMouseLeave={() => setHovered(0)}
            >
              <HiStar size={32}
                className={`transition-colors ${s <= (hovered || rating) ? 'text-yellow-400' : 'text-gray-200'}`} />
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-sm text-gray-500 mb-2">توضیحات (اختیاری)</p>
        <textarea
          value={comment}
          onChange={e => setComment(e.target.value)}
          rows={3}
          placeholder="تجربه‌ات رو بنویس..."
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-purple-400 resize-none"
        />
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="text-white px-6 py-3 rounded-xl text-sm font-bold hover:opacity-90 disabled:opacity-50 transition-opacity"
        style={{ background: 'linear-gradient(135deg, #5B21B6, #7C3AED)' }}
      >
        {loading ? 'در حال ثبت...' : 'ثبت نظر'}
      </button>
    </form>
  )
}

function ReviewCard({ review }) {
  const date = new Date(review.created_at).toLocaleDateString('fa-IR')
  return (
    <div className="border-b border-gray-100 pb-5 last:border-0">
      <div className="flex items-center justify-between mb-2">
        <div className="flex">
          {[1,2,3,4,5].map(s => (
            <HiStar key={s} size={15}
              className={s <= review.rating ? 'text-yellow-400' : 'text-gray-200'} />
          ))}
        </div>
        <span className="text-xs text-gray-400">{date}</span>
      </div>
      {review.comment && (
        <p className="text-sm text-gray-600 leading-relaxed">{review.comment}</p>
      )}
    </div>
  )
}

export default function BusinessDetail() {
  const { id } = useParams()
  const { user } = useAuth()
  const [business, setBusiness] = useState(null)
  const [reviews, setReviews] = useState([])
  const [userReview, setUserReview] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    const [{ data: biz }, { data: revs }] = await Promise.all([
      supabase.from('businesses').select('*').eq('id', id).single(),
      supabase.from('reviews').select('*').eq('business_id', id).order('created_at', { ascending: false }),
    ])
    setBusiness(biz)
    setReviews(revs || [])
    if (user) {
      const found = (revs || []).find(r => r.user_id === user.id)
      setUserReview(found || null)
    }
    setLoading(false)
  }

  useEffect(() => { fetchData() }, [id, user])

  const avgRating = reviews.length
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : null

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

  const stars = Math.round(avgRating || business.rating || 0)

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-5xl mx-auto px-6 py-6">

        <Link to="/businesses" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-gray-700 mb-5 transition-colors font-medium">
          <HiArrowRight size={15} /> برگشت
        </Link>

        {/* Cover */}
        <div className="grid grid-cols-2 gap-2 mb-8 rounded-3xl overflow-hidden h-72">
          <div className="bg-gray-100 h-full">
            {business.image_url
              ? <img src={business.image_url} alt={business.name} className="w-full h-full object-cover" />
              : <div className="w-full h-full flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, #1E0A3C, #4C1D95)' }}>
                  <span className="text-8xl opacity-10">🏢</span>
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="md:col-span-2 space-y-8">

            {/* Header */}
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
                    <HiShare size={18} className="text-gray-400" />
                  </button>
                  <button className="p-2.5 rounded-full hover:bg-gray-100 transition-colors">
                    <HiHeart size={18} className="text-gray-400" />
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                {[1,2,3,4,5].map(s => (
                  <HiStar key={s} size={18} className={s <= stars ? 'text-yellow-500' : 'text-gray-200'} />
                ))}
                {avgRating && <span className="font-bold text-gray-700 text-sm mr-1">{avgRating}</span>}
                <span className="text-gray-400 text-sm">({reviews.length} نظر)</span>
              </div>
            </div>

            {/* Description */}
            {business.description && (
              <div className="border-b border-gray-100 pb-8">
                <h3 className="text-lg font-bold text-gray-900 mb-3">درباره</h3>
                <p className="text-gray-500 leading-relaxed text-sm">{business.description}</p>
              </div>
            )}

            {/* Reviews */}
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <HiStar size={20} className="text-yellow-500" />
                <span className="font-bold text-gray-900">
                  {avgRating || '—'}
                </span>
                <span className="text-gray-400 text-sm">· {reviews.length} نظر</span>
              </div>

              {reviews.length > 0 && (
                <div className="space-y-5 mb-6">
                  {reviews.map(r => <ReviewCard key={r.id} review={r} />)}
                </div>
              )}

              <ReviewForm businessId={Number(id)} onSubmitted={fetchData} userReview={userReview} />
            </div>
          </div>

          {/* Sidebar */}
          <div>
            <div className="sticky top-24 border border-gray-200 rounded-3xl p-6 space-y-5 shadow-sm">
              {avgRating && (
                <div className="flex items-center gap-1.5 pb-4 border-b border-gray-100">
                  <HiStar size={16} className="text-yellow-500" />
                  <span className="font-bold text-gray-800 text-sm">{avgRating}</span>
                  <span className="text-gray-400 text-xs">از ۵ · {reviews.length} نظر</span>
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

              <BusinessMap address={business.address} name={business.name} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
