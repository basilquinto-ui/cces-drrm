import { useEffect, useRef } from 'react'

const bgClass = { sunny: 'linear-gradient(135deg,#1a6fa8,#2980b9 40%,#f39c12)', cloudy: 'linear-gradient(135deg,#2c3e50,#4a6274 50%,#7f8c8d)', rainy: 'linear-gradient(135deg,#1a1a2e,#16213e 50%,#0f3460)', stormy: 'linear-gradient(135deg,#0d0d0d,#1a1a2e 50%,#2c003e)' }

export default function WeatherCard({ weather, signal, onSignalChange }) {
  const rainRef = useRef(null)
  const raysRef = useRef(null)

  useEffect(() => {
    // Build sun rays
    if (raysRef.current) {
      raysRef.current.innerHTML = ''
      for (let i = 0; i < 12; i++) {
        const r = document.createElement('div')
        r.style.cssText = `position:absolute;width:4px;height:20px;background:rgba(255,200,0,0.6);border-radius:2px;top:50%;left:50%;transform-origin:2px -25px;transform:rotate(${i*30}deg)`
        raysRef.current.appendChild(r)
      }
    }
  }, [])

  useEffect(() => {
    if (!rainRef.current) return
    rainRef.current.innerHTML = ''
    const show = weather.type === 'rainy' || weather.type === 'stormy'
    if (!show) return
    const heavy = weather.type === 'stormy'
    for (let i = 0; i < (heavy ? 45 : 22); i++) {
      const d = document.createElement('div')
      d.style.cssText = `position:absolute;width:2px;border-radius:2px;background:linear-gradient(to bottom,transparent,rgba(174,214,241,0.8));left:${Math.random()*100}%;top:${Math.random()*100}%;height:${heavy?22:13}px;opacity:${0.4+Math.random()*0.5};animation:rainFall ${0.4+Math.random()*0.7}s linear ${Math.random()}s infinite`
      rainRef.current.appendChild(d)
    }
  }, [weather.type])

  const signalColors = ['rgba(22,163,74,0.8)', 'rgba(234,179,8,0.9)', 'rgba(249,115,22,0.9)', 'rgba(220,38,38,0.95)']
  const signalLabels = ['🌀 No Typhoon Signal', '🌀 Signal #1', '🌀 Signal #2', '🌀 Signal #3+']

  return (
    <div style={{ borderRadius: 'var(--radius)', overflow: 'hidden', position: 'relative', height: 160, boxShadow: 'var(--shadow-lg)', marginBottom: 14 }}>
      <style>{`
        @keyframes cloudFloat{from{left:-100px}to{left:110%}}
        @keyframes sunGlow{0%,100%{box-shadow:0 0 40px rgba(255,200,0,0.8)}50%{box-shadow:0 0 60px rgba(255,220,0,1)}}
        @keyframes sunSpin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        @keyframes rainFall{from{transform:translateY(-20px)}to{transform:translateY(200px)}}
        @keyframes lightFlash{0%,85%,87%,89%,100%{opacity:0}86%,88%{opacity:1}}
        @keyframes quakePulse{0%,100%{transform:scale(1)}50%{transform:scale(1.5)}}
        .wcloud{position:absolute;background:rgba(255,255,255,0.85);border-radius:50px}
        .wcloud::before,.wcloud::after{content:"";position:absolute;background:inherit;border-radius:50%}
        .wc1{width:70px;height:22px;top:20px;animation:cloudFloat 8s linear infinite}
        .wc1::before{width:32px;height:32px;top:-16px;left:10px}
        .wc1::after{width:24px;height:24px;top:-12px;left:32px}
        .wc2{width:50px;height:16px;top:35px;animation:cloudFloat 12s linear infinite;animation-delay:-4s;opacity:0.7}
        .wc2::before{width:24px;height:24px;top:-12px;left:8px}
        .wc2::after{width:18px;height:18px;top:-9px;left:26px}
        .wc3{width:60px;height:18px;top:14px;animation:cloudFloat 10s linear infinite;animation-delay:-7s;opacity:0.6}
        .wc3::before{width:28px;height:28px;top:-14px;left:8px}
        .wc3::after{width:20px;height:20px;top:-10px;left:30px}
      `}</style>

      {/* Background */}
      <div style={{ position: 'absolute', inset: 0, background: bgClass[weather.type] || bgClass.sunny, transition: 'background 1.5s ease' }} />

      {/* Sun */}
      {weather.type === 'sunny' && (
        <>
          <div style={{ position: 'absolute', top: -15, right: -15, width: 90, height: 90, borderRadius: '50%', background: 'radial-gradient(circle,#ffd700 30%,#ff8c00 70%,transparent 100%)', animation: 'sunGlow 3s ease-in-out infinite' }} />
          <div ref={raysRef} style={{ position: 'absolute', top: -15, right: -15, width: 90, height: 90, animation: 'sunSpin 20s linear infinite' }} />
        </>
      )}

      {/* Clouds */}
      <div className="wcloud wc1" />
      <div className="wcloud wc2" />
      <div className="wcloud wc3" />

      {/* Rain */}
      <div ref={rainRef} style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }} />

      {/* Lightning */}
      {weather.type === 'stormy' && (
        <div style={{ position: 'absolute', top: 10, left: '40%', width: 3, height: 50, background: 'linear-gradient(to bottom,#fff700,#fff,transparent)', filter: 'blur(1px)', opacity: 0, animation: 'lightFlash 4s infinite', clipPath: 'polygon(50% 0%,0% 40%,40% 40%,10% 100%,100% 40%,50% 40%)' }} />
      )}

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 10, padding: 16, height: '100%', display: 'flex', alignItems: 'center', gap: 16 }}>
        <div>
          <div style={{ fontSize: 48, fontWeight: 900, color: 'white', fontFamily: 'Poppins, sans-serif', lineHeight: 1, textShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>
            {weather.temp ? `${weather.temp}°` : '--°'}
          </div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.9)', fontWeight: 700, marginTop: 2 }}>
            {weather.loading ? 'Loading weather...' : weather.description}
          </div>
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'flex-end' }}>
          {[`💧 ${weather.humidity ?? '--'}% humidity`, `💨 ${weather.windKph ?? '--'} km/h winds`, '📍 Quezon City'].map(t => (
            <div key={t} style={{ background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)', borderRadius: 20, padding: '4px 10px', fontSize: 11, color: 'white', fontWeight: 700 }}>{t}</div>
          ))}
        </div>
      </div>

      {/* PAGASA Signal */}
      <div style={{ position: 'absolute', bottom: 12, left: 16, zIndex: 10, padding: '4px 12px', borderRadius: 20, fontSize: 11, fontWeight: 800, backdropFilter: 'blur(8px)', background: signalColors[signal] || signalColors[0], color: 'white', cursor: 'pointer' }} onClick={() => onSignalChange?.((signal + 1) % 4)}>
        {signalLabels[signal]}
      </div>

      {/* Earthquake badge */}
      <div style={{ position: 'absolute', bottom: 12, right: 16, zIndex: 10, background: 'rgba(27,58,107,0.75)', backdropFilter: 'blur(8px)', padding: '4px 10px', borderRadius: 20, fontSize: 11, fontWeight: 800, color: 'white', display: 'flex', alignItems: 'center', gap: 4 }}>
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#dc2626', animation: 'quakePulse 2s infinite' }} />
        🌍 High Seismic Risk
      </div>
    </div>
  )
}
