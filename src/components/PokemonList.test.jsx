import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { PokemonList } from './PokemonList'
import * as hook from '../hooks/usePokemonList'

vi.mock('../hooks/usePokemonList')
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return { ...actual, useNavigate: () => vi.fn() }
})

const mockPokemon = [
  { id: 1, name: 'bulbasaur', types: [{ type: { name: 'grass' } }], sprites: { front_default: 'b.png', other: { 'official-artwork': { front_default: 'b-art.png' } } } },
  { id: 4, name: 'charmander', types: [{ type: { name: 'fire' } }], sprites: { front_default: 'c.png', other: { 'official-artwork': { front_default: 'c-art.png' } } } },
]

function setup(overrides = {}) {
  hook.usePokemonList.mockReturnValue({
    pokemon: mockPokemon,
    loading: false,
    error: null,
    searchQuery: '',
    setSearchQuery: vi.fn(),
    ...overrides,
  })
  return render(<MemoryRouter><PokemonList /></MemoryRouter>)
}

describe('PokemonList', () => {
  it('shows loading state', () => {
    setup({ pokemon: [], loading: true })
    expect(screen.getByRole('status')).toHaveTextContent('Loading Pokémon')
  })

  it('shows error state', () => {
    setup({ pokemon: [], loading: false, error: 'Network error' })
    expect(screen.getByRole('alert')).toHaveTextContent('Network error')
  })

  it('renders list of pokemon cards', () => {
    setup()
    expect(screen.getByText('bulbasaur')).toBeInTheDocument()
    expect(screen.getByText('charmander')).toBeInTheDocument()
  })

  it('shows empty state when no results', () => {
    setup({ pokemon: [], searchQuery: 'xyz' })
    expect(screen.getByText(/No Pokémon found/i)).toBeInTheDocument()
  })

  it('renders search bar', () => {
    setup()
    expect(screen.getByRole('textbox')).toBeInTheDocument()
  })

  it('calls setSearchQuery on search input', async () => {
    const setSearchQuery = vi.fn()
    setup({ setSearchQuery })
    await userEvent.type(screen.getByRole('textbox'), 'char')
    expect(setSearchQuery).toHaveBeenCalled()
  })
})