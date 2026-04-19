import { usePokemonList } from '../hooks/usePokemonList'
import { PokemonCard } from './PokemonCard'
import { SearchBar } from './SearchBar'

export function PokemonList() {
    const { pokemon, loading, loadingMore, error, searchQuery, setSearchQuery, hasMore } =
        usePokemonList()

    return (
        <main className="pokemon-list-page">
            <header className="list-header">
                <h1 className="app-title">Pokédex</h1>
                <SearchBar value={searchQuery} onChange={setSearchQuery} />
            </header>

            {loading && (
                <div className="status-message" role="status" aria-live="polite">
                    Loading Pokémon…
                </div>
            )}

            {error && (
                <div className="status-message error" role="alert">
                    {error}
                </div>
            )}

            {!loading && !error && pokemon.length === 0 && (
                <div className="status-message" role="status">
                    No Pokémon found for &ldquo;{searchQuery}&rdquo;
                </div>
            )}

            {!loading && !error && (
                <div className="pokemon-grid" aria-label="Pokémon list">
                    {pokemon.map((p) => (
                        <PokemonCard key={p.id} pokemon={p} />
                    ))}
                </div>
            )}

            {/* Scroll loading bar */}
            {loadingMore && (
                <div className="scroll-loader" role="status" aria-label="Loading more Pokémon">
                    <div className="scroll-loader-bar" />
                    <span>Loading more…</span>
                </div>
            )}

            {!hasMore && !loading && (
                <div className="end-message">✦ All Pokémon loaded ✦</div>
            )}
        </main>
    )
}


