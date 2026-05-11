import { useLocation, useNavigate } from 'react-router-dom';

const tabs = [
  { path: '/', icon: 'home', label: 'Home' },
  { path: '/explore', icon: 'explore', label: 'Discover' },
  { path: '/saved', icon: 'favorite', label: 'Saved' },
  { path: '/profile', icon: 'person_outline', label: 'Profile' },
];

export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="fixed bottom-0 left-0 w-full glass-header flex justify-around items-center px-4 pb-6 pt-3 z-50 rounded-t-[1.5rem] shadow-[0_-10px_40px_rgba(74,37,7,0.06)]">
      {tabs.map(tab => {
        const active = location.pathname === tab.path;
        return (
          <button
            key={tab.path}
            onClick={() => navigate(tab.path)}
            className={`flex flex-col items-center justify-center px-5 py-2 rounded-[1rem] transition-all active:scale-95 ${
              active
                ? 'bg-secondary-container text-on-surface scale-110'
                : 'text-on-surface opacity-60 hover:opacity-100'
            }`}
          >
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
