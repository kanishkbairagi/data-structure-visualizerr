import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

class TrieNode {
  constructor(char = '') {
    this.char = char
    this.children = {}
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
  const [statusMessage, setStatusMessage] = useState('Trie (Prefix Tree) Visualizer')
  const [autocompleteResults, setAutocompleteResults] = useState([])
  const [complexityStats, setComplexityStats] = useState({ operations: 0, timeComplexity: 'O(L)', spaceComplexity: 'O(Σ*L)' })

  const cloneTrie = (node) => {
    const newNode = new TrieNode(node.char)
    newNode.isEndOfWord = node.isEndOfWord
    newNode.id = node.id
    for (const key in node.children) {
      newNode.children[key] = cloneTrie(node.children[key])
    }
    return newNode
  }

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
    setStatusMessage(`Inserting "${word}"...`)

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
    setStatusMessage(`✓ "${word}" inserted (Length L = ${word.length})`)
    setComplexityStats({ operations: ops, timeComplexity: `O(${word.length})`, spaceComplexity: 'O(Σ*L)' })
    setTimeout(() => setActivePath([]), 1500)
  }

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
      setStatusMessage(`❌ Prefix "${prefix}" not in Trie`)
      setAutocompleteResults([])
      setComplexityStats({ operations: ops, timeComplexity: 'O(L) - Mismatch', spaceComplexity: 'O(1)' })
      setTimeout(() => setActivePath([]), 1500)
      return
    }

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
        ? `✓ Word "${prefix}" exists! Completions: [${matches.join(', ')}]`
        : `✓ Prefix "${prefix}" found! Completions: [${matches.join(', ')}]`
    )
    setComplexityStats({ operations: ops + matches.length, timeComplexity: `O(L + K)`, spaceComplexity: 'O(K*L)' })
    setTimeout(() => setActivePath([]), 2500)
  }

  const handleClear = () => {
    setRoot(new TrieNode(''))
    setAutocompleteResults([])
    setActivePath([])
    setStatusMessage('Trie cleared to empty state.')
    setComplexityStats({ operations: 0, timeComplexity: 'O(1)', spaceComplexity: 'O(1)' })
  }

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

  const layoutTrie = (node, depth = 0, left = 0, right = 780) => {
    const x = (left + right) / 2
    const y = 45 + depth * 70
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

  const { elements, edges } = layoutTrie(root, 0, 20, 760)

  return (
    <div className="p-2.5 sm:p-4 md:p-6 text-white max-w-full overflow-hidden">
      {/* Header and Complexity HUD */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-4 md:mb-6 gap-3 md:gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-300 to-cyan-400">
            Trie (Prefix Tree) Visualizer
          </h2>
          <p className="text-[11px] sm:text-xs md:text-sm text-slate-300 mt-0.5">
            Autocomplete & Lexicographical Lookups in O(L)
          </p>
        </div>

        <div className="grid grid-cols-3 gap-2 bg-white/10 p-2 sm:px-4 sm:py-2 rounded-xl backdrop-blur-md border border-white/10 text-xs w-full lg:w-auto">
          <div className="text-center sm:text-left">
            <span className="text-slate-400 block font-mono text-[10px] sm:text-xs">Time</span>
            <span className="text-emerald-400 font-bold font-mono text-xs sm:text-sm">{complexityStats.timeComplexity}</span>
          </div>
          <div className="border-l border-white/20 pl-2 text-center sm:text-left">
            <span className="text-slate-400 block font-mono text-[10px] sm:text-xs">Space</span>
            <span className="text-cyan-400 font-bold font-mono text-xs sm:text-sm">{complexityStats.spaceComplexity}</span>
          </div>
          <div className="border-l border-white/20 pl-2 text-center sm:text-left">
            <span className="text-slate-400 block font-mono text-[10px] sm:text-xs">Operations</span>
            <span className="text-amber-400 font-bold font-mono text-xs sm:text-sm">{complexityStats.operations}</span>
          </div>
        </div>
      </div>

      {/* Status banner */}
      <div className="mb-4 p-2.5 sm:px-4 sm:py-2.5 bg-slate-800/80 rounded-lg border border-cyan-500/30 flex flex-col sm:flex-row sm:items-center justify-between text-xs sm:text-sm gap-1">
        <span className="text-cyan-300 font-medium break-words">⚡ {statusMessage}</span>
        {autocompleteResults.length > 0 && (
          <span className="text-[10px] sm:text-xs bg-cyan-900/60 px-2 py-0.5 rounded text-cyan-200 self-start sm:self-auto">
            Matches: {autocompleteResults.length}
          </span>
        )}
      </div>

      {/* SVG Trie Canvas */}
      <div className="bg-slate-950/60 rounded-xl p-2 sm:p-4 overflow-x-auto border border-white/10 mb-4 md:mb-6 max-w-full">
        <div className="min-w-[700px] overflow-visible">
          <svg width="780" height="380" className="overflow-visible mx-auto block">
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
        </div>

        <div className="flex flex-wrap justify-center items-center gap-3 sm:gap-6 mt-2 text-[10px] sm:text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-700 border border-slate-500 inline-block" />
            <span>Intermediate Node</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-700 border border-emerald-400 inline-block" />
            <span>End of Word</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-600 border border-sky-300 inline-block" />
            <span>Active Traversal</span>
          </div>
        </div>
      </div>

      {/* Autocomplete predictions */}
      {autocompleteResults.length > 0 && (
        <div className="mb-4 p-3 bg-cyan-950/40 rounded-xl border border-cyan-500/40">
          <h4 className="text-[10px] sm:text-xs uppercase font-mono text-cyan-300 mb-1.5">Autocomplete Predictions:</h4>
          <div className="flex flex-wrap gap-1.5">
            {autocompleteResults.map((word, i) => (
              <span
                key={i}
                className="px-2.5 py-1 bg-cyan-600/40 border border-cyan-400/50 rounded-full text-xs font-mono text-white"
              >
                {word}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Operations Controls */}
      <div className="bg-white/5 rounded-xl p-3 sm:p-4 border border-white/10 space-y-3 sm:space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          <div className="flex flex-col sm:flex-row gap-2 w-full">
            <input
              type="text"
              value={inputWord}
              onChange={(e) => setInputWord(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleInsert()}
              placeholder="Insert word (e.g. apple)"
              className="w-full flex-1 min-w-0 px-3 py-2 rounded-lg bg-white/10 text-white placeholder-white/40 border border-white/20 focus:ring-2 focus:ring-cyan-500 outline-none text-xs sm:text-sm"
            />
            <button
              onClick={handleInsert}
              className="w-full sm:w-auto px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 font-semibold rounded-lg text-xs sm:text-sm transition whitespace-nowrap"
            >
              Insert
            </button>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 w-full">
            <input
              type="text"
              value={searchWord}
              onChange={(e) => setSearchWord(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Search prefix (e.g. ap)"
              className="w-full flex-1 min-w-0 px-3 py-2 rounded-lg bg-white/10 text-white placeholder-white/40 border border-white/20 focus:ring-2 focus:ring-sky-500 outline-none text-xs sm:text-sm"
            />
            <button
              onClick={handleSearch}
              className="w-full sm:w-auto px-4 py-2 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 font-semibold rounded-lg text-xs sm:text-sm transition whitespace-nowrap"
            >
              Prefix Search
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 justify-end pt-2 border-t border-white/10">
          <button
            onClick={handleLoadSample}
            className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-medium transition"
          >
            Load CS Dictionary
          </button>
          <button
            onClick={handleClear}
            className="px-3 py-1.5 bg-rose-500/20 hover:bg-rose-500/40 text-rose-300 border border-rose-500/30 rounded-lg text-xs font-medium transition"
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  )
}

export default TrieVisualizer
