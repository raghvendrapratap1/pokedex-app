import { useNavigate } from 'react-router-dom'
import { TYPE_COLORS } from '../constants/typeColors'

export function PokemonCard({ pokemon }) {
  const navigate = useNavigate()
  const primaryType = pokemon.types[0]?.type.name
  const color = TYPE_COLORS[primaryType]?.bg || '#8A8A8A'
  const sprite =
    pokemon.sprites?.other?.['official-artwork']?.front_default ||
    pokemon.sprites?.front_default

  return (
    <article
      className="pokemon-card"
      style={{ '--card-color': TYPE_COLORS[primaryType]?.bg || '#888' }}
      onClick={() => navigate(`/pokemon/${pokemon.name}`)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && navigate(`/pokemon/${pokemon.name}`)}
      aria-label={`View details for ${pokemon.name}`}
    >
      <div className="card-image-wrap">
        <img src={sprite} alt={pokemon.name} className="card-image" loading="lazy" />
      </div>
      <div className="card-body">
        <span className="card-id">#{String(pokemon.id).padStart(3, '0')}</span>
        <h2 className="card-name">{pokemon.name}</h2>
        <div className="card-types">
          {pokemon.types.map(({ type }) => (
            <span
              key={type.name}
              className="type-badge"
              style={{ backgroundColor: TYPE_COLORS[type.name]?.bg || '#9E9E9E' }}
            >
              {type.name}
            </span>
          ))}
        </div>
      </div>
    </article>
  )
}