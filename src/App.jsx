import { useState } from 'react'
import { motion } from 'framer-motion'
import ArrayVisualizer from './components/ArrayVisualizer'
import StackVisualizer from './components/StackVisualizer'
import QueueVisualizer from './components/QueueVisualizer'
import LinkedListVisualizer from './components/LinkedListVisualizer'
import TreeVisualizer from './components/TreeVisualizer'
import GraphVisualizer from './components/GraphVisualizer'
import TrieVisualizer from './components/TrieVisualizer'

const dataStructures = [
  { id: 'array', name: 'Dynamic Array', icon: '📊' },
  { id: 'tree', name: 'AVL Tree (Self-Balancing)', icon: '🌳' },
  { id: 'graph', name: 'Weighted Graph (Dijkstra)', icon: '🕸️' },
  { id: 'trie', name: 'Trie (Prefix Tree)', icon: '🌲' },
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
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950">
      <div className="container mx-auto px-4 py-4 md:py-8">
        <div className="text-center mb-6 md:mb-8">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-5xl font-extrabold text-white bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-teal-300 to-purple-400"
          >
            Data Structure & Algorithm Visualizer
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-slate-400 text-xs md:text-sm mt-2 font-mono"
          >
            State Machines • Amortized Complexity Analysis • Self-Balancing Trees • Shortest Path SPT
          </motion.p>
        </div>

        <div className="flex flex-wrap justify-center gap-2 md:gap-3 mb-6 md:mb-8">
          {dataStructures.map((ds) => (
            <motion.button
              key={ds.id}
              onClick={() => setActiveDS(ds.id)}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className={`px-3 py-2 md:px-5 md:py-2.5 rounded-xl font-semibold transition-all duration-300 text-xs md:text-sm flex items-center gap-2 ${
                activeDS === ds.id
                  ? 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/25 border border-purple-400/30'
                  : 'bg-white/5 text-white/80 hover:bg-white/10 backdrop-blur-sm border border-white/10'
              }`}
            >
              <span className="text-base">{ds.icon}</span>
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
          className="bg-slate-900/70 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10"
        >
          {renderVisualizer()}
        </motion.div>
      </div>
    </div>
  )
}

export default App
