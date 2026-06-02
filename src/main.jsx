import React, { useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { ExternalLink, Filter, MapPin, Navigation, Search, Star, Utensils } from 'lucide-react'
import { mensas } from './mensas'
import './styles.css'

const districtOrder = ['Alle', ...Array.from(new Set(mensas.map((mensa) => mensa.district))).sort()]
const typeOrder = ['Alle', ...Array.from(new Set(mensas.map((mensa) => mensa.type))).sort()]

function App() {
  const [query, setQuery] = useState('')
  const [district, setDistrict] = useState('Alle')
  const [type, setType] = useState('Alle')
  const [selectedId, setSelectedId] = useState(mensas[0].id)
  const [favorites, setFavorites] = useState(() => new Set())

  const filteredMensas = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    return mensas.filter((mensa) => {
      const matchesSearch = !normalizedQuery || [mensa.name, mensa.school, mensa.address, mensa.provider, ...mensa.features]
        .join(' ')
        .toLowerCase()
        .includes(normalizedQuery)
      const matchesDistrict = district === 'Alle' || mensa.district === district
      const matchesType = type === 'Alle' || mensa.type === type

      return matchesSearch && matchesDistrict && matchesType
    })
  }, [district, query, type])

  const selectedMensa = mensas.find((mensa) => mensa.id === selectedId) ?? filteredMensas[0] ?? mensas[0]

  const toggleFavorite = (id) => {
    setFavorites((current) => {
      const next = new Set(current)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  return (
    <main className="app-shell">
      <section className="hero">
        <div className="hero__content">
          <p className="eyebrow"><Utensils size={18} /> Schulmensen in der Stadt Zürich</p>
          <h1>Finde Mensas, Menüs und Mittagspausen-Angebote auf einer interaktiven Karte.</h1>
          <p className="hero__text">
            Suche nach Schulname, Quartier oder Angebot, filtere nach Mensa-Typ und öffne den offiziellen
            Wochenmenüplan direkt bei der jeweiligen Schule oder Betreiberin.
          </p>
          <div className="hero__stats" aria-label="Datenübersicht">
            <strong>{mensas.length}</strong><span>kuratierte Standorte</span>
            <strong>{districtOrder.length - 1}</strong><span>Stadtgebiete</span>
            <strong>{favorites.size}</strong><span>Favoriten</span>
          </div>
        </div>
        <div className="hero__card">
          <span>Heute im Fokus</span>
          <h2>{selectedMensa.name}</h2>
          <p>{selectedMensa.school}</p>
          <a href={selectedMensa.menuUrl} target="_blank" rel="noreferrer">
            Menüplan öffnen <ExternalLink size={16} />
          </a>
        </div>
      </section>

      <section className="controls" aria-label="Mensas suchen und filtern">
        <label className="search-box">
          <Search size={20} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Suche: z. B. Rämibühl, vegetarisch, ZFV ..."
          />
        </label>
        <label>
          <Filter size={18} />
          <select value={district} onChange={(event) => setDistrict(event.target.value)}>
            {districtOrder.map((item) => <option key={item}>{item}</option>)}
          </select>
        </label>
        <label>
          <Utensils size={18} />
          <select value={type} onChange={(event) => setType(event.target.value)}>
            {typeOrder.map((item) => <option key={item}>{item}</option>)}
          </select>
        </label>
      </section>

      <section className="workspace">
        <aside className="list-panel" aria-label="Gefilterte Mensen">
          <div className="panel-heading">
            <h2>{filteredMensas.length} Treffer</h2>
            <p>Wähle eine Mensa für Details und Menülinks.</p>
          </div>
          <div className="mensa-list">
            {filteredMensas.map((mensa) => (
              <button
                className={`mensa-card ${selectedMensa.id === mensa.id ? 'is-selected' : ''}`}
                key={mensa.id}
                onClick={() => setSelectedId(mensa.id)}
              >
                <span className="mensa-card__type">{mensa.type}</span>
                <strong>{mensa.name}</strong>
                <small>{mensa.school}</small>
                <span><MapPin size={14} /> {mensa.district}</span>
              </button>
            ))}
            {filteredMensas.length === 0 && (
              <div className="empty-state">
                <strong>Keine Mensa gefunden.</strong>
                <p>Versuche einen anderen Suchbegriff oder entferne einen Filter.</p>
              </div>
            )}
          </div>
        </aside>

        <section className="map-panel" aria-label="Interaktive Standortkarte">
          <div className="zurich-map" role="img" aria-label="Schematische Karte der Stadt Zürich mit Mensa-Markern">
            <div className="lake">Zürichsee</div>
            <div className="limmat">Limmat</div>
            {filteredMensas.map((mensa) => {
              const x = 18 + ((mensa.lng - 8.515) / (8.56 - 8.515)) * 68
              const y = 84 - ((mensa.lat - 47.335) / (47.415 - 47.335)) * 70
              return (
                <button
                  key={mensa.id}
                  className={`map-marker ${selectedMensa.id === mensa.id ? 'is-active' : ''}`}
                  style={{ left: `${x}%`, top: `${y}%` }}
                  onClick={() => setSelectedId(mensa.id)}
                  title={`${mensa.name}, ${mensa.district}`}
                >
                  <span>{mensa.name}</span>
                </button>
              )
            })}
          </div>
        </section>

        <section className="detail-panel" aria-live="polite">
          <div className="detail-header">
            <div>
              <span className="mensa-card__type">{selectedMensa.type}</span>
              <h2>{selectedMensa.name}</h2>
              <p>{selectedMensa.school}</p>
            </div>
            <button
              className={`favorite-button ${favorites.has(selectedMensa.id) ? 'is-favorite' : ''}`}
              onClick={() => toggleFavorite(selectedMensa.id)}
              aria-label="Favorit umschalten"
            >
              <Star fill="currentColor" />
            </button>
          </div>

          <div className="info-grid">
            <article>
              <MapPin />
              <span>Adresse</span>
              <strong>{selectedMensa.address}</strong>
            </article>
            <article>
              <Navigation />
              <span>Öffnungszeiten</span>
              <strong>{selectedMensa.openingHours}</strong>
            </article>
          </div>

          <div className="menu-box">
            <div className="menu-box__heading">
              <h3>Menü-Übersicht</h3>
              <a href={selectedMensa.menuUrl} target="_blank" rel="noreferrer">
                {selectedMensa.currentMenuLabel} <ExternalLink size={16} />
              </a>
            </div>
            {selectedMensa.today.map((menu) => (
              <div className="menu-row" key={`${selectedMensa.id}-${menu.line}`}>
                <span>{menu.line}</span>
                <p>{menu.dish}</p>
                <div>{menu.tags.map((tag) => <em key={tag}>{tag}</em>)}</div>
              </div>
            ))}
          </div>

          <div className="feature-list">
            {selectedMensa.features.map((feature) => <span key={feature}>{feature}</span>)}
          </div>

          <p className="fine-print">
            Anbieter: {selectedMensa.provider}. {selectedMensa.priceHint} Die App verlinkt auf die offiziellen
            Menüquellen, weil sich Tagesmenus häufig ändern.
          </p>
        </section>
      </section>
    </main>
  )
}

createRoot(document.getElementById('root')).render(<App />)
