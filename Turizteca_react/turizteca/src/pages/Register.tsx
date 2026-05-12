import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { AccountType, BudgetType } from '../types';
import AztecDivider from '../components/ui/AztecDivider';
import turiztecaLogo from '../img/Turizteca-Logo.png';

const BUDGET_OPTIONS: { value: BudgetType; label: string; sub: string }[] = [
  { value: 'low', label: 'Económico', sub: '< $150' },
  { value: 'medium', label: 'Moderado', sub: '$150–$400' },
  { value: 'high', label: 'Premium', sub: '> $400' },
];

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [accountType, setAccountType] = useState<AccountType>('customer');
  const [budget, setBudget] = useState<BudgetType>('medium');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) { setStep(2); return; }
    setError('');
    setLoading(true);
    try {
      await register({ name, email, password, account_type: accountType, preferred_budget: budget });
      navigate('/');
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string; errors?: Record<string, string[]> } } })?.response?.data;
      if (msg?.errors) {
        const first = Object.values(msg.errors)[0];
        setError(Array.isArray(first) ? first[0] : String(first));
      } else {
        setError(msg?.message || 'Error al registrarse. Intenta de nuevo.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">

      {/* Sección oscura compacta con logo arriba */}
      <div
        className="flex flex-col items-center px-6 pt-12 pb-6"
        style={{ background: '#1A0800' }}
      >
        <div className="flex items-center gap-2 mb-5 self-start">
          <span className="w-6 h-px bg-[#C4501A]" />
          <span className="font-label text-[#E8723C] uppercase tracking-widest text-[10px] font-bold">
            Crea tu cuenta
          </span>
        </div>

        <img src={turiztecaLogo} alt="Turizteca" className="h-20 w-auto drop-shadow-xl" />

        {/* Barra de progreso */}
        <div className="w-full max-w-sm mt-5">
          <div className="flex justify-between mb-2">
            <span className="text-[#C4A882] text-[10px] font-label font-bold uppercase tracking-widest">
              Paso {step} de 2
            </span>
            <span className="text-[#C4A882] text-[10px] font-label">
              {step === 1 ? 'Tus datos' : 'Tu perfil'}
            </span>
          </div>
          <div className="h-1 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${step * 50}%`,
                background: 'linear-gradient(90deg, #C4501A, #E8723C)',
              }}
            />
          </div>
        </div>
      </div>

      <div style={{ background: '#1A0800' }}>
        <AztecDivider color="#FBF4E8" />
      </div>
      <div
        style={{
          height: '24px',
          background: '#FBF4E8',
          borderRadius: '28px 28px 0 0',
          marginTop: '-2px',
        }}
      />

      {/* Sección clara — formulario */}
      <div
        className="flex-1 -mt-2 px-6 pt-2 pb-10"
        style={{ background: '#FBF4E8' }}
      >
        <div className="max-w-sm mx-auto">
          <form onSubmit={handleSubmit} className="space-y-5">
            {step === 1 ? (
              <>
                <div>
                  <h2 className="font-headline text-2xl font-bold text-on-surface mb-1">Crea tu cuenta</h2>
                  <p className="text-on-surface-variant text-sm mb-6">Únete a miles de viajeros gastronómicos</p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-on-surface-variant mb-1.5 font-label uppercase tracking-widest">
                    Nombre completo
                  </label>
                  <div className="flex items-center bg-white rounded-xl px-4 py-3.5 border border-outline-variant/30 focus-within:border-primary transition-colors shadow-sm">
                    <span className="material-symbols-outlined text-outline mr-3 text-sm">person</span>
                    <input
                      className="flex-1 bg-transparent outline-none text-on-surface placeholder-on-surface-variant/40 text-sm"
                      placeholder="Tu nombre"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      required
                    />
                  </div>
                </div>

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
                      placeholder="Mínimo 8 caracteres"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      minLength={8}
                      required
                    />
                    <button type="button" onClick={() => setShowPw(p => !p)} className="text-outline ml-2">
                      <span className="material-symbols-outlined text-sm">
                        {showPw ? 'visibility_off' : 'visibility'}
                      </span>
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 rounded-2xl font-bold text-base shadow-lg mt-2 text-on-primary active:scale-[0.98] transition-transform"
                  style={{ background: 'linear-gradient(135deg, #C4501A 0%, #E8723C 100%)' }}
                >
                  Continuar →
                </button>
              </>
            ) : (
              <>
                <div>
                  <h2 className="font-headline text-2xl font-bold text-on-surface mb-1">Personaliza tu experiencia</h2>
                  <p className="text-on-surface-variant text-sm mb-6">Así podemos recomendarte mejor</p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-on-surface-variant mb-3 font-label uppercase tracking-widest">
                    ¿Cómo usarás Turizteca?
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {([
                      { value: 'customer', label: 'Soy viajero', icon: 'explore', desc: 'Busco restaurantes' },
                      { value: 'owner', label: 'Tengo restaurante', icon: 'store', desc: 'Quiero publicar' },
                    ] as const).map(opt => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setAccountType(opt.value)}
                        className={`p-4 rounded-2xl border-2 text-left transition-all ${
                          accountType === opt.value
                            ? 'border-primary bg-white shadow-md'
                            : 'border-outline-variant/20 bg-white/60 hover:border-outline-variant'
                        }`}
                      >
                        <span
                          className="material-symbols-outlined text-2xl mb-2 block"
                          style={{ color: accountType === opt.value ? '#C4501A' : '#9B7048' }}
                        >
                          {opt.icon}
                        </span>
                        <p className="font-bold text-on-surface text-sm">{opt.label}</p>
                        <p className="text-xs text-on-surface-variant mt-0.5">{opt.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-on-surface-variant mb-3 font-label uppercase tracking-widest">
                    Presupuesto preferido
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {BUDGET_OPTIONS.map(opt => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setBudget(opt.value)}
                        className={`p-3.5 rounded-xl border-2 transition-all text-center ${
                          budget === opt.value
                            ? 'border-primary bg-white shadow-md'
                            : 'border-outline-variant/20 bg-white/60'
                        }`}
                      >
                        <p
                          className="font-black text-base mb-0.5"
                          style={{ color: budget === opt.value ? '#C4501A' : '#9B7048' }}
                        >
                          {opt.value === 'low' ? '$' : opt.value === 'medium' ? '$$' : '$$$'}
                        </p>
                        <p className="text-xs font-bold text-on-surface">{opt.label}</p>
                        <p className="text-[10px] text-on-surface-variant mt-0.5">{opt.sub}</p>
                      </button>
                    ))}
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
                  className="w-full py-4 rounded-2xl font-bold text-base shadow-lg disabled:opacity-60 text-on-primary active:scale-[0.98] transition-transform"
                  style={{ background: 'linear-gradient(135deg, #C4501A 0%, #E8723C 100%)' }}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Creando cuenta...
                    </span>
                  ) : '¡Comenzar mi aventura!'}
                </button>
              </>
            )}
          </form>

          {step === 1 && (
            <div className="mt-6 text-center">
              <p className="text-on-surface-variant text-sm">
                ¿Ya tienes cuenta?{' '}
                <Link to="/login" className="text-primary font-bold hover:underline">
                  Inicia sesión
                </Link>
              </p>
            </div>
          )}

          {step === 2 && (
            <button
              onClick={() => setStep(1)}
              className="mt-4 w-full text-center text-on-surface-variant text-sm hover:text-on-surface"
            >
              ← Regresar
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
