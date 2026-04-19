import { describe, it, expect, vi, beforeEach } from 'vitest'
import { fetchPokemonList, fetchPokemonDetail } from './pokemonService'

describe('pokemonService', () => {
    beforeEach(() => {
        vi.resetAllMocks()
    })

    describe('fetchPokemonList', () => {
        it('returns list of pokemon on success', async () => {
            const mockResults = [{ name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' }]
            global.fetch = vi.fn().mockResolvedValue({
                ok: true,
                json: async () => ({ results: mockResults }),
            })

            const result = await fetchPokemonList()
            expect(result).toEqual(mockResults)
            expect(fetch).toHaveBeenCalledWith('https://pokeapi.co/api/v2/pokemon?limit=20&offset=0')
        })

        it('throws an error when response is not ok', async () => {
            global.fetch = vi.fn().mockResolvedValue({ ok: false })
            await expect(fetchPokemonList()).rejects.toThrow('Failed to fetch Pokémon list')
        })

        it('supports custom limit and offset', async () => {
            global.fetch = vi.fn().mockResolvedValue({
                ok: true,
                json: async () => ({ results: [] }),
            })
            await fetchPokemonList(10, 20)
            expect(fetch).toHaveBeenCalledWith('https://pokeapi.co/api/v2/pokemon?limit=10&offset=20')
        })
    })

    describe('fetchPokemonDetail', () => {
        it('returns pokemon detail on success', async () => {
            const mockPokemon = { id: 1, name: 'bulbasaur', types: [] }
            global.fetch = vi.fn().mockResolvedValue({
                ok: true,
                json: async () => mockPokemon,
            })

            const result = await fetchPokemonDetail('bulbasaur')
            expect(result).toEqual(mockPokemon)
        })

        it('throws an error when pokemon not found', async () => {
            global.fetch = vi.fn().mockResolvedValue({ ok: false })
            await expect(fetchPokemonDetail('unknown')).rejects.toThrow('Failed to fetch Pokémon: unknown')
        })
    })
})