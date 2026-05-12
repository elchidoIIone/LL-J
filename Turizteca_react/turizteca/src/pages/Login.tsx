import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import turiztecaLogo from '../img/Turizteca-Logo.png';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg || 'Credenciales inválidas. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">

      {/* Sección oscura — obsidiana con logo */}
      <div
        className="flex flex-col items-center justify-end px-6 pb-10 pt-16"
        style={{ background: '#1A0800', minHeight: '42vh' }}
      >
        <img src={turiztecaLogo} alt="Turizteca" className="h-28 w-auto mb-5 drop-shadow-xl" />
        <p className="text-[#C4A882] text-sm text-center font-label tracking-wide">
          Descubre los sabores que México esconde
        </p>
      </div>

      {/* Sección clara — formulario en pergamino */}
      <div
        className="flex-1 rounded-t-[2rem] -mt-5 px-6 pt-8 pb-10"
        style={{ background: '#FBF4E8' }}
      >
        <div className="max-w-sm mx-auto">
          <h2 className="font-headline text-2xl font-bold text-on-surface mb-6">Inicia sesión</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-on-surface-variant mb-1.5 font-label uppercase tracking-widest">
                Email
              </label>
              <div className="flex items-center bg-white rounded-xl px-4 py-3.5 border border-outline-variant/30 focus-within:border-primary transition-colors shadow-sm">
                <span className="material-symbols-outlined text-outline mr-3 text-sm">mail</span>
                <input
                  type="email"
                  className="flex-1 bg-transparent outline-none text-on-surface placeholder-on-surface-variant/40 text-sm"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-on-surface-variant mb-1.5 font-label uppercase tracking-widest">
                Contraseña
              </label>
              <div className="flex items-center bg-white rounded-xl px-4 py-3.5 border border-outline-variant/30 focus-within:border-primary transition-colors shadow-sm">
                <span className="material-symbols-outlined text-outline mr-3 text-sm">lock</span>
                <input
                  type={showPw ? 'text' : 'password'}
                  className="flex-1 bg-transparent outline-none text-on-surface placeholder-on-surface-variant/40 text-sm"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
                <button type="button" onClick={() => setShowPw(p => !p)} className="text-outline ml-2">
                  <span className="material-symbols-outlined text-sm">
                    {showPw ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-error-container/20 border border-error/20 rounded-xl p-3 flex items-center gap-2">
                <span className="material-symbols-outlined text-error text-sm">error</span>
                <p className="text-error text-sm font-label">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-2xl font-bold text-base shadow-lg disabled:opacity-60 mt-2 active:scale-[0.98] transition-transform text-on-primary"
              style={{ background: 'linear-gradient(135deg, #C4501A 0%, #E8723C 100%)' }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Iniciando sesión...
                </span>
              ) : 'Iniciar Sesión'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-on-surface-variant text-sm">
              ¿No tienes cuenta?{' '}
              <Link to="/register" className="text-primary font-bold hover:underline">
                Regístrate gratis
              </Link>
            </p>
          </div>

          <div className="mt-4 text-center">
            <Link to="/" className="text-on-surface-variant text-sm hover:text-on-surface">
              ← Continuar sin cuenta
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
