import { useState } from 'react'
import { useToast } from '../components/Toast'
import logo from '../assets/logo.png'

export default function Login({ onLogin }) {
  const toast = useToast()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPass, setShowPass] = useState(false)

  async function handleLogin() {
    if (!email.trim() || !password.trim()) {
      toast('Please enter your email and password.', 'error')
      return
    }
    setLoading(true)
    const error = await onLogin(email.trim(), password)
    setLoading(false)
    if (error) {
      if (error.message?.includes('Invalid')) toast('❌ Incorrect email or password.', 'error')
      else if (error.message?.includes('confirm')) toast('📧 Please confirm your email first.', 'error')
      else toast('❌ Login failed. Try again.', 'error')
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') handleLogin()
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(160deg, #0f1923 0%, #1B3A6B 50%, #c0392b 100%)',
      padding: '24px', position: 'relative', overflow: 'hidden'
    }}>
      <style>{`
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse { 0%,100%{opacity:0.15} 50%{opacity:0.3} }
        .login-card { animation: fadeUp 0.6s 0.2s both; }
        .login-logo { animation: float 4s ease-in-out infinite; }
      `}</style>

      {/* Background circles */}
      <div style={{ position: 'absolute', width: 500, height: 500, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.05)', top: -100, left: -150, animation: 'pulse 4s infinite' }} />
      <div style={{ position: 'absolute', width: 400, height: 400, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.05)', bottom: -80, right: -100, animation: 'pulse 4s 1s infinite' }} />
      <div style={{ position: 'absolute', width: 200, height: 200, borderRadius: '50%', background: 'rgba(192,57,43,0.15)', top: 80, right: 40 }} />
      <div style={{ position: 'absolute', width: 150, height: 150, borderRadius: '50%', background: 'rgba(27,58,107,0.3)', bottom: 100, left: 30 }} />

      {/* Logo + Title */}
      <div className="login-logo" style={{ textAlign: 'center', marginBottom: 32, position: 'relative', zIndex: 2 }}>
        <img src={logo} alt="CCES" style={{ width: 90, height: 90, borderRadius: '50%', border: '3px solid #E8A020', objectFit: 'cover', boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }} />
        <h1 style={{ color: 'white', fontSize: 22, fontWeight: 900, fontFamily: 'Poppins,sans-serif', marginTop: 14, textShadow: '0 2px 8px rgba(0,0,0,0.4)' }}>CCES DRRM Portal</h1>
        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12, marginTop: 4 }}>Camp Crame Elementary School</p>
        <div style={{ marginTop: 8, background: 'rgba(232,160,32,0.2)', border: '1px solid rgba(232,160,32,0.4)', borderRadius: 20, padding: '4px 14px', display: 'inline-block', fontSize: 11, color: '#E8A020', fontWeight: 700 }}>
          🔐 Authorized Personnel Only
        </div>
      </div>

      {/* Login Card */}
      <div className="login-card" style={{
        background: 'rgba(255,255,255,0.07)', backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.15)', borderRadius: 24,
        padding: 28, width: '100%', maxWidth: 380, position: 'relative', zIndex: 2,
        boxShadow: '0 20px 60px rgba(0,0,0,0.4)'
      }}>
        <h2 style={{ color: 'white', fontSize: 18, fontWeight: 800, marginBottom: 6 }}>Welcome back 👋</h2>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, marginBottom: 24 }}>Sign in with your school account</p>

        {/* Email */}
        <div style={{ marginBottom: 14 }}>
          <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 6 }}>Email Address</label>
          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 16 }}>📧</span>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="your.email@school.com"
              style={{
                width: '100%', padding: '12px 14px 12px 44px',
                background: 'rgba(255,255,255,0.1)', border: '1.5px solid rgba(255,255,255,0.15)',
                borderRadius: 12, color: 'white', fontSize: 14, fontFamily: 'Nunito,sans-serif',
                outline: 'none', transition: 'border-color 0.2s'
              }}
              onFocus={e => e.target.style.borderColor = '#E8A020'}
              onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.15)'}
            />
          </div>
        </div>

        {/* Password */}
        <div style={{ marginBottom: 24 }}>
          <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 6 }}>Password</label>
          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 16 }}>🔑</span>
            <input
              type={showPass ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="••••••••"
              style={{
                width: '100%', padding: '12px 44px 12px 44px',
                background: 'rgba(255,255,255,0.1)', border: '1.5px solid rgba(255,255,255,0.15)',
                borderRadius: 12, color: 'white', fontSize: 14, fontFamily: 'Nunito,sans-serif',
                outline: 'none', transition: 'border-color 0.2s'
              }}
              onFocus={e => e.target.style.borderColor = '#E8A020'}
              onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.15)'}
            />
            <button
              onClick={() => setShowPass(!showPass)}
              style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 16, opacity: 0.6 }}>
              {showPass ? '🙈' : '👁️'}
            </button>
          </div>
        </div>

        {/* Login Button */}
        <button
          onClick={handleLogin}
          disabled={loading}
          style={{
            width: '100%', padding: '14px', borderRadius: 12, border: 'none',
            background: loading ? 'rgba(232,160,32,0.5)' : 'linear-gradient(135deg,#E8A020,#f0932b)',
            color: '#1a1a1a', fontSize: 15, fontWeight: 800, cursor: loading ? 'not-allowed' : 'pointer',
            fontFamily: 'Nunito,sans-serif', transition: 'all 0.2s',
            boxShadow: loading ? 'none' : '0 4px 20px rgba(232,160,32,0.4)'
          }}>
          {loading ? '⏳ Signing in...' : '🔐 Sign In'}
        </button>

        {/* Notice */}
        <div style={{ marginTop: 20, padding: '12px 14px', background: 'rgba(255,255,255,0.05)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.08)' }}>
          <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', textAlign: 'center', lineHeight: 1.6 }}>
            🏫 Access is limited to CCES staff only.<br />
            Contact your DRRM Coordinator for an account.<br />
            <span style={{ color: 'rgba(255,255,255,0.3)' }}>campcrame_es@yahoo.com.ph</span>
          </p>
        </div>
      </div>

      {/* Footer */}
      <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: 11, marginTop: 24, position: 'relative', zIndex: 2, textAlign: 'center' }}>
        CCES DRRM Portal v2.0 · QC District VIII · Est. 1952
      </p>
    </div>
  )
}
