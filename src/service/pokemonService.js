const BASE_URL = 'https://pokeapi.co/api/v2'

export async function fetchPokemonList(limit = 20, offset = 0) {
    const response = await fetch(`${BASE_URL}/pokemon?limit=${limit}&offset=${offset}`)
    if (!response.ok) throw new Error('Failed to fetch Pokémon list')
    const data = await response.json()
    return data.results
}

export async function fetchPokemonDetail(nameOrId) {
    const response = await fetch(`${BASE_URL}/pokemon/${nameOrId}`)
    if (!response.ok) throw new Error(`Failed to fetch Pokémon: ${nameOrId}`)
    return response.json()
}