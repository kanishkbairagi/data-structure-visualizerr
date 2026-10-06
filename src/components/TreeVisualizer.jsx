import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

class AVLNode {
  constructor(val) {
    this.value = val
    this.left = null
    this.right = null
    this.height = 1
  }
}

const TreeVisualizer = () => {
  // Tree state
  const [treeRoot, setTreeRoot] = useState(() => {
    // Initial balanced tree: 10, 5, 15, 3, 7, 12, 18
    let root = new AVLNode(15)
    const insertBST = (node, val) => {
      if (!node) return new AVLNode(val)
      if (val < node.value) node.left = insertBST(node.left, val)
      else if (val > node.value) node.right = insertBST(node.right, val)
      return node
    }
    ;[10, 20, 5, 12, 18, 25].forEach(v => {
      root = insertBST(root, v)
    })
    return root
  })

  const [inputVal, setInputVal] = useState('')
  const [traversalOrder, setTraversalOrder] = useState([])
  const [isTraversing, setIsTraversing] = useState(false)
  const [lastActionLog, setLastActionLog] = useState('Initialized balanced Binary Search Tree')
  const [lastRotation, setLastRotation] = useState(null)
  const [mode, setMode] = useState('AVL') // 'AVL' | 'BST'

  // AVL Helper functions
  const getHeight = (node) => (node ? node.height : 0)
  const getBalance = (node) => (node ? getHeight(node.left) - getHeight(node.right) : 0)

  const rightRotate = (y) => {
    const x = y.left
    const T2 = x.right
    x.right = y
    y.left = T2
    y.height = Math.max(getHeight(y.left), getHeight(y.right)) + 1
    x.height = Math.max(getHeight(x.left), getHeight(x.right)) + 1
    return x
  }

  const leftRotate = (x) => {
    const y = x.right
    const T2 = y.left
    y.left = x
    x.right = T2
    x.height = Math.max(getHeight(x.left), getHeight(x.right)) + 1
    y.height = Math.max(getHeight(y.left), getHeight(y.right)) + 1
    return y
  }

  // Deep clone tree
  const cloneTree = (node) => {
    if (!node) return null
    const copy = new AVLNode(node.value)
    copy.height = node.height
    copy.left = cloneTree(node.left)
    copy.right = cloneTree(node.right)
    return copy
  }

  // Insert AVL
  const insertAVL = (node, val, rotationRef) => {
    if (!node) return new AVLNode(val)

    if (val < node.value) {
      node.left = insertAVL(node.left, val, rotationRef)
    } else if (val > node.value) {
      node.right = insertAVL(node.right, val, rotationRef)
    } else {
      return node // Duplicate
    }

    node.height = 1 + Math.max(getHeight(node.left), getHeight(node.right))
    const balance = getBalance(node)

    // Left Left Case
    if (balance > 1 && val < node.left.value) {
      rotationRef.type = 'LL (Right Rotation)'
      return rightRotate(node)
    }

    // Right Right Case
    if (balance < -1 && val > node.right.value) {
      rotationRef.type = 'RR (Left Rotation)'
      return leftRotate(node)
    }

    // Left Right Case
    if (balance > 1 && val > node.left.value) {
      rotationRef.type = 'LR (Left-Right Double Rotation)'
      node.left = leftRotate(node.left)
      return rightRotate(node)
    }

    // Right Left Case
    if (balance < -1 && val < node.right.value) {
      rotationRef.type = 'RL (Right-Left Double Rotation)'
      node.right = rightRotate(node.right)
      return leftRotate(node)
    }

    return node
  }

  // Standard BST insert without balancing
  const insertStandardBST = (node, val) => {
    if (!node) return new AVLNode(val)
    if (val < node.value) node.left = insertStandardBST(node.left, val)
    else if (val > node.value) node.right = insertStandardBST(node.right, val)
    node.height = 1 + Math.max(getHeight(node.left), getHeight(node.right))
    return node
  }

  const handleInsert = () => {
    const val = parseInt(inputVal)
    if (isNaN(val)) return

    const rotationRef = { type: null }
    const cloned = cloneTree(treeRoot)
    const newRoot = mode === 'AVL'
      ? insertAVL(cloned, val, rotationRef)
      : insertStandardBST(cloned, val)

    setTreeRoot(newRoot)
    setInputVal('')

    if (rotationRef.type) {
      setLastRotation(rotationRef.type)
      setLastActionLog(`⚖️ Inserted ${val} → Triggered ${rotationRef.type} to preserve AVL invariants!`)
    } else {
      setLastRotation(null)
      setLastActionLog(`✓ Inserted ${val} into tree (Balanced BF maintained)`)
    }
  }

  // Layout algorithm for dynamic rendering
  const calculatePositions = (node, x = 400, y = 50, level = 0, spread = 180, positions = {}) => {
    if (!node) return positions

    const bf = getBalance(node)
    positions[node.value] = { x, y, level, height: node.height, balanceFactor: bf }
    const nextSpread = Math.max(38, spread * 0.55)

    if (node.left) {
      calculatePositions(node.left, x - nextSpread, y + 80, level + 1, nextSpread, positions)
    }
    if (node.right) {
      calculatePositions(node.right, x + nextSpread, y + 80, level + 1, nextSpread, positions)
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

  // Traversals
  const inorder = (node, res = []) => {
    if (!node) return res
    inorder(node.left, res)
    res.push(node.value)
    inorder(node.right, res)
    return res
  }

  const preorder = (node, res = []) => {
    if (!node) return res
    res.push(node.value)
    preorder(node.left, res)
    preorder(node.right, res)
    return res
  }

  const postorder = (node, res = []) => {
    if (!node) return res
    postorder(node.left, res)
    postorder(node.right, res)
    res.push(node.value)
    return res
  }

  const levelorder = (node) => {
    if (!node) return []
    const queue = [node]
    const res = []
    while (queue.length > 0) {
      const curr = queue.shift()
      res.push(curr.value)
      if (curr.left) queue.push(curr.left)
      if (curr.right) queue.push(curr.right)
    }
    return res
  }

  const animateTraversal = async (order, name) => {
    setIsTraversing(true)
    setTraversalOrder([])
    setLastActionLog(`Running ${name} Traversal...`)

    for (let i = 0; i < order.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 550))
      setTraversalOrder(order.slice(0, i + 1))
    }

    setLastActionLog(`✓ ${name} Traversal complete: [${order.join(', ')}]`)
    setTimeout(() => {
      setIsTraversing(false)
      setTraversalOrder([])
    }, 2500)
  }

  const countNodes = (node) => {
    if (!node) return 0
    return 1 + countNodes(node.left) + countNodes(node.right)
  }

  const totalNodes = countNodes(treeRoot)
  const treeHeight = getHeight(treeRoot)
  const positions = calculatePositions(treeRoot)
  const edges = getAllEdges(treeRoot)

  return (
    <div className="p-3 md:p-6 text-white">
      {/* Header & Academic Complexity HUD */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-300 to-green-400">
              {mode === 'AVL' ? 'Self-Balancing AVL Tree' : 'Binary Search Tree'}
            </h2>
            <button
              onClick={() => setMode(mode === 'AVL' ? 'BST' : 'AVL')}
              className="text-xs px-2.5 py-1 bg-white/10 hover:bg-white/20 border border-white/20 rounded-md font-mono"
            >
              Switch to {mode === 'AVL' ? 'Standard BST' : 'AVL Mode'}
            </button>
          </div>
          <p className="text-xs md:text-sm text-slate-300 mt-1">
            Dynamic Height Rebalancing via LL, RR, LR & RL Rotations
          </p>
        </div>

        <div className="flex gap-3 bg-white/10 px-4 py-2 rounded-xl backdrop-blur-md border border-white/10 text-xs">
          <div>
            <span className="text-slate-400 block font-mono">Time Complexity</span>
            <span className="text-emerald-400 font-bold font-mono">
              {mode === 'AVL' ? 'O(log N) Guaranteed' : 'O(N) Worst / O(log N) Avg'}
            </span>
          </div>
          <div className="border-l border-white/20 pl-3">
            <span className="text-slate-400 block font-mono">Tree Height (h)</span>
            <span className="text-cyan-400 font-bold font-mono">{treeHeight} levels</span>
          </div>
          <div className="border-l border-white/20 pl-3">
            <span className="text-slate-400 block font-mono">Total Nodes</span>
            <span className="text-amber-400 font-bold font-mono">{totalNodes} nodes</span>
          </div>
        </div>
      </div>

      {/* Action / Rebalance Banner */}
      <div className="mb-4 px-4 py-2.5 bg-slate-800/80 rounded-lg border border-emerald-500/30 flex items-center justify-between text-sm">
        <span className="text-emerald-300 font-medium">⚡ {lastActionLog}</span>
        {lastRotation && (
          <span className="text-xs font-mono bg-amber-500/30 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded">
            {lastRotation}
          </span>
        )}
      </div>

      {/* SVG Canvas for Tree */}
      <div className="bg-slate-950/60 rounded-xl p-4 overflow-x-auto border border-white/10 mb-6">
        <svg width="800" height="420" className="overflow-visible mx-auto block">
          {/* Edges */}
          {edges.map((edge, idx) => {
            const fromPos = positions[edge.from]
            const toPos = positions[edge.to]
            if (!fromPos || !toPos) return null

            return (
              <line
                key={`edge-${edge.from}-${edge.to}-${idx}`}
                x1={fromPos.x}
                y1={fromPos.y + 22}
                x2={toPos.x}
                y2={toPos.y - 22}
                stroke="rgba(255, 255, 255, 0.4)"
                strokeWidth="2"
              />
            )
          })}

          {/* Nodes */}
          {Object.entries(positions).map(([valStr, pos]) => {
            const val = parseInt(valStr)
            const isHighlighted = traversalOrder.length > 0 && traversalOrder[traversalOrder.length - 1] === val
            const isVisited = traversalOrder.includes(val)
            const bf = pos.balanceFactor

            return (
              <g key={`node-${val}`}>
                <motion.circle
                  cx={pos.x}
                  cy={pos.y}
                  r="22"
                  stroke={isHighlighted ? '#f59e0b' : Math.abs(bf) > 1 ? '#ef4444' : '#10b981'}
                  strokeWidth="2.5"
                  fill={isHighlighted ? '#d97706' : isVisited ? '#059669' : '#1e293b'}
                  initial={{ scale: 0 }}
                  animate={{ scale: isHighlighted ? 1.25 : 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                />
                <text
                  x={pos.x}
                  y={pos.y - 1}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="white"
                  fontWeight="bold"
                  fontSize="13"
                >
                  {val}
                </text>
                {/* Balance Factor badge */}
                <rect
                  x={pos.x + 10}
                  y={pos.y - 24}
                  width="22"
                  height="14"
                  rx="4"
                  fill={Math.abs(bf) > 1 ? '#b91c1c' : '#334155'}
                  stroke={Math.abs(bf) > 1 ? '#f87171' : '#64748b'}
                  strokeWidth="1"
                />
                <text
                  x={pos.x + 21}
                  y={pos.y - 16}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="white"
                  fontSize="9"
                  fontWeight="bold"
                >
                  {bf >= 0 ? `+${bf}` : bf}
                </text>
              </g>
            )
          })}
        </svg>

        <div className="flex justify-center items-center gap-6 mt-2 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-slate-800 border border-emerald-400 inline-block" />
            <span>Balanced Node (BF ∈ &#123;-1, 0, 1&#125;)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-1.5 py-0.5 rounded bg-slate-700 text-[10px] font-mono border border-slate-500">
              BF: +1
            </span>
            <span>Balance Factor badge (h_L - h_R)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-amber-500 inline-block" />
            <span>Active Traversal Node</span>
          </div>
        </div>
      </div>

      {/* Traversal display */}
      {traversalOrder.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 px-6 py-2.5 bg-emerald-950/70 border border-emerald-500/40 rounded-xl text-center font-mono text-sm text-emerald-200"
        >
          Traversal Sequence: {traversalOrder.join(' ➔ ')}
        </motion.div>
      )}

      {/* Controls & Operations */}
      <div className="bg-white/5 rounded-xl p-4 border border-white/10 space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="number"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleInsert()}
            placeholder="Enter integer to insert (e.g. 14, 30)"
            className="flex-1 px-4 py-2 rounded-lg bg-white/10 text-white placeholder-white/40 border border-white/20 focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
          />
          <button
            onClick={handleInsert}
            disabled={isTraversing}
            className="px-6 py-2 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 font-semibold rounded-lg text-sm transition-all"
          >
            Insert Node {mode === 'AVL' && '(Auto-Balance)'}
          </button>
          <button
            onClick={() => {
              setTreeRoot(null)
              setLastActionLog('Tree cleared.')
            }}
            className="px-4 py-2 bg-rose-500/20 hover:bg-rose-500/40 text-rose-300 border border-rose-500/30 rounded-lg text-xs font-semibold"
          >
            Clear
          </button>
        </div>

        <div className="pt-2 border-t border-white/10">
          <span className="text-xs font-mono text-slate-400 block mb-2 uppercase">
            Algorithmic Tree Traversals:
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <button
              onClick={() => animateTraversal(inorder(treeRoot), 'Inorder (LNR - Sorted)')}
              disabled={isTraversing || !treeRoot}
              className="px-3 py-2 bg-emerald-600/40 hover:bg-emerald-600/60 border border-emerald-500/40 rounded-lg text-xs font-semibold transition"
            >
              Inorder (Sorted)
            </button>
            <button
              onClick={() => animateTraversal(preorder(treeRoot), 'Preorder (NLR)')}
              disabled={isTraversing || !treeRoot}
              className="px-3 py-2 bg-blue-600/40 hover:bg-blue-600/60 border border-blue-500/40 rounded-lg text-xs font-semibold transition"
            >
              Preorder (NLR)
            </button>
            <button
              onClick={() => animateTraversal(postorder(treeRoot), 'Postorder (LRN)')}
              disabled={isTraversing || !treeRoot}
              className="px-3 py-2 bg-purple-600/40 hover:bg-purple-600/60 border border-purple-500/40 rounded-lg text-xs font-semibold transition"
            >
              Postorder (LRN)
            </button>
            <button
              onClick={() => animateTraversal(levelorder(treeRoot), 'Level-Order (BFS)')}
              disabled={isTraversing || !treeRoot}
              className="px-3 py-2 bg-amber-600/40 hover:bg-amber-600/60 border border-amber-500/40 rounded-lg text-xs font-semibold transition"
            >
              Level-Order (BFS)
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TreeVisualizer
