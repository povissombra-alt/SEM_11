import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import {
  CATEGORIES,
  TODAY,
  buildMonthlyTrend,
  buildSavingsGrowth,
  getCategory,
  initialGoals,
  initialProfile,
  initialSettings,
  initialTransactions,
  monthLabel,
} from '../data';
import { useLocalStorage } from '../hooks/useLocalStorage';

const FinanceContext = createContext(null);

const STORAGE_KEYS = {
  transactions: 'fintra:transactions',
  balance: 'fintra:balance',
  goals: 'fintra:goals',
  profile: 'fintra:profile',
  settings: 'fintra:settings',
};

const currentMonthKey = () => {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
};

export function FinanceProvider({ children }) {
  const [transactions, setTransactions] = useLocalStorage(
    STORAGE_KEYS.transactions,
    initialTransactions,
  );
  const [balance, setBalance] = useLocalStorage(STORAGE_KEYS.balance, 12480.5);
  const [goals, setGoals] = useLocalStorage(STORAGE_KEYS.goals, initialGoals);
  const [profile, setProfile] = useLocalStorage(
    STORAGE_KEYS.profile,
    initialProfile,
  );
  const [settings, setSettings] = useLocalStorage(
    STORAGE_KEYS.settings,
    initialSettings,
  );

  const [toasts, setToasts] = useState([]);
  const [transactionModalOpen, setTransactionModalOpen] = useState(false);

  const notify = useCallback((message, tone = 'success') => {
    const id =
      typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random()}`;

    setToasts((current) => [...current.slice(-2), { id, message, tone }]);
    window.setTimeout(() => {
      setToasts((current) => current.filter((toast) => toast.id !== id));
    }, 3800);
  }, []);

  const dismissToast = useCallback((id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const formatCurrency = useCallback(
    (value, options = {}) => {
      if (settings.hideBalances && !options.force) return '••••••';
      const maximumFractionDigits = options.maximumFractionDigits ?? 2;
      return new Intl.NumberFormat('es-ES', {
        style: 'currency',
        currency: settings.currency,
        minimumFractionDigits:
          options.minimumFractionDigits ??
          Math.min(2, maximumFractionDigits),
        maximumFractionDigits,
      }).format(Number(value) || 0);
    },
    [settings.currency, settings.hideBalances],
  );

  const formatCompact = useCallback(
    (value) => {
      if (settings.hideBalances) return '•••';
      return new Intl.NumberFormat('es-ES', {
        style: 'currency',
        currency: settings.currency,
        notation: 'compact',
        maximumFractionDigits: 1,
      }).format(Number(value) || 0);
    },
    [settings.currency, settings.hideBalances],
  );

  const addTransaction = useCallback(
    (payload) => {
      const absoluteAmount = Math.abs(Number(payload.amount));
      if (!Number.isFinite(absoluteAmount) || absoluteAmount <= 0) {
        notify('Introduce un importe válido.', 'error');
        return false;
      }

      const isIncome = payload.type === 'income';
      const category = isIncome ? 'Ingresos' : payload.category || 'Otros';
      const date = payload.date || TODAY;

      const transaction = {
        id: `tx-${Date.now()}`,
        date,
        description: payload.description?.trim() || 'Movimiento sin concepto',
        merchant: payload.merchant?.trim() || 'Sin comercio',
        category,
        amount: isIncome ? absoluteAmount : -absoluteAmount,
        method: payload.method || 'Tarjeta •••• 4821',
        status: 'Completado',
      };

      setTransactions((current) =>
        [transaction, ...current].sort((a, b) => b.date.localeCompare(a.date)),
      );
      setBalance((current) => current + transaction.amount);
      notify(
        `${isIncome ? 'Ingreso' : 'Gasto'} de ${formatCurrency(absoluteAmount)} ${
          isIncome ? 'registrado' : 'añadido'
        }.`,
      );
      setTransactionModalOpen(false);
      return true;
    },
    [formatCurrency, notify, setBalance, setTransactions],
  );

  const deleteTransaction = useCallback(
    (id) => {
      const target = transactions.find((transaction) => transaction.id === id);
      if (!target) return;

      setTransactions((current) =>
        current.filter((transaction) => transaction.id !== id),
      );
      setBalance((current) => current - target.amount);

      if (
        target.category === 'Ahorro' &&
        target.description.startsWith('Aporte a ')
      ) {
        const goalName = target.description.replace('Aporte a ', '');
        setGoals((current) =>
          current.map((goal) =>
            goal.name === goalName
              ? {
                  ...goal,
                  saved: Math.max(0, goal.saved + target.amount),
                }
              : goal,
          ),
        );
      }

      notify('Movimiento eliminado.', 'info');
    },
    [notify, setBalance, setGoals, setTransactions, transactions],
  );

  const addFundsToGoal = useCallback(
    (goalId, rawAmount) => {
      const amount = Math.abs(Number(rawAmount));
      const goal = goals.find((item) => item.id === goalId);
      if (!goal || !Number.isFinite(amount) || amount <= 0) {
        notify('Introduce un importe válido.', 'error');
        return false;
      }

      const remaining = Math.max(0, goal.target - goal.saved);
      if (remaining === 0) {
        notify('Esta meta ya está completada. 🎉', 'info');
        return false;
      }

      const contribution = Math.min(amount, remaining);
      setGoals((current) =>
        current.map((item) =>
          item.id === goalId
            ? { ...item, saved: Math.min(item.target, item.saved + contribution) }
            : item,
        ),
      );

      const transaction = {
        id: `tx-${Date.now()}`,
        date: TODAY,
        description: `Aporte a ${goal.name}`,
        merchant: 'Cuenta de ahorro',
        category: 'Ahorro',
        amount: -contribution,
        method: 'Cuenta de ahorro',
        status: 'Completado',
      };

      setTransactions((current) =>
        [transaction, ...current].sort((a, b) => b.date.localeCompare(a.date)),
      );
      setBalance((current) => current - contribution);
      notify(
        `Aportaste ${formatCurrency(contribution)} a “${goal.name}”.`,
      );
      return true;
    },
    [
      formatCurrency,
      goals,
      notify,
      setBalance,
      setGoals,
      setTransactions,
    ],
  );

  const updateProfile = useCallback(
    (nextProfile) => {
      setProfile((current) => ({ ...current, ...nextProfile }));
    },
    [setProfile],
  );

  const updateSettings = useCallback(
    (patch) => {
      setSettings((current) => ({ ...current, ...patch }));
    },
    [setSettings],
  );

  const resetDemo = useCallback(() => {
    Object.values(STORAGE_KEYS).forEach((key) => {
      window.localStorage.removeItem(key);
    });
    window.location.reload();
  }, []);

  const currentTransactions = useMemo(
    () =>
      transactions.filter((transaction) =>
        transaction.date.startsWith(currentMonthKey()),
      ),
    [transactions],
  );

  const stats = useMemo(() => {
    const income = currentTransactions
      .filter((transaction) => transaction.amount > 0)
      .reduce((total, transaction) => total + transaction.amount, 0);

    const expenses = Math.abs(
      currentTransactions
        .filter(
          (transaction) =>
            transaction.amount < 0 && transaction.category !== 'Ahorro',
        )
        .reduce((total, transaction) => total + transaction.amount, 0),
    );

    const savings = Math.max(0, income - expenses);
    const savingsRate = income > 0 ? (savings / income) * 100 : 0;
    const monthlyBudget = CATEGORIES.filter(
      (category) => category.budget > 0 && category.name !== 'Ahorro',
    ).reduce((total, category) => total + category.budget, 0);

    return {
      income,
      expenses,
      savings,
      savingsRate,
      monthlyBudget,
      budgetUsed:
        monthlyBudget > 0 ? Math.min(150, (expenses / monthlyBudget) * 100) : 0,
    };
  }, [currentTransactions]);

  const categoryBreakdown = useMemo(() => {
    const grouped = currentTransactions
      .filter(
        (transaction) =>
          transaction.amount < 0 && transaction.category !== 'Ahorro',
      )
      .reduce((accumulator, transaction) => {
        accumulator[transaction.category] =
          (accumulator[transaction.category] || 0) +
          Math.abs(transaction.amount);
        return accumulator;
      }, {});

    return Object.entries(grouped)
      .map(([name, amount]) => ({
        ...getCategory(name),
        amount,
        percentage: stats.expenses > 0 ? (amount / stats.expenses) * 100 : 0,
      }))
      .sort((a, b) => b.amount - a.amount);
  }, [currentTransactions, stats.expenses]);

  const monthlyTrend = useMemo(
    () => buildMonthlyTrend(stats.income, stats.expenses),
    [stats.income, stats.expenses],
  );

  const savingsGrowth = useMemo(() => buildSavingsGrowth(balance), [balance]);

  const goalsSummary = useMemo(() => {
    const saved = goals.reduce((total, goal) => total + goal.saved, 0);
    const target = goals.reduce((total, goal) => total + goal.target, 0);
    return {
      saved,
      target,
      percentage: target > 0 ? (saved / target) * 100 : 0,
    };
  }, [goals]);

  const value = {
    transactions,
    currentTransactions,
    balance,
    goals,
    goalsSummary,
    profile,
    settings,
    stats,
    categoryBreakdown,
    monthlyTrend,
    savingsGrowth,
    monthLabel,
    toasts,
    notify,
    dismissToast,
    formatCurrency,
    formatCompact,
    addTransaction,
    deleteTransaction,
    addFundsToGoal,
    updateProfile,
    updateSettings,
    resetDemo,
    transactionModalOpen,
    openTransactionModal: () => setTransactionModalOpen(true),
    closeTransactionModal: () => setTransactionModalOpen(false),
  };

  return (
    <FinanceContext.Provider value={value}>{children}</FinanceContext.Provider>
  );
}

export function useFinance() {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance debe usarse dentro de FinanceProvider');
  }
  return context;
}
