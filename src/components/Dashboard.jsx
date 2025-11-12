import { useEffect, useState } from 'react'

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

export default function Dashboard({ user }) {
  const [matches, setMatches] = useState([])
  const [balance, setBalance] = useState(0)

  useEffect(() => {
    if (!user?.id) return
    api('/api/matches', { user_id: user.id }).then(setMatches)
    api('/api/skillcoins', { user_id: user.id }).then((d) => setBalance(d.balance))
  }, [user])

  const schedule = async (matchId) => {
    await post('/api/sessions', { match_id: matchId, mode: 'chat' })
    alert('Session scheduled!')
  }

  return (
    <div className="bg-black text-white py-16" id="get-started">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold">Your Dashboard</h2>
          <div className="rounded-full bg-orange-500/20 text-orange-300 px-4 py-2">SkillCoins: <span className="font-semibold text-orange-400">{balance}</span></div>
        </div>
        <div className="mt-10 grid md:grid-cols-2 gap-6">
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-6">
            <h3 className="text-xl font-semibold mb-4">Your Matches</h3>
            <div className="space-y-4">
              {matches.length === 0 && <div className="text-gray-400">No matches yet. Keep swiping!</div>}
              {matches.map(m => (
                <div key={m.id} className="flex items-center justify-between bg-zinc-900 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <img src={m.other?.avatar_url || `https://api.dicebear.com/7.x/identicon/svg?seed=${m.other?.name}` } className="w-10 h-10 rounded-full" />
                    <div>
                      <div className="font-medium">{m.other?.name}</div>
                      <div className="text-sm text-gray-400">Wants to learn: {(m.other?.learn_skills||[]).slice(0,3).join(', ')}</div>
                    </div>
                  </div>
                  <button onClick={() => schedule(m.id)} className="px-3 py-2 rounded-md bg-orange-500 text-black font-semibold">Start chat</button>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-6" id="how-it-works">
            <h3 className="text-xl font-semibold mb-4">How it works</h3>
            <ol className="list-decimal list-inside space-y-2 text-gray-300">
              <li>Create your profile: add what you can teach and want to learn.</li>
              <li>Swipe through recommendations based on mutual interests.</li>
              <li>Match, chat or start a quick call, and schedule sessions.</li>
              <li>Earn SkillCoins for every completed session and level up.</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  )
}
