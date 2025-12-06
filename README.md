# Data Structure Visualizer

An interactive web application for visualizing common data structures and their operations using React, Tailwind CSS, and Framer Motion.

## Features

- **Array Visualization**: Push, pop, insert at index, delete at index
- **Stack Visualization**: LIFO operations with animated push/pop
- **Queue Visualization**: FIFO operations with animated enqueue/dequeue
- **Linked List Visualization**: Insert/delete at head, tail, or any position
- **Tree Visualization**: Binary tree with inorder, preorder, and postorder traversals
- **Graph Traversal**: BFS and DFS with animated node highlighting

## Technologies Used

- React 18
- Tailwind CSS
- Framer Motion (for animations)
- Vite (build tool)

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open your browser and navigate to the URL shown in the terminal (usually `http://localhost:5173`)

## Build for Production

```bash
npm run build
```

## Project Structure

```
src/
  ├── components/
  │   ├── ArrayVisualizer.jsx
  │   ├── StackVisualizer.jsx
  │   ├── QueueVisualizer.jsx
  │   ├── LinkedListVisualizer.jsx
  │   ├── TreeVisualizer.jsx
  │   └── GraphVisualizer.jsx
  ├── App.jsx
  ├── main.jsx
  └── index.css
```

## Usage

- Navigate between different data structures using the top navigation buttons
- Use the controls for each data structure to perform operations
- Watch the animations as operations are performed
- For tree and graph visualizers, click the traversal buttons to see animated traversals

