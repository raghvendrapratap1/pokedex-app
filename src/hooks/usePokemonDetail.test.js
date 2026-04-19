import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { usePokemonDetail } from './usePokemonDetail'
import * as pokemonService from '../service/pokemonService'

// ✅ FIXED PATH
vi.mock('../service/pokemonService')

const mockPokemon = {
  id: 1, name: 'bulbasaur',
  height: 7, weight: 69,
  types: [{ type: { name: 'grass' } }],
  abilities: [{ ability: { name: 'overgrow' }, is_hidden: false }],
  stats: [{ base_stat: 45, stat: { name: 'hp' } }],
  sprites: { front_default: 'bulbasaur.png', other: { 'official-artwork': { front_default: 'art.png' } } },
}

describe('usePokemonDetail', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('starts in loading state', () => {
    pokemonService.fetchPokemonDetail.mockResolvedValue(mockPokemon)
    const { result } = renderHook(() => usePokemonDetail('bulbasaur'))
    expect(result.current.loading).toBe(true)
  })

  it('loads pokemon detail successfully', async () => {
    pokemonService.fetchPokemonDetail.mockResolvedValue(mockPokemon)
    const { result } = renderHook(() => usePokemonDetail('bulbasaur'))
    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.pokemon).toEqual(mockPokemon)
    expect(result.current.error).toBeNull()
  })

  it('sets error when fetch fails', async () => {
    pokemonService.fetchPokemonDetail.mockRejectedValue(new Error('Not found'))
    const { result } = renderHook(() => usePokemonDetail('missingno')  )
    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.error).toBe('Not found')
    expect(result.current.pokemon).toBeNull()
  })
})