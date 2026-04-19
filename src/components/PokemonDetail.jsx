import { useParams, useNavigate } from 'react-router-dom'
import { usePokemonDetail } from '../hooks/usePokemonDetail'

import { TYPE_COLORS } from '../constants/typeColors'

export function PokemonDetail() {
  const { name } = useParams()
  const navigate = useNavigate()
  const { pokemon, loading, error } = usePokemonDetail(name)

  if (loading) return <div className="status-message" role="status">Loading…</div>
  if (error) return <div className="status-message error" role="alert">{error}</div>
  if (!pokemon) return null

  const sprite =
    pokemon.sprites?.other?.['official-artwork']?.front_default ||
    pokemon.sprites?.front_default

  const maxStat = 255

  return (
    <div className="detail-page">
      <button className="back-btn" onClick={() => navigate(-1)} aria-label="Go back">
        ← Back
      </button>

      <div className="detail-card">
        <div className="detail-hero">
          <img src={sprite} alt={pokemon.name} className="detail-image" />
          <div className="detail-info">
            <span className="card-id">#{String(pokemon.id).padStart(3, '0')}</span>
            <h1 className="detail-name">{pokemon.name}</h1>
            <div className="card-types">
              {pokemon.types.map(({ type }) => (
                <span
                  key={type.name}
                  className="type-badge"
                  style={{ backgroundColor: TYPE_COLORS[type.name] || '#A8A77A' }}
                >
                  {type.name}
                </span>
              ))}
            </div>
            <div className="detail-measurements">
              <span>Height: {pokemon.height / 10}m</span>
              <span>Weight: {pokemon.weight / 10}kg</span>
            </div>
            <div className="detail-abilities">
              <strong>Abilities:</strong>{' '}
              {pokemon.abilities.map(({ ability, is_hidden }) => (
                <span key={ability.name} className={is_hidden ? 'hidden-ability' : ''}>
                  {ability.name}{is_hidden ? ' (hidden)' : ''}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="detail-stats">
          <h2>Base Stats</h2>
          {pokemon.stats.map(({ base_stat, stat }) => (
            <div key={stat.name} className="stat-row">
              <span className="stat-label">{stat.name}</span>
              <span className="stat-value">{base_stat}</span>
              <div className="stat-bar-bg">
                <div
                  className="stat-bar-fill"
                  style={{ width: `${(base_stat / maxStat) * 100}%` }}
                  role="progressbar"
                  aria-valuenow={base_stat}
                  aria-valuemin={0}
                  aria-valuemax={maxStat}
                  aria-label={stat.name}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}