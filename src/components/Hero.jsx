import Spline from '@splinetool/react-spline';

export default function Hero() {
  return (
    <section className="relative min-h-[80vh] bg-black text-white overflow-hidden">
      <div className="absolute inset-0">
        <Spline scene="https://prod.spline.design/xXD1hOqciVNtJX50/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      </div>
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-24">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-orange-500/20 text-orange-400 px-4 py-1.5 mb-6">
            <span className="h-2 w-2 rounded-full bg-orange-500 animate-pulse"></span>
            <span className="text-sm">AI-powered matching • Neon Orange • Matte Black</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight tracking-tight">
            SkillSwap
            <span className="block text-orange-500">Tinder for Learning</span>
          </h1>
          <p className="mt-4 text-lg text-gray-300">
            List skills you can teach and what you want to learn. Swipe to match, chat or hop on a call, and earn SkillCoins for every session.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <a href="#get-started" className="px-6 py-3 rounded-lg bg-orange-500 hover:bg-orange-600 text-black font-semibold transition-colors">Get Started</a>
            <a href="#how-it-works" className="px-6 py-3 rounded-lg border border-gray-700 hover:border-gray-500 text-white">How it works</a>
          </div>
        </div>
      </div>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,115,0,0.25),transparent_40%),radial-gradient(circle_at_80%_20%,rgba(255,115,0,0.15),transparent_40%)]" />
    </section>
  );
}
