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
    setStats(prev => ({ ...prev, writes, amortizedCost: 'O(1) Amortized (O(N) during reallocation)' }))
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
    setStatusLog(`✓ Inserted ${value} at index [${index}]. Elements shifted right: ${shifted} (Time: O(N))`)
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
      setStatusLog(`✓ Deleted ${removed} at index [${index}]. Elements shifted left: ${shifted}`)
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
      setStatusLog(`❌ Target ${target} NOT found in array (Total comparisons: ${comps})`)
    }

    setStats(prev => ({ ...prev, comparisons: prev.comparisons + comps }))
    setIsProcessing(false)
  }

  return (
    <div className="p-3 md:p-6 text-white">
      {/* Header and Amortized Complexity HUD */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-indigo-400">
            Dynamic Array & Complexity Engine
          </h2>
          <p className="text-xs md:text-sm text-slate-300 mt-1">
            Contiguous Memory Allocation, Buffer Resizing (Amortized Analysis) & Binary Search
          </p>
        </div>

        <div className="flex gap-3 bg-white/10 px-4 py-2 rounded-xl backdrop-blur-md border border-white/10 text-xs">
          <div>
            <span className="text-slate-400 block font-mono">Amortized Cost</span>
            <span className="text-emerald-400 font-bold font-mono">O(1) Append</span>
          </div>
          <div className="border-l border-white/20 pl-3">
            <span className="text-slate-400 block font-mono">Size / Capacity</span>
            <span className="text-cyan-400 font-bold font-mono">{array.length} / {capacity}</span>
          </div>
          <div className="border-l border-white/20 pl-3">
            <span className="text-slate-400 block font-mono">Memory Writes</span>
            <span className="text-amber-400 font-bold font-mono">{stats.writes} ops</span>
          </div>
        </div>
      </div>

      {/* Status banner */}
      <div className="mb-6 px-4 py-2.5 bg-slate-800/80 rounded-lg border border-blue-500/30 flex items-center justify-between text-sm">
        <span className="text-blue-300 font-medium">⚡ {statusLog}</span>
        <span className="text-xs font-mono text-slate-400">
          Load Factor: {((array.length / capacity) * 100).toFixed(0)}%
        </span>
      </div>

      {/* Memory Allocation Buffer View */}
      <div className="bg-slate-950/60 rounded-xl p-4 overflow-x-auto border border-white/10 mb-6">
        <div className="text-xs font-mono text-slate-400 mb-3 flex items-center justify-between">
          <span>Contiguous Physical Memory Buffer (Capacity: {capacity})</span>
          <span className="text-emerald-400">Green = Mid | Yellow = Active | Purple = Unallocated</span>
        </div>

        <div className="flex gap-2 items-end min-h-[170px] pb-3 overflow-x-auto">
          {Array.from({ length: capacity }).map((_, slotIdx) => {
            const hasElement = slotIdx < array.length
            const val = hasElement ? array[slotIdx] : null
            const isActive = highlightIndices.active === slotIdx
            const isMid = highlightIndices.mid === slotIdx
            const isBound = highlightIndices.low === slotIdx || highlightIndices.high === slotIdx

            return (
              <div key={slotIdx} className="flex flex-col items-center">
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
                      className="w-12 md:w-14 rounded-lg flex flex-col justify-center items-center font-bold text-white shadow-lg border border-white/30"
                      style={{ height: `${Math.max(50, Math.min(130, val * 2.2))}px` }}
                    >
                      <span className="text-xs md:text-sm">{val}</span>
                    </motion.div>
                  ) : (
                    <div
                      className="w-12 md:w-14 h-12 rounded-lg border-2 border-dashed border-white/20 bg-white/5 flex items-center justify-center text-[10px] text-slate-500 font-mono"
                    >
                      FREE
                    </div>
                  )}
                </AnimatePresence>
                <span className="text-[10px] font-mono text-slate-400 mt-1.5">[{slotIdx}]</span>
                {highlightIndices.low === slotIdx && (
                  <span className="text-[9px] font-mono font-bold text-purple-400">LOW</span>
                )}
                {highlightIndices.mid === slotIdx && (
                  <span className="text-[9px] font-mono font-bold text-emerald-400">MID</span>
                )}
                {highlightIndices.high === slotIdx && (
                  <span className="text-[9px] font-mono font-bold text-purple-400">HIGH</span>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Control Panels */}
      <div className="bg-white/5 rounded-xl p-4 border border-white/10 space-y-4">
        {/* Row 1: Push / Pop & Binary Search */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex gap-2">
            <input
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handlePush()}
              placeholder="Value to append"
              className="flex-1 px-4 py-2 rounded-lg bg-white/10 text-white placeholder-white/40 border border-white/20 text-sm outline-none"
            />
            <button
              onClick={handlePush}
              disabled={isProcessing}
              className="px-5 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-semibold text-sm transition"
            >
              Push (Append)
            </button>
            <button
              onClick={handlePop}
              disabled={isProcessing || array.length === 0}
              className="px-4 py-2 bg-rose-500/80 hover:bg-rose-600 text-white rounded-lg font-semibold text-sm transition"
            >
              Pop
            </button>
          </div>

          <div className="flex gap-2">
            <input
              type="number"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleBinarySearch()}
              placeholder="Target for Binary Search"
              className="flex-1 px-4 py-2 rounded-lg bg-white/10 text-white placeholder-white/40 border border-white/20 text-sm outline-none"
            />
            <button
              onClick={handleBinarySearch}
              disabled={isProcessing || array.length === 0}
              className="px-5 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg font-semibold text-sm transition"
            >
              Binary Search O(log N)
            </button>
          </div>
        </div>

        {/* Row 2: Arbitrary Insert and Delete */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-white/10">
          <div className="flex gap-2">
            <input
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Val"
              className="w-24 px-3 py-1.5 rounded-lg bg-white/10 text-white placeholder-white/40 border border-white/20 text-sm outline-none"
            />
            <input
              type="number"
              value={indexValue}
              onChange={(e) => setIndexValue(e.target.value)}
              placeholder="Index"
              className="w-24 px-3 py-1.5 rounded-lg bg-white/10 text-white placeholder-white/40 border border-white/20 text-sm outline-none"
            />
            <button
              onClick={handleInsertAt}
              disabled={isProcessing}
              className="flex-1 px-4 py-1.5 bg-blue-500 hover:bg-blue-600 rounded-lg text-sm font-semibold transition"
            >
              Insert At Index O(N)
            </button>
          </div>

          <div className="flex gap-2">
            <input
              type="number"
              value={indexValue}
              onChange={(e) => setIndexValue(e.target.value)}
              placeholder="Index to delete"
              className="flex-1 px-3 py-1.5 rounded-lg bg-white/10 text-white placeholder-white/40 border border-white/20 text-sm outline-none"
            />
            <button
              onClick={handleDeleteAt}
              disabled={isProcessing}
              className="px-5 py-1.5 bg-orange-500 hover:bg-orange-600 rounded-lg text-sm font-semibold transition"
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
