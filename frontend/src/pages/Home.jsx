import React from 'react'
import { Link } from 'react-router-dom'
import { Zap, Brain, Users, Target, Sparkles } from 'lucide-react'

export default function Home() {
  const features = [
    {
      icon: <Brain size={32} />,
      title: 'AI-Powered Tutoring',
      description: 'Learn from our intelligent AI tutor powered by Claude API, available 24/7'
    },
    {
      icon: <Zap size={32} />,
      title: 'Interactive Lessons',
      description: 'Engage with 20+ dynamic lessons across 5 core disciplines with hands-on simulations'
    },
    {
      icon: <Target size={32} />,
      title: 'Gamified Learning',
      description: 'Earn XP, unlock badges, and track your progress with our reward system'
    },
    {
      icon: <Users size={32} />,
      title: 'Collaborative Learning',
      description: 'Connect with peers, share knowledge, and learn together in a supportive community'
    },
    {
      icon: <Sparkles size={32} />,
      title: 'Personalized Paths',
      description: 'Custom learning paths adapted to your pace and learning style'
    },
    {
      icon: <Zap size={32} />,
      title: 'Real-World Projects',
      description: 'Apply your knowledge with Arduino and Raspberry Pi integration'
    }
  ]

  const disciplines = [
    { name: 'Mathematics', color: 'from-blue-500' },
    { name: 'Physics', color: 'from-purple-500' },
    { name: 'Computer Science', color: 'from-pink-500' },
    { name: 'Engineering', color: 'from-green-500' },
    { name: 'Electronics', color: 'from-yellow-500' }
  ]

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-slate-900 to-slate-800 py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Quantum Rise Foundation
          </h1>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            Empowering minds, shaping futures. A world-class educational platform featuring AI tutors, interactive simulations, and gamified learning.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              to="/signup"
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg font-semibold hover:opacity-90 transition transform hover:scale-105"
            >
              Get Started Free
            </Link>
            <Link
              to="/lessons"
              className="px-8 py-3 border border-blue-500 text-blue-400 rounded-lg font-semibold hover:bg-blue-500 hover:text-white transition"
            >
              Explore Lessons
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-slate-800">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">Why Choose Quantum Rise?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className="bg-slate-700 p-8 rounded-lg border border-slate-600 hover:border-blue-500 transition group"
              >
                <div className="text-blue-400 mb-4 group-hover:scale-110 transition">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-slate-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Disciplines Section */}
      <section className="py-16 px-4 bg-slate-900">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">5 Core Disciplines</h2>
          <div className="grid md:grid-cols-5 gap-6">
            {disciplines.map((discipline, idx) => (
              <div
                key={idx}
                className={`bg-gradient-to-br ${discipline.color} to-slate-700 p-8 rounded-lg text-center font-semibold text-lg hover:scale-105 transition cursor-pointer`}
              >
                {discipline.name}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-slate-800">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <h3 className="text-4xl font-bold text-blue-400">20+</h3>
              <p className="text-slate-300">Interactive Lessons</p>
            </div>
            <div>
              <h3 className="text-4xl font-bold text-purple-400">5</h3>
              <p className="text-slate-300">Core Disciplines</p>
            </div>
            <div>
              <h3 className="text-4xl font-bold text-pink-400">24/7</h3>
              <p className="text-slate-300">AI Tutoring</p>
            </div>
            <div>
              <h3 className="text-4xl font-bold text-green-400">∞</h3>
              <p className="text-slate-300">Learning Potential</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Transform Your Learning?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of students empowering their futures with Quantum Rise Foundation
          </p>
          <Link
            to="/signup"
            className="inline-block px-8 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:opacity-90 transition"
          >
            Start Your Journey
          </Link>
        </div>
      </section>
    </div>
  )
}
