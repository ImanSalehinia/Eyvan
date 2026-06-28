import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../lib/AuthContext'

const categories = ['رستوران', 'سوپرمارکت', 'پزشک', 'وکیل', 'آرایشگاه', 'مدرسه', 'رویدادها', 'سایر']
const cities = ['London', 'Manchester', 'Birmingham', 'Leeds', 'Glasgow', 'Liverpool', 'Bristol', 'Edinburgh']

export default function AddBusiness() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)

  const [form, setForm] = useState({
    name: '',
    category: '',
    city: '',
    address: '',
    phone: '',
    description: '',
  })

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!user) { navigate('/login'); return }

    setLoading(true)
    setError(null)

    let image_url = null

    if (imageFile) {
      const ext = imageFile.name.split('.').pop()
      const fileName = `${user.id}_${Date.now()}.${ext}`
      const { error: uploadError } = await supabase.storage
        .from('business-images')
        .upload(fileName, imageFile)

      if (uploadError) {
        setError('خطا در آپلود عکس: ' + uploadError.message)
        setLoading(false)
        return
      }

      const { data } = supabase.storage.from('business-images').getPublicUrl(fileName)
      image_url = data.publicUrl
    }

    const { error } = await supabase.from('businesses').insert({
      ...form,
      image_url,
      user_id: user.id,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      navigate('/businesses')
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">ثبت کسب‌وکار</h1>

      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">عکس کسب‌وکار</label>
          <div
            onClick={() => document.getElementById('imageInput').click()}
            className="border-2 border-dashed border-gray-200 rounded-xl h-40 flex items-center justify-center cursor-pointer hover:border-red-300 overflow-hidden"
          >
            {imagePreview
              ? <img src={imagePreview} alt="preview" className="w-full h-full object-cover" />
              : <div className="text-center text-gray-400">
                  <p className="text-3xl mb-1">📷</p>
                  <p className="text-sm">کلیک کن تا عکس انتخاب کنی</p>
                </div>
            }
          </div>
          <input
            id="imageInput"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">نام کسب‌وکار *</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            placeholder="مثلاً: رستوران تهران"
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-red-400"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">دسته‌بندی *</label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              required
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-red-400"
            >
              <option value="">انتخاب کن</option>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">شهر *</label>
            <select
              name="city"
              value={form.city}
              onChange={handleChange}
              required
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-red-400"
            >
              <option value="">انتخاب کن</option>
              {cities.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">آدرس *</label>
          <input
            name="address"
            value={form.address}
            onChange={handleChange}
            required
            placeholder="مثلاً: 12 Oxford St, London"
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-red-400"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">شماره تلفن</label>
          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="+44 20 1234 5678"
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-red-400"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">توضیحات</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={3}
            placeholder="کسب‌وکارت رو معرفی کن..."
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-red-400 resize-none"
          />
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-red-600 text-white py-2.5 rounded-lg font-medium hover:bg-red-700 disabled:opacity-50"
          >
            {loading ? 'در حال ثبت...' : 'ثبت کسب‌وکار'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/businesses')}
            className="px-6 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50"
          >
            انصراف
          </button>
        </div>
      </form>
    </div>
  )
}
