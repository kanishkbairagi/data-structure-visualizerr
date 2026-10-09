# Algorithmic State Engine & Data Structure Visualizer

<div align="center">

![React](https://img.shields.io/badge/React-18.2-61dafb?style=for-the-badge&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-5.0-646cff?style=for-the-badge&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.3-38bdf8?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-10.16-ff0055?style=for-the-badge&logo=framer&logoColor=white)
![Deployment](https://img.shields.io/badge/Deployment-Vercel_Production-000000?style=for-the-badge&logo=vercel&logoColor=white)
![Adoption](https://img.shields.io/badge/Adoption-110+_Active_Students-10b981?style=for-the-badge)

**An interactive execution engine visualizing algorithmic state transitions, mathematical invariants, and amortized complexity.**

[Explore Live Platform](https://data-structure-visualizerr.vercel.app/) • [Report Bug / Feature Request](https://github.com/kanishkbairagi/data-structure-visualizer/issues)

</div>

---

## 📌 Executive Overview

Traditional computer science education often presents abstract data structures through static chalkboard diagrams and pseudocode, making internal memory representations and asymptotic mechanics difficult to internalize. 

**Algorithmic State Engine** bridges this pedagogical gap by providing an interactive, event-driven state visualization platform. The engine visualizes invariant maintenance (e.g., AVL tree rebalancing rotations, Dijkstra distance-vector edge relaxations, and dynamic array buffer doubling) with mathematical rigor and real-time complexity instrumentation.

---

## 📊 Production Telemetry & Real-World Adoption

The platform is deployed live on Vercel and instrumented with privacy-first web telemetry. It has been adopted by undergraduate peers as a study aid for Data Structures & Algorithms coursework:

| Telemetry Metric | Verified Value | Impact / Measurement |
| :--- | :--- | :--- |
| **Active Student Users** | **110+ Unique Visitors** | Coursework revision & algorithm study |
| **Interaction Sessions** | **162+ Page Views** | Multi-ADT test sessions across algorithms |
| **Geographic Diversity** | **7 Countries** | 🇮🇳 India, 🇺🇸 USA, 🇬🇧 UK, 🇨🇭 Switzerland, 🇫🇷 France, 🇵🇭 Philippines, 🇵🇱 Poland |
| **Cross-Platform Delivery**| **93% Mobile / Tablet** | Responsive touch layout with throttled 60 FPS transitions |

---

## ⚡ Key Algorithmic Modules

### 1. Self-Balancing AVL Trees (`AVLTreeEngine`)
* **Strict Invariant Maintenance:** Tracks node balance factors $BF = h_L - h_R$ live on every node, enforcing balance factor $BF \in \{-1, 0, 1\}$.
* **Automated Rotation Archetypes:** Dynamically detects balance violations ($|BF| > 1$) and triggers animated rebalancing:
  * **LL Rotation** (Right Rotation)
  * **RR Rotation** (Left Rotation)
  * **LR Rotation** (Left-Right Double Rotation)
  * **RL Rotation** (Right-Left Double Rotation)
* **Guaranteed Worst-Case Bound:** Visualizes how rotation invariants enforce strict logarithmic height $h < 1.44 \log_2(N+2)$, preventing degradation to $O(N)$ skewed trees.
* **Traversals:** Inorder (LNR sorted verification), Preorder (NLR), Postorder (LRN), and Level-Order (BFS).

### 2. Weighted Graph Theory & Shortest Path (`DijkstraSimulator`)
* **Weighted Digraph Representation:** Weighted adjacency matrix/list with interactive source-to-target pathfinding.
* **Greedy Edge Relaxation:** Animates distance updates $d[v] = \min(d[v], d[u] + w(u,v))$ step-by-step alongside real-time distance-vector table updates.
* **Shortest Path Tree (SPT):** Reconstructs and highlights the optimal shortest path in real time with total path weight calculation.
* **Traversals:** Queue-driven Breadth-First Search (BFS) and call-stack Depth-First Search (DFS).

### 3. Trie Prefix Tree & Autocomplete (`TrieEngine`)
* **Sub-linear Lexicographical Search:** Visualizes root, intermediate character nodes, and `isEndOfWord` termination markers.
* **Prefix Autocomplete:** Interactive query engine returning matching dictionary branches in $O(L)$ time, where $L$ is word length.

### 4. Dynamic Array & Amortized Buffer Resizing (`DynamicArrayBuffer`)
* **Contiguous Physical Memory Model:** Visualizes low-level memory allocation, displaying active elements vs. free capacity slots ($N$ vs. $C$).
* **Buffer Overflow Reallocation:** Simulates buffer doubling ($C \to 2C$) and element copy cost, visually demonstrating **Amortized $O(1)$ Analysis** (Aggregate Method).
* **Pointer-Tracking Binary Search:** Interactive search with `LOW`, `MID`, and `HIGH` pointers, live comparison counters, and memory write metrics.

### 5. Classical Abstract Data Types (ADTs)
* **Stack:** LIFO semantics with animated push/pop mechanics and call-frame depth tracking.
* **Queue:** FIFO semantics with front/rear pointer shifts.
* **Linked List:** Singly linked structure with dynamic head/tail insertion, deletion, and pointer link updates.

---

## 📈 Asymptotic Complexity Reference

| Abstract Data Type (ADT) | Operation | Best Case | Average Case | Worst Case | Space Complexity |
| :--- | :--- | :---: | :---: | :---: | :---: |
| **Dynamic Array** | Append | $O(1)$ | $O(1)$ Amortized | $O(N)$ Reallocation | $O(N)$ |
| **Dynamic Array** | Binary Search | $O(1)$ | $O(\log N)$ | $O(\log N)$ | $O(1)$ |
| **AVL Tree** | Search / Insert | $O(1)$ | $O(\log N)$ | $O(\log N)$ Guaranteed | $O(N)$ |
| **Dijkstra Graph** | Shortest Path | $O(V + E)$ | $O((V+E)\log V)$ | $O((V+E)\log V)$ | $O(V+E)$ |
| **Trie** | Prefix / Search | $O(1)$ | $O(L)$ | $O(L)$ | $O(\Sigma \cdot L)$ |
| **Singly Linked List** | Insert (Head) | $O(1)$ | $O(1)$ | $O(1)$ | $O(1)$ |
| **Stack / Queue** | Push / Pop | $O(1)$ | $O(1)$ | $O(1)$ | $O(1)$ |

---

## 🏗️ System Architecture

```
src/
├── components/
│   ├── ArrayVisualizer.jsx       # Contiguous buffer doubling, Amortized O(1), Binary Search
│   ├── TreeVisualizer.jsx        # AVL Self-Balancing Tree, LL/RR/LR/RL Rotations, Traversals
│   ├── GraphVisualizer.jsx       # Weighted Graph, Dijkstra SPT, Edge Relaxation, BFS/DFS
│   ├── TrieVisualizer.jsx        # Prefix Tree (Trie), Dynamic Autocomplete, O(L) Lookups
│   ├── LinkedListVisualizer.jsx  # Singly Linked List with pointer animation
│   ├── StackVisualizer.jsx       # LIFO State Engine
│   └── QueueVisualizer.jsx       # FIFO State Engine
├── App.jsx                       # Root Navigation & Layout State
├── main.jsx                      # React 18 Mounting + Vercel Analytics Telemetry
└── index.css                     # Tailwind CSS Theme & Animations
```

### Architectural Highlights
1. **Decoupled Execution Pipeline:** Algorithmic invariant updates are computed separately from SVG/DOM render cycles, ensuring deterministic transitions.
2. **Responsive Coordinate Projection:** Tree and graph coordinate layouts dynamically scale down to 320px mobile viewports without horizontal clipping.
3. **Telemetry Integration:** Integrated `@vercel/analytics/react` to monitor international student traffic, session retention, and device compatibility.

---

## 🚀 Local Development Setup

### Prerequisites
* **Node.js:** `>= 18.0.0`
* **npm:** `>= 9.0.0`

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/kanishkbairagi/data-structure-visualizer.git
   cd data-structure-visualizer
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser.

4. **Production Build:**
   ```bash
   npm run build
   ```

---

## 📜 License & Acknowledgments

This project is open-source under the **MIT License**.  
Developed by **Kanishk Bairagi** as a pedagogical engineering tool for computer science students.
