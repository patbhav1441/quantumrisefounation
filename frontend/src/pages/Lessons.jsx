import React, { useState } from 'react'
import { Lock, Play, BookOpen } from 'lucide-react'

export default function Lessons() {
  const [selectedDiscipline, setSelectedDiscipline] = useState('all')

  const disciplines = ['all', 'Mathematics', 'Physics', 'Computer Science', 'Engineering', 'Electronics']

  const lessons = [
    { id: 1, title: 'Algebra Basics', discipline: 'Mathematics', level: 'Beginner', xp: 100, locked: false, progress: 60 },
    { id: 2, title: 'Advanced Equations', discipline: 'Mathematics', level: 'Intermediate', xp: 250, locked: false, progress: 40 },
    { id: 3, title: 'Calculus Fundamentals', discipline: 'Mathematics', level: 'Advanced', xp: 500, locked: true, progress: 0 },
    { id: 4, title: 'Force and Motion', discipline: 'Physics', level: 'Beginner', xp: 150, locked: false, progress: 75 },
    { id: 5, title: 'Quantum Mechanics', discipline: 'Physics', level: 'Advanced', xp: 600, locked: true, progress: 0 },
    { id: 6, title: 'Python Basics', discipline: 'Computer Science', level: 'Beginner', xp: 200, locked: false, progress: 100 },
    { id: 7, title: 'Web Development', discipline: 'Computer Science', level: 'Intermediate', xp: 350, locked: false, progress: 50 },
    { id: 8, title: 'Robotics Intro', discipline: 'Engineering', level: 'Beginner', xp: 180, locked: false, progress: 30 },
    { id: 9, title: 'Circuit Design', discipline: 'Electronics', level: 'Intermediate', xp: 280, locked: false, progress: 20 },
    { id: 10, title: 'Microcontrollers', discipline: 'Electronics', level: 'Advanced', xp: 450, locked: true, progress: 0 },
  ]

  const filteredLessons = selectedDiscipline === 'all'
    ? lessons
    : lessons.filter(l => l.discipline === selectedDiscipline)

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-900 py-12 px-4">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold mb-2">Interactive Lessons</h1>
          <p className="text-slate-400">Learn from our comprehensive collection of courses</p>
        </div>

        {/* Discipline Filter */}
        <div className="flex gap-2 flex-wrap">
          {disciplines.map(d => (
            <button
              key={d}
              onClick={() => setSelectedDiscipline(d)}
              className={`px-6 py-2 rounded-lg font-semibold transition ${
                selectedDiscipline === d
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {d.charAt(0).toUpperCase() + d.slice(1)}
            </button>
          ))}
        </div>

        {/* Lessons Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLessons.map(lesson => (
            <LessonCard key={lesson.id} lesson={lesson} />
          ))}
        </div>
      </div>
    </div>
  )
}

function LessonCard({ lesson }) {
  const getLevelColor = (level) => {
    switch (level) {
      case 'Beginner':
        return 'from-green-500'
      case 'Intermediate':
        return 'from-yellow-500'
      case 'Advanced':
        return 'from-red-500'
      default:
        return 'from-blue-500'
    }
  }

  return (
    <div className={`bg-slate-800 rounded-lg border border-slate-700 overflow-hidden hover:border-blue-500 transition group ${lesson.locked ? 'opacity-60' : ''}`}>
      <div className="p-6 space-y-4">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-semibold">{lesson.title}</h3>
            <p className="text-slate-400 text-sm">{lesson.discipline}</p>
          </div>
          {lesson.locked && <Lock size={24} className="text-slate-500" />}
        </div>

        {/* Level Badge */}
        <div className={`inline-block bg-gradient-to-r ${getLevelColor(lesson.level)} to-slate-700 px-3 py-1 rounded text-sm font-semibold`}>
          {lesson.level}
        </div>

        {/* Progress Bar */}
        {!lesson.locked && lesson.progress > 0 && (
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm text-slate-400">Progress</span>
              <span className="text-sm text-blue-400">{lesson.progress}%</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                style={{ width: `${lesson.progress}%` }}
              />
            </div>
          </div>
        )}

        {/* XP and Action */}
        <div className="flex justify-between items-center pt-4 border-t border-slate-700">
          <div className="flex items-center gap-2 text-blue-400">
            <BookOpen size={18} />
            <span className="font-semibold">{lesson.xp} XP</span>
          </div>
          <button
            disabled={lesson.locked}
            className={`px-4 py-2 rounded-lg font-semibold transition flex items-center gap-2 ${
              lesson.locked
                ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white group-hover:scale-105'
            }`}
          >
            <Play size={18} />
            {lesson.progress === 100 ? 'Review' : lesson.progress > 0 ? 'Continue' : 'Start'}
          </button>
        </div>
      </div>
    </div>
  )
}
