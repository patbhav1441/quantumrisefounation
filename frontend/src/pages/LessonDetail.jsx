import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ChevronLeft, Send, Loader, BookOpen } from 'lucide-react'

export default function LessonDetail() {
  const { lessonId } = useParams()
  const navigate = useNavigate()
  const [lesson, setLesson] = useState(null)
  const [progress, setProgress] = useState(0)
  const [activeTab, setActiveTab] = useState('content')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchLesson()
  }, [lessonId])

  const fetchLesson = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`http://localhost:5000/api/lessons/${lessonId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await response.json()
      if (response.ok) {
        setLesson(data.lesson)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleProgressUpdate = (newProgress) => {
    setProgress(newProgress)
    // Save to backend
  }

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center">
        <Loader className="animate-spin" size={48} />
      </div>
    )
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-900">
      {/* Header */}
      <div className="bg-slate-800 border-b border-slate-700 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-4">
          <button onClick={() => navigate('/lessons')} className="p-2 hover:bg-slate-700 rounded">
            <ChevronLeft size={24} />
          </button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">{lesson?.title}</h1>
            <p className="text-slate-400">{lesson?.discipline} • {lesson?.level}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-slate-400">Progress</p>
            <p className="text-2xl font-bold text-blue-400">{progress}%</p>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="h-1 bg-slate-800">
        <div
          className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tabs */}
            <div className="flex gap-4 border-b border-slate-700">
              {['content', 'exercises', 'discussion'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 border-b-2 transition ${
                    activeTab === tab
                      ? 'border-blue-500 text-blue-400'
                      : 'border-transparent text-slate-400'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            {/* Content Tab */}
            {activeTab === 'content' && (
              <div className="bg-slate-800 rounded-lg border border-slate-700 p-8 space-y-6">
                <div className="prose prose-invert max-w-none">
                  <h2 className="text-2xl font-bold mb-4">Lesson Content</h2>
                  <p className="text-slate-300 mb-6">{lesson?.description}</p>
                  
                  {/* Sample lesson content */}
                  <div className="bg-slate-700 p-6 rounded-lg my-6">
                    <h3 className="text-xl font-semibold mb-4">Key Concepts</h3>
                    <ul className="space-y-2 text-slate-300">
                      <li>• Understanding fundamental principles</li>
                      <li>• Applying concepts to real-world scenarios</li>
                      <li>• Problem-solving strategies</li>
                      <li>• Advanced techniques and tips</li>
                    </ul>
                  </div>

                  <div className="flex gap-4 mt-8">
                    <button
                      onClick={() => handleProgressUpdate(50)}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg font-semibold transition"
                    >
                      Mark as 50% Complete
                    </button>
                    <button
                      onClick={() => handleProgressUpdate(100)}
                      className="flex-1 bg-green-600 hover:bg-green-700 px-6 py-2 rounded-lg font-semibold transition"
                    >
                      Complete Lesson
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Exercises Tab */}
            {activeTab === 'exercises' && (
              <div className="space-y-4">
                {[1, 2, 3].map(ex => (
                  <ExerciseCard key={ex} number={ex} />
                ))}
              </div>
            )}

            {/* Discussion Tab */}
            {activeTab === 'discussion' && (
              <DiscussionSection />
            )}
          </div>

          {/* AI Tutor Sidebar */}
          <div className="lg:col-span-1">
            <AiTutorChat lessonId={lessonId} />
          </div>
        </div>
      </div>
    </div>
  )
}

function ExerciseCard({ number }) {
  return (
    <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
      <h3 className="text-lg font-semibold mb-3">Exercise {number}</h3>
      <p className="text-slate-300 mb-4">Solve this problem based on the lesson content</p>
      <div className="bg-slate-700 p-4 rounded mb-4">
        <p>Problem {number}: [Exercise content goes here]</p>
      </div>
      <div className="space-y-2">
        <input
          type="text"
          placeholder="Enter your answer..."
          className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
        />
        <button className="w-full bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded font-semibold transition">
          Submit Answer
        </button>
      </div>
    </div>
  )
}

function DiscussionSection() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')

  return (
    <div className="bg-slate-800 rounded-lg border border-slate-700 p-6 space-y-4">
      <h3 className="text-lg font-semibold">Discussion</h3>
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {messages.length === 0 && (
          <p className="text-slate-400 text-center py-8">No messages yet. Start the conversation!</p>
        )}
        {messages.map((msg, idx) => (
          <div key={idx} className="bg-slate-700 p-3 rounded">
            <p className="font-semibold text-sm">{msg.author}</p>
            <p className="text-sm text-slate-300">{msg.text}</p>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question..."
          className="flex-1 bg-slate-700 border border-slate-600 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
        />
        <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded transition">
          <Send size={20} />
        </button>
      </div>
    </div>
  )
}

function AiTutorChat({ lessonId }) {
  const [messages, setMessages] = useState([
    { role: 'assistant', text: 'Hi! 👋 I\'m your AI tutor powered by OpenAI. I\'m here to help you understand this lesson. What would you like to know?' }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage = { role: 'user', text: input }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:5000/api/tutor/ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          question: input, 
          lessonId,
          conversationHistory: messages
        })
      })

      const data = await response.json()
      if (response.ok) {
        setMessages(prev => [...prev, { role: 'assistant', text: data.response.answer }])
      } else {
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          text: `Error: ${data.message || 'Failed to get response'}` 
        }])
      }
    } catch (err) {
      console.error(err)
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        text: 'Sorry, I encountered an error. Please try again.' 
      }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-slate-800 rounded-lg border border-slate-700 p-6 flex flex-col h-[600px]">
      <div className="flex items-center gap-2 mb-4 pb-4 border-b border-slate-700">
        <BookOpen size={24} className="text-blue-400" />
        <h3 className="text-lg font-semibold">AI Tutor</h3>
      </div>

      {/* Messages */}
      <div className="flex-1 space-y-4 overflow-y-auto mb-4">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-xs px-4 py-2 rounded-lg ${
                msg.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-700 text-slate-100'
              }`}
            >
              <p className="text-sm">{msg.text}</p>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-slate-700 px-4 py-2 rounded-lg">
              <Loader className="animate-spin text-blue-400" size={20} />
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <form onSubmit={handleSendMessage} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={loading}
          placeholder="Ask me anything..."
          className="flex-1 bg-slate-700 border border-slate-600 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 p-2 rounded transition"
        >
          <Send size={20} />
        </button>
      </form>
    </div>
  )
}
