import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

class TrieNode {
  constructor(char = '') {
    this.char = char
    this.children = {} // char -> TrieNode
    this.isEndOfWord = false
    this.id = Math.random().toString(36).substr(2, 9)
  }
}

const TrieVisualizer = () => {
  const [root, setRoot] = useState(() => {
    const initialRoot = new TrieNode('')
    const sampleWords = ['algo', 'api', 'app', 'tree']
    for (const word of sampleWords) {
      let curr = initialRoot
      for (const ch of word) {
        if (!curr.children[ch]) {
          curr.children[ch] = new TrieNode(ch)
        }
        curr = curr.children[ch]
      }
      curr.isEndOfWord = true
    }
    return initialRoot
  })

  const [inputWord, setInputWord] = useState('')
  const [searchWord, setSearchWord] = useState('')
  const [activePath, setActivePath] = useState([])
  const [statusMessage, setStatusMessage] = useState('Welcome to Trie (Prefix Tree) Visualizer')
  const [autocompleteResults, setAutocompleteResults] = useState([])
  const [complexityStats, setComplexityStats] = useState({ operations: 0, timeComplexity: 'O(L)', spaceComplexity: 'O(Σ * L)' })

  // Deep clone trie for React state updates
  const cloneTrie = (node) => {
    const newNode = new TrieNode(node.char)
    newNode.isEndOfWord = node.isEndOfWord
    newNode.id = node.id
    for (const key in node.children) {
      newNode.children[key] = cloneTrie(node.children[key])
    }
    return newNode
  }

  // Insert word
  const handleInsert = async () => {
    const word = inputWord.trim().toLowerCase()
    if (!word || !/^[a-z]+$/.test(word)) {
      setStatusMessage('Please enter lowercase letters only (a-z)')
      return
    }

    const newRoot = cloneTrie(root)
    let curr = newRoot
    const path = ['root']
    setActivePath([...path])
    setStatusMessage(`Inserting "${word}" step-by-step...`)

    let ops = 0
    for (let i = 0; i < word.length; i++) {
      const ch = word[i]
      ops++
      if (!curr.children[ch]) {
        curr.children[ch] = new TrieNode(ch)
      }
      curr = curr.children[ch]
      path.push(curr.id)
      setActivePath([...path])
      await new Promise(r => setTimeout(r, 400))
    }
    curr.isEndOfWord = true
    setRoot(newRoot)
    setInputWord('')
    setStatusMessage(`✓ Word "${word}" successfully inserted! (Word length L = ${word.length})`)
    setComplexityStats({ operations: ops, timeComplexity: `O(${word.length}) [O(L)]`, spaceComplexity: 'O(ALPHABET_SIZE * L)' })
    setTimeout(() => setActivePath([]), 1500)
  }

  // Search prefix & get autocomplete
  const handleSearch = async () => {
    const prefix = searchWord.trim().toLowerCase()
    if (!prefix) return

    let curr = root
    const path = ['root']
    setActivePath([...path])
    setStatusMessage(`Searching prefix "${prefix}"...`)

    let ops = 0
    let found = true
    for (let i = 0; i < prefix.length; i++) {
      const ch = prefix[i]
      ops++
      await new Promise(r => setTimeout(r, 450))
      if (!curr.children[ch]) {
        found = false
        break
      }
      curr = curr.children[ch]
      path.push(curr.id)
      setActivePath([...path])
    }

    if (!found) {
      setStatusMessage(`❌ Prefix "${prefix}" not found in Trie!`)
      setAutocompleteResults([])
      setComplexityStats({ operations: ops, timeComplexity: 'O(L) - Mismatch early exit', spaceComplexity: 'O(1)' })
      setTimeout(() => setActivePath([]), 1500)
      return
    }

    // Collect autocomplete words
    const matches = []
    const dfsCollect = (node, currentStr) => {
      if (node.isEndOfWord) matches.push(currentStr)
      for (const charKey of Object.keys(node.children).sort()) {
        dfsCollect(node.children[charKey], currentStr + charKey)
      }
    }
    dfsCollect(curr, prefix)

    setAutocompleteResults(matches)
    setStatusMessage(
      curr.isEndOfWord
        ? `✓ Exact word "${prefix}" exists! Auto-complete matches: [${matches.join(', ')}]`
        : `✓ Prefix "${prefix}" found! Autocomplete completions: [${matches.join(', ')}]`
    )
    setComplexityStats({ operations: ops + matches.length, timeComplexity: `O(L + K) where K=${matches.length}`, spaceComplexity: 'O(K * L)' })
    setTimeout(() => setActivePath([]), 2500)
  }

  // Clear trie
  const handleClear = () => {
    setRoot(new TrieNode(''))
    setAutocompleteResults([])
    setActivePath([])
    setStatusMessage('Trie cleared to empty state.')
    setComplexityStats({ operations: 0, timeComplexity: 'O(1)', spaceComplexity: 'O(1)' })
  }

  // Pre-load dictionary
  const handleLoadSample = () => {
    const sample = ['tree', 'trie', 'graph', 'greedy', 'heap', 'hash']
    const newRoot = new TrieNode('')
    for (const w of sample) {
      let curr = newRoot
      for (const ch of w) {
        if (!curr.children[ch]) curr.children[ch] = new TrieNode(ch)
        curr = curr.children[ch]
      }
      curr.isEndOfWord = true
    }
    setRoot(newRoot)
    setAutocompleteResults([])
    setActivePath([])
    setStatusMessage('Loaded Computer Science terms dictionary.')
  }

  // Layout calculation for SVG rendering
  const layoutTrie = (node, depth = 0, left = 0, right = 800) => {
    const x = (left + right) / 2
    const y = 50 + depth * 75
    const elements = [{ id: node.id || 'root', char: node.char || 'ROOT', isEndOfWord: node.isEndOfWord, x, y }]
    const edges = []

    const childKeys = Object.keys(node.children).sort()
    const n = childKeys.length
    if (n > 0) {
      const sliceWidth = (right - left) / n
      childKeys.forEach((key, idx) => {
        const childLeft = left + idx * sliceWidth
        const childRight = childLeft + sliceWidth
        const childRes = layoutTrie(node.children[key], depth + 1, childLeft, childRight)
        edges.push({ fromX: x, fromY: y, toX: childRes.elements[0].x, toY: childRes.elements[0].y, char: key })
        elements.push(...childRes.elements)
        edges.push(...childRes.edges)
      })
    }

    return { elements, edges }
  }

  const { elements, edges } = layoutTrie(root, 0, 20, 780)

  return (
    <div className="p-3 md:p-6 text-white">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-300 to-cyan-400">
            Trie (Prefix Tree) Visualizer
          </h2>
          <p className="text-xs md:text-sm text-slate-300 mt-1">
            Core CS Structure for Autocomplete, IP Routing, and Lexicographical Lookups
          </p>
        </div>

        {/* Complexity HUD */}
        <div className="flex gap-2 sm:gap-4 bg-white/10 px-4 py-2 rounded-xl backdrop-blur-md border border-white/10 text-xs">
          <div>
            <span className="text-slate-400 block font-mono">Time Complexity</span>
            <span className="text-emerald-400 font-bold font-mono">{complexityStats.timeComplexity}</span>
          </div>
          <div className="border-l border-white/20 pl-3">
            <span className="text-slate-400 block font-mono">Space Complexity</span>
            <span className="text-cyan-400 font-bold font-mono">{complexityStats.spaceComplexity}</span>
          </div>
          <div className="border-l border-white/20 pl-3">
            <span className="text-slate-400 block font-mono">Operations</span>
            <span className="text-amber-400 font-bold font-mono">{complexityStats.operations} ops</span>
          </div>
        </div>
      </div>

      {/* Status banner */}
      <div className="mb-4 px-4 py-2 bg-slate-800/80 rounded-lg border border-cyan-500/30 flex items-center justify-between text-sm">
        <span className="text-cyan-300 font-medium">⚡ {statusMessage}</span>
        {autocompleteResults.length > 0 && (
          <span className="text-xs bg-cyan-900/60 px-2 py-1 rounded text-cyan-200">
            Matches: {autocompleteResults.length}
          </span>
        )}
      </div>

      {/* SVG Trie Canvas */}
      <div className="bg-slate-950/60 rounded-xl p-4 overflow-x-auto border border-white/10 mb-6">
        <svg width="800" height="420" className="overflow-visible mx-auto block">
          {/* Edges */}
          {edges.map((edge, idx) => (
            <g key={`edge-${idx}`}>
              <line
                x1={edge.fromX}
                y1={edge.fromY + 18}
                x2={edge.toX}
                y2={edge.toY - 18}
                stroke="rgba(255, 255, 255, 0.3)"
                strokeWidth="2"
              />
              <text
                x={(edge.fromX + edge.toX) / 2 - 8}
                y={(edge.fromY + edge.toY) / 2}
                fill="#94a3b8"
                fontSize="12"
                fontWeight="bold"
              >
                {edge.char}
              </text>
            </g>
          ))}

          {/* Nodes */}
          {elements.map((el) => {
            const isActive = activePath.includes(el.id)
            const isRoot = el.id === 'root'

            return (
              <g key={el.id}>
                <motion.circle
                  cx={el.x}
                  cy={el.y}
                  r={isRoot ? 22 : 18}
                  stroke={isActive ? '#38bdf8' : el.isEndOfWord ? '#10b981' : '#64748b'}
                  strokeWidth={isActive ? 3 : 2}
                  fill={
                    isActive
                      ? '#0284c7'
                      : el.isEndOfWord
                      ? '#065f46'
                      : isRoot
                      ? '#334155'
                      : '#1e293b'
                  }
                  initial={{ scale: 0 }}
                  animate={{ scale: isActive ? 1.2 : 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                />
                <text
                  x={el.x}
                  y={el.y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="white"
                  fontWeight="bold"
                  fontSize={isRoot ? '9' : '13'}
                >
                  {el.char}
                </text>
                {el.isEndOfWord && (
                  <circle
                    cx={el.x + 12}
                    cy={el.y - 12}
                    r="4"
                    fill="#34d399"
                    stroke="#064e3b"
                    strokeWidth="1"
                  />
                )}
              </g>
            )
          })}
        </svg>

        <div className="flex justify-center items-center gap-6 mt-2 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-slate-700 border border-slate-500 inline-block" />
            <span>Intermediate Prefix</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-700 border border-emerald-400 inline-block" />
            <span>End of Word (isEndOfWord = true)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-sky-600 border border-sky-300 inline-block" />
            <span>Active Traversal Node</span>
          </div>
        </div>
      </div>

      {/* Autocomplete drawer */}
      {autocompleteResults.length > 0 && (
        <div className="mb-6 p-4 bg-cyan-950/40 rounded-xl border border-cyan-500/40">
          <h4 className="text-xs uppercase font-mono text-cyan-300 mb-2">Autocomplete Predictions:</h4>
          <div className="flex flex-wrap gap-2">
            {autocompleteResults.map((word, i) => (
              <span
                key={i}
                className="px-3 py-1 bg-cyan-600/40 border border-cyan-400/50 rounded-full text-xs font-mono text-white"
              >
                {word}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Operations Controls */}
      <div className="bg-white/5 rounded-xl p-4 border border-white/10 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Insert control */}
          <div className="flex gap-2">
            <input
              type="text"
              value={inputWord}
              onChange={(e) => setInputWord(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleInsert()}
              placeholder="Insert word (e.g. apple, code)"
              className="flex-1 px-4 py-2 rounded-lg bg-white/10 text-white placeholder-white/40 border border-white/20 focus:ring-2 focus:ring-cyan-500 outline-none text-sm"
            />
            <button
              onClick={handleInsert}
              className="px-5 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 font-semibold rounded-lg text-sm transition-all"
            >
              Insert
            </button>
          </div>

          {/* Search prefix */}
          <div className="flex gap-2">
            <input
              type="text"
              value={searchWord}
              onChange={(e) => setSearchWord(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Search prefix (e.g. ap, tr)"
              className="flex-1 px-4 py-2 rounded-lg bg-white/10 text-white placeholder-white/40 border border-white/20 focus:ring-2 focus:ring-sky-500 outline-none text-sm"
            />
            <button
              onClick={handleSearch}
              className="px-5 py-2 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 font-semibold rounded-lg text-sm transition-all"
            >
              Prefix Search
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 justify-end pt-2 border-t border-white/10">
          <button
            onClick={handleLoadSample}
            className="px-4 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-medium transition"
          >
            Load CS Dictionary
          </button>
          <button
            onClick={handleClear}
            className="px-4 py-1.5 bg-rose-500/20 hover:bg-rose-500/40 text-rose-300 border border-rose-500/30 rounded-lg text-xs font-medium transition"
          >
            Clear Trie
          </button>
        </div>
      </div>
    </div>
  )
}

export default TrieVisualizer
