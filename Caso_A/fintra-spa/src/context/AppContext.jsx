import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { DEFAULT_USER, LIVE_POOL, SEED_MOVEMENTS } from '../data/seed';
import { money, nowLocalISO } from '../lib/format';

const STORAGE_KEY = 'fintra:user:v1';

const AppContext = createContext(null);

function loadUser() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_USER;
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_USER,
      ...parsed,
      preferences: { ...DEFAULT_USER.preferences, ...(parsed.preferences || {}) },
    };
  } catch {
    return DEFAULT_USER;
  }
}

export function AppProvider({ children }) {
  const [user, setUser] = useState(loadUser);
  const [movements, setMovements] = useState(SEED_MOVEMENTS);
  const [privacy, setPrivacy] = useState(false);
  const [live, setLive] = useState(true);
  const [notifications, setNotifications] = useState([
    {
      id: 'n-welcome',
      title: 'Bienvenida a Fintra',
      body: 'Tu panel está sincronizado en tiempo real.',
      time: 'Ahora',
      unread: true,
    },
  ]);
  const [toasts, setToasts] = useState([]);
  const [sessionStart] = useState(() => Date.now());
  const [visits, setVisits] = useState(0);
  const [shellMounts, setShellMounts] = useState(0);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } catch {
      /* almacenamiento no disponible */
    }
  }, [user]);

  const addToast = useCallback((toast) => {
    const id = `toast-${Date.now()}-${Math.random().toString(16).slice(2, 6)}`;
    setToasts((current) => [...current, { id, tone: 'info', ...toast }]);
    window.setTimeout(() => {
      setToasts((current) => current.filter((item) => item.id !== id));
    }, 4500);
  }, []);

  const dismissToast = useCallback((id) => {
    setToasts((current) => current.filter((item) => item.id !== id));
  }, []);

  const updateUser = useCallback((patch) => {
    setUser((current) => ({ ...current, ...patch }));
  }, []);

  const addMovement = useCallback((input) => {
    const movement = {
      id: `mv-manual-${Date.now()}`,
      status: 'Completado',
      date: nowLocalISO(),
      ...input,
      amount: Number(input.amount),
    };
    setMovements((current) => [movement, ...current]);
    return movement;
  }, []);

  const markAllRead = useCallback(() => {
    setNotifications((current) => current.map((item) => ({ ...item, unread: false })));
  }, []);

  const registerVisit = useCallback(() => setVisits((value) => value + 1), []);
  const registerShell = useCallback(() => setShellMounts((value) => value + 1), []);

  const resetDemo = useCallback(() => {
    setUser(DEFAULT_USER);
    setMovements(SEED_MOVEMENTS);
    setPrivacy(false);
    setLive(true);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* noop */
    }
    addToast({
      tone: 'success',
      title: 'Demo restablecida',
      message: 'Los datos de ejemplo vuelven a su estado inicial.',
    });
  }, [addToast]);

  // Simulación de datos en tiempo real: cada 12s entra un movimiento nuevo.
  useEffect(() => {
    if (!live) return undefined;

    const interval = window.setInterval(() => {
      const pool = LIVE_POOL[Math.floor(Math.random() * LIVE_POOL.length)];
      const amount =
        Math.round((pool.min + Math.random() * (pool.max - pool.min)) * 100) / 100;
      const movement = {
        id: `mv-live-${Date.now()}`,
        date: nowLocalISO(),
        description: pool.description,
        category: pool.category,
        type: 'gasto',
        amount,
        method: pool.method,
        status: 'Completado',
      };

      setMovements((current) => [movement, ...current]);
      setNotifications((current) =>
        [
          {
            id: `n-${Date.now()}`,
            title: 'Movimiento detectado',
            body: `${pool.description} · ${money(amount)}`,
            time: 'Ahora',
            unread: true,
          },
          ...current,
        ].slice(0, 20),
      );
      addToast({
        tone: 'info',
        title: 'Movimiento en tiempo real',
        message: `${pool.description} por ${money(amount)}`,
      });
    }, 12000);

    return () => window.clearInterval(interval);
  }, [live, addToast]);

  const unreadCount = useMemo(
    () => notifications.filter((item) => item.unread).length,
    [notifications],
  );

  const value = useMemo(
    () => ({
      user,
      movements,
      privacy,
      setPrivacy,
      live,
      setLive,
      notifications,
      unreadCount,
      markAllRead,
      toasts,
      addToast,
      dismissToast,
      addMovement,
      updateUser,
      resetDemo,
      sessionStart,
      visits,
      registerVisit,
      shellMounts,
      registerShell,
    }),
    [
      user,
      movements,
      privacy,
      live,
      notifications,
      unreadCount,
      markAllRead,
      toasts,
      addToast,
      dismissToast,
      addMovement,
      updateUser,
      resetDemo,
      sessionStart,
      visits,
      registerVisit,
      shellMounts,
      registerShell,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp debe usarse dentro de <AppProvider>');
  return context;
}
