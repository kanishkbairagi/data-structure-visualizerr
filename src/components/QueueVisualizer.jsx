import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const QueueVisualizer = () => {
  const [queue, setQueue] = useState([10, 20, 30])
  const [inputValue, setInputValue] = useState('')
  const [dequeuedValue, setDequeuedValue] = useState(null)

  const handleEnqueue = () => {
    if (inputValue === '') return
    const value = parseInt(inputValue)
    if (isNaN(value)) return
    setQueue([...queue, value])
    setInputValue('')
  }

  const handleDequeue = () => {
    if (queue.length === 0) return
    const value = queue[0]
    setDequeuedValue(value)
    setTimeout(() => {
      setQueue(queue.slice(1))
      setDequeuedValue(null)
    }, 500)
  }

  return (
    <div className="p-3 sm:p-4 md:p-6 text-white max-w-full overflow-hidden">
      <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-center">
        Queue Visualizer (FIFO)
      </h2>

      <div className="flex flex-col items-center gap-6">
        <div className="relative w-full max-w-3xl">
          <div className="flex items-center justify-between gap-2 min-h-[130px]">
            <div className="text-white font-semibold text-xs sm:text-sm text-red-400">Front</div>

            <div className="flex-1 flex items-center justify-start gap-2 sm:gap-3 overflow-x-auto pb-3 px-2">
              <AnimatePresence mode="popLayout">
                {queue.map((value, index) => (
                  <motion.div
                    key={`${value}-${index}`}
                    initial={{ opacity: 0, x: -40, scale: 0.8 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: 40, scale: 0.8 }}
                    layout
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center text-white font-bold rounded-lg shadow-lg border-2 border-white/30 flex-shrink-0 text-sm sm:text-base"
                    style={{
                      backgroundColor: index === 0 ? '#ef4444' : index === queue.length - 1 ? '#10b981' : '#6366f1',
                    }}
                  >
                    {value}
                  </motion.div>
                ))}
              </AnimatePresence>

              {queue.length === 0 && (
                <div className="text-white/50 text-center flex-1 py-8 text-xs sm:text-sm">Queue is empty</div>
              )}
            </div>

            <div className="text-white font-semibold text-xs sm:text-sm text-emerald-400">Rear</div>
          </div>

          <div className="h-1 bg-white/20 rounded-full mt-2"></div>
        </div>

        {dequeuedValue !== null && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            className="px-5 py-2 bg-red-500 text-white rounded-lg font-bold text-xs sm:text-sm"
          >
            Dequeued: {dequeuedValue}
          </motion.div>
        )}
      </div>

      <div className="mt-6 bg-white/5 rounded-xl p-3 sm:p-4 space-y-3">
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="number"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleEnqueue()}
            placeholder="Enter value"
            className="w-full flex-1 min-w-0 px-3 py-2 rounded-lg bg-white/10 text-white placeholder-white/50 border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500 text-xs sm:text-sm"
          />
          <div className="flex gap-2 w-full sm:w-auto">
            <button
              onClick={handleEnqueue}
              className="flex-1 sm:flex-none px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold text-xs sm:text-sm transition-colors whitespace-nowrap"
            >
              Enqueue
            </button>
            <button
              onClick={handleDequeue}
              disabled={queue.length === 0}
              className="flex-1 sm:flex-none px-6 py-2 bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white rounded-lg font-semibold text-xs sm:text-sm transition-colors whitespace-nowrap"
            >
              Dequeue
            </button>
          </div>
        </div>
        <div className="text-white/70 text-xs text-center space-x-3">
          <span>Front: {queue.length > 0 ? queue[0] : 'None'}</span>
          <span>|</span>
          <span>Rear: {queue.length > 0 ? queue[queue.length - 1] : 'None'}</span>
          <span>|</span>
          <span>Size: {queue.length}</span>
        </div>
      </div>
    </div>
  )
}

export default QueueVisualizer
