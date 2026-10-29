import { useEffect, useState } from 'react';
import { CATEGORIES, TODAY } from '../data';
import { useFinance } from '../context/FinanceContext';
import Icon from './Icon';
import Modal from './Modal';

const DEFAULT_FORM = {
  type: 'expense',
  amount: '',
  description: '',
  merchant: '',
  category: 'Comida',
  date: TODAY,
  method: 'Tarjeta •••• 4821',
};

const expenseCategories = CATEGORIES.filter(
  (category) =>
    !['Ingresos', 'Ahorro', 'Otros'].includes(category.name),
);

const methods = [
  'Tarjeta •••• 4821',
  'Cuenta corriente',
  'Transferencia',
  'Efectivo',
];

export default function AddTransactionModal() {
  const {
    addTransaction,
    closeTransactionModal,
    settings,
    transactionModalOpen,
  } = useFinance();
  const [form, setForm] = useState(DEFAULT_FORM);

  useEffect(() => {
    if (transactionModalOpen) setForm({ ...DEFAULT_FORM, date: TODAY });
  }, [transactionModalOpen]);

  const update = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    addTransaction(form);
  };

  return (
    <Modal
      open={transactionModalOpen}
      onClose={closeTransactionModal}
      title="Nuevo movimiento"
      subtitle="Registra un ingreso o gasto en tu cuenta."
      icon="movements"
      size="md"
    >
      <form className="form-stack" onSubmit={handleSubmit}>
        <div className="type-switch" role="group" aria-label="Tipo de movimiento">
          <button
            type="button"
            className={form.type === 'expense' ? 'is-active expense' : ''}
            onClick={() =>
              setForm((current) => ({
                ...current,
                type: 'expense',
                category:
                  current.category === 'Ingresos'
                    ? 'Comida'
                    : current.category,
              }))
            }
          >
            <Icon name="arrowUpRight" size={17} />
            Gasto
          </button>
          <button
            type="button"
            className={form.type === 'income' ? 'is-active income' : ''}
            onClick={() =>
              setForm((current) => ({
                ...current,
                type: 'income',
                category: 'Ingresos',
              }))
            }
          >
            <Icon name="arrowDownLeft" size={17} />
            Ingreso
          </button>
        </div>

        <label className="field">
          <span>Importe</span>
          <div className="input-with-suffix">
            <input
              type="number"
              min="0.01"
              step="0.01"
              inputMode="decimal"
              placeholder="0,00"
              value={form.amount}
              onChange={update('amount')}
              required
              autoFocus
            />
            <span>{settings.currency}</span>
          </div>
        </label>

        <div className="form-grid">
          <label className="field">
            <span>Concepto</span>
            <input
              type="text"
              placeholder="Ej. Cena con amigos"
              value={form.description}
              onChange={update('description')}
              required
            />
          </label>
          <label className="field">
            <span>Comercio o entidad</span>
            <input
              type="text"
              placeholder="Ej. La Buena Vida"
              value={form.merchant}
              onChange={update('merchant')}
            />
          </label>
        </div>

        <div className="form-grid">
          <label className="field">
            <span>Categoría</span>
            <select
              value={form.type === 'income' ? 'Ingresos' : form.category}
              onChange={update('category')}
              disabled={form.type === 'income'}
            >
              {(form.type === 'income'
                ? [{ name: 'Ingresos' }]
                : expenseCategories
              ).map((category) => (
                <option key={category.name} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>
          <label className="field">
            <span>Fecha</span>
            <input
              type="date"
              value={form.date}
              max={TODAY}
              onChange={update('date')}
              required
            />
          </label>
        </div>

        <label className="field">
          <span>Método de pago</span>
          <select value={form.method} onChange={update('method')}>
            {methods.map((method) => (
              <option key={method} value={method}>
                {method}
              </option>
            ))}
          </select>
        </label>

        <footer className="modal-actions">
          <button
            type="button"
            className="button button-ghost"
            onClick={closeTransactionModal}
          >
            Cancelar
          </button>
          <button type="submit" className="button button-primary">
            <Icon name="plus" size={17} />
            Añadir movimiento
          </button>
        </footer>
      </form>
    </Modal>
  );
}
