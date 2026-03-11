import { useEffect, useRef } from 'react'
import logo from '../assets/logo.png'

/*
  Splash.jsx — CCES DRRM Portal
  ─────────────────────────────
  • Keeps your logo, visible/hidden fade transition, badge & dots
  • Adds: starfield canvas, spinning rings, shockwave, particle burst, typewriter title
  • Background matches Median's native splash — zero visible seam
*/

export default function Splash({ visible }) {
  const wrapRef     = useRef(null)
  const canvasRef   = useRef(null)
  const ring1Ref    = useRef(null)
  const ring2Ref    = useRef(null)
  const ring3Ref    = useRef(null)
  const logoWrapRef = useRef(null)
  const shockRef    = useRef(null)
  const titleRef    = useRef(null)
  const subtitleRef = useRef(null)
  const badgeRef    = useRef(null)
  const dotsRef     = useRef(null)
  const dividerRef  = useRef(null)
  const timersRef   = useRef([])
  const rafRef      = useRef(null)
  const didAnim     = useRef(false)

  // ── Starfield canvas ────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current
    const wrap   = wrapRef.current
    if (!canvas || !wrap) return

    const W = canvas.width  = wrap.clientWidth
    const H = canvas.height = wrap.clientHeight

    const stars = Array.from({ length: 140 }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      r: Math.random() * 1.5 + 0.2,
      speed: Math.random() * 0.25 + 0.04,
      opacity: Math.random() * 0.6 + 0.15,
      pulse: Math.random() * Math.PI * 2,
    }))

    const ctx = canvas.getContext('2d')
    const draw = () => {
      ctx.clearRect(0, 0, W, H)

      const g = ctx.createRadialGradient(W/2,H/2,0, W/2,H/2,W*0.9)
      g.addColorStop(0,   '#0d1a3a')
      g.addColorStop(0.5, '#071228')
      g.addColorStop(1,   '#030810')
      ctx.fillStyle = g
      ctx.fillRect(0, 0, W, H)

      ;[
        { x:W*0.15, y:H*0.2,  r:W*0.2,  c:'rgba(27,58,107,0.18)'  },
        { x:W*0.85, y:H*0.6,  r:W*0.22, c:'rgba(192,57,43,0.06)'  },
        { x:W*0.5,  y:H*0.82, r:W*0.15, c:'rgba(232,160,32,0.05)' },
      ].forEach(o => {
        const og = ctx.createRadialGradient(o.x,o.y,0, o.x,o.y,o.r)
        og.addColorStop(0, o.c); og.addColorStop(1,'transparent')
        ctx.fillStyle = og
        ctx.beginPath(); ctx.arc(o.x,o.y,o.r,0,Math.PI*2); ctx.fill()
      })

      stars.forEach(s => {
        s.pulse += 0.018
        const glow = Math.sin(s.pulse)*0.4+0.6
        ctx.beginPath(); ctx.arc(s.x,s.y,s.r*glow,0,Math.PI*2)
        ctx.fillStyle = `rgba(255,255,255,${s.opacity*glow})`; ctx.fill()
        s.y -= s.speed
        if (s.y < -2) { s.y = H+2; s.x = Math.random()*W }
      })

      rafRef.current = requestAnimationFrame(draw)
    }
    draw()
    return () => cancelAnimationFrame(rafRef.current)
  }, [])

  // ── Animation timeline (runs once) ─────────────────────────────
  useEffect(() => {
    if (didAnim.current) return
    didAnim.current = true

    const T   = (fn, ms) => timersRef.current.push(setTimeout(fn, ms))
    const anim = (el, kf, opts) => el?.animate(kf, { fill:'forwards', ...opts })
    const wrap = wrapRef.current

    // t=80ms — Logo spring pop
    T(() => anim(logoWrapRef.current, [
      { opacity:0, transform:'scale(0.15)' },
      { opacity:1, transform:'scale(1.12)', offset:0.55 },
      { opacity:1, transform:'scale(0.95)', offset:0.78 },
      { opacity:1, transform:'scale(1)' },
    ], { duration:900, easing:'ease-out' }), 80)

    // t=900ms — Shockwave + particles + rings
    T(() => {
      // Shockwave
      const size = (wrap?.clientWidth || 390) * 1.5
      anim(shockRef.current, [
        { transform:'translate(-50%,-50%) scale(0)', opacity:0.9, width:'10px',      height:'10px'      },
        { transform:'translate(-50%,-50%) scale(1)', opacity:0,   width:`${size}px`, height:`${size}px` },
      ], { duration:950, easing:'cubic-bezier(0,0,0.2,1)' })

      // Particles
      const cx = (wrap?.clientWidth  || 390) / 2
      const cy = (wrap?.clientHeight || 844) / 2
      for (let i = 0; i < 28; i++) {
        const p   = document.createElement('div')
        const ang = (i/28)*Math.PI*2
        const spd = Math.random()*90+45
        const sz  = Math.random()*5+2
        Object.assign(p.style, {
          position:'absolute', borderRadius:'50%', pointerEvents:'none', zIndex:6,
          width:`${sz}px`, height:`${sz}px`, left:`${cx}px`, top:`${cy}px`,
          background: Math.random()>0.4 ? '#E8A020' : '#fff',
        })
        wrap?.appendChild(p)
        p.animate([
          { transform:'translate(0,0) scale(1)', opacity:1 },
          { transform:`translate(${Math.cos(ang)*spd}px,${Math.sin(ang)*spd}px) scale(0)`, opacity:0 },
        ], { duration:800+Math.random()*400, easing:'cubic-bezier(0,0,0.2,1)', fill:'forwards' })
        setTimeout(() => p.remove(), 1300)
      }

      // Rings fan in
      ;[ring1Ref,ring2Ref,ring3Ref].forEach((ref,i) =>
        anim(ref.current, [
          { opacity:0, transform:'scale(0.4)' },
          { opacity:1, transform:'scale(1)'   },
        ], { duration:550, delay:i*120, easing:'ease-out' })
      )
      setTimeout(() => {
        if (ring1Ref.current) ring1Ref.current.style.animation = 'spinCW   8s linear infinite'
        if (ring2Ref.current) ring2Ref.current.style.animation = 'spinCCW 13s linear infinite'
        if (ring3Ref.current) ring3Ref.current.style.animation = 'pulseRing 2.8s ease-in-out infinite'
      }, 520)
    }, 900)

    // t=1400ms — Subtitle, badge, dots slide up
    T(() => {
      ;[subtitleRef,badgeRef,dotsRef].forEach((ref,i) =>
        anim(ref.current, [
          { opacity:0, transform:'translateY(20px)' },
          { opacity:1, transform:'translateY(0)'    },
        ], { duration:600, delay:i*100, easing:'ease-out' })
      )
    }, 1400)

    // t=1500ms — Divider expands
    T(() => {
      if (dividerRef.current) {
        dividerRef.current.style.transition = 'width 0.9s cubic-bezier(0.22,1,0.36,1)'
        dividerRef.current.style.width = 'min(55vw, 200px)'
      }
    }, 1500)

    // t=1620ms — Typewriter
    T(() => {
      const el = titleRef.current
      if (!el) return
      el.style.opacity = '1'
      el.textContent   = ''
      const text   = 'CCES DRRM PORTAL'
      const cursor = document.createElement('span')
      Object.assign(cursor.style, {
        display:'inline-block', width:'2px', height:'0.85em',
        background:'#E8A020', marginLeft:'3px', verticalAlign:'middle',
        animation:'blink 0.55s infinite',
      })
      el.appendChild(cursor)
      let i = 0
      const iv = setInterval(() => {
        if (i < text.length) cursor.before(text[i++])
        else { clearInterval(iv); setTimeout(() => cursor.remove(), 350) }
      }, 58)
      timersRef.current.push(iv)
    }, 1620)

    return () => timersRef.current.forEach(clearTimeout)
  }, [])

  return (
    <div
      ref={wrapRef}
      style={{
        position:'fixed', inset:0, zIndex:9999, overflow:'hidden',
        display:'flex', flexDirection:'column',
        alignItems:'center', justifyContent:'center',
        fontFamily:'Poppins, system-ui, sans-serif',
        transition:'opacity 0.7s ease, visibility 0.7s ease',
        opacity: visible ? 1 : 0,
        visibility: visible ? 'visible' : 'hidden',
        pointerEvents: visible ? 'auto' : 'none',
      }}
    >
      <style>{`
        @keyframes spinCW    { to{transform:rotate(360deg)}  }
        @keyframes spinCCW   { to{transform:rotate(-360deg)} }
        @keyframes pulseRing { 0%,100%{transform:scale(1);opacity:.32} 50%{transform:scale(1.07);opacity:.1} }
        @keyframes blink     { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes dotPulse  { 0%,100%{background:rgba(255,255,255,.25)} 50%{background:#E8A020} }
      `}</style>

      {/* Starfield */}
      <canvas ref={canvasRef} style={{
        position:'absolute', inset:0, width:'100%', height:'100%', zIndex:0,
      }} />

      {/* Shockwave */}
      <div ref={shockRef} style={{
        position:'absolute', top:'50%', left:'50%',
        transform:'translate(-50%,-50%) scale(0)',
        width:10, height:10, borderRadius:'50%',
        background:'radial-gradient(circle,rgba(232,160,32,0.55),transparent 70%)',
        zIndex:5, pointerEvents:'none',
      }} />

      {/* Logo + rings */}
      <div ref={logoWrapRef} style={{
        position:'relative', zIndex:10,
        width:'min(42vw,170px)', height:'min(42vw,170px)',
        display:'flex', alignItems:'center', justifyContent:'center',
        opacity:0, transform:'scale(0.15)',
      }}>
        {/* Ring 3 — outer pulse */}
        <div ref={ring3Ref} style={{
          position:'absolute',
          width:'min(52vw,210px)', height:'min(52vw,210px)',
          borderRadius:'50%', border:'2px solid rgba(232,160,32,0.28)', opacity:0,
        }} />
        {/* Ring 2 — dashed reverse */}
        <div ref={ring2Ref} style={{
          position:'absolute',
          width:'min(46vw,186px)', height:'min(46vw,186px)',
          borderRadius:'50%', border:'2px dashed rgba(27,58,107,0.8)', opacity:0,
        }} />
        {/* Ring 1 — gold spin */}
        <div ref={ring1Ref} style={{
          position:'absolute',
          width:'min(40vw,160px)', height:'min(40vw,160px)',
          borderRadius:'50%', border:'2.5px solid rgba(232,160,32,0.9)', opacity:0,
        }} />

        {/* Your logo */}
        <img
          src={logo}
          alt="CCES"
          style={{
            width:'min(34vw,130px)', height:'min(34vw,130px)',
            borderRadius:'50%', border:'3px solid #E8A020',
            objectFit:'cover', position:'relative', zIndex:3,
            boxShadow:'0 0 40px rgba(27,58,107,0.9),0 0 80px rgba(27,58,107,0.35)',
          }}
        />
      </div>

      {/* Typewriter title */}
      <div ref={titleRef} style={{
        color:'#fff', fontSize:'min(5.5vw,22px)', fontWeight:900,
        textAlign:'center', letterSpacing:'min(1vw,4px)',
        textTransform:'uppercase',
        textShadow:'0 0 40px rgba(232,160,32,0.6),0 2px 6px rgba(0,0,0,0.9)',
        position:'relative', zIndex:10,
        marginTop:'min(5vw,20px)', minHeight:'1.3em', opacity:0,
      }} />

      {/* Gold divider */}
      <div ref={dividerRef} style={{
        width:0, height:2,
        background:'linear-gradient(90deg,transparent,#E8A020,transparent)',
        margin:'min(2vw,8px) auto', borderRadius:2,
        position:'relative', zIndex:10,
      }} />

      {/* Subtitle */}
      <p ref={subtitleRef} style={{
        color:'rgba(255,255,255,0.65)', fontSize:'min(3.5vw,14px)',
        position:'relative', zIndex:10,
        margin:'2px 0 0', opacity:0, transform:'translateY(20px)',
      }}>
        Camp Crame Elementary School
      </p>

      {/* Badge */}
      <div ref={badgeRef} style={{
        marginTop:'min(3vw,12px)',
        background:'#E8A020', color:'#112850',
        fontSize:'min(2.8vw,11px)', fontWeight:800,
        padding:'4px 14px', borderRadius:20, letterSpacing:1,
        position:'relative', zIndex:10,
        opacity:0, transform:'translateY(20px)',
      }}>
        QUEZON CITY · EST. 1952
      </div>

      {/* Loading dots */}
      <div ref={dotsRef} style={{
        display:'flex', gap:8, marginTop:'min(8vw,32px)',
        position:'relative', zIndex:10,
        opacity:0, transform:'translateY(20px)',
      }}>
        {[0,1,2].map(i => (
          <span key={i} style={{
            width:8, height:8, borderRadius:'50%', display:'inline-block',
            background:'rgba(255,255,255,0.25)',
            animation:`dotPulse 1.2s ${i*0.2}s infinite`,
          }} />
        ))}
      </div>
    </div>
  )
}
