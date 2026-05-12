import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { getRestaurant, createSponsorship } from '../api';
import type { Restaurant, SponsorshipTier, VisibilityLevel } from '../types';
import { SPONSORSHIP_TIERS } from '../types';
import Header from '../components/layout/Header';
import BottomNav from '../components/layout/BottomNav';
import AztecDivider from '../components/ui/AztecDivider';
import AztecStamp from '../components/ui/AztecStamp';

const PAYPAL_CLIENT_ID = import.meta.env.VITE_PAYPAL_CLIENT_ID || 'test';

const TIER_COLORS: Record<VisibilityLevel, string> = {
  basic: '#C4501A',
  featured: '#1B7A6E',
  premium: '#D4960A',
};

const TIER_ICONS: Record<VisibilityLevel, string> = {
  basic: '✨',
  featured: '◆',
  premium: '👑',
};

export default function Sponsorship() {
  const { restaurantId } = useParams<{ restaurantId: string }>();
  const navigate = useNavigate();

  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [selectedTier, setSelectedTier] = useState<SponsorshipTier>(SPONSORSHIP_TIERS[0]);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!restaurantId) return;
    getRestaurant(Number(restaurantId))
      .then(res => setRestaurant(res.data?.data ?? res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [restaurantId]);

  const handlePaymentSuccess = async (_orderId: string) => {
    if (!restaurantId) return;
    try {
      await createSponsorship({
        restaurant_id: Number(restaurantId),
        visibility_level: selectedTier.level,
        label: selectedTier.label,
      });
      setSuccess(true);
    } catch {
      setError('El pago fue exitoso pero hubo un error al activar el plan. Contacta soporte.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center"
        style={{ background: 'linear-gradient(180deg, #1A0800 0%, #2A1200 60%, #FBF4E8 60%, #FBF4E8 100%)' }}
      >
        <div className="mb-6">
          <AztecStamp color={TIER_COLORS[selectedTier.level]} size={140}>
            <span className="text-5xl">🎉</span>
          </AztecStamp>
        </div>
        <h2 className="font-headline text-3xl font-black text-[#FBF4E8] mb-2">¡Activado!</h2>
        <p className="text-[#C4A882] max-w-xs mb-2">
          El plan <strong style={{ color: TIER_COLORS[selectedTier.level] }}>{selectedTier.label}</strong> para{' '}
          <strong className="text-[#FBF4E8]">{restaurant?.name}</strong> está activo.
        </p>
        <p className="text-sm text-[#C4A882]/80 mb-8">
          Tu restaurante ahora tendrá mayor visibilidad en Turizteca.
        </p>
        <button
          onClick={() => navigate(`/restaurant/${restaurantId}`)}
          className="text-on-primary px-8 py-3.5 rounded-full font-bold shadow-lg active:scale-[0.98] transition-transform"
          style={{ background: 'linear-gradient(135deg, #C4501A, #E8723C)' }}
        >
          Ver mi restaurante
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-32">
      <Header showBack title="Promocionar" />

      <div className="pt-16">
        {/* Hero oscuro */}
        <div
          className="px-6 pt-8 pb-8"
          style={{ background: 'linear-gradient(180deg, #1A0800 0%, #2A1200 100%)' }}
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="w-6 h-px bg-[#C4501A]" />
            <span className="font-label text-[#E8723C] uppercase tracking-widest text-[10px] font-bold">
              Patrocinio
            </span>
          </div>

          <h2 className="font-headline text-3xl font-black text-[#FBF4E8] tracking-tight leading-tight">
            Destaca tu restaurante
          </h2>
          {restaurant && (
            <p className="text-[#C4A882] text-sm mt-1">
              Elige un plan para <strong className="text-[#FBF4E8]">{restaurant.name}</strong>
            </p>
          )}
        </div>

        <div style={{ background: '#2A1200' }}>
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

        <div className="px-6 max-w-lg mx-auto -mt-2 pb-4">

          {/* Selección de tiers */}
          <div className="space-y-4 mb-6">
            {SPONSORSHIP_TIERS.map(tier => {
              const isSelected = selectedTier.level === tier.level;
              const tierColor = TIER_COLORS[tier.level];

              return (
                <button
                  key={tier.level}
                  type="button"
                  onClick={() => setSelectedTier(tier)}
                  className={`w-full text-left p-5 rounded-2xl border-2 transition-all relative overflow-hidden ${
                    isSelected
                      ? 'bg-white shadow-lg -translate-y-0.5'
                      : 'border-outline-variant/20 bg-white/70 hover:bg-white hover:border-outline-variant'
                  }`}
                  style={isSelected ? { borderColor: tierColor } : {}}
                >
                  {/* Accent bar */}
                  {isSelected && (
                    <span
                      className="absolute left-0 top-0 bottom-0 w-1.5"
                      style={{ background: tierColor }}
                    />
                  )}

                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-lg shadow-md"
                        style={{
                          background: isSelected ? tierColor : 'rgba(155, 112, 72, 0.12)',
                          color: isSelected ? '#FBF4E8' : tierColor,
                        }}
                      >
                        {TIER_ICONS[tier.level]}
                      </div>
                      <div>
                        <span
                          className="font-headline text-lg font-black block leading-none"
                          style={{ color: tierColor }}
                        >
                          {tier.label}
                        </span>
                        <span className="text-[10px] uppercase tracking-widest text-on-surface-variant font-label font-bold">
                          Plan {tier.level}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-headline text-2xl font-black text-on-surface">
                        ${tier.price}
                      </span>
                      <span className="text-[10px] text-on-surface-variant font-label block uppercase tracking-widest">
                        USD / mes
                      </span>
                    </div>
                  </div>

                  <p className="text-sm text-on-surface-variant mb-3 leading-relaxed">
                    {tier.description}
                  </p>

                  <ul className="space-y-1.5">
                    {tier.perks.map(perk => (
                      <li key={perk} className="flex items-start gap-2 text-sm text-on-surface">
                        <span
                          className="material-symbols-outlined text-sm shrink-0 mt-0.5"
                          style={{
                            fontVariationSettings: "'FILL' 1",
                            color: tierColor,
                          }}
                        >
                          check_circle
                        </span>
                        {perk}
                      </li>
                    ))}
                  </ul>

                  {isSelected && (
                    <div
                      className="mt-3 pt-3 border-t flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest"
                      style={{ color: tierColor, borderColor: `${tierColor}33` }}
                    >
                      <span
                        className="material-symbols-outlined text-base"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        check_circle
                      </span>
                      Plan seleccionado
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* PayPal section */}
          <div className="bg-white rounded-2xl p-5 border border-outline-variant/20 shadow-md">
            <div className="flex justify-between items-center mb-4 pb-4 border-b border-outline-variant/15">
              <div>
                <span className="font-label font-bold text-on-surface-variant text-[10px] uppercase tracking-widest block">
                  Total a pagar
                </span>
                <span className="font-headline text-3xl font-black" style={{ color: TIER_COLORS[selectedTier.level] }}>
                  ${selectedTier.price}
                  <span className="text-base text-on-surface-variant font-bold ml-1">USD</span>
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase tracking-widest font-label font-bold text-on-surface-variant block">
                  Plan
                </span>
                <span className="font-headline font-black" style={{ color: TIER_COLORS[selectedTier.level] }}>
                  {selectedTier.label}
                </span>
              </div>
            </div>

            {error && (
              <div className="bg-error-container/20 border border-error/20 rounded-xl p-3 mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-error text-sm">error</span>
                <p className="text-error text-sm">{error}</p>
              </div>
            )}

            <PayPalScriptProvider
              options={{
                clientId: PAYPAL_CLIENT_ID,
                currency: 'USD',
              }}
            >
              <PayPalButtons
                style={{ layout: 'vertical', color: 'gold', shape: 'rect', label: 'pay' }}
                createOrder={(_data, actions) =>
                  actions.order.create({
                    intent: 'CAPTURE',
                    purchase_units: [{
                      description: `Turizteca - Plan ${selectedTier.label} para ${restaurant?.name}`,
                      amount: {
                        currency_code: 'USD',
                        value: String(selectedTier.price),
                      },
                    }],
                  })
                }
                onApprove={async (_data, actions) => {
                  const order = await actions.order?.capture();
                  if (order?.id) await handlePaymentSuccess(order.id);
                }}
                onError={() => setError('Error al procesar el pago. Intenta de nuevo.')}
              />
            </PayPalScriptProvider>

            <p className="text-center text-xs text-on-surface-variant mt-4 font-label flex items-center justify-center gap-1.5">
              <span className="material-symbols-outlined text-sm">lock</span>
              Pago seguro por PayPal. Cancela cuando quieras.
            </p>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
