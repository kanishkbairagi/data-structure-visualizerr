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
    <div className="p-6">
      <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 text-center">Queue Visualizer (FIFO)</h2>

      <div className="flex flex-col items-center gap-8">
        {/* Queue visualization */}
        <div className="relative w-full max-w-4xl">
          <div className="flex items-center justify-center gap-3 min-h-[150px]">
            <div className="text-white font-semibold mr-4">Front</div>

            <div className="flex-1 flex items-center justify-start gap-3 overflow-x-auto pb-4">
              <AnimatePresence mode="popLayout">
                {queue.map((value, index) => (
                  <motion.div
                    key={`${value}-${index}`}
                    initial={{ opacity: 0, x: -50, scale: 0.8 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: 50, scale: 0.8 }}
                    layout
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    className="w-24 h-24 flex items-center justify-center text-white font-bold rounded-lg shadow-lg border-2 border-white/30 flex-shrink-0"
                    style={{
                      backgroundColor: index === 0 ? '#ef4444' : index === queue.length - 1 ? '#10b981' : '#6366f1',
                    }}
                  >
                    {value}
                  </motion.div>
                ))}
              </AnimatePresence>

              {queue.length === 0 && (
                <div className="text-white/50 text-center flex-1 py-8">Queue is empty</div>
              )}
            </div>

            <div className="text-white font-semibold ml-4">Rear</div>
          </div>

          {/* Queue line indicator */}
          <div className="h-1 bg-white/20 rounded-full mt-4"></div>
        </div>

        {/* Dequeued value display */}
        {dequeuedValue !== null && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            className="px-6 py-3 bg-red-500 text-white rounded-lg font-bold"
          >
            Dequeued: {dequeuedValue}
          </motion.div>
        )}
      </div>

      <div className="mt-8 bg-white/5 rounded-lg p-3 md:p-4 space-y-4">
        <div className="flex flex-col sm:flex-row gap-2 md:gap-4">
          <input
            type="number"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleEnqueue()}
            placeholder="Enter value"
            className="flex-1 px-4 py-2 rounded-lg bg-white/10 text-white placeholder-white/50 border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500 w-full"
          />
          <button
            onClick={handleEnqueue}
            className="px-8 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold transition-colors w-full sm:w-auto"
          >
            Enqueue
          </button>
          <button
            onClick={handleDequeue}
            className="px-8 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition-colors w-full sm:w-auto"
          >
            Dequeue
          </button>
        </div>
        <div className="text-white/70 text-sm text-center space-x-4">
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

