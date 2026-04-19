import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { PokemonDetail } from './PokemonDetail'
import * as hook from '../hooks/usePokemonDetail'

vi.mock('../hooks/usePokemonDetail')

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return { ...actual, useNavigate: () => mockNavigate }
})

const mockPokemon = {
  id: 1, name: 'bulbasaur', height: 7, weight: 69,
  types: [{ type: { name: 'grass' } }, { type: { name: 'poison' } }],
  abilities: [
    { ability: { name: 'overgrow' }, is_hidden: false },
    { ability: { name: 'chlorophyll' }, is_hidden: true },
  ],
  stats: [
    { base_stat: 45, stat: { name: 'hp' } },
    { base_stat: 49, stat: { name: 'attack' } },
  ],
  sprites: {
    front_default: 'b.png',
    other: { 'official-artwork': { front_default: 'b-art.png' } },
  },
}

function setup(overrides = {}) {
  hook.usePokemonDetail.mockReturnValue({ pokemon: mockPokemon, loading: false, error: null, ...overrides })
  return render(
    <MemoryRouter initialEntries={['/pokemon/bulbasaur']}>
      <Routes>
        <Route path="/pokemon/:name" element={<PokemonDetail />} />
      </Routes>
    </MemoryRouter>
  )
}

describe('PokemonDetail', () => {
  it('shows loading state', () => {
    setup({ pokemon: null, loading: true })
    expect(screen.getByRole('status')).toHaveTextContent('Loading')
  })

  it('shows error state', () => {
    setup({ pokemon: null, loading: false, error: 'Not found' })
    expect(screen.getByRole('alert')).toHaveTextContent('Not found')
  })

  it('renders pokemon name', () => {
    setup()
    expect(screen.getByText('bulbasaur')).toBeInTheDocument()
  })

  it('renders formatted id', () => {
    setup()
    expect(screen.getByText('#001')).toBeInTheDocument()
  })

  it('renders all types', () => {
    setup()
    expect(screen.getByText('grass')).toBeInTheDocument()
    expect(screen.getByText('poison')).toBeInTheDocument()
  })

  it('renders height and weight', () => {
    setup()
    expect(screen.getByText('Height: 0.7m')).toBeInTheDocument()
    expect(screen.getByText('Weight: 6.9kg')).toBeInTheDocument()
  })

  it('renders all stats as progress bars', () => {
    setup()
    expect(screen.getAllByRole('progressbar')).toHaveLength(2)
  })

  it('goes back on button click', async () => {
    setup()
    await userEvent.click(screen.getByRole('button', { name: /go back/i }))
    expect(mockNavigate).toHaveBeenCalledWith(-1)
  })
})