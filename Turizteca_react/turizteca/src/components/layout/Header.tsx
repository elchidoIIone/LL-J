import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface HeaderProps {
  showBack?: boolean;
  title?: string;
}

export default function Header({ showBack, title }: HeaderProps) {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 z-50 w-full glass-header shadow-[0_20px_40px_rgba(74,37,7,0.06)]">
      <div className="flex justify-between items-center w-full px-6 py-4">
        {showBack ? (
          <button
            onClick={() => navigate(-1)}
            className="text-primary hover:opacity-80 transition-opacity active:scale-90"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
        ) : (
          <button
            onClick={() => setMenuOpen(o => !o)}
            className="text-primary hover:opacity-80 transition-opacity active:scale-90"
          >
            <span className="material-symbols-outlined">menu</span>
          </button>
        )}

        <h1 className="text-2xl font-black text-primary font-headline tracking-tight">
          {title || 'Turizteca'}
        </h1>

        <button
          onClick={() => navigate(isAuthenticated ? '/profile' : '/login')}
          className="text-primary hover:opacity-80 transition-opacity active:scale-90"
        >
          <span className="material-symbols-outlined">
            {isAuthenticated ? 'account_circle' : 'person_outline'}
          </span>
        </button>
      </div>

      {menuOpen && (
        <div className="absolute top-full left-0 w-full bg-surface-container-lowest shadow-lg border-t border-outline-variant/20 py-2 z-50">
          {isAuthenticated ? (
            <>
              <div className="px-6 py-3 border-b border-outline-variant/20">
                <p className="text-xs text-on-surface-variant font-label uppercase tracking-widest">
                  {user?.account_type === 'owner' ? 'Propietario' : 'Viajero'}
                </p>
                <p className="font-bold text-on-surface">{user?.name}</p>
              </div>
              {user?.account_type === 'owner' && (
                <button
                  onClick={() => { navigate('/owner/dashboard'); setMenuOpen(false); }}
                  className="w-full text-left px-6 py-3 text-on-surface hover:bg-surface-container-low flex items-center gap-3"
                >
                  <span className="material-symbols-outlined text-primary">store</span>
                  Mi Restaurante
                </button>
              )}
              <button
                onClick={() => { navigate('/profile'); setMenuOpen(false); }}
                className="w-full text-left px-6 py-3 text-on-surface hover:bg-surface-container-low flex items-center gap-3"
              >
                <span className="material-symbols-outlined text-primary">person</span>
                Mi Perfil
              </button>
              <button
                onClick={() => { navigate('/saved'); setMenuOpen(false); }}
                className="w-full text-left px-6 py-3 text-on-surface hover:bg-surface-container-low flex items-center gap-3"
              >
                <span className="material-symbols-outlined text-primary">favorite</span>
                Guardados
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => { navigate('/login'); setMenuOpen(false); }}
                className="w-full text-left px-6 py-3 text-on-surface hover:bg-surface-container-low flex items-center gap-3"
              >
                <span className="material-symbols-outlined text-primary">login</span>
                Iniciar Sesión
              </button>
              <button
                onClick={() => { navigate('/register'); setMenuOpen(false); }}
                className="w-full text-left px-6 py-3 text-on-surface hover:bg-surface-container-low flex items-center gap-3"
              >
                <span className="material-symbols-outlined text-primary">person_add</span>
                Registrarse
              </button>
            </>
          )}
        </div>
      )}
    </header>
  );
}
