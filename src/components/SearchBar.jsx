export function SearchBar({ value, onChange }) {
  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Search by name or type…"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Search Pokémon"
        className="search-input"
      />
    </div>
  )
}