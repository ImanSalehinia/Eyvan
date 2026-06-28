export default function BusinessMap({ address, name }) {
  if (!address) return null

  const query = encodeURIComponent(`${name}, ${address}`)
  const src = `https://www.openstreetmap.org/export/embed.html?bbox=-0.5,51.2,0.3,51.7&layer=mapnik&marker=51.5,-0.1&query=${query}`
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`

  return (
    <div className="rounded-2xl overflow-hidden border border-gray-100">
      <iframe
        title="map"
        width="100%"
        height="200"
        src={`https://maps.google.com/maps?q=${encodeURIComponent(address)}&output=embed&z=15`}
        style={{ border: 0, display: 'block' }}
        loading="lazy"
      />
      <a
        href={mapsUrl}
        target="_blank"
        rel="noreferrer"
        className="flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold text-purple-600 hover:bg-gray-50 transition-colors border-t border-gray-100"
      >
        🗺️ باز کردن در Google Maps
      </a>
    </div>
  )
}
