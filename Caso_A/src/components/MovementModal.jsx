import { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { money, nowLocalISO } from '../lib/format';
import Icon from './Icons';

const EXPENSE_CATEGORIES = [
  'Supermercado',
  'Restaurantes',
  'Transporte',
  'Vivienda',
  'Ocio',
  'Salud',
  'Suscripciones',
  'Compras',
  'Educación',
  'Transferencias',
];

const INCOME_CATEGORIES = ['Ingresos', 'Transferencias'];

const METHODS = ['Tarjeta', 'Transferencia', 'Bizum', 'Efectivo', 'Domiciliación'];

const todayInput = () => nowLocalISO().slice(0, 10);

const emptyForm = () => ({
  description: '',
  amount: '',
  category: EXPENSE_CATEGORIES[0],
  date: todayInput(),
  method: 'Tarjeta',
});

export default function MovementModal({ open, onClose }) {
  const { addMovement, addToast } = useApp();
  const [type, setType] = useState('gasto');
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!open) return;
    setType('gasto');
    setForm(emptyForm());
    setError('');
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;

    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  const setField = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
    setError('');
  };

  const changeType = (nextType) => {
    setType(nextType);
    setForm((current) => ({
      ...current,
      category: nextType === 'gasto' ? EXPENSE_CATEGORIES[0] : INCOME_CATEGORIES[0],
    }));
    setError('');
  };

  const categories = type === 'gasto' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;

  const handleSubmit = (event) => {
    event.preventDefault();
    const amount = Number(String(form.amount).replace(',', '.'));

    if (!form.description.trim()) {
      setError('Escribe una descripción para el movimiento.');
      return;
    }
    if (!Number.isFinite(amount) || amount <= 0) {
      setError('Introduce un importe mayor que 0.');
      return;
    }

    addMovement({
      description: form.description.trim(),
      amount,
      category: form.category,
      type,
      method: form.method,
      date: `${form.date}T${nowLocalISO().slice(11)}`,
      status: 'Completado',
    });

    addToast({
      tone: 'success',
      title: 'Movimiento añadido',
      message: `${form.description.trim()} · ${money(amount)}`,
    });

    onClose();
  };

  return (
    <div
      className="modal-backdrop"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <header className="modal-head">
          <div>
            <h2 id="modal-title">Nuevo movimiento</h2>
            <p className="muted">Se añadirá al instante, sin recargar la página.</p>
          </div>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Cerrar">
            <Icon name="close" />
          </button>
        </header>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="segmented segmented-full" role="group" aria-label="Tipo de movimiento">
            <button
              type="button"
              className={type === 'gasto' ? 'active' : ''}
              onClick={() => changeType('gasto')}
            >
              <Icon name="arrowUpRight" size={16} /> Gasto
            </button>
            <button
              type="button"
              className={type === 'ingreso' ? 'active' : ''}
              onClick={() => changeType('ingreso')}
            >
              <Icon name="arrowDownRight" size={16} /> Ingreso
            </button>
          </div>

          <div className="form-grid">
            <label className="field field-full">
              <span>Descripción</span>
              <input
                type="text"
                value={form.description}
                onChange={setField('description')}
                placeholder="Ej. Compra en el supermercado"
                autoFocus
                maxLength={60}
              />
            </label>

            <label className="field">
              <span>Importe (€)</span>
              <input
                type="text"
                inputMode="decimal"
                value={form.amount}
                onChange={setField('amount')}
                placeholder="0,00"
              />
            </label>

            <label className="field">
              <span>Categoría</span>
              <select value={form.category} onChange={setField('category')}>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </label>

            <label className="field">
              <span>Fecha</span>
              <input type="date" value={form.date} onChange={setField('date')} />
            </label>

            <label className="field">
              <span>Método de pago</span>
              <select value={form.method} onChange={setField('method')}>
                {METHODS.map((method) => (
                  <option key={method} value={method}>
                    {method}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {error && (
            <p className="form-error">
              <Icon name="alert" size={16} /> {error}
            </p>
          )}

          <footer className="modal-foot">
            <button type="button" className="btn btn-ghost" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary">
              <Icon name="plus" size={18} /> Guardar movimiento
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
}
