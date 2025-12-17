import { useState } from 'react'
import { motion } from 'framer-motion'

const TreeVisualizer = () => {
  const [traversalOrder, setTraversalOrder] = useState([])
  const [isTraversing, setIsTraversing] = useState(false)

  // Sample binary tree structure
  const [tree] = useState({
    value: 10,
    left: {
      value: 5,
      left: { value: 3, left: null, right: null },
      right: { value: 7, left: null, right: null }
    },
    right: {
      value: 15,
      left: { value: 12, left: null, right: null },
      right: { value: 18, left: null, right: null }
    }
  })

  const calculatePositions = (node, x, y, level = 0, positions = {}) => {
    if (!node) return positions

    positions[node.value] = { x, y, level, node }
    const spacing = Math.max(80, 200 - level * 40)

    if (node.left) {
      calculatePositions(node.left, x - spacing, y + 100, level + 1, positions)
    }
    if (node.right) {
      calculatePositions(node.right, x + spacing, y + 100, level + 1, positions)
    }

    return positions
  }

  const getAllEdges = (node, edges = []) => {
    if (!node) return edges

    if (node.left) {
      edges.push({ from: node.value, to: node.left.value })
      getAllEdges(node.left, edges)
    }
    if (node.right) {
      edges.push({ from: node.value, to: node.right.value })
      getAllEdges(node.right, edges)
    }

    return edges
  }

  const inorderTraversal = (node, result = []) => {
    if (!node) return result
    inorderTraversal(node.left, result)
    result.push(node.value)
    inorderTraversal(node.right, result)
    return result
  }

  const preorderTraversal = (node, result = []) => {
    if (!node) return result
    result.push(node.value)
    preorderTraversal(node.left, result)
    preorderTraversal(node.right, result)
    return result
  }

  const postorderTraversal = (node, result = []) => {
    if (!node) return result
    postorderTraversal(node.left, result)
    postorderTraversal(node.right, result)
    result.push(node.value)
    return result
  }

  const animateTraversal = async (order) => {
    setIsTraversing(true)
    setTraversalOrder([])

    for (let i = 0; i < order.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 800))
      setTraversalOrder(order.slice(0, i + 1))
    }

    setTimeout(() => {
      setTraversalOrder([])
      setIsTraversing(false)
    }, 1000)
  }

  const handleInorder = () => {
    const order = inorderTraversal(tree)
    animateTraversal(order)
  }

  const handlePreorder = () => {
    const order = preorderTraversal(tree)
    animateTraversal(order)
  }

  const handlePostorder = () => {
    const order = postorderTraversal(tree)
    animateTraversal(order)
  }

  const positions = calculatePositions(tree, 400, 50)
  const edges = getAllEdges(tree)

  return (
    <div className="p-3 md:p-6">
      <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 text-center">Binary Tree Visualizer</h2>

      <div className="flex flex-col items-center gap-8 mb-8">
        <div className="bg-white/5 rounded-lg p-2 md:p-8 overflow-x-auto w-full">
          <svg width="800" height="500" className="overflow-visible">
            {/* Draw edges */}
            {edges.map((edge, idx) => {
              const fromPos = positions[edge.from]
              const toPos = positions[edge.to]
              if (!fromPos || !toPos) return null

              return (
                <line
                  key={`${edge.from}-${edge.to}-${idx}`}
                  x1={fromPos.x}
                  y1={fromPos.y + 25}
                  x2={toPos.x}
                  y2={toPos.y - 25}
                  stroke="rgba(255, 255, 255, 0.5)"
                  strokeWidth="2"
                />
              )
            })}

            {/* Draw nodes */}
            {Object.entries(positions).map(([value, pos]) => {
              const nodeValue = parseInt(value)
              const isHighlighted = traversalOrder.length > 0 && traversalOrder[traversalOrder.length - 1] === nodeValue
              const isVisited = traversalOrder.includes(nodeValue)

              return (
                <g key={value}>
                  <motion.circle
                    cx={pos.x}
                    cy={pos.y}
                    r="25"
                    stroke="white"
                    strokeWidth="2"
                    fill={isHighlighted ? '#f59e0b' : isVisited ? '#10b981' : '#3b82f6'}
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
                    fontSize="14"
                  >
                    {value}
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
            Traversal: {traversalOrder.join(' → ')}
          </motion.div>
        )}
      </div>

      <div className="bg-white/5 rounded-lg p-3 md:p-4 space-y-4">
        <div className="flex flex-col sm:flex-row flex-wrap gap-2 md:gap-4 justify-center">
          <button
            onClick={handlePreorder}
            disabled={isTraversing}
            className="px-6 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-500 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition-colors w-full sm:w-auto text-sm md:text-base"
          >
            Preorder (NLR)
          </button>
          <button
            onClick={handleInorder}
            disabled={isTraversing}
            className="px-6 py-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-500 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition-colors w-full sm:w-auto text-sm md:text-base"
          >
            Inorder (LNR)
          </button>
          <button
            onClick={handlePostorder}
            disabled={isTraversing}
            className="px-6 py-2 bg-purple-500 hover:bg-purple-600 disabled:bg-gray-500 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition-colors w-full sm:w-auto text-sm md:text-base"
          >
            Postorder (LRN)
          </button>
        </div>
        <div className="text-white/70 text-sm text-center">
          Click a traversal method to see the animated traversal
        </div>
      </div>
    </div>
  )
}

export default TreeVisualizer

