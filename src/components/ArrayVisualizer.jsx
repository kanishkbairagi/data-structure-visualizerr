import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const ArrayVisualizer = () => {
  const [array, setArray] = useState([10, 20, 30, 40, 50])
  const [inputValue, setInputValue] = useState('')
  const [indexValue, setIndexValue] = useState('')
  const [highlightIndex, setHighlightIndex] = useState(-1)

  const handlePush = () => {
    if (inputValue === '') return
    const value = parseInt(inputValue)
    if (isNaN(value)) return
    setArray([...array, value])
    setInputValue('')
  }

  const handlePop = () => {
    if (array.length === 0) return
    setArray(array.slice(0, -1))
  }

  const handleInsertAt = () => {
    if (inputValue === '' || indexValue === '') return
    const value = parseInt(inputValue)
    const index = parseInt(indexValue)
    if (isNaN(value) || isNaN(index) || index < 0 || index > array.length) return

    const newArray = [...array]
    newArray.splice(index, 0, value)
    setArray(newArray)
    setInputValue('')
    setIndexValue('')
    setHighlightIndex(index)
    setTimeout(() => setHighlightIndex(-1), 1000)
  }

  const handleDeleteAt = () => {
    if (indexValue === '') return
    const index = parseInt(indexValue)
    if (isNaN(index) || index < 0 || index >= array.length) return

    setHighlightIndex(index)
    setTimeout(() => {
      const newArray = [...array]
      newArray.splice(index, 1)
      setArray(newArray)
      setHighlightIndex(-1)
    }, 500)
  }

  return (
    <div className="p-3 md:p-6">
      <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 text-center">Array Visualizer</h2>

      <div className="flex justify-center items-center min-h-[200px] mb-8 overflow-x-auto pb-4">
        <div className="flex gap-3 items-end min-w-min mx-auto px-4">
          <AnimatePresence mode="popLayout">
            {array.map((value, index) => (
              <motion.div
                key={`${value}-${index}`}
                initial={{ opacity: 0, scale: 0, y: -50 }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  y: 0,
                  backgroundColor: highlightIndex === index ? '#f59e0b' : '#3b82f6'
                }}
                exit={{ opacity: 0, scale: 0, y: 50 }}
                layout
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="w-12 h-12 md:w-16 md:h-16 flex items-center justify-center text-white font-bold rounded-lg shadow-lg border-2 border-white/30"
                style={{ height: `${value * 3}px`, minHeight: '48px' }}
              >
                <div className="text-center">
                  <div className="text-sm md:text-lg">{value}</div>
                  <div className="text-[10px] md:text-xs mt-1 opacity-75">[{index}]</div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      <div className="bg-white/5 rounded-lg p-3 md:p-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Enter value"
              className="flex-1 px-4 py-2 rounded-lg bg-white/10 text-white placeholder-white/50 border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500 w-full"
            />
            <button
              onClick={handlePush}
              className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold transition-colors w-full sm:w-auto"
            >
              Push
            </button>
          </div>
          <button
            onClick={handlePop}
            className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition-colors w-full"
          >
            Pop
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Value"
              className="flex-1 px-4 py-2 rounded-lg bg-white/10 text-white placeholder-white/50 border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500 w-full"
            />
            <input
              type="number"
              value={indexValue}
              onChange={(e) => setIndexValue(e.target.value)}
              placeholder="Index"
              className="flex-1 px-4 py-2 rounded-lg bg-white/10 text-white placeholder-white/50 border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500 w-full"
            />
            <button
              onClick={handleInsertAt}
              className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition-colors w-full sm:w-auto"
            >
              Insert
            </button>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="number"
              value={indexValue}
              onChange={(e) => setIndexValue(e.target.value)}
              placeholder="Index to delete"
              className="flex-1 px-4 py-2 rounded-lg bg-white/10 text-white placeholder-white/50 border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500 w-full"
            />
            <button
              onClick={handleDeleteAt}
              className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-semibold transition-colors w-full sm:w-auto"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ArrayVisualizer

