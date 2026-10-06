import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const StackVisualizer = () => {
  const [stack, setStack] = useState([30, 20, 10])
  const [inputValue, setInputValue] = useState('')
  const [poppedValue, setPoppedValue] = useState(null)

  const handlePush = () => {
    if (inputValue === '') return
    const value = parseInt(inputValue)
    if (isNaN(value)) return
    setStack([...stack, value])
    setInputValue('')
  }

  const handlePop = () => {
    if (stack.length === 0) return
    const value = stack[stack.length - 1]
    setPoppedValue(value)
    setTimeout(() => {
      setStack(stack.slice(0, -1))
      setPoppedValue(null)
    }, 500)
  }

  return (
    <div className="p-3 sm:p-4 md:p-6 text-white max-w-full overflow-hidden">
      <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-center">
        Stack Visualizer (LIFO)
      </h2>

      <div className="flex flex-col items-center gap-6">
        <div className="relative flex flex-col-reverse items-center gap-2 min-h-[260px] w-28 sm:w-32">
          <div className="absolute bottom-0 w-28 sm:w-32 h-1 bg-white/30"></div>

          <AnimatePresence mode="popLayout">
            {stack.map((value, index) => (
              <motion.div
                key={`${value}-${index}`}
                initial={{ opacity: 0, y: 50, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 50, scale: 0.8 }}
                layout
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className="w-28 sm:w-32 h-14 sm:h-16 flex items-center justify-center text-white font-bold rounded-lg shadow-lg border-2 border-white/30 relative z-10 text-sm sm:text-base"
                style={{
                  backgroundColor: index === stack.length - 1 ? '#8b5cf6' : '#6366f1',
                }}
              >
                {value}
              </motion.div>
            ))}
          </AnimatePresence>

          {stack.length === 0 && (
            <div className="text-white/50 text-center py-8 text-xs sm:text-sm">Stack is empty</div>
          )}
        </div>

        <div className="text-white font-semibold text-xs sm:text-sm">
          Top: {stack.length > 0 ? stack[stack.length - 1] : 'None'}
        </div>

        {poppedValue !== null && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            className="px-5 py-2 bg-red-500 text-white rounded-lg font-bold text-xs sm:text-sm"
          >
            Popped: {poppedValue}
          </motion.div>
        )}
      </div>

      <div className="mt-6 bg-white/5 rounded-xl p-3 sm:p-4 space-y-3">
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="number"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handlePush()}
            placeholder="Enter value"
            className="w-full flex-1 min-w-0 px-3 py-2 rounded-lg bg-white/10 text-white placeholder-white/50 border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500 text-xs sm:text-sm"
          />
          <div className="flex gap-2 w-full sm:w-auto">
            <button
              onClick={handlePush}
              className="flex-1 sm:flex-none px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold text-xs sm:text-sm transition-colors whitespace-nowrap"
            >
              Push
            </button>
            <button
              onClick={handlePop}
              disabled={stack.length === 0}
              className="flex-1 sm:flex-none px-6 py-2 bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white rounded-lg font-semibold text-xs sm:text-sm transition-colors whitespace-nowrap"
            >
              Pop
            </button>
          </div>
        </div>
        <div className="text-white/70 text-xs text-center">
          Stack Size: {stack.length}
        </div>
      </div>
    </div>
  )
}

export default StackVisualizer
