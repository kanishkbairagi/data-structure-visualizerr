import { useState } from 'react'
import { motion } from 'framer-motion'

const GraphVisualizer = () => {
  const [traversalOrder, setTraversalOrder] = useState([])
  const [isTraversing, setIsTraversing] = useState(false)
  const [activeAlgorithm, setActiveAlgorithm] = useState('')
  const [dijkstraDistances, setDijkstraDistances] = useState({})
  const [shortestPathEdges, setShortestPathEdges] = useState([])
  const [highlightedEdge, setHighlightedEdge] = useState(null)
  const [logMessage, setLogMessage] = useState('Select an algorithm: BFS, DFS, or Dijkstra Shortest Path')
  const [targetNode, setTargetNode] = useState(5)
  const [relaxCount, setRelaxCount] = useState(0)

  // Weighted Adjacency List
  const weightedGraph = {
    0: [{ node: 1, weight: 4 }, { node: 2, weight: 2 }],
    1: [{ node: 0, weight: 4 }, { node: 2, weight: 1 }, { node: 3, weight: 5 }, { node: 4, weight: 2 }],
    2: [{ node: 0, weight: 2 }, { node: 1, weight: 1 }, { node: 4, weight: 7 }, { node: 5, weight: 6 }],
    3: [{ node: 1, weight: 5 }, { node: 4, weight: 3 }, { node: 5, weight: 1 }],
    4: [{ node: 1, weight: 2 }, { node: 2, weight: 7 }, { node: 3, weight: 3 }, { node: 5, weight: 2 }],
    5: [{ node: 2, weight: 6 }, { node: 3, weight: 1 }, { node: 4, weight: 2 }]
  }

  // Node positions for visualization
  const nodePositions = {
    0: { x: 380, y: 70 },
    1: { x: 190, y: 190 },
    2: { x: 570, y: 190 },
    3: { x: 170, y: 350 },
    4: { x: 380, y: 280 },
    5: { x: 590, y: 350 }
  }

  // Unique edges for rendering
  const allEdges = []
  const seenEdges = new Set()
  Object.entries(weightedGraph).forEach(([uStr, neighbors]) => {
    const u = parseInt(uStr)
    neighbors.forEach(({ node: v, weight }) => {
      const key = u < v ? `${u}-${v}` : `${v}-${u}`
      if (!seenEdges.has(key)) {
        seenEdges.add(key)
        allEdges.push({ u, v, weight })
      }
    })
  })

  // BFS
  const handleBFS = async () => {
    setIsTraversing(true)
    setActiveAlgorithm('Breadth-First Search (BFS)')
    setShortestPathEdges([])
    setDijkstraDistances({})
    setHighlightedEdge(null)
    setRelaxCount(0)

    const visited = new Set([0])
    const queue = [0]
    const order = []

    setLogMessage('BFS initialized from root Node 0 (Queue: [0])')

    while (queue.length > 0) {
      const curr = queue.shift()
      order.push(curr)
      setTraversalOrder([...order])
      setLogMessage(`Dequeued Node ${curr} - exploring adjacent neighbors`)
      await new Promise(r => setTimeout(r, 600))

      for (const edge of weightedGraph[curr]) {
        if (!visited.has(edge.node)) {
          visited.add(edge.node)
          queue.push(edge.node)
          setHighlightedEdge({ u: curr, v: edge.node })
          await new Promise(r => setTimeout(r, 350))
        }
      }
    }

    setHighlightedEdge(null)
    setLogMessage(`✓ BFS Traversal Complete: [${order.join(' → ')}]`)
    setIsTraversing(false)
  }

  // DFS
  const handleDFS = async () => {
    setIsTraversing(true)
    setActiveAlgorithm('Depth-First Search (DFS)')
    setShortestPathEdges([])
    setDijkstraDistances({})
    setHighlightedEdge(null)
    setRelaxCount(0)

    const visited = new Set()
    const order = []

    setLogMessage('DFS initialized from Node 0')

    const dfsHelper = async (u) => {
      visited.add(u)
      order.push(u)
      setTraversalOrder([...order])
      setLogMessage(`Visiting Node ${u} (Call stack depth: ${visited.size})`)
      await new Promise(r => setTimeout(r, 600))

      for (const edge of weightedGraph[u]) {
        if (!visited.has(edge.node)) {
          setHighlightedEdge({ u, v: edge.node })
          await new Promise(r => setTimeout(r, 350))
          await dfsHelper(edge.node)
        }
      }
    }

    await dfsHelper(0)
    setHighlightedEdge(null)
    setLogMessage(`✓ DFS Traversal Complete: [${order.join(' → ')}]`)
    setIsTraversing(false)
  }

  // Dijkstra's Algorithm
  const handleDijkstra = async () => {
    setIsTraversing(true)
    setActiveAlgorithm("Dijkstra's Shortest Path")
    setTraversalOrder([])
    setShortestPathEdges([])
    setHighlightedEdge(null)

    const nodes = [0, 1, 2, 3, 4, 5]
    const dist = {}
    const prev = {}
    const unvisited = new Set(nodes)

    nodes.forEach(n => {
      dist[n] = n === 0 ? 0 : Infinity
      prev[n] = null
    })
    setDijkstraDistances({ ...dist })
    setLogMessage(`Initialized distances: d[0]=0, d[others]=∞`)
    await new Promise(r => setTimeout(r, 600))

    let relCount = 0
    const visitedSequence = []

    while (unvisited.size > 0) {
      // Find unvisited node with min distance
      let minNode = null
      let minDist = Infinity
      for (const node of unvisited) {
        if (dist[node] < minDist) {
          minDist = dist[node]
          minNode = node
        }
      }

      if (minNode === null || minDist === Infinity) break

      unvisited.delete(minNode)
      visitedSequence.push(minNode)
      setTraversalOrder([...visitedSequence])
      setLogMessage(`Extracted Min-Node ${minNode} with d[${minNode}] = ${minDist}`)
      await new Promise(r => setTimeout(r, 600))

      if (minNode === targetNode) {
        setLogMessage(`Target Node ${targetNode} reached!`)
        break
      }

      // Relax edges
      for (const edge of weightedGraph[minNode]) {
        if (unvisited.has(edge.node)) {
          setHighlightedEdge({ u: minNode, v: edge.node })
          await new Promise(r => setTimeout(r, 350))

          const newDist = dist[minNode] + edge.weight
          if (newDist < dist[edge.node]) {
            dist[edge.node] = newDist
            prev[edge.node] = minNode
            relCount++
            setRelaxCount(relCount)
            setDijkstraDistances({ ...dist })
            setLogMessage(`Relaxed edge (${minNode} ➔ ${edge.node}): d[${edge.node}] updated to ${newDist}`)
            await new Promise(r => setTimeout(r, 500))
          }
        }
      }
    }

    // Reconstruct shortest path to target
    const pathEdges = []
    let curr = targetNode
    while (prev[curr] !== null && prev[curr] !== undefined) {
      pathEdges.push({ u: prev[curr], v: curr })
      curr = prev[curr]
    }
    setHighlightedEdge(null)
    setShortestPathEdges(pathEdges)
    setLogMessage(`✓ Optimal Shortest Path to Node ${targetNode} found with Total Cost = ${dist[targetNode]}!`)
    setIsTraversing(false)
  }

  const isEdgeInShortestPath = (u, v) => {
    return shortestPathEdges.some(
      e => (e.u === u && e.v === v) || (e.u === v && e.v === u)
    )
  }

  const isEdgeCurrentlyRelaxing = (u, v) => {
    if (!highlightedEdge) return false
    return (
      (highlightedEdge.u === u && highlightedEdge.v === v) ||
      (highlightedEdge.u === v && highlightedEdge.v === u)
    )
  }

  return (
    <div className="p-3 md:p-6 text-white">
      {/* Header and Complexity HUD */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-indigo-400">
            Weighted Graph & Dijkstra Visualizer
          </h2>
          <p className="text-xs md:text-sm text-slate-300 mt-1">
            Shortest Path Tree (SPT), Priority Queue Edge Relaxation & Traversals
          </p>
        </div>

        <div className="flex gap-3 bg-white/10 px-4 py-2 rounded-xl backdrop-blur-md border border-white/10 text-xs">
          <div>
            <span className="text-slate-400 block font-mono">Dijkstra Complexity</span>
            <span className="text-purple-300 font-bold font-mono">O((V + E) log V)</span>
          </div>
          <div className="border-l border-white/20 pl-3">
            <span className="text-slate-400 block font-mono">BFS / DFS Complexity</span>
            <span className="text-emerald-400 font-bold font-mono">O(V + E)</span>
          </div>
          <div className="border-l border-white/20 pl-3">
            <span className="text-slate-400 block font-mono">Edge Relaxations</span>
            <span className="text-amber-400 font-bold font-mono">{relaxCount} relaxed</span>
          </div>
        </div>
      </div>

      {/* Action / State Banner */}
      <div className="mb-4 px-4 py-2.5 bg-slate-800/80 rounded-lg border border-purple-500/30 flex items-center justify-between text-sm">
        <span className="text-purple-300 font-medium">⚡ {logMessage}</span>
        {activeAlgorithm && (
          <span className="text-xs font-mono bg-purple-900/60 text-purple-200 border border-purple-400/40 px-2 py-0.5 rounded">
            {activeAlgorithm}
          </span>
        )}
      </div>

      {/* Distance HUD Table for Dijkstra */}
      {Object.keys(dijkstraDistances).length > 0 && (
        <div className="mb-4 p-3 bg-slate-900/70 rounded-xl border border-white/10 overflow-x-auto">
          <div className="text-xs uppercase font-mono text-purple-300 mb-2">
            Current Distance Vector (d[u] from Source 0):
          </div>
          <div className="flex gap-2 min-w-max">
            {[0, 1, 2, 3, 4, 5].map(node => (
              <div
                key={node}
                className={`px-3 py-1.5 rounded-lg border text-xs font-mono text-center ${
                  traversalOrder.includes(node)
                    ? 'bg-purple-600/30 border-purple-400 text-purple-200'
                    : 'bg-white/5 border-white/10 text-slate-300'
                }`}
              >
                <div>Node {node}</div>
                <div className="font-bold text-sm text-white">
                  {dijkstraDistances[node] === Infinity ? '∞' : dijkstraDistances[node]}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SVG Canvas */}
      <div className="bg-slate-950/60 rounded-xl p-4 overflow-x-auto border border-white/10 mb-6">
        <svg width="780" height="420" className="overflow-visible mx-auto block">
          {/* Edges with weights */}
          {allEdges.map(({ u, v, weight }) => {
            const p1 = nodePositions[u]
            const p2 = nodePositions[v]
            const inShortestPath = isEdgeInShortestPath(u, v)
            const isRelaxing = isEdgeCurrentlyRelaxing(u, v)

            const strokeColor = inShortestPath
              ? '#10b981'
              : isRelaxing
              ? '#f59e0b'
              : 'rgba(255, 255, 255, 0.25)'

            const strokeWidth = inShortestPath ? 4 : isRelaxing ? 3 : 2

            // Midpoint for weight badge
            const midX = (p1.x + p2.x) / 2
            const midY = (p1.y + p2.y) / 2

            return (
              <g key={`edge-${u}-${v}`}>
                <line
                  x1={p1.x}
                  y1={p1.y}
                  x2={p2.x}
                  y2={p2.y}
                  stroke={strokeColor}
                  strokeWidth={strokeWidth}
                />
                {/* Weight badge */}
                <rect
                  x={midX - 11}
                  y={midY - 9}
                  width="22"
                  height="18"
                  rx="4"
                  fill="#1e293b"
                  stroke={inShortestPath ? '#10b981' : '#475569'}
                  strokeWidth="1"
                />
                <text
                  x={midX}
                  y={midY + 3}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill={inShortestPath ? '#34d399' : '#cbd5e1'}
                  fontSize="10"
                  fontWeight="bold"
                >
                  {weight}
                </text>
              </g>
            )
          })}

          {/* Nodes */}
          {Object.entries(nodePositions).map(([nodeStr, pos]) => {
            const node = parseInt(nodeStr)
            const isVisited = traversalOrder.includes(node)
            const isCurrent = traversalOrder.length > 0 && traversalOrder[traversalOrder.length - 1] === node
            const isTarget = node === targetNode

            return (
              <g key={`node-${node}`}>
                <motion.circle
                  cx={pos.x}
                  cy={pos.y}
                  r="24"
                  stroke={
                    isCurrent
                      ? '#f59e0b'
                      : isTarget && isVisited
                      ? '#10b981'
                      : isVisited
                      ? '#8b5cf6'
                      : '#64748b'
                  }
                  strokeWidth={isCurrent || isTarget ? 3 : 2}
                  fill={
                    isCurrent
                      ? '#d97706'
                      : isTarget && isVisited
                      ? '#059669'
                      : isVisited
                      ? '#6d28d9'
                      : '#0f172a'
                  }
                  initial={{ scale: 0 }}
                  animate={{ scale: isCurrent ? 1.25 : 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                />
                <text
                  x={pos.x}
                  y={pos.y + 1}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="white"
                  fontWeight="bold"
                  fontSize="14"
                >
                  {node}
                </text>
              </g>
            )
          })}
        </svg>

        <div className="flex justify-center items-center gap-6 mt-2 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-slate-900 border border-slate-500 inline-block" />
            <span>Unvisited</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-purple-700 inline-block" />
            <span>Visited / In Closed Set</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-amber-500 inline-block" />
            <span>Active Relaxing</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
            <span>Shortest Path (SPT)</span>
          </div>
        </div>
      </div>

      {/* Control Panel */}
      <div className="bg-white/5 rounded-xl p-4 border border-white/10 space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <label className="text-xs text-slate-300 font-mono">Target Node:</label>
            <select
              value={targetNode}
              onChange={(e) => setTargetNode(parseInt(e.target.value))}
              disabled={isTraversing}
              className="bg-white/10 border border-white/20 text-white rounded-lg px-3 py-1.5 text-sm outline-none"
            >
              {[1, 2, 3, 4, 5].map(n => (
                <option key={n} value={n} className="bg-slate-900 text-white">
                  Node {n}
                </option>
              ))}
            </select>
            <button
              onClick={handleDijkstra}
              disabled={isTraversing}
              className="px-5 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 font-semibold rounded-lg text-sm transition-all"
            >
              Run Dijkstra Shortest Path
            </button>
          </div>

          <div className="flex gap-2 w-full sm:w-auto">
            <button
              onClick={handleBFS}
              disabled={isTraversing}
              className="flex-1 sm:flex-none px-4 py-2 bg-blue-600/40 hover:bg-blue-600/60 border border-blue-500/40 rounded-lg text-xs font-semibold transition"
            >
              BFS
            </button>
            <button
              onClick={handleDFS}
              disabled={isTraversing}
              className="flex-1 sm:flex-none px-4 py-2 bg-emerald-600/40 hover:bg-emerald-600/60 border border-emerald-500/40 rounded-lg text-xs font-semibold transition"
            >
              DFS
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GraphVisualizer
