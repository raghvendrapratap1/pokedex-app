import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from './App'
import * as hook from './hooks/usePokemonList'

vi.mock('./hooks/usePokemonList')

describe('App', () => {
  it('renders the Pokédex heading on the home route', () => {
    hook.usePokemonList.mockReturnValue({
      pokemon: [], loading: false, error: null, searchQuery: '', setSearchQuery: vi.fn(),
    })
    render(<App />)
    expect(screen.getByText('Pokédex')).toBeInTheDocument()
  })
})