import React, { useState } from 'react'
import { Users, BookOpen, Settings, BarChart3 } from 'lucide-react'

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState('overview')

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-900 py-12 px-4">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-slate-400">Manage users, content, and platform analytics</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 border-b border-slate-700">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'users', label: 'Users', icon: Users },
            { id: 'lessons', label: 'Lessons', icon: BookOpen },
            { id: 'settings', label: 'Settings', icon: Settings }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 font-semibold border-b-2 transition ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-slate-400 hover:text-slate-300'
              }`}
            >
              <tab.icon size={20} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="grid md:grid-cols-4 gap-6">
            <StatBox title="Total Users" value="1,234" change="+12%" />
            <StatBox title="Active Users" value="567" change="+8%" />
            <StatBox title="Lessons Created" value="24" change="0%" />
            <StatBox title="Avg Completion" value="72%" change="+5%" />
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
            <h2 className="text-2xl font-bold mb-6">User Management</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="text-left py-3 px-4">Name</th>
                    <th className="text-left py-3 px-4">Email</th>
                    <th className="text-left py-3 px-4">Joined</th>
                    <th className="text-left py-3 px-4">Status</th>
                    <th className="text-left py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { name: 'John Doe', email: 'john@example.com', joined: '2024-01-15', status: 'Active' },
                    { name: 'Jane Smith', email: 'jane@example.com', joined: '2024-02-20', status: 'Active' },
                    { name: 'Bob Johnson', email: 'bob@example.com', joined: '2024-03-10', status: 'Inactive' },
                  ].map((user, idx) => (
                    <tr key={idx} className="border-b border-slate-700">
                      <td className="py-3 px-4">{user.name}</td>
                      <td className="py-3 px-4">{user.email}</td>
                      <td className="py-3 px-4 text-slate-400">{user.joined}</td>
                      <td className="py-3 px-4">
                        <span className={`px-3 py-1 rounded text-sm ${
                          user.status === 'Active' ? 'bg-green-500 bg-opacity-20 text-green-400' : 'bg-slate-700 text-slate-400'
                        }`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <button className="text-blue-400 hover:text-blue-300 text-sm">Edit</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Lessons Tab */}
        {activeTab === 'lessons' && (
          <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Lesson Management</h2>
              <button className="px-6 py-2 bg-blue-600 rounded-lg font-semibold hover:bg-blue-700">
                Create Lesson
              </button>
            </div>
            <div className="space-y-4">
              {[
                { title: 'Algebra Basics', discipline: 'Mathematics', lessons: 5 },
                { title: 'Python Basics', discipline: 'Computer Science', lessons: 8 },
                { title: 'Force and Motion', discipline: 'Physics', lessons: 4 },
              ].map((course, idx) => (
                <div key={idx} className="bg-slate-700 p-4 rounded-lg flex justify-between items-center">
                  <div>
                    <p className="font-semibold">{course.title}</p>
                    <p className="text-sm text-slate-400">{course.discipline} • {course.lessons} lessons</p>
                  </div>
                  <button className="text-blue-400 hover:text-blue-300">Edit</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
            <h2 className="text-2xl font-bold mb-6">Platform Settings</h2>
            <div className="space-y-4 max-w-2xl">
              <SettingItem label="Platform Name" value="Quantum Rise Foundation" />
              <SettingItem label="Max Students per Lesson" value="50" />
              <SettingItem label="XP Multiplier" value="1.0x" />
              <SettingItem label="API Key (Claude)" value="••••••••••••••••" masked />
              <button className="w-full bg-blue-600 rounded-lg font-semibold py-2 hover:bg-blue-700 mt-6">
                Save Changes
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function StatBox({ title, value, change }) {
  return (
    <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
      <p className="text-slate-400 text-sm mb-2">{title}</p>
      <p className="text-3xl font-bold mb-2">{value}</p>
      <p className="text-green-400 text-sm">{change}</p>
    </div>
  )
}

function SettingItem({ label, value, masked }) {
  return (
    <div className="border-b border-slate-700 pb-4">
      <label className="block text-sm font-medium mb-2">{label}</label>
      <input
        type={masked ? 'password' : 'text'}
        defaultValue={value}
        className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
      />
    </div>
  )
}
