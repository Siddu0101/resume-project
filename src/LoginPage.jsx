import { useState } from 'react';
import { supabase } from './supabase.js';

/* ── Shared colour palette (mirrors App.jsx) ── */
const C = {
  navy:      '#0B1F45',
  blue:      '#1554AD',
  blueMed:   '#1976D2',
  blueLight: '#42A5F5',
  bluePale:  '#EBF3FF',
  bg:        '#F0F4FA',
  white:     '#FFFFFF',
  dark:      '#101B2D',
  mid:       '#3A526B',
  muted:     '#7B8EA6',
  border:    '#C4D4E8',
  green:     '#16A34A',
  greenBg:   '#D1FAE5',
  red:       '#DC2626',
  redBg:     '#FEE2E2',
  amber:     '#B45309',
  amberBg:   '#FEF3C7',
};

const inputStyle = {
  width: '100%',
  padding: '12px 14px',
  borderRadius: 8,
  border: `1px solid ${C.border}`,
  fontSize: 14,
  color: C.dark,
  fontFamily: 'inherit',
  boxSizing: 'border-box',
  outline: 'none',
  background: C.white,
};

const btnStyle = (disabled) => ({
  width: '100%',
  padding: '12px',
  borderRadius: 8,
  border: 'none',
  background: disabled ? C.border : C.blue,
  color: '#fff',
  fontSize: 15,
  fontWeight: 700,
  cursor: disabled ? 'not-allowed' : 'pointer',
  fontFamily: 'inherit',
  transition: 'background .2s',
  marginTop: 6,
});

export default function LoginPage({ onAuthenticated }) {
  const [mode, setMode]         = useState('login'); // 'login' | 'signup' | 'forgot'
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [name, setName]         = useState('');
  const [showPw, setShowPw]     = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');
  const [info, setInfo]         = useState('');

  const reset = () => { setError(''); setInfo(''); };

  /* ── Login ── */
  async function handleLogin(e) {
    e.preventDefault();
    reset();
    if (!email || !password) { setError('Please enter email and password.'); return; }
    setLoading(true);
    const { data, error: err } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (err) { setError(err.message); return; }
    onAuthenticated(data.user, data.session);
  }

  /* ── Sign Up ── */
  async function handleSignup(e) {
    e.preventDefault();
    reset();
    if (!name.trim())            { setError('Please enter your name.'); return; }
    if (!email)                  { setError('Please enter your email.'); return; }
    if (password.length < 6)     { setError('Password must be at least 6 characters.'); return; }
    setLoading(true);
    const { data, error: err } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name.trim() } },
    });
    setLoading(false);
    if (err) { setError(err.message); return; }
    // Some Supabase projects auto-confirm; others send a verification e-mail
    if (data.session) {
      onAuthenticated(data.user, data.session);
    } else {
      setInfo('✅ Account created! Check your email to confirm your address, then log in.');
      setMode('login');
    }
  }

  /* ── Forgot password ── */
  async function handleForgot(e) {
    e.preventDefault();
    reset();
    if (!email) { setError('Enter the email address for your account.'); return; }
    setLoading(true);
    const { error: err } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin,
    });
    setLoading(false);
    if (err) { setError(err.message); return; }
    setInfo('📧 Password reset link sent! Check your inbox.');
  }

  /* ── Google OAuth ── */
  async function handleGoogle() {
    reset();
    setLoading(true);
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin },
    });
    // Page will redirect — no need to setLoading(false)
  }

  const isLogin  = mode === 'login';
  const isSignup = mode === 'signup';
  const isForgot = mode === 'forgot';

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lora:wght@400;600;700&family=Source+Sans+3:wght@300;400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Source Sans 3', sans-serif; background: ${C.bg}; }
        input:focus { border-color: ${C.blue} !important; box-shadow: 0 0 0 3px rgba(21,84,173,.12) !important; }
        .auth-link { color: ${C.blue}; cursor: pointer; font-weight: 600; text-decoration: underline; }
        .auth-link:hover { color: ${C.blueMed}; }
      `}</style>

      <div style={{
        minHeight: '100vh',
        background: `linear-gradient(135deg, ${C.navy} 0%, ${C.blueMed} 100%)`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '24px 16px',
      }}>
        <div style={{ width: '100%', maxWidth: 440 }}>

          {/* Logo / Brand */}
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <div style={{
              width: 80, height: 80, borderRadius: 24,
              background: 'rgba(255,255,255,.15)',
              backdropFilter: 'blur(12px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 40, margin: '0 auto 16px',
              border: '2px solid rgba(255,255,255,.25)',
            }}>🎓</div>
            <h1 style={{
              fontFamily: 'Lora, Georgia, serif', color: '#fff',
              fontSize: 30, fontWeight: 700, margin: 0,
            }}>Career-Copilot AI</h1>
            <p style={{ color: 'rgba(255,255,255,.75)', marginTop: 6, fontSize: 15 }}>
              Your AI-powered career platform
            </p>
          </div>

          {/* Card */}
          <div style={{
            background: C.white, borderRadius: 16,
            padding: '32px 28px',
            boxShadow: '0 20px 60px rgba(0,0,0,.25)',
          }}>

            {/* Tab switcher (login / signup only) */}
            {!isForgot && (
              <div style={{
                display: 'flex', gap: 0, marginBottom: 24,
                background: C.bg, borderRadius: 10, padding: 4,
              }}>
                {[['login', 'Sign In'], ['signup', 'Create Account']].map(([id, label]) => (
                  <button key={id}
                    onClick={() => { setMode(id); reset(); }}
                    style={{
                      flex: 1, padding: '9px 0', border: 'none', borderRadius: 8,
                      fontFamily: 'inherit', fontSize: 14, fontWeight: 700, cursor: 'pointer',
                      background: mode === id ? C.white : 'transparent',
                      color: mode === id ? C.navy : C.muted,
                      boxShadow: mode === id ? '0 1px 6px rgba(0,0,0,.10)' : 'none',
                      transition: 'all .2s',
                    }}>{label}
                  </button>
                ))}
              </div>
            )}

            {/* Forgot-password header */}
            {isForgot && (
              <div style={{ marginBottom: 20 }}>
                <h2 style={{ color: C.navy, fontFamily: 'Lora, serif', marginBottom: 6 }}>Reset Password</h2>
                <p style={{ color: C.muted, fontSize: 14 }}>We'll send a reset link to your email.</p>
              </div>
            )}

            {/* Error / Info */}
            {error && (
              <div style={{ background: C.redBg, color: C.red, padding: '10px 14px', borderRadius: 8, fontSize: 13, marginBottom: 16 }}>
                ⚠️ {error}
              </div>
            )}
            {info && (
              <div style={{ background: C.greenBg, color: C.green, padding: '10px 14px', borderRadius: 8, fontSize: 13, marginBottom: 16 }}>
                {info}
              </div>
            )}

            {/* ── LOGIN FORM ── */}
            {isLogin && (
              <form onSubmit={handleLogin}>
                <div style={{ marginBottom: 14 }}>
                  <label style={{ fontSize: 13, fontWeight: 600, color: C.mid, display: 'block', marginBottom: 6 }}>Email</label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                    placeholder="you@example.com" style={inputStyle} autoComplete="email" />
                </div>
                <div style={{ marginBottom: 8 }}>
                  <label style={{ fontSize: 13, fontWeight: 600, color: C.mid, display: 'block', marginBottom: 6 }}>Password</label>
                  <div style={{ position: 'relative' }}>
                    <input type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                      placeholder="••••••••" style={{ ...inputStyle, paddingRight: 44 }} autoComplete="current-password" />
                    <button type="button" onClick={() => setShowPw(p => !p)}
                      style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 16, color: C.muted }}>
                      {showPw ? '🙈' : '👁️'}
                    </button>
                  </div>
                </div>
                <div style={{ textAlign: 'right', marginBottom: 16 }}>
                  <span className="auth-link" style={{ fontSize: 13 }} onClick={() => { setMode('forgot'); reset(); }}>
                    Forgot password?
                  </span>
                </div>
                <button type="submit" disabled={loading} style={btnStyle(loading)}>
                  {loading ? 'Signing in…' : 'Sign In →'}
                </button>
              </form>
            )}

            {/* ── SIGNUP FORM ── */}
            {isSignup && (
              <form onSubmit={handleSignup}>
                <div style={{ marginBottom: 14 }}>
                  <label style={{ fontSize: 13, fontWeight: 600, color: C.mid, display: 'block', marginBottom: 6 }}>Full Name</label>
                  <input type="text" value={name} onChange={e => setName(e.target.value)}
                    placeholder="Jane Smith" style={inputStyle} autoComplete="name" />
                </div>
                <div style={{ marginBottom: 14 }}>
                  <label style={{ fontSize: 13, fontWeight: 600, color: C.mid, display: 'block', marginBottom: 6 }}>Email</label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                    placeholder="you@example.com" style={inputStyle} autoComplete="email" />
                </div>
                <div style={{ marginBottom: 20 }}>
                  <label style={{ fontSize: 13, fontWeight: 600, color: C.mid, display: 'block', marginBottom: 6 }}>Password <span style={{ color: C.muted, fontWeight: 400 }}>(min 6 chars)</span></label>
                  <div style={{ position: 'relative' }}>
                    <input type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                      placeholder="••••••••" style={{ ...inputStyle, paddingRight: 44 }} autoComplete="new-password" />
                    <button type="button" onClick={() => setShowPw(p => !p)}
                      style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 16, color: C.muted }}>
                      {showPw ? '🙈' : '👁️'}
                    </button>
                  </div>
                </div>
                <button type="submit" disabled={loading} style={btnStyle(loading)}>
                  {loading ? 'Creating account…' : 'Create Account →'}
                </button>
              </form>
            )}

            {/* ── FORGOT PASSWORD FORM ── */}
            {isForgot && (
              <form onSubmit={handleForgot}>
                <div style={{ marginBottom: 20 }}>
                  <label style={{ fontSize: 13, fontWeight: 600, color: C.mid, display: 'block', marginBottom: 6 }}>Email Address</label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                    placeholder="you@example.com" style={inputStyle} autoComplete="email" />
                </div>
                <button type="submit" disabled={loading} style={btnStyle(loading)}>
                  {loading ? 'Sending…' : 'Send Reset Link →'}
                </button>
                <p style={{ textAlign: 'center', marginTop: 16, fontSize: 13, color: C.muted }}>
                  <span className="auth-link" onClick={() => { setMode('login'); reset(); }}>← Back to Sign In</span>
                </p>
              </form>
            )}

            {/* ── Divider + Google ── */}
            {!isForgot && (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '20px 0' }}>
                  <div style={{ flex: 1, height: 1, background: C.border }} />
                  <span style={{ color: C.muted, fontSize: 12, fontWeight: 600 }}>OR</span>
                  <div style={{ flex: 1, height: 1, background: C.border }} />
                </div>

                <button onClick={handleGoogle} disabled={loading}
                  style={{
                    width: '100%', padding: '11px', borderRadius: 8,
                    border: `1.5px solid ${C.border}`, background: C.white,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                    cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'inherit',
                    fontSize: 14, fontWeight: 600, color: C.dark, transition: 'border-color .2s',
                  }}>
                  <svg width="18" height="18" viewBox="0 0 48 48">
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                  </svg>
                  Continue with Google
                </button>
              </>
            )}
          </div>

          {/* Footer note */}
          <p style={{ textAlign: 'center', color: 'rgba(255,255,255,.6)', fontSize: 12, marginTop: 20 }}>
            🔒 Your data is private and stored securely via Supabase
          </p>
        </div>
      </div>
    </>
  );
}
