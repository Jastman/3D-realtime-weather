import { useState, useCallback } from 'react'
import {
  getWeatherDescription,
  getWeatherIcon,
  windDirectionLabel,
} from '../utils/weatherMapping'
import { lookupAirport } from '../data/airports'
import { computeGreatCircle, haversineDistanceKm } from '../utils/greatCircle'

function toF(c) { return Math.round(c * 9 / 5 + 32) }
function toMph(kmh) { return Math.round(kmh * 0.621371) }

export function WeatherPanel({
  weather,
  turbulence,
  turbulenceLabel,
  turbulenceColor,
  location,
  locationName,
  appMode,
  onAppModeChange,
  tempUnit,
  onTempUnitChange,
  qualityPreset,
  onQualityChange,
  currentDate,
  onDateChange,
  onAirportRoute,
  hasRoute,
  onClearRoute,
  routeDistKm,
  routeOrigin,
  routeDest,
  globeTapMode,
  onGlobeTapMode,
}) {
  // Start expanded on desktop (wide screen)
  const [expanded, setExpanded] = useState(() => window.innerWidth >= 768)
  const [timeOffset, setTimeOffset] = useState(0)

  // ── Derived weather values ────────────────────────────────────────────────
  const tempRaw = weather?.temp != null ? weather.temp : null
  const tempDisplay = tempRaw != null
    ? (tempUnit === 'F' ? `${toF(tempRaw)}°F` : `${Math.round(tempRaw)}°C`)
    : '--'

  const windKmh = weather?.windSpeed != null ? Math.round(weather.windSpeed) : '--'
  const windMph = weather?.windSpeed != null ? toMph(weather.windSpeed) : '--'
  const windSpeed = tempUnit === 'F' ? `${windMph} mph` : `${windKmh} km/h`
  const windDirLabel = weather?.windDir != null ? windDirectionLabel(weather.windDir) : ''
  const cloudCoverPct = weather?.cloudCover != null ? Math.round(weather.cloudCover) : '--'
  const turbulencePct = Math.round(turbulence * 100)
  const weatherDesc = weather ? getWeatherDescription(weather.weatherCode) : 'Loading…'
  const weatherIcon = weather ? getWeatherIcon(weather.weatherCode) : '🌍'

  // ── Location display ──────────────────────────────────────────────────────
  const locationDisplay = locationName?.display
    || `${location.lat.toFixed(2)}°, ${location.lon.toFixed(2)}°`

  // ── Time slider ───────────────────────────────────────────────────────────
  function handleTimeSlider(e) {
    const h = Number(e.target.value)
    setTimeOffset(h)
    const d = new Date(currentDate)
    d.setHours(d.getHours() + h)
    onDateChange(d)
  }

  return (
    <div className={`weather-panel ${expanded ? 'expanded' : ''}`}>
      {/* ── Collapsed header ─────────────────────────────────────────────── */}
      <div
        className="panel-header"
        onClick={() => setExpanded(e => !e)}
        role="button"
        aria-expanded={expanded}
      >
        <span className="weather-summary">
          <span className="weather-icon">{weatherIcon}</span>
          <span className="temp">{tempDisplay}</span>
          <span className="desc">{weatherDesc}</span>
        </span>
        <button
          className="unit-toggle"
          onClick={e => { e.stopPropagation(); onTempUnitChange(tempUnit === 'F' ? 'C' : 'F') }}
          title="Toggle temperature unit"
        >
          {tempUnit === 'F' ? '°C' : '°F'}
        </button>
        <span className="expand-arrow">{expanded ? '▼' : '▲'}</span>
      </div>

      {/* ── Mode tabs ────────────────────────────────────────────────────── */}
      <div className="mode-tabs">
        <button
          className={`mode-tab ${appMode === 'weather' ? 'active' : ''}`}
          onClick={() => onAppModeChange('weather')}
        >
          🌤 Weather
        </button>
        <button
          className={`mode-tab ${appMode === 'turbulence' ? 'active' : ''}`}
          onClick={() => onAppModeChange('turbulence')}
        >
          ✈ Turbulence
        </button>
      </div>

      {/* ── Expanded content ─────────────────────────────────────────────── */}
      {expanded && appMode === 'weather' && (
        <WeatherTab
          locationDisplay={locationDisplay}
          windSpeed={windSpeed}
          windDirLabel={windDirLabel}
          cloudCoverPct={cloudCoverPct}
          turbulencePct={turbulencePct}
          turbulenceColor={turbulenceColor}
          turbulenceLabel={turbulenceLabel}
          qualityPreset={qualityPreset}
          onQualityChange={onQualityChange}
          timeOffset={timeOffset}
          onTimeSlider={handleTimeSlider}
          fetchedAt={weather?.fetchedAt}
        />
      )}

      {expanded && appMode === 'turbulence' && (
        <TurbulenceTab
          turbulencePct={turbulencePct}
          turbulenceColor={turbulenceColor}
          turbulenceLabel={turbulenceLabel}
          onAirportRoute={onAirportRoute}
          hasRoute={hasRoute}
          onClearRoute={onClearRoute}
          routeDistKm={routeDistKm}
          routeOrigin={routeOrigin}
          routeDest={routeDest}
          globeTapMode={globeTapMode}
          onGlobeTapMode={onGlobeTapMode}
        />
      )}
    </div>
  )
}

// ── Weather tab ──────────────────────────────────────────────────────────────

function WeatherTab({
  locationDisplay, windSpeed, windDirLabel, cloudCoverPct,
  turbulencePct, turbulenceColor, turbulenceLabel,
  qualityPreset, onQualityChange,
  timeOffset, onTimeSlider, fetchedAt,
}) {
  return (
    <div className="panel-body">
      <div className="data-row location-row">
        <span className="data-label">📍 Location</span>
        <span className="data-value location-name">{locationDisplay}</span>
      </div>

      <div className="data-row">
        <span className="data-label">💨 Wind</span>
        <span className="data-value">{windSpeed} {windDirLabel}</span>
      </div>

      <div className="data-row">
        <span className="data-label">☁ Clouds</span>
        <span className="data-value">{cloudCoverPct}%</span>
      </div>

      <div className="data-row turbulence-row">
        <span className="data-label">🌪 Turbulence</span>
        <div className="turbulence-bar-wrap">
          <div
            className="turbulence-bar"
            style={{ width: `${turbulencePct}%`, background: `linear-gradient(to right, #22c55e, ${turbulenceColor})` }}
          />
        </div>
        <span className="turbulence-pct" style={{ color: turbulenceColor }}>{turbulencePct}%</span>
      </div>

      <div className="data-row">
        <span className="data-label">🎨 Quality</span>
        <div className="quality-btns">
          {['low', 'medium', 'high', 'ultra'].map(q => (
            <button
              key={q}
              className={`quality-btn ${qualityPreset === q ? 'active' : ''}`}
              onClick={() => onQualityChange(q)}
            >
              {q.charAt(0).toUpperCase() + q.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="data-row time-row">
        <span className="data-label">🕐 Time</span>
        <div className="time-slider-wrap">
          <input
            type="range" min={-12} max={12} step={0.25}
            value={timeOffset} onChange={onTimeSlider}
            className="time-slider"
          />
          <span className="time-label">
            {timeOffset === 0 ? 'Now' : `${timeOffset > 0 ? '+' : ''}${timeOffset.toFixed(2)}h`}
          </span>
        </div>
      </div>

      {fetchedAt && (
        <div className="data-row last-updated">
          <span className="data-label">Updated</span>
          <span className="data-value dim">
            {fetchedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      )}
    </div>
  )
}

// ── Turbulence tab ───────────────────────────────────────────────────────────

function TurbulenceTab({
  turbulencePct, turbulenceColor, turbulenceLabel,
  onAirportRoute, hasRoute, onClearRoute, routeDistKm,
  routeOrigin, routeDest, globeTapMode, onGlobeTapMode,
}) {
  const [originCode, setOriginCode]   = useState('')
  const [destCode, setDestCode]       = useState('')
  const [flightNum, setFlightNum]     = useState('')
  const [lookupError, setLookupError] = useState(null)

  const handleRouteSubmit = useCallback((e) => {
    e.preventDefault()
    setLookupError(null)

    const orig = lookupAirport(originCode)
    const dest = lookupAirport(destCode)

    if (!orig) { setLookupError(`Unknown airport: ${originCode.toUpperCase()}`); return }
    if (!dest) { setLookupError(`Unknown airport: ${destCode.toUpperCase()}`); return }

    const pts  = computeGreatCircle(orig.lat, orig.lon, dest.lat, dest.lon, 80, 10_500)
    const dist = haversineDistanceKm(orig.lat, orig.lon, dest.lat, dest.lon)

    onAirportRoute(
      { iata: originCode.toUpperCase(), ...orig },
      { iata: destCode.toUpperCase(), ...dest },
      pts,
      dist
    )
  }, [originCode, destCode, onAirportRoute])

  return (
    <div className="panel-body">
      {/* Current turbulence */}
      <div className="data-row turbulence-row">
        <span className="data-label">🌪 Turbulence</span>
        <div className="turbulence-bar-wrap">
          <div
            className="turbulence-bar"
            style={{ width: `${turbulencePct}%`, background: `linear-gradient(to right, #22c55e, ${turbulenceColor})` }}
          />
        </div>
        <span className="turbulence-pct" style={{ color: turbulenceColor }}>{turbulencePct}%</span>
      </div>

      <div className="section-divider">Flight Route</div>

      {/* Airport route form */}
      <form className="route-form" onSubmit={handleRouteSubmit}>
        <div className="route-inputs">
          <input
            className="airport-input"
            placeholder="Origin (e.g. JFK)"
            value={originCode}
            onChange={e => setOriginCode(e.target.value)}
            maxLength={4}
          />
          <span className="route-arrow">→</span>
          <input
            className="airport-input"
            placeholder="Dest (e.g. LAX)"
            value={destCode}
            onChange={e => setDestCode(e.target.value)}
            maxLength={4}
          />
        </div>
        <input
          className="flight-num-input"
          placeholder="Flight # (optional, e.g. AA123)"
          value={flightNum}
          onChange={e => setFlightNum(e.target.value)}
        />
        {lookupError && <div className="lookup-error">{lookupError}</div>}
        <div className="route-form-actions">
          <button type="submit" className="route-submit-btn">Visualize Route</button>
          <button
            type="button"
            className={`globe-tap-btn ${globeTapMode ? 'active' : ''}`}
            onClick={() => onGlobeTapMode(!globeTapMode)}
            title="Tap two points on the globe to draw a route"
          >
            🌍 Tap Globe
          </button>
        </div>
      </form>

      {globeTapMode && (
        <div className="route-hint">Tap two points on the globe to set route</div>
      )}

      {/* Active route summary */}
      {hasRoute && (
        <div className="route-summary-card">
          {routeOrigin && routeDest ? (
            <div className="route-airports">
              <span className="airport-tag">{routeOrigin.iata}</span>
              <span className="route-line">──✈──</span>
              <span className="airport-tag">{routeDest.iata}</span>
            </div>
          ) : (
            <div className="route-airports">
              <span className="airport-tag">A</span>
              <span className="route-line">──✈──</span>
              <span className="airport-tag">B</span>
            </div>
          )}
          {routeOrigin && <div className="route-city">{routeOrigin.city}</div>}
          {routeDistKm && (
            <div className="route-stat">
              {Math.round(routeDistKm).toLocaleString()} km
              &nbsp;·&nbsp;
              <span style={{ color: turbulenceColor }}>{turbulenceLabel} turbulence</span>
            </div>
          )}
          <button className="clear-route-btn" onClick={onClearRoute}>✕ Clear Route</button>
        </div>
      )}
    </div>
  )
}
