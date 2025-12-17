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
    <div className="p-6">
      <h2 className="text-3xl font-bold text-white mb-6 text-center">Stack Visualizer (LIFO)</h2>

      <div className="flex flex-col items-center gap-8">
        <div className="relative flex flex-col-reverse items-center gap-2 min-h-[300px] w-32">
          {/* Stack container */}
          <div className="absolute bottom-0 w-32 h-1 bg-white/30"></div>

          <AnimatePresence mode="popLayout">
            {stack.map((value, index) => (
              <motion.div
                key={`${value}-${index}`}
                initial={{ opacity: 0, y: 50, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 50, scale: 0.8 }}
                layout
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className="w-32 h-16 flex items-center justify-center text-white font-bold rounded-lg shadow-lg border-2 border-white/30 relative z-10"
                style={{
                  backgroundColor: index === stack.length - 1 ? '#8b5cf6' : '#6366f1',
                }}
              >
                {value}
              </motion.div>
            ))}
          </AnimatePresence>

          {stack.length === 0 && (
            <div className="text-white/50 text-center py-8">Stack is empty</div>
          )}
        </div>

        {/* Top indicator */}
        <div className="text-white font-semibold">
          Top: {stack.length > 0 ? stack[stack.length - 1] : 'None'}
        </div>

        {/* Popped value display */}
        {poppedValue !== null && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            className="px-6 py-3 bg-red-500 text-white rounded-lg font-bold"
          >
            Popped: {poppedValue}
          </motion.div>
        )}
      </div>

      <div className="mt-8 bg-white/5 rounded-lg p-3 md:p-4 space-y-4">
        <div className="flex flex-col sm:flex-row gap-2 md:gap-4">
          <input
            type="number"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handlePush()}
            placeholder="Enter value"
            className="flex-1 px-4 py-2 rounded-lg bg-white/10 text-white placeholder-white/50 border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500 w-full"
          />
          <button
            onClick={handlePush}
            className="px-8 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold transition-colors w-full sm:w-auto"
          >
            Push
          </button>
          <button
            onClick={handlePop}
            className="px-8 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition-colors w-full sm:w-auto"
          >
            Pop
          </button>
        </div>
        <div className="text-white/70 text-sm text-center">
          Stack Size: {stack.length}
        </div>
      </div>
    </div>
  )
}

export default StackVisualizer

