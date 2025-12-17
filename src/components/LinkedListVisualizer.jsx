import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const Node = ({ value, next, isHead, isTail, index, highlight }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0 }}
    animate={{
      opacity: 1,
      scale: 1,
      backgroundColor: highlight ? '#f59e0b' : '#3b82f6'
    }}
    exit={{ opacity: 0, scale: 0 }}
    transition={{ type: "spring", stiffness: 300, damping: 25 }}
    className="flex items-center gap-2"
  >
    <div className="relative">
      <div className={`w-16 h-16 rounded-lg flex items-center justify-center text-white font-bold shadow-lg border-2 border-white/30 ${isHead ? 'bg-purple-600' : isTail ? 'bg-green-600' : ''
        }`}>
        {value}
      </div>
      {isHead && (
        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs text-white font-semibold">
          Head
        </div>
      )}
      {isTail && (
        <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-white font-semibold">
          Tail
        </div>
      )}
    </div>
    {next !== null && (
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        className="w-8 h-1 bg-white/50 relative"
      >
        <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-0 h-0 border-l-8 border-l-white/50 border-t-4 border-t-transparent border-b-4 border-b-transparent"></div>
      </motion.div>
    )}
    {next === null && (
      <div className="text-white/50 text-xs ml-2">null</div>
    )}
  </motion.div>
)

const LinkedListVisualizer = () => {
  const [list, setList] = useState([10, 20, 30])
  const [inputValue, setInputValue] = useState('')
  const [indexValue, setIndexValue] = useState('')
  const [highlightIndex, setHighlightIndex] = useState(-1)

  const handleInsertAtHead = () => {
    if (inputValue === '') return
    const value = parseInt(inputValue)
    if (isNaN(value)) return
    setList([value, ...list])
    setInputValue('')
    setHighlightIndex(0)
    setTimeout(() => setHighlightIndex(-1), 1000)
  }

  const handleInsertAtTail = () => {
    if (inputValue === '') return
    const value = parseInt(inputValue)
    if (isNaN(value)) return
    setList([...list, value])
    setInputValue('')
    setHighlightIndex(list.length)
    setTimeout(() => setHighlightIndex(-1), 1000)
  }

  const handleDeleteAtHead = () => {
    if (list.length === 0) return
    setList(list.slice(1))
  }

  const handleDeleteAtTail = () => {
    if (list.length === 0) return
    setList(list.slice(0, -1))
  }

  const handleInsertAt = () => {
    if (inputValue === '' || indexValue === '') return
    const value = parseInt(inputValue)
    const index = parseInt(indexValue)
    if (isNaN(value) || isNaN(index) || index < 0 || index > list.length) return

    const newList = [...list]
    newList.splice(index, 0, value)
    setList(newList)
    setInputValue('')
    setIndexValue('')
    setHighlightIndex(index)
    setTimeout(() => setHighlightIndex(-1), 1000)
  }

  const handleDeleteAt = () => {
    if (indexValue === '') return
    const index = parseInt(indexValue)
    if (isNaN(index) || index < 0 || index >= list.length) return

    setHighlightIndex(index)
    setTimeout(() => {
      const newList = [...list]
      newList.splice(index, 1)
      setList(newList)
      setHighlightIndex(-1)
    }, 500)
  }

  return (
    <div className="p-3 md:p-6">
      <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 text-center">Linked List Visualizer</h2>

      <div className="flex flex-col items-center gap-8 mb-8">
        <div className="flex items-center justify-start gap-2 min-h-[150px] p-4 md:p-8 bg-white/5 rounded-lg overflow-x-auto w-full">
          <AnimatePresence mode="popLayout">
            {list.map((value, index) => (
              <Node
                key={`${value}-${index}`}
                value={value}
                next={index < list.length - 1 ? list[index + 1] : null}
                isHead={index === 0}
                isTail={index === list.length - 1}
                index={index}
                highlight={highlightIndex === index}
              />
            ))}
          </AnimatePresence>

          {list.length === 0 && (
            <div className="text-white/50 text-center py-8">List is empty</div>
          )}
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
              onClick={handleInsertAtHead}
              className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-semibold transition-colors w-full sm:w-auto"
            >
              Insert Head
            </button>
            <button
              onClick={handleInsertAtTail}
              className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold transition-colors w-full sm:w-auto"
            >
              Insert Tail
            </button>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={handleDeleteAtHead}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition-colors w-full"
            >
              Delete Head
            </button>
            <button
              onClick={handleDeleteAtTail}
              className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-semibold transition-colors w-full"
            >
              Delete Tail
            </button>
          </div>
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
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition-colors w-full sm:w-auto"
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
              className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-semibold transition-colors w-full sm:w-auto"
            >
              Delete
            </button>
          </div>
        </div>

        <div className="text-white/70 text-sm text-center">
          Length: {list.length}
        </div>
      </div>
    </div>
  )
}

export default LinkedListVisualizer

