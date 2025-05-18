import { useState } from 'react'

const KeyInput = ({ keyText, setKeyText, parseKey, setError }) => {
  const [isDragging, setIsDragging] = useState(false)

  const handlePaste = (e) => {
    const text = e.target.value
    setKeyText(text)
    if (text.trim()) {
      parseKey(text)
    } else {
      setKeyData(null)
      setError('')
    }
  }

  const handleFile = async (file) => {
    if (file.name.endsWith('.asc') || file.type === 'text/plain') {
      const text = await file.text()
      setKeyText(text)
      parseKey(text)
    } else {
      setError('Please upload a valid .asc file.')
    }
  }

  const handleFileSelect = (e) => {
    const file = e.target.files[0]
    if (file) handleFile(file)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => setIsDragging(false)

  return (
    <div className="w-full max-w-2xl mb-6">
      <h2 className="text-xl font-semibold mb-2">Enter PGP Public Key</h2>
      <textarea
        className="w-full h-40 bg-gray-900 text-white border border-gray-700 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all duration-300 hover:border-gray-500"
        placeholder="Paste your PGP public key here..."
        value={keyText}
        onChange={handlePaste}
      />
      <div
        className={`mt-4 p-6 border-2 border-dashed rounded-lg text-center transition-all duration-300 ${
          isDragging ? 'border-gray-500 bg-gray-800' : 'border-gray-700 bg-gray-900'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <p className="text-gray-300">
          Drag and drop a .asc file here, or{' '}
          <label className="text-blue-400 cursor-pointer hover:underline">
            click to upload
            <input
              type="file"
              accept=".asc,text/plain"
              className="hidden"
              onChange={handleFileSelect}
            />
          </label>
        </p>
      </div>
    </div>
  )
}

export default KeyInput