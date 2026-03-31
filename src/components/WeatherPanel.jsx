import { useState } from 'react'
import {
  getWeatherDescription,
  getWeatherIcon,
  windDirectionLabel,
} from '../utils/weatherMapping'

/**
 * Mobile-first weather + turbulence UI panel.
 *
 * Mobile: fixed bottom sheet that expands on tap.
 * Desktop: fixed left panel always open.
 *
 * Turbulence toggle and Route Mode button are always visible
 * so they're thumb-reachable in the collapsed state on mobile.
 */
export function WeatherPanel({
  weather,
  turbulence,
  turbulenceLabel,
  turbulenceColor,
  location,
  showTurbulenceLayer,
  onToggleTurbulenceLayer,
  routeMode,
  onToggleRouteMode,
  hasRoute,
  onClearRoute,
  distanceKm,
  qualityPreset,
  onQualityChange,
  currentDate,
  onDateChange,
}) {
  const [expanded, setExpanded] = useState(false)

  const turbulencePct = Math.round(turbulence * 100)
  const tempC = weather?.temp != null ? Math.round(weather.temp) : '--'
  const windKmh = weather?.windSpeed != null ? Math.round(weather.windSpeed) : '--'
  const windDirLabel = weather?.windDir != null ? windDirectionLabel(weather.windDir) : '--'
  const cloudCoverPct = weather?.cloudCover != null ? Math.round(weather.cloudCover) : '--'
  const weatherDesc = weather ? getWeatherDescription(weather.weatherCode) : 'Loading...'
  const weatherIcon = weather ? getWeatherIcon(weather.weatherCode) : '🌍'

  // Time of day offset: -12h to +12h from current date
  const [timeOffset, setTimeOffset] = useState(0)
  function handleTimeSlider(e) {
    const offsetH = Number(e.target.value)
    setTimeOffset(offsetH)
    const d = new Date(currentDate)
    d.setHours(d.getHours() + offsetH)
    onDateChange(d)
  }

  return (
    <div className={`weather-panel ${expanded ? 'expanded' : ''}`}>
      {/* ── Collapsed summary bar (always visible on mobile) ── */}
      <div className="panel-header" onClick={() => setExpanded(e => !e)} role="button" aria-expanded={expanded}>
        <span className="weather-summary">
          <span className="weather-icon">{weatherIcon}</span>
          <span className="temp">{tempC}°</span>
          <span className="desc">{weatherDesc}</span>
        </span>
        <span
          className="turbulence-badge"
          style={{ background: turbulenceColor, color: turbulence > 0.5 ? '#fff' : '#000' }}
        >
          {turbulenceLabel}
        </span>
        <span className="expand-arrow">{expanded ? '▼' : '▲'}</span>
      </div>

      {/* ── Quick action buttons (always visible) ── */}
      <div className="quick-actions">
        <button
          className={`action-btn turbulence-toggle ${showTurbulenceLayer ? 'active' : ''}`}
          onClick={onToggleTurbulenceLayer}
          title="Toggle turbulence overlay"
        >
          <span className="btn-icon">🌪</span>
          <span className="btn-label">Turbulence</span>
        </button>

        <button
          className={`action-btn route-btn ${routeMode ? 'active' : ''}`}
          onClick={onToggleRouteMode}
          title="Draw a flight route"
        >
          <span className="btn-icon">✈</span>
          <span className="btn-label">{routeMode ? 'Cancel Route' : 'Route'}</span>
        </button>

        {hasRoute && (
          <button className="action-btn clear-btn" onClick={onClearRoute} title="Clear route">
            <span className="btn-icon">✕</span>
            <span className="btn-label">Clear</span>
          </button>
        )}
      </div>

      {/* ── Route hint in route mode ── */}
      {routeMode && (
        <div className="route-hint">
          Tap two points on the globe to set your route
        </div>
      )}

      {/* ── Route summary ── */}
      {hasRoute && distanceKm && (
        <div className="route-summary">
          <span className="route-stat">
            ✈ {Math.round(distanceKm).toLocaleString()} km
          </span>
          <span className="route-stat" style={{ color: turbulenceColor }}>
            {turbulenceLabel} turbulence
          </span>
        </div>
      )}

      {/* ── Expanded content ── */}
      {expanded && (
        <div className="panel-body">
          {/* Location */}
          <div className="data-row location-row">
            <span className="data-label">📍 Location</span>
            <span className="data-value">
              {location.lat.toFixed(2)}°, {location.lon.toFixed(2)}°
            </span>
          </div>

          {/* Wind */}
          <div className="data-row">
            <span className="data-label">💨 Wind</span>
            <span className="data-value">{windKmh} km/h {windDirLabel}</span>
          </div>

          {/* Cloud cover */}
          <div className="data-row">
            <span className="data-label">☁ Clouds</span>
            <span className="data-value">{cloudCoverPct}%</span>
          </div>

          {/* Turbulence bar */}
          <div className="data-row turbulence-row">
            <span className="data-label">🌪 Turbulence</span>
            <div className="turbulence-bar-wrap">
              <div
                className="turbulence-bar"
                style={{
                  width: `${turbulencePct}%`,
                  background: `linear-gradient(to right, #22c55e, ${turbulenceColor})`,
                }}
              />
            </div>
            <span className="turbulence-pct" style={{ color: turbulenceColor }}>
              {turbulencePct}%
            </span>
          </div>

          {/* Quality preset */}
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

          {/* Time of day slider */}
          <div className="data-row time-row">
            <span className="data-label">
              🕐 Time
            </span>
            <div className="time-slider-wrap">
              <input
                type="range"
                min={-12}
                max={12}
                step={0.25}
                value={timeOffset}
                onChange={handleTimeSlider}
                className="time-slider"
              />
              <span className="time-label">
                {timeOffset === 0 ? 'Now' : `${timeOffset > 0 ? '+' : ''}${timeOffset.toFixed(2)}h`}
              </span>
            </div>
          </div>

          {/* Last updated */}
          {weather?.fetchedAt && (
            <div className="data-row last-updated">
              <span className="data-label">Updated</span>
              <span className="data-value dim">
                {weather.fetchedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
