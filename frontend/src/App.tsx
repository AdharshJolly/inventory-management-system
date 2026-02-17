import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import MainLayout from './components/layout/MainLayout'

function App() {
  const [count, setCount] = useState(0)

  return (
    <MainLayout>
      <div className="flex flex-col items-center justify-center h-full">
        <div className="flex gap-8 mb-8">
          <a href="https://vite.dev" target="_blank">
            <img src={viteLogo} className="h-24 w-24" alt="Vite logo" />
          </a>
          <a href="https://react.dev" target="_blank">
            <img src={reactLogo} className="h-24 w-24 animate-[spin_20s_linear_infinite]" alt="React logo" />
          </a>
        </div>
        <h1 className="text-4xl font-bold mb-8">Vite + React + Tailwind v4</h1>
        <div className="bg-white p-8 rounded-xl shadow-md border border-gray-200">
          <button 
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            onClick={() => setCount((count) => count + 1)}
          >
            count is {count}
          </button>
          <p className="mt-4 text-gray-600">
            Edit <code>src/App.tsx</code> and save to test HMR
          </p>
        </div>
        <p className="mt-8 text-gray-500">
          Click on the Vite and React logos to learn more
        </p>
      </div>
    </MainLayout>
  )
}

export default App
