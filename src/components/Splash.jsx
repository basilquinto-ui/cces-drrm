import { useEffect, useRef } from 'react'
import logo from '../assets/logo.png'

export default function Splash({ visible }) {
  const skyRef = useRef(null)

  useEffect(() => {
    if (!skyRef.current) return
    for (let i = 0; i < 60; i++) {
      const s = document.createElement('div')
      const size = Math.random() * 3 + 1
      s.style.cssText = `position:absolute;width:${size}px;height:${size}px;border-radius:50%;background:white;top:${Math.random()*100}%;left:${Math.random()*100}%;animation:twinkle ${1.5+Math.random()*2}s ${Math.random()*3}s infinite`
      skyRef.current.appendChild(s)
    }
  }, [])

  return (
    <div style={{ position: 'fixed', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 9999, transition: 'opacity 0.7s ease, visibility 0.7s ease', opacity: visible ? 1 : 0, visibility: visible ? 'visible' : 'hidden', pointerEvents: visible ? 'auto' : 'none', overflow: 'hidden' }}>
      <style>{`
        @keyframes twinkle{0%,100%{opacity:0.2;transform:scale(1)}50%{opacity:1;transform:scale(1.3)}}
        @keyframes splashPop{from{transform:scale(0.4);opacity:0}to{transform:scale(1);opacity:1}}
        @keyframes fadeUp{from{transform:translateY(18px);opacity:0}to{transform:translateY(0);opacity:1}}
        @keyframes dotPulse{0%,100%{background:rgba(255,255,255,0.3)}50%{background:#E8A020}}
      `}</style>
      <div ref={skyRef} style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg,#0a1628 0%,#1B3A6B 50%,#2A4F8F 100%)' }} />
      <img src={logo} alt="CCES" style={{ width: 110, height: 110, borderRadius: '50%', border: '3px solid #E8A020', position: 'relative', zIndex: 2, animation: 'splashPop 0.7s 0.3s cubic-bezier(.34,1.56,.64,1) both', objectFit: 'cover' }} />
      <h1 style={{ color: 'white', fontSize: 21, fontWeight: 900, textAlign: 'center', fontFamily: 'Poppins,sans-serif', position: 'relative', zIndex: 2, animation: 'fadeUp 0.6s 0.6s both', marginTop: 14 }}>CCES DRRM Portal</h1>
      <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, position: 'relative', zIndex: 2, animation: 'fadeUp 0.6s 0.7s both', marginTop: 4 }}>Camp Crame Elementary School</p>
      <div style={{ marginTop: 14, background: '#E8A020', color: '#112850', fontSize: 11, fontWeight: 800, padding: '4px 14px', borderRadius: 20, letterSpacing: 1, position: 'relative', zIndex: 2, animation: 'fadeUp 0.6s 0.8s both' }}>QUEZON CITY · EST. 1952</div>
      <div style={{ display: 'flex', gap: 8, marginTop: 36, position: 'relative', zIndex: 2, animation: 'fadeUp 0.6s 0.9s both' }}>
        {[0,1,2].map(i => <span key={i} style={{ width: 8, height: 8, borderRadius: '50%', background: 'rgba(255,255,255,0.3)', animation: `dotPulse 1.2s ${i*0.2}s infinite` }} />)}
      </div>
    </div>
  )
}
