import React, { useState, useEffect } from 'react'
import { Award, Zap, Book, Target } from 'lucide-react'

export default function Dashboard({ user }) {
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUserData()
  }, [])

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:5000/api/user/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const data = await response.json()
      if (response.ok) {
        setUserData(data)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center">
        <p>Loading your dashboard...</p>
      </div>
    )
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-900 py-12 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 rounded-lg">
          <h1 className="text-4xl font-bold mb-2">Welcome back, {user?.name || 'Student'}!</h1>
          <p className="text-lg opacity-90">Keep learning and growing your knowledge</p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-6">
          <StatCard
            icon={<Zap size={32} />}
            title="Total XP"
            value={userData?.totalXP || 0}
            color="from-blue-500"
          />
          <StatCard
            icon={<Award size={32} />}
            title="Badges Earned"
            value={userData?.badges?.length || 0}
            color="from-purple-500"
          />
          <StatCard
            icon={<Book size={32} />}
            title="Lessons Completed"
            value={userData?.lessonsCompleted || 0}
            color="from-pink-500"
          />
          <StatCard
            icon={<Target size={32} />}
            title="Current Streak"
            value={`${userData?.streak || 0} days`}
            color="from-green-500"
          />
        </div>

        {/* Progress Section */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-slate-800 rounded-lg border border-slate-700 p-8">
            <h2 className="text-2xl font-bold mb-6">Your Disciplines</h2>
            <div className="space-y-4">
              {[
                { name: 'Mathematics', progress: 65 },
                { name: 'Physics', progress: 45 },
                { name: 'Computer Science', progress: 80 },
                { name: 'Engineering', progress: 35 },
                { name: 'Electronics', progress: 55 }
              ].map((discipline, idx) => (
                <div key={idx}>
                  <div className="flex justify-between mb-2">
                    <span>{discipline.name}</span>
                    <span className="text-blue-400">{discipline.progress}%</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                      style={{ width: `${discipline.progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-800 rounded-lg border border-slate-700 p-8">
            <h2 className="text-2xl font-bold mb-6">Recent Achievements</h2>
            <div className="space-y-4">
              {[
                { badge: '🌟', title: 'First Steps', desc: 'Completed first lesson' },
                { badge: '⚡', title: 'Quick Learner', desc: 'Completed 5 lessons' },
                { badge: '🎯', title: 'Focused', desc: '7 day streak' },
                { badge: '🏆', title: 'Champion', desc: '100 XP earned' }
              ].map((achievement, idx) => (
                <div key={idx} className="flex items-center gap-4 p-3 bg-slate-700 rounded">
                  <span className="text-3xl">{achievement.badge}</span>
                  <div>
                    <p className="font-semibold">{achievement.title}</p>
                    <p className="text-sm text-slate-400">{achievement.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-slate-800 rounded-lg border border-slate-700 p-8">
          <h2 className="text-2xl font-bold mb-6">Continue Learning</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <button className="bg-slate-700 p-4 rounded-lg hover:bg-blue-600 transition text-left">
              <p className="font-semibold">Advanced Algebra</p>
              <p className="text-sm text-slate-400">Mathematics • 45% complete</p>
            </button>
            <button className="bg-slate-700 p-4 rounded-lg hover:bg-blue-600 transition text-left">
              <p className="font-semibold">Circuit Design</p>
              <p className="text-sm text-slate-400">Electronics • 20% complete</p>
            </button>
            <button className="bg-slate-700 p-4 rounded-lg hover:bg-blue-600 transition text-left">
              <p className="font-semibold">Web Development</p>
              <p className="text-sm text-slate-400">Computer Science • 60% complete</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function StatCard({ icon, title, value, color }) {
  return (
    <div className={`bg-gradient-to-br ${color} to-slate-700 rounded-lg p-6 border border-slate-600`}>
      <div className="text-slate-300 mb-2">{icon}</div>
      <p className="text-slate-300 text-sm">{title}</p>
      <p className="text-3xl font-bold mt-2">{value}</p>
    </div>
  )
}
