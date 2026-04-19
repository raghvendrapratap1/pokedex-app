import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { PokemonCard } from './PokemonCard'

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return { ...actual, useNavigate: () => mockNavigate }
})

const mockPokemon = {
  id: 4,
  name: 'charmander',
  types: [{ type: { name: 'fire' } }],
  sprites: {
    front_default: 'charmander.png',
    other: { 'official-artwork': { front_default: 'charmander-art.png' } },
  },
}

function renderCard(pokemon = mockPokemon) {
  return render(
    <MemoryRouter>
      <PokemonCard pokemon={pokemon} />
    </MemoryRouter>
  )
}

describe('PokemonCard', () => {
  it('renders pokemon name', () => {
    renderCard()
    expect(screen.getByText('charmander')).toBeInTheDocument()
  })

  it('renders formatted pokemon id', () => {
    renderCard()
    expect(screen.getByText('#004')).toBeInTheDocument()
  })

  it('renders pokemon type badge', () => {
    renderCard()
    expect(screen.getByText('fire')).toBeInTheDocument()
  })

  it('renders pokemon image with alt text', () => {
    renderCard()
    expect(screen.getByAltText('charmander')).toBeInTheDocument()
  })

  it('navigates to detail page on click', async () => {
    renderCard()
    await userEvent.click(screen.getByRole('button'))
    expect(mockNavigate).toHaveBeenCalledWith('/pokemon/charmander')
  })

  it('navigates on Enter key press', async () => {
    renderCard()
    const card = screen.getByRole('button')
    card.focus()
    await userEvent.keyboard('{Enter}')
    expect(mockNavigate).toHaveBeenCalledWith('/pokemon/charmander')
  })

  it('renders multiple types', () => {
    const dualType = {
      ...mockPokemon,
      types: [{ type: { name: 'water' } }, { type: { name: 'flying' } }],
    }
    renderCard(dualType)
    expect(screen.getByText('water')).toBeInTheDocument()
    expect(screen.getByText('flying')).toBeInTheDocument()
  })
})