'use client'

import React, { useState, useRef, FormEvent, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import axios, { AxiosResponse } from 'axios'

export default function Home() {
  const [url, setUrl] = useState('https://example.com')
  const [history, setHistory] = useState<string[]>([url])
  const [current, setCurrent] = useState(0)
  const [bookmarks, setBookmarks] = useState<string[]>([])
  const [inputUrl, setInputUrl] = useState(url)
  const [aiResponse, setAiResponse] = useState('')
  const [showAiResponse, setShowAiResponse] = useState(false)
  const [error, setError] = useState('')
  const iframeRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    const storedBookmarks = localStorage.getItem('bookmarks')
    if (storedBookmarks) {
      setBookmarks(JSON.parse(storedBookmarks))
    }
  }, [])

  const navigate = (newUrl: string) => {
    let processedUrl = newUrl
    if (!newUrl.startsWith('http://') && !newUrl.startsWith('https://')) {
      processedUrl = `https://${newUrl}`
    }
    const updatedHistory = history.slice(0, current + 1)
    updatedHistory.push(processedUrl)
    setHistory(updatedHistory)
    setCurrent(updatedHistory.length - 1)
    setUrl(processedUrl)
    setError('')
  }

  const goBack = () => {
    if (current > 0) {
      setCurrent(current - 1)
      setUrl(history[current - 1])
    }
  }

  const goForward = () => {
    if (current < history.length - 1) {
      setCurrent(current + 1)
      setUrl(history[current + 1])
    }
  }

  const addBookmark = () => {
    if (!bookmarks.includes(url)) {
      const newBookmarks = [...bookmarks, url]
      setBookmarks(newBookmarks)
      localStorage.setItem('bookmarks', JSON.stringify(newBookmarks))
    }
  }

  const handleSearch = async (e: FormEvent) => {
    e.preventDefault()
    if (inputUrl.startsWith('@ai ')) {
      const userQuery = inputUrl.slice(4)
      try {
        const response: AxiosResponse<{ answer: string }> = await axios.post('/api/genai', { query: userQuery })
        setAiResponse(response.data.answer)
        setShowAiResponse(true)
      } catch (error: any) {
        console.error('Error fetching AI response:', error.response?.data || error.message)
        setAiResponse(`Failed to get AI response: ${error.response?.data?.error || error.message}`)
        setShowAiResponse(true)
      }
    } else {
      navigate(inputUrl)
    }
  }

  const closeAiResponse = () => {
    setShowAiResponse(false)
  }

  const handleIframeError = () => {
    setError('Unable to load the requested page. It may not allow embedding.')
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <div className="flex items-center p-4 bg-white shadow-md">
        <button onClick={goBack} className="p-2 mr-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
        </button>
        <button onClick={goForward} className="p-2 mr-4 text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
        <form onSubmit={handleSearch} className="flex-1">
          <input
            type="text"
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            placeholder="Enter URL or @ai query..."
            className="w-full p-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
        </form>
        <button onClick={addBookmark} className="ml-4 p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
          </svg>
        </button>
        <Link href="/bookmarks" className="ml-4 p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
          </svg>
        </Link>
      </div>
      {showAiResponse && aiResponse && (
        <div className="p-4 bg-blue-50 text-blue-800 relative animate-fadeIn">
          <button 
            onClick={closeAiResponse} 
            className="absolute top-2 right-2 text-blue-600 hover:text-blue-800 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
          {aiResponse}
        </div>
      )}
      {error && (
        <div className="p-4 bg-red-50 text-red-800 animate-fadeIn">
          {error}
        </div>
      )}
      <iframe 
        src={`/api/proxy?url=${encodeURIComponent(url)}`}
        ref={iframeRef} 
        className="flex-1 border-none" 
        onError={handleIframeError}
        sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
      />
      <footer className="flex flex-col items-center justify-center p-4 bg-gray-50">
        <h3 className="text-lg font-bold mb-2 text-gray-700">#Lucky100 Sponsors</h3>
        <div className="flex gap-4">
          <Link href="https://x.com/zalkazemi/" target="_blank" rel="noopener noreferrer" className="transition-transform hover:scale-105">
            <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-300 flex items-center justify-center shadow-md">
              <Image
                src="/images/z.jpg"
                alt="Sponsor 1"
                width={64}
                height={64}
                objectFit="cover"
                className="rounded-full"
              />
            </div>
          </Link>
          <Link href="https://x.com/jansgraphics" target="_blank" rel="noopener noreferrer" className="transition-transform hover:scale-105">
            <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-300 flex items-center justify-center shadow-md">
              <Image
                src="/images/jans.jpg"
                alt="jans"
                width={64}
                height={64}
                objectFit="cover"
                className="rounded-full"
              />
            </div>
          </Link>
        </div>
      </footer>
    </div>
  )
}
