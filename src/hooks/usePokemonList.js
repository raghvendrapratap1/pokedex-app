import { useState, useEffect, useCallback, useRef } from 'react'
import { fetchPokemonList,fetchPokemonDetail } from '../service/pokemonService'

const LIMIT = 10

export function usePokemonList() {
    const [pokemon, setPokemon] = useState([])
    const [loading, setLoading] = useState(false)
    const [loadingMore, setLoadingMore] = useState(false)
    const [error, setError] = useState(null)
    const [searchQuery, setSearchQuery] = useState('')
    const [offset, setOffset] = useState(0)
    const [hasMore, setHasMore] = useState(true)
    const isFetching = useRef(false)

    const loadPokemon = useCallback(async (currentOffset, isInitial = false) => {
        if (isFetching.current || !hasMore) return
        isFetching.current = true

        isInitial ? setLoading(true) : setLoadingMore(true)
        setError(null)

        try {
            const list = await fetchPokemonList(LIMIT, currentOffset)

            if (list.length < LIMIT) setHasMore(false)
            if (list.length === 0) return

            const detailed = await Promise.all(list.map((p) => fetchPokemonDetail(p.name)))
            setPokemon((prev) => [...prev, ...detailed])
            setOffset(currentOffset + LIMIT)
        } catch (err) {
            setError(err.message)
        } finally {
            isInitial ? setLoading(false) : setLoadingMore(false)
            isFetching.current = false
        }
    }, [hasMore])

    // Initial load
    useEffect(() => {
        loadPokemon(0, true)
    }, [])

    // Infinite scroll
    useEffect(() => {
        const handleScroll = () => {
            const nearBottom =
                window.innerHeight + window.scrollY >= document.body.offsetHeight - 300
            if (nearBottom && !isFetching.current) {
                loadPokemon(offset)
            }
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [offset, loadPokemon])

    const filteredPokemon = pokemon.filter(
        (p) =>
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.types.some((t) => t.type.name.toLowerCase().includes(searchQuery.toLowerCase()))
    )

    return {
        pokemon: filteredPokemon,
        loading,
        loadingMore,
        error,
        searchQuery,
        setSearchQuery,
        hasMore,
    }
}