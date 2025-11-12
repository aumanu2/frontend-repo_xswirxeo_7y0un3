import { useEffect, useState } from 'react'
import Hero from './components/Hero'
import SwipeDeck from './components/SwipeDeck'
import Dashboard from './components/Dashboard'

const post = (path, body) => fetch(`${import.meta.env.VITE_BACKEND_URL}${path}`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(body)
}).then(r => r.json())

export default function App() {
  const [user, setUser] = useState(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    // Create a demo user on first load
    const stored = localStorage.getItem('skillswap_user')
    if (stored) {
      setUser(JSON.parse(stored))
      setReady(true)
      return
    }
    const demo = {
      name: 'Alex Student',
      email: `alex${Math.floor(Math.random()*10000)}@skillswap.dev`,
      bio: 'Curious learner and part-time tutor',
      teach_skills: ['Python', 'Algebra', 'Study Habits'],
      learn_skills: ['Design', 'Public Speaking'],
      location: 'Remote',
      availability: 'Evenings & Weekends'
    }
    post('/api/users', demo).then(u => {
      localStorage.setItem('skillswap_user', JSON.stringify(u))
      setUser(u)
      setReady(true)
    })
  }, [])

  if (!ready) return <div className="min-h-screen bg-black text-white flex items-center justify-center">Loading SkillSwap…</div>

  return (
    <div className="bg-black min-h-screen text-white">
      <nav className="sticky top-0 z-50 backdrop-blur bg-black/70 border-b border-zinc-900">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-orange-500 animate-pulse" />
            <span className="font-bold">SkillSwap</span>
          </div>
          <div className="text-sm text-orange-300">SkillCoins: {user?.skillcoins ?? 0}</div>
        </div>
      </nav>
      <Hero />
      <section className="bg-black py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-2xl font-bold mb-6">Recommended for you</h2>
          <SwipeDeck user={user} />
        </div>
      </section>
      <Dashboard user={user} />
      <footer className="border-t border-zinc-900 py-10 text-center text-gray-500 bg-black">
        Built with ❤️ for curious learners. Neon orange + matte black forever.
      </footer>
    </div>
  )
}
