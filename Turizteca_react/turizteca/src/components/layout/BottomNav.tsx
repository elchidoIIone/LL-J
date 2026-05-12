import { useLocation, useNavigate } from 'react-router-dom';

const tabs = [
  { path: '/', icon: 'home', label: 'Inicio' },
  { path: '/explore', icon: 'explore', label: 'Explorar' },
  { path: '/saved', icon: 'favorite', label: 'Guardados' },
  { path: '/profile', icon: 'person_outline', label: 'Perfil' },
];

export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="fixed bottom-0 left-0 w-full obsidian-nav aztec-border-t flex justify-around items-stretch px-2 pb-6 pt-2 z-50 shadow-[0_-4px_24px_rgba(0,0,0,0.4)]">
      {tabs.map(tab => {
        const active = location.pathname === tab.path;
        return (
          <button
            key={tab.path}
            onClick={() => navigate(tab.path)}
            className={`relative flex flex-col items-center justify-center px-5 py-2 rounded-2xl transition-all active:scale-95 ${
              active ? 'text-primary-fixed' : 'text-on-dark-muted hover:text-on-dark'
            }`}
          >
            {/* Indicador de tab activa */}
            {active && (
              <span
                className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full"
                style={{ background: '#E8723C' }}
              />
            )}

            <span
              className="material-symbols-outlined"
              style={active ? { fontVariationSettings: "'FILL' 1" } : undefined}
            >
              {tab.icon}
            </span>
            <span className="font-label text-[10px] font-bold uppercase tracking-widest mt-1">
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
