'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'

export default function Bookmarks() {
  const [bookmarks, setBookmarks] = useState<string[]>([])

  useEffect(() => {
    const storedBookmarks = localStorage.getItem('bookmarks')
    if (storedBookmarks) {
      setBookmarks(JSON.parse(storedBookmarks))
    }
  }, [])

  const removeBookmark = (url: string) => {
    const updatedBookmarks = bookmarks.filter(bookmark => bookmark !== url)
    setBookmarks(updatedBookmarks)
    localStorage.setItem('bookmarks', JSON.stringify(updatedBookmarks))
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">Bookmarks</h1>
        <Link href="/" className="mb-4 inline-block text-blue-600 hover:text-blue-800">
          ← Back to Browser
        </Link>
        <div className="bg-white shadow-md rounded-lg p-6">
          {bookmarks.length === 0 ? (
            <p className="text-gray-600">No bookmarks yet.</p>
          ) : (
            <ul className="space-y-4">
              {bookmarks.map((bookmark, index) => (
                <li key={index} className="flex items-center justify-between bg-gray-50 p-4 rounded-md">
                  <a href={bookmark} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 truncate flex-grow">
                    {bookmark}
                  </a>
                  <button onClick={() => removeBookmark(bookmark)} className="ml-4 text-red-600 hover:text-red-800">
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}