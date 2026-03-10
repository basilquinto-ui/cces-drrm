import { useEffect, useRef } from 'react'
import logo from '../assets/logo.png'

const skyClasses = {
  sunny: 'linear-gradient(135deg,#0a3d6b 0%,#1565c0 50%,#1976d2 100%)',
  cloudy: 'linear-gradient(135deg,#1a2a3a 0%,#2c3e50 50%,#37474f 100%)',
  rainy: 'linear-gradient(135deg,#0d1117 0%,#1a1f2e 50%,#243447 100%)',
  stormy: 'linear-gradient(135deg,#060608 0%,#0d0f1a 50%,#1a0a2e 100%)',
}

const statusBadgeClass = { normal: 'status-normal', watch: 'status-watch', alert: 'status-alert' }
const statusLabel = { normal: '🟢 Normal', watch: '🟡 Watch', alert: '🔴 Alert' }

export default function Header({ weather, status }) {
  const rainRef = useRef(null)

  useEffect(() => {
    if (!rainRef.current) return
    rainRef.current.innerHTML = ''
    const showRain = weather.type === 'rainy' || weather.type === 'stormy'
    if (!showRain) return
    const heavy = weather.type === 'stormy'
    for (let i = 0; i < (heavy ? 25 : 12); i++) {
      const d = document.createElement('div')
      d.className = 'hdr-drop'
      d.style.cssText = `position:absolute;width:1.5px;border-radius:2px;background:linear-gradient(to bottom,transparent,rgba(174,214,241,0.7));left:${Math.random()*100}%;top:${Math.random()*100}%;height:${heavy?15:9}px;opacity:${0.4+Math.random()*0.4};animation:hdrRain ${0.3+Math.random()*0.5}s linear ${Math.random()*0.5}s infinite`
      rainRef.current.appendChild(d)
    }
  }, [weather.type])

  const weatherPill = weather.temp
    ? `${weather.type === 'sunny' ? '☀️' : weather.type === 'rainy' ? '🌧️' : weather.type === 'stormy' ? '⛈️' : '⛅'} ${weather.temp}° · ${weather.description}`
    : '⛅ Loading...'

  return (
    <div style={{ height: 'var(--header-height)', flexShrink: 0, position: 'relative', overflow: 'hidden', boxShadow: '0 3px 16px rgba(0,0,0,0.25)' }}>
      {/* Sky background */}
      <div style={{ position: 'absolute', inset: 0, background: skyClasses[weather.type] || skyClasses.sunny, transition: 'background 2s ease', zIndex: 0 }} />

      {/* Animated clouds */}
      <style>{`
        @keyframes hdrCloud1{from{left:-80px}to{left:520px}}
        @keyframes hdrCloud2{from{left:-60px}to{left:520px}}
        @keyframes hdrCloud3{from{left:520px}to{left:-100px}}
        @keyframes hdrRain{from{transform:translateY(-10px)}to{transform:translateY(80px)}}
        @keyframes hdrFlash{0%,82%,84%,86%,100%{opacity:0}83%,85%{opacity:1}}
        @keyframes hdrGlow{0%,100%{box-shadow:0 0 20px rgba(255,200,0,0.4)}50%{box-shadow:0 0 40px rgba(255,220,0,0.7)}}
        .hdr-c{position:absolute;border-radius:40px;pointer-events:none;background:rgba(255,255,255,0.12)}
        .hdr-c::before,.hdr-c::after{content:"";position:absolute;border-radius:50%;background:inherit}
        .hdr-c1{width:55px;height:18px;top:8px;animation:hdrCloud1 14s linear infinite}
        .hdr-c1::before{width:24px;height:24px;top:-12px;left:8px}
        .hdr-c1::after{width:18px;height:18px;top:-9px;left:24px}
        .hdr-c2{width:40px;height:13px;top:20px;opacity:0.8;animation:hdrCloud2 20s linear infinite;animation-delay:-8s}
        .hdr-c2::before{width:18px;height:18px;top:-9px;left:6px}
        .hdr-c2::after{width:13px;height:13px;top:-6px;left:18px}
        .hdr-c3{width:70px;height:22px;top:4px;opacity:0.6;animation:hdrCloud3 17s linear infinite;animation-delay:-4s}
        .hdr-c3::before{width:30px;height:30px;top:-15px;left:10px}
        .hdr-c3::after{width:22px;height:22px;top:-11px;left:34px}
        .status-normal{background:rgba(22,163,74,0.85);color:white}
        .status-watch{background:rgba(202,138,4,0.9);color:white}
        .status-alert{background:rgba(220,38,38,0.95);color:white}
      `}</style>

      <div className="hdr-c hdr-c1" style={{ zIndex: 1 }} />
      <div className="hdr-c hdr-c2" style={{ zIndex: 1 }} />
      <div className="hdr-c hdr-c3" style={{ zIndex: 1 }} />

      {/* Sun */}
      {(weather.type === 'sunny' || weather.type === 'cloudy') && (
        <div style={{ position: 'absolute', top: -20, right: 55, width: 70, height: 70, borderRadius: '50%', background: 'radial-gradient(circle,#ffd700 30%,rgba(255,140,0,0.5) 70%,transparent 100%)', animation: 'hdrGlow 4s ease-in-out infinite', zIndex: 1, opacity: weather.type === 'sunny' ? 1 : 0.3 }} />
      )}

      {/* Rain in header */}
      <div ref={rainRef} style={{ position: 'absolute', inset: 0, zIndex: 1, overflow: 'hidden', pointerEvents: 'none' }} />

      {/* Lightning */}
      {weather.type === 'stormy' && (
        <div style={{ position: 'absolute', top: 0, left: '35%', width: 2, height: 40, background: 'rgba(255,255,150,0.9)', opacity: 0, zIndex: 2, clipPath: 'polygon(50% 0%,0% 40%,40% 40%,10% 100%,100% 40%,50% 40%)', animation: 'hdrFlash 5s infinite' }} />
      )}

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 10, height: '100%', display: 'flex', alignItems: 'center', padding: '0 16px', gap: 12 }}>
        <img src={logo} alt="CCES Logo" style={{ width: 42, height: 42, borderRadius: '50%', border: '2px solid var(--gold)', flexShrink: 0, objectFit: 'cover' }} />
        <div>
          <div style={{ color: 'white', fontSize: 15, fontWeight: 800, fontFamily: 'Poppins, sans-serif', lineHeight: 1.2, textShadow: '0 1px 4px rgba(0,0,0,0.4)' }}>CCES DRRM Portal</div>
          <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 11 }}>Camp Crame ES · Quezon City</div>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
          <span className={`badge ${statusBadgeClass[status]}`} style={{ fontSize: 11, padding: '4px 10px' }}>
            {statusLabel[status]}
          </span>
          <div style={{ background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)', borderRadius: 12, padding: '3px 8px', fontSize: 11, color: 'white', fontWeight: 700 }}>
            {weatherPill}
          </div>
        </div>
      </div>
    </div>
  )
}
