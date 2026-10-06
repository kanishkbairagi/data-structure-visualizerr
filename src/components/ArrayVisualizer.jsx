import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const ArrayVisualizer = () => {
  const [array, setArray] = useState([10, 20, 30, 40, 50])
  const [capacity, setCapacity] = useState(8)
  const [inputValue, setInputValue] = useState('')
  const [indexValue, setIndexValue] = useState('')
  const [searchValue, setSearchValue] = useState('')
  const [highlightIndices, setHighlightIndices] = useState({ active: -1, low: -1, mid: -1, high: -1 })
  const [stats, setStats] = useState({ comparisons: 0, writes: 0, amortizedCost: 'O(1) Amortized' })
  const [statusLog, setStatusLog] = useState('Dynamic Array with Capacity Management & Pointer Tracking')
  const [isProcessing, setIsProcessing] = useState(false)

  // Dynamic Array Push (Demonstrating Buffer Doubling)
  const handlePush = async () => {
    if (inputValue === '') return
    const value = parseInt(inputValue)
    if (isNaN(value)) return

    let currentCapacity = capacity
    let writes = stats.writes + 1

    // Check if buffer reallocation is required
    if (array.length >= capacity) {
      const newCapacity = capacity * 2
      setStatusLog(`⚠️ Buffer Overflow (Size ${array.length} = Capacity ${capacity})! Reallocating memory: Capacity ${capacity} ➔ ${newCapacity}`)
      setIsProcessing(true)
      await new Promise(r => setTimeout(r, 700))
      setCapacity(newCapacity)
      currentCapacity = newCapacity
      writes += array.length // copying elements into new buffer
    } else {
      setStatusLog(`✓ Pushed ${value} into contiguous memory block at index [${array.length}]`)
    }

    setArray([...array, value])
    setInputValue('')
    setStats(prev => ({ ...prev, writes, amortizedCost: 'O(1) Amortized (O(N) reallocation)' }))
    setIsProcessing(false)
  }

  const handlePop = () => {
    if (array.length === 0) return
    const popped = array[array.length - 1]
    setArray(array.slice(0, -1))
    setStatusLog(`✓ Popped ${popped} from index [${array.length - 1}] in O(1) time`)
    setStats(prev => ({ ...prev, writes: prev.writes + 1 }))
  }

  const handleInsertAt = () => {
    if (inputValue === '' || indexValue === '') return
    const value = parseInt(inputValue)
    const index = parseInt(indexValue)
    if (isNaN(value) || isNaN(index) || index < 0 || index > array.length) return

    let newCap = capacity
    if (array.length >= capacity) {
      newCap = capacity * 2
      setCapacity(newCap)
    }

    const newArray = [...array]
    newArray.splice(index, 0, value)
    setArray(newArray)
    setInputValue('')
    setIndexValue('')
    setHighlightIndices({ active: index, low: -1, mid: -1, high: -1 })
    const shifted = array.length - index
    setStatusLog(`✓ Inserted ${value} at index [${index}]. Elements shifted: ${shifted}`)
    setStats(prev => ({ ...prev, writes: prev.writes + shifted + 1 }))
    setTimeout(() => setHighlightIndices({ active: -1, low: -1, mid: -1, high: -1 }), 1200)
  }

  const handleDeleteAt = () => {
    if (indexValue === '') return
    const index = parseInt(indexValue)
    if (isNaN(index) || index < 0 || index >= array.length) return

    setHighlightIndices({ active: index, low: -1, mid: -1, high: -1 })
    const shifted = array.length - index - 1
    setTimeout(() => {
      const newArray = [...array]
      const removed = newArray.splice(index, 1)[0]
      setArray(newArray)
      setIndexValue('')
      setHighlightIndices({ active: -1, low: -1, mid: -1, high: -1 })
      setStatusLog(`✓ Deleted ${removed} at index [${index}]. Elements shifted: ${shifted}`)
      setStats(prev => ({ ...prev, writes: prev.writes + shifted }))
    }, 400)
  }

  // Binary Search Visualization (O(log N))
  const handleBinarySearch = async () => {
    if (searchValue === '') return
    const target = parseInt(searchValue)
    if (isNaN(target)) return

    // Ensure array is sorted for binary search
    const sorted = [...array].sort((a, b) => a - b)
    setArray(sorted)
    setIsProcessing(true)
    setStatusLog(`Array sorted for Binary Search. Searching for target ${target}...`)

    let low = 0
    let high = sorted.length - 1
    let found = false
    let comps = 0

    while (low <= high) {
      const mid = Math.floor((low + high) / 2)
      comps++
      setHighlightIndices({ active: -1, low, mid, high })
      setStatusLog(`Low=[${low}], Mid=[${mid}] (${sorted[mid]}), High=[${high}] — Comparison #${comps}`)
      await new Promise(r => setTimeout(r, 800))

      if (sorted[mid] === target) {
        setHighlightIndices({ active: mid, low: -1, mid: -1, high: -1 })
        setStatusLog(`🎯 Target ${target} FOUND at index [${mid}] in ${comps} comparisons!`)
        found = true
        break
      } else if (sorted[mid] < target) {
        low = mid + 1
      } else {
        high = mid - 1
      }
    }

    if (!found) {
      setHighlightIndices({ active: -1, low: -1, mid: -1, high: -1 })
      setStatusLog(`❌ Target ${target} NOT found (Total comparisons: ${comps})`)
    }

    setStats(prev => ({ ...prev, comparisons: prev.comparisons + comps }))
    setIsProcessing(false)
  }

  return (
    <div className="p-2.5 sm:p-4 md:p-6 text-white max-w-full overflow-hidden">
      {/* Header and Amortized Complexity HUD */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-4 md:mb-6 gap-3 md:gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-indigo-400">
            Dynamic Array & Complexity Engine
          </h2>
          <p className="text-[11px] sm:text-xs md:text-sm text-slate-300 mt-0.5">
            Buffer Resizing (Amortized Analysis) & Binary Search
          </p>
        </div>

        <div className="grid grid-cols-3 gap-2 bg-white/10 p-2 sm:px-4 sm:py-2 rounded-xl backdrop-blur-md border border-white/10 text-xs w-full lg:w-auto">
          <div className="text-center sm:text-left">
            <span className="text-slate-400 block font-mono text-[10px] sm:text-xs">Amortized</span>
            <span className="text-emerald-400 font-bold font-mono text-xs sm:text-sm">O(1)</span>
          </div>
          <div className="border-l border-white/20 pl-2 text-center sm:text-left">
            <span className="text-slate-400 block font-mono text-[10px] sm:text-xs">Size / Cap</span>
            <span className="text-cyan-400 font-bold font-mono text-xs sm:text-sm">{array.length}/{capacity}</span>
          </div>
          <div className="border-l border-white/20 pl-2 text-center sm:text-left">
            <span className="text-slate-400 block font-mono text-[10px] sm:text-xs">Writes</span>
            <span className="text-amber-400 font-bold font-mono text-xs sm:text-sm">{stats.writes}</span>
          </div>
        </div>
      </div>

      {/* Status banner */}
      <div className="mb-4 p-2.5 sm:px-4 sm:py-2.5 bg-slate-800/80 rounded-lg border border-blue-500/30 flex flex-col sm:flex-row sm:items-center justify-between text-xs sm:text-sm gap-1">
        <span className="text-blue-300 font-medium break-words">⚡ {statusLog}</span>
        <span className="text-[10px] sm:text-xs font-mono text-slate-400 flex-shrink-0">
          Load: {((array.length / capacity) * 100).toFixed(0)}%
        </span>
      </div>

      {/* Memory Allocation Buffer View */}
      <div className="bg-slate-950/60 rounded-xl p-3 sm:p-4 border border-white/10 mb-4 md:mb-6 max-w-full">
        <div className="text-[11px] sm:text-xs font-mono text-slate-400 mb-2 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          <span>Contiguous Buffer (Cap: {capacity})</span>
          <span className="text-emerald-400 text-[10px] sm:text-xs">
            Green: Mid | Yellow: Active | Purple: Low/High
          </span>
        </div>

        <div className="overflow-x-auto pb-2 scrollbar-thin">
          <div className="flex gap-2 items-end min-h-[150px] sm:min-h-[170px] min-w-min mx-auto py-2">
            {Array.from({ length: capacity }).map((_, slotIdx) => {
              const hasElement = slotIdx < array.length
              const val = hasElement ? array[slotIdx] : null
              const isActive = highlightIndices.active === slotIdx
              const isMid = highlightIndices.mid === slotIdx
              const isBound = highlightIndices.low === slotIdx || highlightIndices.high === slotIdx

              return (
                <div key={slotIdx} className="flex flex-col items-center flex-shrink-0">
                  <AnimatePresence mode="popLayout">
                    {hasElement ? (
                      <motion.div
                        key={`elem-${slotIdx}-${val}`}
                        initial={{ opacity: 0, scale: 0.5, y: -20 }}
                        animate={{
                          opacity: 1,
                          scale: 1,
                          y: 0,
                          backgroundColor: isActive
                            ? '#f59e0b'
                            : isMid
                            ? '#10b981'
                            : isBound
                            ? '#8b5cf6'
                            : '#3b82f6'
                        }}
                        exit={{ opacity: 0, scale: 0, y: 30 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                        className="w-10 sm:w-12 md:w-14 rounded-lg flex flex-col justify-center items-center font-bold text-white shadow-lg border border-white/30"
                        style={{ height: `${Math.max(45, Math.min(120, val * 2))}px` }}
                      >
                        <span className="text-xs sm:text-sm">{val}</span>
                      </motion.div>
                    ) : (
                      <div
                        className="w-10 sm:w-12 md:w-14 h-11 sm:h-12 rounded-lg border-2 border-dashed border-white/20 bg-white/5 flex items-center justify-center text-[9px] sm:text-[10px] text-slate-500 font-mono"
                      >
                        FREE
                      </div>
                    )}
                  </AnimatePresence>
                  <span className="text-[9px] sm:text-[10px] font-mono text-slate-400 mt-1">[{slotIdx}]</span>
                  {highlightIndices.low === slotIdx && (
                    <span className="text-[8px] sm:text-[9px] font-mono font-bold text-purple-400">LOW</span>
                  )}
                  {highlightIndices.mid === slotIdx && (
                    <span className="text-[8px] sm:text-[9px] font-mono font-bold text-emerald-400">MID</span>
                  )}
                  {highlightIndices.high === slotIdx && (
                    <span className="text-[8px] sm:text-[9px] font-mono font-bold text-purple-400">HIGH</span>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Control Panels - Fully Responsive for Mobile & Desktop */}
      <div className="bg-white/5 rounded-xl p-3 sm:p-4 border border-white/10 space-y-3 sm:space-y-4">
        {/* Row 1: Push / Pop & Binary Search */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          {/* Push & Pop Group */}
          <div className="flex flex-col sm:flex-row gap-2 w-full">
            <input
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handlePush()}
              placeholder="Value to append"
              className="w-full flex-1 min-w-0 px-3 py-2 rounded-lg bg-white/10 text-white placeholder-white/40 border border-white/20 text-xs sm:text-sm outline-none focus:border-blue-400"
            />
            <div className="flex gap-2 w-full sm:w-auto">
              <button
                onClick={handlePush}
                disabled={isProcessing}
                className="flex-1 sm:flex-none px-4 py-2 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white rounded-lg font-semibold text-xs sm:text-sm transition whitespace-nowrap"
              >
                Push (Append)
              </button>
              <button
                onClick={handlePop}
                disabled={isProcessing || array.length === 0}
                className="flex-1 sm:flex-none px-4 py-2 bg-rose-500/80 hover:bg-rose-600 disabled:opacity-50 text-white rounded-lg font-semibold text-xs sm:text-sm transition whitespace-nowrap"
              >
                Pop
              </button>
            </div>
          </div>

          {/* Binary Search Group */}
          <div className="flex flex-col sm:flex-row gap-2 w-full">
            <input
              type="number"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleBinarySearch()}
              placeholder="Target for Binary Search"
              className="w-full flex-1 min-w-0 px-3 py-2 rounded-lg bg-white/10 text-white placeholder-white/40 border border-white/20 text-xs sm:text-sm outline-none focus:border-indigo-400"
            />
            <button
              onClick={handleBinarySearch}
              disabled={isProcessing || array.length === 0}
              className="w-full sm:w-auto px-4 py-2 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 text-white rounded-lg font-semibold text-xs sm:text-sm transition whitespace-nowrap"
            >
              Binary Search O(log N)
            </button>
          </div>
        </div>

        {/* Row 2: Arbitrary Insert and Delete */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 pt-3 border-t border-white/10">
          {/* Insert Group */}
          <div className="flex flex-col sm:flex-row gap-2 w-full">
            <div className="grid grid-cols-2 gap-2 w-full sm:w-auto">
              <input
                type="number"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Val"
                className="w-full sm:w-20 px-3 py-2 rounded-lg bg-white/10 text-white placeholder-white/40 border border-white/20 text-xs sm:text-sm outline-none"
              />
              <input
                type="number"
                value={indexValue}
                onChange={(e) => setIndexValue(e.target.value)}
                placeholder="Index"
                className="w-full sm:w-20 px-3 py-2 rounded-lg bg-white/10 text-white placeholder-white/40 border border-white/20 text-xs sm:text-sm outline-none"
              />
            </div>
            <button
              onClick={handleInsertAt}
              disabled={isProcessing}
              className="w-full sm:flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 rounded-lg text-xs sm:text-sm font-semibold transition whitespace-nowrap"
            >
              Insert At Index O(N)
            </button>
          </div>

          {/* Delete Group */}
          <div className="flex flex-col sm:flex-row gap-2 w-full">
            <input
              type="number"
              value={indexValue}
              onChange={(e) => setIndexValue(e.target.value)}
              placeholder="Index to delete"
              className="w-full flex-1 min-w-0 px-3 py-2 rounded-lg bg-white/10 text-white placeholder-white/40 border border-white/20 text-xs sm:text-sm outline-none"
            />
            <button
              onClick={handleDeleteAt}
              disabled={isProcessing}
              className="w-full sm:w-auto px-4 py-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 rounded-lg text-xs sm:text-sm font-semibold transition whitespace-nowrap"
            >
              Delete At Index
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ArrayVisualizer
