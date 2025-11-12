import { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion'

const api = (path, params = {}) => {
  const url = new URL(`${import.meta.env.VITE_BACKEND_URL}${path}`)
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v))
  return fetch(url.toString()).then(r => r.json())
}

const post = (path, body) => fetch(`${import.meta.env.VITE_BACKEND_URL}${path}`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(body)
}).then(r => r.json())

function Card({ profile, onSwipe }) {
  const x = useMotionValue(0)
  const rotate = useTransform(x, [-200, 200], [-15, 15])
  const opacity = useTransform(x, [-200, 0, 200], [0.4, 1, 0.4])

  const handleDragEnd = (event, info) => {
    const threshold = 150
    if (info.offset.x > threshold) onSwipe('like', profile)
    else if (info.offset.x < -threshold) onSwipe('pass', profile)
  }

  return (
    <motion.div
      className="absolute w-full h-full bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden"
      style={{ x, rotate, opacity }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
    >
      <div className="h-48 bg-gradient-to-br from-orange-500/30 to-orange-400/10" />
      <div className="p-5">
        <div className="flex items-center gap-4">
          <img src={profile.avatar_url || `https://api.dicebear.com/7.x/identicon/svg?seed=${profile.name}`} alt="avatar" className="w-14 h-14 rounded-full" />
          <div>
            <h3 className="text-xl font-semibold text-white">{profile.name}</h3>
            <p className="text-sm text-gray-400">{profile.location || 'Somewhere on Earth'}</p>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-400">Can teach</p>
            <div className="mt-1 flex flex-wrap gap-2">
              {profile.teach_skills?.map((s, i) => (
                <span key={i} className="px-2 py-1 rounded-full bg-orange-500/20 text-orange-300">{s}</span>
              ))}
            </div>
          </div>
          <div>
            <p className="text-gray-400">Wants to learn</p>
            <div className="mt-1 flex flex-wrap gap-2">
              {profile.learn_skills?.map((s, i) => (
                <span key={i} className="px-2 py-1 rounded-full bg-zinc-800 text-gray-200">{s}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default function SwipeDeck({ user }) {
  const [deck, setDeck] = useState([])
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (!user?.id) return
    api('/api/recommendations', { user_id: user.id }).then(setDeck)
  }, [user])

  const current = useMemo(() => deck[index], [deck, index])

  const handleSwipe = async (action, profile) => {
    if (!profile) return
    await post('/api/swipe', { user_id: user.id, target_id: profile.id, action })
    setIndex(i => i + 1)
  }

  if (!current) {
    return (
      <div className="text-center text-gray-400 py-16">No more recommendations for now ✨</div>
    )
  }

  const next = deck[index + 1]

  return (
    <div className="relative w-full max-w-md h-[520px] mx-auto">
      <AnimatePresence>
        {next && (
          <motion.div className="absolute w-full h-full rounded-2xl bg-zinc-950 border border-zinc-800" initial={{ scale: 0.95, y: 10, opacity: 0.5 }} animate={{ scale: 0.95, y: 10, opacity: 0.6 }} />
        )}
      </AnimatePresence>
      <Card key={current.id} profile={current} onSwipe={handleSwipe} />
      <div className="absolute -bottom-16 left-0 right-0 flex items-center justify-center gap-4">
        <button onClick={() => handleSwipe('pass', current)} className="px-5 py-3 rounded-full bg-zinc-900 border border-zinc-800 text-gray-200">Pass</button>
        <button onClick={() => handleSwipe('like', current)} className="px-5 py-3 rounded-full bg-orange-500 text-black font-semibold">Like</button>
      </div>
    </div>
  )
}
