import { useState } from 'react'
import { motion } from 'framer-motion'

const GraphVisualizer = () => {
  const [traversalOrder, setTraversalOrder] = useState([])
  const [isTraversing, setIsTraversing] = useState(false)
  const [activeAlgorithm, setActiveAlgorithm] = useState('')
  const [dijkstraDistances, setDijkstraDistances] = useState({})
  const [shortestPathEdges, setShortestPathEdges] = useState([])
  const [highlightedEdge, setHighlightedEdge] = useState(null)
  const [logMessage, setLogMessage] = useState('Select an algorithm: BFS, DFS, or Dijkstra')
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
    setActiveAlgorithm('BFS')
    setShortestPathEdges([])
    setDijkstraDistances({})
    setHighlightedEdge(null)
    setRelaxCount(0)

    const visited = new Set([0])
    const queue = [0]
    const order = []

    setLogMessage('BFS initialized from Node 0')

    while (queue.length > 0) {
      const curr = queue.shift()
      order.push(curr)
      setTraversalOrder([...order])
      setLogMessage(`Dequeued Node ${curr}`)
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
    setLogMessage(`✓ BFS: [${order.join(' → ')}]`)
    setIsTraversing(false)
  }

  // DFS
  const handleDFS = async () => {
    setIsTraversing(true)
    setActiveAlgorithm('DFS')
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
      setLogMessage(`Visiting Node ${u}`)
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
    setLogMessage(`✓ DFS: [${order.join(' → ')}]`)
    setIsTraversing(false)
  }

  // Dijkstra's Algorithm
  const handleDijkstra = async () => {
    setIsTraversing(true)
    setActiveAlgorithm("Dijkstra")
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
    setLogMessage(`Initialized: d[0]=0, others=∞`)
    await new Promise(r => setTimeout(r, 600))

    let relCount = 0
    const visitedSequence = []

    while (unvisited.size > 0) {
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
      setLogMessage(`Min Node ${minNode} (d=${minDist})`)
      await new Promise(r => setTimeout(r, 600))

      if (minNode === targetNode) {
        setLogMessage(`Target Node ${targetNode} reached!`)
        break
      }

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
            setLogMessage(`Relaxed edge (${minNode}➔${edge.node}): d[${edge.node}]=${newDist}`)
            await new Promise(r => setTimeout(r, 500))
          }
        }
      }
    }

    const pathEdges = []
    let curr = targetNode
    while (prev[curr] !== null && prev[curr] !== undefined) {
      pathEdges.push({ u: prev[curr], v: curr })
      curr = prev[curr]
    }
    setHighlightedEdge(null)
    setShortestPathEdges(pathEdges)
    setLogMessage(`✓ Shortest Path to Node ${targetNode} Cost = ${dist[targetNode]}!`)
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
    <div className="p-2.5 sm:p-4 md:p-6 text-white max-w-full overflow-hidden">
      {/* Header and Complexity HUD */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-4 md:mb-6 gap-3 md:gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-indigo-400">
            Weighted Graph & Dijkstra Visualizer
          </h2>
          <p className="text-[11px] sm:text-xs md:text-sm text-slate-300 mt-0.5">
            Shortest Path Tree (SPT) & Priority Queue Edge Relaxation
          </p>
        </div>

        <div className="grid grid-cols-3 gap-2 bg-white/10 p-2 sm:px-4 sm:py-2 rounded-xl backdrop-blur-md border border-white/10 text-xs w-full lg:w-auto">
          <div className="text-center sm:text-left">
            <span className="text-slate-400 block font-mono text-[10px] sm:text-xs">Dijkstra</span>
            <span className="text-purple-300 font-bold font-mono text-xs sm:text-sm">O(E log V)</span>
          </div>
          <div className="border-l border-white/20 pl-2 text-center sm:text-left">
            <span className="text-slate-400 block font-mono text-[10px] sm:text-xs">BFS/DFS</span>
            <span className="text-emerald-400 font-bold font-mono text-xs sm:text-sm">O(V + E)</span>
          </div>
          <div className="border-l border-white/20 pl-2 text-center sm:text-left">
            <span className="text-slate-400 block font-mono text-[10px] sm:text-xs">Relaxations</span>
            <span className="text-amber-400 font-bold font-mono text-xs sm:text-sm">{relaxCount}</span>
          </div>
        </div>
      </div>

      {/* Action / State Banner */}
      <div className="mb-4 p-2.5 sm:px-4 sm:py-2.5 bg-slate-800/80 rounded-lg border border-purple-500/30 flex flex-col sm:flex-row sm:items-center justify-between text-xs sm:text-sm gap-1">
        <span className="text-purple-300 font-medium break-words">⚡ {logMessage}</span>
        {activeAlgorithm && (
          <span className="text-[10px] sm:text-xs font-mono bg-purple-900/60 text-purple-200 border border-purple-400/40 px-2 py-0.5 rounded self-start sm:self-auto">
            {activeAlgorithm}
          </span>
        )}
      </div>

      {/* Distance HUD Table for Dijkstra */}
      {Object.keys(dijkstraDistances).length > 0 && (
        <div className="mb-4 p-2.5 sm:p-3 bg-slate-900/70 rounded-xl border border-white/10 overflow-x-auto max-w-full">
          <div className="text-[10px] sm:text-xs uppercase font-mono text-purple-300 mb-1.5">
            Distance Vector (d[u] from Node 0):
          </div>
          <div className="flex gap-2 min-w-max pb-1">
            {[0, 1, 2, 3, 4, 5].map(node => (
              <div
                key={node}
                className={`px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg border text-xs font-mono text-center ${
                  traversalOrder.includes(node)
                    ? 'bg-purple-600/30 border-purple-400 text-purple-200'
                    : 'bg-white/5 border-white/10 text-slate-300'
                }`}
              >
                <div className="text-[10px]">N{node}</div>
                <div className="font-bold text-xs sm:text-sm text-white">
                  {dijkstraDistances[node] === Infinity ? '∞' : dijkstraDistances[node]}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SVG Canvas */}
      <div className="bg-slate-950/60 rounded-xl p-2 sm:p-4 overflow-x-auto border border-white/10 mb-4 md:mb-6 max-w-full">
        <div className="min-w-[700px] overflow-visible">
          <svg width="780" height="380" className="overflow-visible mx-auto block">
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
        </div>

        <div className="flex flex-wrap justify-center items-center gap-3 sm:gap-6 mt-2 text-[10px] sm:text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-500 inline-block" />
            <span>Unvisited</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-700 inline-block" />
            <span>Visited</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
            <span>Relaxing</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
            <span>Shortest Path</span>
          </div>
        </div>
      </div>

      {/* Control Panel */}
      <div className="bg-white/5 rounded-xl p-3 sm:p-4 border border-white/10 space-y-3 sm:space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
            <div className="flex items-center gap-2">
              <label className="text-xs text-slate-300 font-mono flex-shrink-0">Target Node:</label>
              <select
                value={targetNode}
                onChange={(e) => setTargetNode(parseInt(e.target.value))}
                disabled={isTraversing}
                className="flex-1 sm:flex-none bg-white/10 border border-white/20 text-white rounded-lg px-2.5 py-1.5 text-xs outline-none"
              >
                {[1, 2, 3, 4, 5].map(n => (
                  <option key={n} value={n} className="bg-slate-900 text-white">
                    Node {n}
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={handleDijkstra}
              disabled={isTraversing}
              className="w-full sm:w-auto px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 font-semibold rounded-lg text-xs sm:text-sm transition whitespace-nowrap"
            >
              Run Dijkstra
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
