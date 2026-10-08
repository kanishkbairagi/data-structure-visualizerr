import { useState } from 'react'
import { motion } from 'framer-motion'
import { Analytics } from '@vercel/analytics/react'
import ArrayVisualizer from './components/ArrayVisualizer'
import StackVisualizer from './components/StackVisualizer'
import QueueVisualizer from './components/QueueVisualizer'
import LinkedListVisualizer from './components/LinkedListVisualizer'
import TreeVisualizer from './components/TreeVisualizer'
import GraphVisualizer from './components/GraphVisualizer'
import TrieVisualizer from './components/TrieVisualizer'

const dataStructures = [
  { id: 'array', name: 'Dynamic Array', icon: '📊' },
  { id: 'tree', name: 'AVL Tree', icon: '🌳' },
  { id: 'graph', name: 'Dijkstra Graph', icon: '🕸️' },
  { id: 'trie', name: 'Trie Prefix', icon: '🌲' },
  { id: 'linkedlist', name: 'Linked List', icon: '🔗' },
  { id: 'stack', name: 'Stack', icon: '📚' },
  { id: 'queue', name: 'Queue', icon: '🚶' },
]

function App() {
  const [activeDS, setActiveDS] = useState('array')

  const renderVisualizer = () => {
    switch (activeDS) {
      case 'array':
        return <ArrayVisualizer />
      case 'tree':
        return <TreeVisualizer />
      case 'graph':
        return <GraphVisualizer />
      case 'trie':
        return <TrieVisualizer />
      case 'linkedlist':
        return <LinkedListVisualizer />
      case 'stack':
        return <StackVisualizer />
      case 'queue':
        return <QueueVisualizer />
      default:
        return <ArrayVisualizer />
    }
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 overflow-x-hidden w-full max-w-full">
        <div className="container mx-auto px-2 sm:px-4 py-3 md:py-8 max-w-full">
          <div className="text-center mb-4 md:mb-8">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-2xl sm:text-3xl md:text-5xl font-extrabold text-white bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-teal-300 to-purple-400"
            >
              Data Structure & Algorithm Visualizer
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-slate-400 text-[10px] sm:text-xs md:text-sm mt-1 sm:mt-2 font-mono px-2"
            >
              State Machines • Amortized Complexity • Self-Balancing Trees • Dijkstra SPT
            </motion.p>
          </div>

          {/* DS Tabs with clean wrapping on mobile */}
          <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2 md:gap-3 mb-4 md:mb-8">
            {dataStructures.map((ds) => (
              <motion.button
                key={ds.id}
                onClick={() => setActiveDS(ds.id)}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                className={`px-2.5 py-1.5 sm:px-4 sm:py-2 md:px-5 md:py-2.5 rounded-xl font-semibold transition-all duration-300 text-xs sm:text-sm flex items-center gap-1.5 ${
                  activeDS === ds.id
                    ? 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/25 border border-purple-400/30'
                    : 'bg-white/5 text-white/80 hover:bg-white/10 backdrop-blur-sm border border-white/10'
                }`}
              >
                <span className="text-sm sm:text-base">{ds.icon}</span>
                <span>{ds.name}</span>
              </motion.button>
            ))}
          </div>

          <motion.div
            key={activeDS}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            className="bg-slate-900/70 backdrop-blur-xl rounded-xl sm:rounded-2xl shadow-2xl border border-white/10 overflow-hidden max-w-full"
          >
            {renderVisualizer()}
          </motion.div>
        </div>
      </div>
      <Analytics />
    </>
  )
}

export default App
