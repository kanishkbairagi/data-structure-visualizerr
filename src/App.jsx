import { useState } from 'react'
import { motion } from 'framer-motion'
import ArrayVisualizer from './components/ArrayVisualizer'
import StackVisualizer from './components/StackVisualizer'
import QueueVisualizer from './components/QueueVisualizer'
import LinkedListVisualizer from './components/LinkedListVisualizer'
import TreeVisualizer from './components/TreeVisualizer'
import GraphVisualizer from './components/GraphVisualizer'

const dataStructures = [
  { id: 'array', name: 'Array', icon: '📊' },
  { id: 'stack', name: 'Stack', icon: '📚' },
  { id: 'queue', name: 'Queue', icon: '🚶' },
  { id: 'linkedlist', name: 'Linked List', icon: '🔗' },
  { id: 'tree', name: 'Tree', icon: '🌳' },
  { id: 'graph', name: 'Graph', icon: '🕸️' },
]

function App() {
  const [activeDS, setActiveDS] = useState('array')

  const renderVisualizer = () => {
    switch (activeDS) {
      case 'array':
        return <ArrayVisualizer />
      case 'stack':
        return <StackVisualizer />
      case 'queue':
        return <QueueVisualizer />
      case 'linkedlist':
        return <LinkedListVisualizer />
      case 'tree':
        return <TreeVisualizer />
      case 'graph':
        return <GraphVisualizer />
      default:
        return <ArrayVisualizer />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl font-bold text-white text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400"
        >
          Data Structure Visualizer
        </motion.h1>

        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {dataStructures.map((ds) => (
            <motion.button
              key={ds.id}
              onClick={() => setActiveDS(ds.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                activeDS === ds.id
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                  : 'bg-white/10 text-white/80 hover:bg-white/20 backdrop-blur-sm'
              }`}
            >
              <span className="mr-2 text-xl">{ds.icon}</span>
              {ds.name}
            </motion.button>
          ))}
        </div>

        <motion.div
          key={activeDS}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-2xl border border-white/20"
        >
          {renderVisualizer()}
        </motion.div>
      </div>
    </div>
  )
}

export default App

