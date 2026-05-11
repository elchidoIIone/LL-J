import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

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
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="px-6 pt-12 pb-6 text-center">
        <h1 className="font-headline text-4xl font-black text-primary tracking-tight">Turizteca</h1>
        <p className="text-on-surface-variant mt-1 text-sm">Descubre los mejores sabores</p>
      </div>

      {/* Hero illustration */}
      <div className="flex justify-center py-6">
        <div className="w-32 h-32 bg-gradient-to-br from-primary to-primary-container rounded-full flex items-center justify-center shadow-lg">
          <span className="text-6xl">🗺️</span>
        </div>
      </div>

      {/* Form */}
      <div className="flex-1 px-6 pb-8">
        <div className="max-w-sm mx-auto">
          <h2 className="font-headline text-2xl font-bold text-on-surface mb-6">Inicia sesión</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-on-surface-variant mb-1.5 font-label">Email</label>
              <div className="flex items-center bg-surface-container-low rounded-xl px-4 py-3 border border-outline-variant/20 focus-within:border-primary transition-colors">
                <span className="material-symbols-outlined text-outline mr-3 text-sm">mail</span>
                <input
                  type="email"
                  className="flex-1 bg-transparent outline-none text-on-surface placeholder-on-surface-variant/50 text-sm"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-on-surface-variant mb-1.5 font-label">Contraseña</label>
              <div className="flex items-center bg-surface-container-low rounded-xl px-4 py-3 border border-outline-variant/20 focus-within:border-primary transition-colors">
                <span className="material-symbols-outlined text-outline mr-3 text-sm">lock</span>
                <input
                  type={showPw ? 'text' : 'password'}
                  className="flex-1 bg-transparent outline-none text-on-surface placeholder-on-surface-variant/50 text-sm"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
                <button type="button" onClick={() => setShowPw(p => !p)} className="text-outline ml-2">
                  <span className="material-symbols-outlined text-sm">{showPw ? 'visibility_off' : 'visibility'}</span>
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
              className="w-full bg-gradient-to-r from-primary to-primary-container text-on-primary py-4 rounded-2xl font-bold text-base shadow-lg disabled:opacity-60 mt-2 active:scale-[0.98] transition-transform"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-on-primary/30 border-t-on-primary rounded-full animate-spin" />
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
