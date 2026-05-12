import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface HeaderProps {
  showBack?: boolean;
  title?: string;
}

export default function Header({ showBack }: HeaderProps) {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [menuOpen]);

  return (
    <header ref={headerRef} className="fixed top-0 z-50 w-full obsidian-nav aztec-border-b shadow-[0_4px_24px_rgba(0,0,0,0.4)]">
      <div className="flex justify-between items-center w-full px-5 py-3">

        {showBack ? (
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors active:scale-90 text-on-dark"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
        ) : (
          <button
            onClick={() => setMenuOpen(o => !o)}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors active:scale-90 text-on-dark"
          >
            <span className="material-symbols-outlined">
              {menuOpen ? 'close' : 'menu'}
            </span>
          </button>
        )}

        <span className="font-headline text-xl font-black tracking-tight text-on-dark">
          Turizteca
        </span>

        <button
          onClick={() => navigate(isAuthenticated ? '/profile' : '/login')}
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors active:scale-90 text-on-dark"
        >
          <span className="material-symbols-outlined">
            {isAuthenticated ? 'account_circle' : 'person_outline'}
          </span>
        </button>
      </div>

      {menuOpen && (
        <div className="absolute top-full left-0 w-full obsidian-menu z-50 shadow-[0_12px_32px_rgba(0,0,0,0.5)]">
          {isAuthenticated ? (
            <>
              <div className="px-6 py-4 border-b border-white/10">
                <p className="text-xs font-label uppercase tracking-widest text-on-dark-muted mb-0.5">
                  {user?.account_type === 'owner' ? 'Propietario' : 'Viajero'}
                </p>
                <p className="font-bold text-on-dark text-base">{user?.name}</p>
              </div>
              {user?.account_type === 'owner' && (
                <button
                  onClick={() => { navigate('/owner/dashboard'); setMenuOpen(false); }}
                  className="obsidian-menu-item w-full text-left px-6 py-4 flex items-center gap-4 transition-colors"
                >
                  <span className="material-symbols-outlined obsidian-menu-item-icon">store</span>
                  <span className="font-semibold">Mi Restaurante</span>
                </button>
              )}
              <button
                onClick={() => { navigate('/profile'); setMenuOpen(false); }}
                className="obsidian-menu-item w-full text-left px-6 py-4 flex items-center gap-4 transition-colors"
              >
                <span className="material-symbols-outlined obsidian-menu-item-icon">person</span>
                <span className="font-semibold">Mi Perfil</span>
              </button>
              <button
                onClick={() => { navigate('/saved'); setMenuOpen(false); }}
                className="obsidian-menu-item w-full text-left px-6 py-4 flex items-center gap-4 transition-colors"
              >
                <span className="material-symbols-outlined obsidian-menu-item-icon">favorite</span>
                <span className="font-semibold">Guardados</span>
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => { navigate('/login'); setMenuOpen(false); }}
                className="obsidian-menu-item w-full text-left px-6 py-4 flex items-center gap-4 transition-colors"
              >
                <span className="material-symbols-outlined obsidian-menu-item-icon">login</span>
                <span className="font-semibold">Iniciar Sesión</span>
              </button>
              <button
                onClick={() => { navigate('/register'); setMenuOpen(false); }}
                className="obsidian-menu-item w-full text-left px-6 py-4 flex items-center gap-4 transition-colors"
              >
                <span className="material-symbols-outlined obsidian-menu-item-icon">person_add</span>
                <span className="font-semibold">Registrarse</span>
              </button>
            </>
          )}
        </div>
      )}
    </header>
  );
}
