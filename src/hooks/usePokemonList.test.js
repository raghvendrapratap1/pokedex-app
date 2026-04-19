import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { usePokemonList } from './usePokemonList'
import * as pokemonService from '../service/pokemonService'

vi.mock('../service/pokemonService')

const mockPokemonList = [{ name: 'bulbasaur', url: '' }, { name: 'charmander', url: '' }]
const mockBulbasaur = {
  id: 1, name: 'bulbasaur',
  types: [{ type: { name: 'grass' } }],
  sprites: { front_default: 'bulbasaur.png' },
}
const mockCharmander = {
  id: 4, name: 'charmander',
  types: [{ type: { name: 'fire' } }],
  sprites: { front_default: 'charmander.png' },
}

describe('usePokemonList', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    pokemonService.fetchPokemonList.mockResolvedValue(mockPokemonList)
    pokemonService.fetchPokemonDetail
      .mockImplementation((name) =>
        name === 'bulbasaur' ? Promise.resolve(mockBulbasaur) : Promise.resolve(mockCharmander)
      )
  })

  it('starts in loading state', () => {
    const { result } = renderHook(() => usePokemonList())
    expect(result.current.loading).toBe(true)
  })

  it('loads pokemon successfully', async () => {
    const { result } = renderHook(() => usePokemonList())
    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.pokemon).toHaveLength(2)
    expect(result.current.error).toBeNull()
  })

  it('sets error state when fetch fails', async () => {
    pokemonService.fetchPokemonList.mockRejectedValue(new Error('Network error'))
    const { result } = renderHook(() => usePokemonList())
    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.error).toBe('Network error')
    expect(result.current.pokemon).toHaveLength(0)
  })

  it('filters pokemon by name', async () => {
    const { result } = renderHook(() => usePokemonList())
    await waitFor(() => expect(result.current.loading).toBe(false))
    result.current.setSearchQuery('char')
    await waitFor(() => expect(result.current.pokemon).toHaveLength(1))
    expect(result.current.pokemon[0].name).toBe('charmander')
  })

  it('filters pokemon by type', async () => {
    const { result } = renderHook(() => usePokemonList())
    await waitFor(() => expect(result.current.loading).toBe(false))
    result.current.setSearchQuery('grass')
    await waitFor(() => expect(result.current.pokemon).toHaveLength(1))
    expect(result.current.pokemon[0].name).toBe('bulbasaur')
  })

  it('returns all pokemon when search is empty', async () => {
    const { result } = renderHook(() => usePokemonList())
    await waitFor(() => expect(result.current.loading).toBe(false))
    result.current.setSearchQuery('')
    await waitFor(() => expect(result.current.pokemon).toHaveLength(2))
  })
})