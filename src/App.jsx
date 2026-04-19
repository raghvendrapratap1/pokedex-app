import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { PokemonList } from './components/PokemonList'
import { PokemonDetail } from './components/PokemonDetail'
import { ThemeToggle } from './components/ThemeToggle'
import './App.css'

export default function App() {
  return (
    <BrowserRouter>
      <ThemeToggle />
      <Routes>
        <Route path="/" element={<PokemonList />} />
        <Route path="/pokemon/:name" element={<PokemonDetail />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

