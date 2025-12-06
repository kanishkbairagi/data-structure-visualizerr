import { useState } from 'react'
import { motion } from 'framer-motion'

const GraphVisualizer = () => {
  const [traversalOrder, setTraversalOrder] = useState([])
  const [isTraversing, setIsTraversing] = useState(false)
  const [traversalType, setTraversalType] = useState('')

  // Sample graph (adjacency list representation)
  const graph = {
    0: [1, 2],
    1: [0, 3, 4],
    2: [0, 5],
    3: [1],
    4: [1, 5],
    5: [2, 4]
  }

  // Node positions for visualization
  const nodePositions = {
    0: { x: 400, y: 100 },
    1: { x: 250, y: 250 },
    2: { x: 550, y: 250 },
    3: { x: 150, y: 400 },
    4: { x: 300, y: 400 },
    5: { x: 600, y: 400 }
  }

  const bfs = (start) => {
    const visited = new Set()
    const queue = [start]
    const result = []
    
    visited.add(start)
    
    while (queue.length > 0) {
      const node = queue.shift()
      result.push(node)
      
      for (const neighbor of graph[node]) {
        if (!visited.has(neighbor)) {
          visited.add(neighbor)
          queue.push(neighbor)
        }
      }
    }
    
    return result
  }

  const dfs = (start) => {
    const visited = new Set()
    const result = []
    
    const dfsHelper = (node) => {
      visited.add(node)
      result.push(node)
      
      for (const neighbor of graph[node]) {
        if (!visited.has(neighbor)) {
          dfsHelper(neighbor)
        }
      }
    }
    
    dfsHelper(start)
    return result
  }

  const animateTraversal = async (order, type) => {
    setIsTraversing(true)
    setTraversalType(type)
    setTraversalOrder([])
    
    for (let i = 0; i < order.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 600))
      setTraversalOrder(order.slice(0, i + 1))
    }
    
    setTimeout(() => {
      setTraversalOrder([])
      setTraversalType('')
      setIsTraversing(false)
    }, 1000)
  }

  const handleBFS = () => {
    const order = bfs(0)
    animateTraversal(order, 'BFS')
  }

  const handleDFS = () => {
    const order = dfs(0)
    animateTraversal(order, 'DFS')
  }

  const isHighlighted = (node) => {
    return traversalOrder.length > 0 && traversalOrder[traversalOrder.length - 1] === node
  }

  const isVisited = (node) => {
    return traversalOrder.includes(node)
  }

  const isEdgeHighlighted = (from, to) => {
    const fromIndex = traversalOrder.indexOf(from)
    const toIndex = traversalOrder.indexOf(to)
    return fromIndex !== -1 && toIndex !== -1 && Math.abs(fromIndex - toIndex) === 1
  }

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold text-white mb-6 text-center">Graph Traversal Visualizer</h2>
      
      <div className="flex flex-col items-center gap-8 mb-8">
        <div className="bg-white/5 rounded-lg p-8 overflow-x-auto">
          <svg width="800" height="500" className="overflow-visible">
            {/* Draw edges */}
            {Object.entries(graph).map(([node, neighbors]) => {
              const fromPos = nodePositions[parseInt(node)]
              return neighbors.map((neighbor) => {
                const toPos = nodePositions[neighbor]
                const highlighted = isEdgeHighlighted(parseInt(node), neighbor)
                return (
                  <line
                    key={`${node}-${neighbor}`}
                    x1={fromPos.x}
                    y1={fromPos.y}
                    x2={toPos.x}
                    y2={toPos.y}
                    stroke={highlighted ? '#f59e0b' : 'rgba(255, 255, 255, 0.3)'}
                    strokeWidth={highlighted ? 3 : 2}
                  />
                )
              })
            })}

            {/* Draw nodes */}
            {Object.entries(nodePositions).map(([node, pos]) => {
              const nodeNum = parseInt(node)
              const highlighted = isHighlighted(nodeNum)
              const visited = isVisited(nodeNum)
              
              return (
                <g key={node}>
                  <motion.circle
                    cx={pos.x}
                    cy={pos.y}
                    r="30"
                    stroke="white"
                    strokeWidth="3"
                    fill={highlighted ? '#f59e0b' : visited ? '#10b981' : '#3b82f6'}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  />
                  <text
                    x={pos.x}
                    y={pos.y}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="white"
                    fontWeight="bold"
                    fontSize="18"
                  >
                    {node}
                  </text>
                </g>
              )
            })}
          </svg>
        </div>

        {traversalOrder.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold"
          >
            {traversalType} Traversal: {traversalOrder.join(' → ')}
          </motion.div>
        )}
      </div>

      <div className="bg-white/5 rounded-lg p-4 space-y-4">
        <div className="flex flex-wrap gap-4 justify-center">
          <button
            onClick={handleBFS}
            disabled={isTraversing}
            className="px-8 py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-500 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition-colors text-lg"
          >
            Breadth-First Search (BFS)
          </button>
          <button
            onClick={handleDFS}
            disabled={isTraversing}
            className="px-8 py-3 bg-green-500 hover:bg-green-600 disabled:bg-gray-500 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition-colors text-lg"
          >
            Depth-First Search (DFS)
          </button>
        </div>
        <div className="text-white/70 text-sm text-center space-y-2">
          <p>Starting node: 0</p>
          <p>Click a traversal method to see the animated graph traversal</p>
        </div>
      </div>
    </div>
  )
}

export default GraphVisualizer

