import { useMemo, useState } from 'react';
import { useApp } from '../context/AppContext';
import { CATEGORIES } from '../data/seed';
import { money, monthTitle } from '../lib/format';
import TransactionTable from '../components/TransactionTable';
import MovementModal from '../components/MovementModal';
import Icon from '../components/Icons';

const TYPE_OPTIONS = [
  { value: 'todos', label: 'Todos' },
  { value: 'ingreso', label: 'Ingresos' },
  { value: 'gasto', label: 'Gastos' },
];

export default function Movimientos() {
  const { movements, privacy } = useApp();
  const [query, setQuery] = useState('');
  const [type, setType] = useState('todos');
  const [category, setCategory] = useState('todas');
  const [month, setMonth] = useState('todos');
  const [modalOpen, setModalOpen] = useState(false);

  const months = useMemo(() => {
    const keys = [...new Set(movements.map((movement) => movement.date.slice(0, 7)))];
    return keys.sort().reverse();
  }, [movements]);

  const filtered = useMemo(() => {
    const search = query.trim().toLowerCase();

    return movements.filter((movement) => {
      if (type !== 'todos' && movement.type !== type) return false;
      if (category !== 'todas' && movement.category !== category) return false;
      if (month !== 'todos' && movement.date.slice(0, 7) !== month) return false;
      if (
        search &&
        !`${movement.description} ${movement.category} ${movement.method}`
          .toLowerCase()
          .includes(search)
      ) {
        return false;
      }
      return true;
    });
  }, [movements, query, type, category, month]);

  const totals = useMemo(() => {
    return filtered.reduce(
      (acc, movement) => {
        if (movement.type === 'ingreso') acc.income += movement.amount;
        else acc.expense += movement.amount;
        return acc;
      },
      { income: 0, expense: 0 },
    );
  }, [filtered]);

  const hasFilters =
    query.trim() !== '' || type !== 'todos' || category !== 'todas' || month !== 'todos';

  const clearFilters = () => {
    setQuery('');
    setType('todos');
    setCategory('todas');
    setMonth('todos');
  };

  return (
    <div className="page-in">
      <section className="card">
        <div className="toolbar">
          <div className="search">
            <Icon name="search" size={18} />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Buscar por descripción, categoría o método…"
              aria-label="Buscar movimientos"
            />
          </div>

          <div className="segmented" role="group" aria-label="Filtrar por tipo">
            {TYPE_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                className={type === option.value ? 'active' : ''}
                onClick={() => setType(option.value)}
              >
                {option.label}
              </button>
            ))}
          </div>

          <select
            className="select"
            value={month}
            onChange={(event) => setMonth(event.target.value)}
            aria-label="Filtrar por mes"
          >
            <option value="todos">Todos los meses</option>
            {months.map((key) => (
              <option key={key} value={key}>
                {monthTitle(key)}
              </option>
            ))}
          </select>

          <select
            className="select"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            aria-label="Filtrar por categoría"
          >
            <option value="todas">Todas las categorías</option>
            {Object.keys(CATEGORIES).map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>

          <button
            type="button"
            className="btn btn-primary toolbar-cta"
            onClick={() => setModalOpen(true)}
          >
            <Icon name="plus" size={18} /> Añadir
          </button>
        </div>

        <div className="filter-summary">
          <span>
            <strong>{filtered.length}</strong> movimientos
          </span>
          <span className="dot-sep" />
          <span>
            Ingresos <strong className="pos">{money(totals.income, privacy)}</strong>
          </span>
          <span>
            Gastos <strong className="neg">{money(totals.expense, privacy)}</strong>
          </span>
          {hasFilters && (
            <button type="button" className="link clear-link" onClick={clearFilters}>
              <Icon name="reset" size={15} /> Limpiar filtros
            </button>
          )}
        </div>

        <TransactionTable
          items={filtered}
          emptyMessage="Prueba con otro término de búsqueda o cambia los filtros."
        />
      </section>

      <MovementModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
