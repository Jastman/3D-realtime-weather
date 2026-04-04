'use client'
import { useState } from 'react'
import { useAppStore } from '@/store/useAppStore'

function wIcon(code: number) {
  if (code === 0) return '\u2600\ufe0f'
  if (code <= 2)  return '\ud83c\udf24\ufe0f'
  if (code <= 49) return '\ud83c\udf2b\ufe0f'
  if (code <= 69) return '\ud83c\udf27\ufe0f'
  if (code <= 79) return '\u2744\ufe0f'
  if (code <= 82) return '\ud83c\udf26\ufe0f'
  if (code <= 99) return '\u26c8\ufe0f'
  return '\ud83c\udf21\ufe0f'
}

const windDirStr = (deg: number) => ['N','NE','E','SE','S','SW','W','NW'][Math.round(deg / 45) % 8]
const fmtHour = (d: Date) => d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })

export function WeatherSidebar() {
  const { weather, forecast, location, tempUnit } = useAppStore()
  const [collapsed, setCollapsed] = useState(false)
  const cvt = (c: number) => tempUnit === 'F' ? Math.round(c * 9/5 + 32) : Math.round(c)

  if (!weather) return (
    <div className="absolute left-4 top-20 z-20">
      <div className="bg-black/50 backdrop-blur-md rounded-2xl p-6 border border-white/10 text-white/60 text-sm">
        Loading weather…
      </div>
    </div>
  )

  return (
    <div
      className={`absolute left-4 top-20 z-20 transition-all duration-300 ${collapsed ? 'w-10' : 'w-72'}`}
      style={{ maxHeight: 'calc(100vh - 6rem)' }}
    >
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-4 top-3 z-30 bg-black/60 hover:bg-black/80 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm border border-white/20 transition-colors shadow-lg"
        title={collapsed ? 'Expand' : 'Collapse'}
      >
        {collapsed ? '\u203a' : '\u2039'}
      </button>

      {!collapsed && (
        <div className="bg-black/55 backdrop-blur-md rounded-2xl border border-white/10 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 6rem)' }}>
          <div className="p-4 border-b border-white/10">
            <div className="text-white/60 text-xs uppercase tracking-wider mb-1">
              {location.city}{location.country ? `, ${location.country}` : ''}
            </div>
            <div className="flex items-end gap-3">
              <div className="text-5xl font-light text-white">{cvt(weather.temp)}&deg;</div>
              <div className="pb-1 text-3xl">{wIcon(weather.weatherCode)}</div>
            </div>
            <div className="text-white/70 text-sm mt-1">{weather.description}</div>
            <div className="text-white/50 text-xs mt-0.5">Feels like {cvt(weather.feelsLike)}&deg;{tempUnit}</div>
          </div>

          <div className="grid grid-cols-2 gap-px bg-white/5 border-b border-white/10">
            {[
              { label: 'Wind',        value: `${Math.round(weather.windSpeed)} km/h ${windDirStr(weather.windDirection)}`, icon: '\ud83d\udca8' },
              { label: 'Humidity',    value: `${weather.humidity}%`,                                                      icon: '\ud83d\udca7' },
              { label: 'Visibility',  value: `${weather.visibility.toFixed(1)} km`,                                      icon: '\ud83d\udc41\ufe0f' },
              { label: 'Precip.',     value: `${weather.precipitation} mm`,                                              icon: '\ud83c\udf27\ufe0f' },
              { label: 'Cloud Cover', value: `${weather.cloudCover}%`,                                                   icon: '\u2601\ufe0f' },
              { label: 'Status',      value: weather.isDay ? 'Daytime' : 'Nighttime',                                   icon: weather.isDay ? '\ud83c\udf1e' : '\ud83c\udf19' },
            ].map(({ label, value, icon }) => (
              <div key={label} className="bg-black/20 p-3">
                <div className="text-white/50 text-xs flex items-center gap-1"><span>{icon}</span>{label}</div>
                <div className="text-white text-sm font-medium mt-0.5">{value}</div>
              </div>
            ))}
          </div>

          {forecast.length > 0 && (
            <div className="p-3">
              <div className="text-white/50 text-xs uppercase tracking-wider mb-2">24-Hour Forecast</div>
              <div className="space-y-1">
                {forecast.slice(0, 12).map((f, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    <span className="text-white/50 text-xs w-16 shrink-0">{fmtHour(f.time)}</span>
                    <span className="text-lg leading-none">{wIcon(f.weatherCode)}</span>
                    <span className="text-white font-medium w-14">{cvt(f.temp)}&deg;</span>
                    <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-400/60 rounded-full" style={{ width: `${Math.min(100, f.precipitation * 20)}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {weather.fetchedAt && (
            <div className="px-4 pb-3 text-white/30 text-xs">
              Updated {weather.fetchedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          )}
        </div>
      )}

      {collapsed && (
        <div className="bg-black/55 backdrop-blur-md rounded-2xl border border-white/10 p-2 flex flex-col items-center gap-1">
          <span className="text-lg">{wIcon(weather.weatherCode)}</span>
          <span className="text-white text-xs font-bold">{cvt(weather.temp)}&deg;</span>
        </div>
      )}
    </div>
  )
}
