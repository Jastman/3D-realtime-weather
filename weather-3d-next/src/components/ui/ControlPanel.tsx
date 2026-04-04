'use client'
import { useState } from 'react'
import { useAppStore } from '@/store/useAppStore'
import type { SceneParams } from '@/types'

function Slider({ label, param, min, max, step = 0.01 }: { label: string; param: keyof SceneParams; min: number; max: number; step?: number }) {
  const { sceneParams, setSceneParam } = useAppStore()
  const value = sceneParams[param] as number
  return (
    <div className="mb-2">
      <div className="flex justify-between text-xs text-white/60 mb-1">
        <span>{label}</span>
        <span>{typeof value === 'number' ? value.toFixed(step < 0.1 ? 2 : 0) : value}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={e => setSceneParam(param, parseFloat(e.target.value))}
        className="w-full h-1 bg-white/20 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full" />
    </div>
  )
}

export function ControlPanel({ quality, onQualityChange }: { quality: 'low' | 'medium' | 'high'; onQualityChange: (q: 'low' | 'medium' | 'high') => void }) {
  const { mode, setMode, sceneParams, setSceneParam } = useAppStore()
  const [collapsed, setCollapsed] = useState(false)
  const [section, setSection] = useState<'sky' | 'clouds' | 'effects'>('sky')

  return (
    <div className={`absolute right-4 top-20 z-20 transition-all duration-300 ${collapsed ? 'w-12' : 'w-64'}`} style={{ maxHeight: 'calc(100vh - 6rem)' }}>
      <button onClick={() => setCollapsed(!collapsed)} className="absolute -left-3 top-3 z-30 bg-white/10 hover:bg-white/20 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs border border-white/20 transition-colors">
        {collapsed ? '\u2039' : '\u203a'}
      </button>
      {!collapsed && (
        <div className="bg-black/50 backdrop-blur-md rounded-2xl border border-white/10 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 6rem)' }}>
          <div className="p-3 border-b border-white/10">
            <div className="text-white/50 text-xs uppercase tracking-wider mb-2">Mode</div>
            <div className="flex bg-white/10 rounded-lg p-0.5">
              {(['real', 'manual'] as const).map(m => (
                <button key={m} onClick={() => setMode(m)} className={`flex-1 text-xs py-1.5 rounded-md transition-all ${mode === m ? 'bg-white text-black font-semibold' : 'text-white/60 hover:text-white'}`}>
                  {m === 'real' ? '\ud83c\udf10 Real Weather' : '\ud83c\udf9b\ufe0f Manual'}
                </button>
              ))}
            </div>
          </div>
          <div className="px-3 py-2 border-b border-white/10">
            <div className="text-white/50 text-xs uppercase tracking-wider mb-2">Render Quality</div>
            <div className="flex gap-1">
              {(['low', 'medium', 'high'] as const).map(q => (
                <button key={q} onClick={() => onQualityChange(q)} className={`flex-1 text-xs py-1 rounded transition-all ${quality === q ? 'bg-white/20 text-white' : 'text-white/40 hover:text-white/70'}`}>
                  {q[0].toUpperCase() + q.slice(1)}
                </button>
              ))}
            </div>
          </div>
          {mode === 'manual' && (
            <>
              <div className="flex border-b border-white/10">
                {(['sky', 'clouds', 'effects'] as const).map(s => (
                  <button key={s} onClick={() => setSection(s)} className={`flex-1 text-xs py-2 capitalize transition-colors ${section === s ? 'text-white border-b-2 border-white' : 'text-white/40 hover:text-white/60'}`}>{s}</button>
                ))}
              </div>
              <div className="p-3">
                {section === 'sky' && (<>
                  <Slider label="Sun Elevation" param="sunElevation" min={-10} max={90} step={1} />
                  <Slider label="Sun Azimuth"   param="sunAzimuth"   min={0}   max={360} step={1} />
                  <Slider label="Sun Intensity"  param="sunIntensity"  min={0} max={3} />
                  <Slider label="Ambient Light"  param="ambientIntensity" min={0} max={1} />
                  <Slider label="Turbidity"      param="turbidity"     min={1} max={20} step={0.5} />
                  <Slider label="Rayleigh"       param="rayleigh"      min={0} max={4} />
                  <Slider label="Fog Density"    param="fogDensity"    min={0} max={0.01} step={0.0001} />
                </>)}
                {section === 'clouds' && (<>
                  <Slider label="Cloud Coverage" param="cloudCoverage" min={0} max={1} />
                  <Slider label="Cloud Altitude"  param="cloudAltitude" min={100} max={3000} step={50} />
                  <Slider label="Cloud Speed"     param="cloudSpeed"    min={0} max={5} />
                  <div className="mb-2">
                    <div className="text-xs text-white/60 mb-1">Cloud Type</div>
                    <div className="flex flex-wrap gap-1">
                      {(['cumulus','stratus','cirrus','storm'] as const).map(t => (
                        <button key={t} onClick={() => setSceneParam('cloudType', t)} className={`text-xs px-2 py-1 rounded transition-all ${sceneParams.cloudType === t ? 'bg-white/30 text-white' : 'text-white/40 hover:text-white/70 bg-white/5'}`}>{t}</button>
                      ))}
                    </div>
                  </div>
                  <Slider label="Rain Intensity" param="rainIntensity" min={0} max={1} />
                  <Slider label="Snow Intensity" param="snowIntensity" min={0} max={1} />
                  <Slider label="Wind X" param="windX" min={-50} max={50} step={1} />
                  <Slider label="Wind Z" param="windZ" min={-50} max={50} step={1} />
                </>)}
                {section === 'effects' && (<>
                  <Slider label="Bloom"      param="bloomStrength"    min={0} max={3} />
                  <Slider label="Vignette"   param="vignetteIntensity" min={0} max={1} />
                  <Slider label="Brightness" param="brightness"        min={0.5} max={1.5} />
                  <Slider label="Saturation" param="saturation"        min={0} max={2} />
                </>)}
              </div>
            </>
          )}
          {mode === 'real' && (
            <div className="p-3">
              <div className="text-white/50 text-xs mb-3">Scene driven by live weather data</div>
              {[
                { label: 'Cloud Coverage', value: `${(sceneParams.cloudCoverage * 100).toFixed(0)}%` },
                { label: 'Cloud Type',     value: sceneParams.cloudType },
                { label: 'Rain',           value: `${(sceneParams.rainIntensity * 100).toFixed(0)}%` },
                { label: 'Snow',           value: `${(sceneParams.snowIntensity * 100).toFixed(0)}%` },
                { label: 'Fog Density',    value: sceneParams.fogDensity.toFixed(4) },
                { label: 'Turbidity',      value: sceneParams.turbidity.toFixed(1) },
                { label: 'Sun Elevation',  value: `${sceneParams.sunElevation.toFixed(1)}\u00b0` },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between text-xs mb-2">
                  <span className="text-white/50">{label}</span>
                  <span className="text-white/80 font-mono">{value}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      {collapsed && (
        <div className="bg-black/50 backdrop-blur-md rounded-2xl border border-white/10 p-2 flex flex-col items-center gap-2">
          <span className="text-lg">{mode === 'real' ? '\ud83c\udf10' : '\ud83c\udf9b\ufe0f'}</span>
          <span className="text-white/40 text-xs">{quality[0].toUpperCase()}</span>
        </div>
      )}
    </div>
  )
}
