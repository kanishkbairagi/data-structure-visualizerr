import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const Node = ({ value, next, isHead, isTail, highlight }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0 }}
    animate={{
      opacity: 1,
      scale: 1,
      backgroundColor: highlight ? '#f59e0b' : '#3b82f6'
    }}
    exit={{ opacity: 0, scale: 0 }}
    transition={{ type: "spring", stiffness: 300, damping: 25 }}
    className="flex items-center gap-2 flex-shrink-0"
  >
    <div className="relative">
      <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-lg flex items-center justify-center text-white font-bold shadow-lg border-2 border-white/30 text-xs sm:text-sm ${
        isHead ? 'bg-purple-600' : isTail ? 'bg-green-600' : ''
      }`}>
        {value}
      </div>
      {isHead && (
        <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 text-[10px] sm:text-xs text-white font-semibold">
          Head
        </div>
      )}
      {isTail && (
        <div className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 text-[10px] sm:text-xs text-white font-semibold">
          Tail
        </div>
      )}
    </div>
    {next !== null && (
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        className="w-6 sm:w-8 h-1 bg-white/50 relative flex-shrink-0"
      >
        <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-0 h-0 border-l-[6px] sm:border-l-8 border-l-white/50 border-t-[3px] sm:border-t-4 border-t-transparent border-b-[3px] sm:border-b-4 border-b-transparent"></div>
      </motion.div>
    )}
    {next === null && (
      <div className="text-white/50 text-[10px] sm:text-xs ml-1 flex-shrink-0">null</div>
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
    <div className="p-2.5 sm:p-4 md:p-6 text-white max-w-full overflow-hidden">
      <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-center">
        Linked List Visualizer
      </h2>

      <div className="flex flex-col items-center gap-6 mb-6">
        <div className="flex items-center justify-start gap-2 min-h-[140px] p-3 sm:p-6 bg-white/5 rounded-xl overflow-x-auto w-full max-w-full">
          <AnimatePresence mode="popLayout">
            {list.map((value, index) => (
              <Node
                key={`${value}-${index}`}
                value={value}
                next={index < list.length - 1 ? list[index + 1] : null}
                isHead={index === 0}
                isTail={index === list.length - 1}
                highlight={highlightIndex === index}
              />
            ))}
          </AnimatePresence>

          {list.length === 0 && (
            <div className="text-white/50 text-center py-8 text-xs sm:text-sm w-full">List is empty</div>
          )}
        </div>
      </div>

      <div className="bg-white/5 rounded-xl p-3 sm:p-4 space-y-3 sm:space-y-4">
        {/* Row 1: Insert Head/Tail & Delete Head/Tail */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          <div className="flex flex-col sm:flex-row gap-2 w-full">
            <input
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Enter value"
              className="w-full flex-1 min-w-0 px-3 py-2 rounded-lg bg-white/10 text-white placeholder-white/50 border border-white/20 text-xs sm:text-sm outline-none"
            />
            <div className="flex gap-2 w-full sm:w-auto">
              <button
                onClick={handleInsertAtHead}
                className="flex-1 sm:flex-none px-3 py-2 bg-purple-500 hover:bg-purple-600 rounded-lg font-semibold text-xs sm:text-sm transition-colors whitespace-nowrap"
              >
                Insert Head
              </button>
              <button
                onClick={handleInsertAtTail}
                className="flex-1 sm:flex-none px-3 py-2 bg-green-500 hover:bg-green-600 rounded-lg font-semibold text-xs sm:text-sm transition-colors whitespace-nowrap"
              >
                Insert Tail
              </button>
            </div>
          </div>

          <div className="flex gap-2 w-full">
            <button
              onClick={handleDeleteAtHead}
              disabled={list.length === 0}
              className="flex-1 px-3 py-2 bg-red-500 hover:bg-red-600 disabled:opacity-50 rounded-lg font-semibold text-xs sm:text-sm transition-colors whitespace-nowrap"
            >
              Delete Head
            </button>
            <button
              onClick={handleDeleteAtTail}
              disabled={list.length === 0}
              className="flex-1 px-3 py-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 rounded-lg font-semibold text-xs sm:text-sm transition-colors whitespace-nowrap"
            >
              Delete Tail
            </button>
          </div>
        </div>

        {/* Row 2: Arbitrary Insert and Delete */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 pt-3 border-t border-white/10">
          <div className="flex flex-col sm:flex-row gap-2 w-full">
            <div className="grid grid-cols-2 gap-2 w-full sm:w-auto">
              <input
                type="number"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Value"
                className="w-full sm:w-20 px-3 py-2 rounded-lg bg-white/10 text-white placeholder-white/50 border border-white/20 text-xs sm:text-sm outline-none"
              />
              <input
                type="number"
                value={indexValue}
                onChange={(e) => setIndexValue(e.target.value)}
                placeholder="Index"
                className="w-full sm:w-20 px-3 py-2 rounded-lg bg-white/10 text-white placeholder-white/50 border border-white/20 text-xs sm:text-sm outline-none"
              />
            </div>
            <button
              onClick={handleInsertAt}
              className="w-full sm:flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg font-semibold text-xs sm:text-sm transition-colors whitespace-nowrap"
            >
              Insert At Index
            </button>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 w-full">
            <input
              type="number"
              value={indexValue}
              onChange={(e) => setIndexValue(e.target.value)}
              placeholder="Index to delete"
              className="w-full flex-1 min-w-0 px-3 py-2 rounded-lg bg-white/10 text-white placeholder-white/50 border border-white/20 text-xs sm:text-sm outline-none"
            />
            <button
              onClick={handleDeleteAt}
              disabled={list.length === 0}
              className="w-full sm:w-auto px-4 py-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 rounded-lg font-semibold text-xs sm:text-sm transition-colors whitespace-nowrap"
            >
              Delete At Index
            </button>
          </div>
        </div>

        <div className="text-white/70 text-xs text-center">
          Length: {list.length}
        </div>
      </div>
    </div>
  )
}

export default LinkedListVisualizer
