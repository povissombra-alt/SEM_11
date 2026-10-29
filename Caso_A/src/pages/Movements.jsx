import { useDeferredValue, useEffect, useMemo, useState } from 'react';
import { CATEGORIES, formatDate, getCategory } from '../data';
import { useFinance } from '../context/FinanceContext';
import Icon from '../components/Icon';

const PAGE_SIZE = 8;

export default function Movements() {
  const {
    transactions,
    deleteTransaction,
    formatCurrency,
    notify,
    openTransactionModal,
  } = useFinance();
  const [search, setSearch] = useState('');
  const [type, setType] = useState('all');
  const [category, setCategory] = useState('all');
  const [period, setPeriod] = useState('all');
  const [page, setPage] = useState(1);
  const deferredSearch = useDeferredValue(search);

  const currentMonthKey = useMemo(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  }, []);

  const filtered = useMemo(() => {
    const query = deferredSearch.trim().toLowerCase();

    return [...transactions]
      .filter((transaction) => {
        if (period === 'current' && !transaction.date.startsWith(currentMonthKey)) {
          return false;
        }
        if (type === 'income' && transaction.amount <= 0) return false;
        if (type === 'expense' && transaction.amount > 0) return false;
        if (category !== 'all' && transaction.category !== category) return false;
        if (!query) return true;

        return [transaction.merchant, transaction.description, transaction.category]
          .join(' ')
          .toLowerCase()
          .includes(query);
      })
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [
    category,
    currentMonthKey,
    deferredSearch,
    period,
    transactions,
    type,
  ]);

  const totals = useMemo(() => {
    const income = filtered
      .filter((transaction) => transaction.amount > 0)
      .reduce((total, transaction) => total + transaction.amount, 0);
    const expenses = Math.abs(
      filtered
        .filter((transaction) => transaction.amount < 0)
        .reduce((total, transaction) => total + transaction.amount, 0),
    );
    return { income, expenses, net: income - expenses };
  }, [filtered]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount);
  const paginated = filtered.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE,
  );

  useEffect(() => {
    setPage(1);
  }, [search, type, category, period]);

  const resetFilters = () => {
    setSearch('');
    setType('all');
    setCategory('all');
    setPeriod('all');
  };

  const exportCsv = () => {
    const header = ['Fecha', 'Comercio', 'Concepto', 'Categoría', 'Método', 'Importe'];
    const rows = filtered.map((transaction) => [
      transaction.date,
      transaction.merchant,
      transaction.description,
      transaction.category,
      transaction.method,
      transaction.amount.toFixed(2).replace('.', ','),
    ]);
    const csv = [header, ...rows]
      .map((row) =>
        row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(';'),
      )
      .join('\r\n');

    const blob = new Blob([`\uFEFF${csv}`], {
      type: 'text/csv;charset=utf-8;',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'fintra-movimientos.csv';
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 0);
    notify(`${filtered.length} movimientos exportados a CSV.`);
  };

  const filtersActive =
    search || type !== 'all' || category !== 'all' || period !== 'all';

  return (
    <div className="movements-page">
      <section className="page-intro">
        <div>
          <span className="eyebrow">
            <span className="live-dot" />
            Actualizado en tiempo real
          </span>
          <h2>Todos tus movimientos</h2>
          <p>
            Busca, filtra y entiende cada euro que entra y sale de tu cuenta.
          </p>
        </div>
        <div className="page-actions">
          <button
            type="button"
            className="button button-ghost"
            onClick={exportCsv}
            disabled={filtered.length === 0}
          >
            <Icon name="download" size={17} />
            Exportar CSV
          </button>
          <button
            type="button"
            className="button button-primary"
            onClick={openTransactionModal}
          >
            <Icon name="plus" size={18} />
            Nuevo movimiento
          </button>
        </div>
      </section>

      <section className="mini-metrics" aria-label="Totales del filtro">
        <div>
          <span>Movimientos</span>
          <strong>{filtered.length}</strong>
        </div>
        <div>
          <span>Entradas</span>
          <strong className="positive-text">+{formatCurrency(totals.income)}</strong>
        </div>
        <div>
          <span>Salidas</span>
          <strong className="negative-text">−{formatCurrency(totals.expenses)}</strong>
        </div>
        <div>
          <span>Balance del periodo</span>
          <strong className={totals.net >= 0 ? 'positive-text' : 'negative-text'}>
            {totals.net >= 0 ? '+' : '−'}
            {formatCurrency(Math.abs(totals.net))}
          </strong>
        </div>
      </section>

      <section className="card movements-card">
        <div className="filter-bar">
          <label className="search-field">
            <Icon name="search" size={18} />
            <span className="sr-only">Buscar movimientos</span>
            <input
              type="search"
              placeholder="Buscar por comercio, concepto o categoría…"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                aria-label="Limpiar búsqueda"
              >
                <Icon name="close" size={15} />
              </button>
            )}
          </label>

          <div className="filter-controls">
            <label className="select-field">
              <Icon name="filter" size={16} />
              <span className="sr-only">Tipo de movimiento</span>
              <select value={type} onChange={(event) => setType(event.target.value)}>
                <option value="all">Todos los tipos</option>
                <option value="income">Ingresos</option>
                <option value="expense">Gastos</option>
              </select>
            </label>

            <label className="select-field">
              <span className="sr-only">Categoría</span>
              <select
                value={category}
                onChange={(event) => setCategory(event.target.value)}
              >
                <option value="all">Todas las categorías</option>
                {CATEGORIES.map((item) => (
                  <option key={item.name} value={item.name}>
                    {item.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="select-field">
              <Icon name="calendar" size={16} />
              <span className="sr-only">Periodo</span>
              <select
                value={period}
                onChange={(event) => setPeriod(event.target.value)}
              >
                <option value="all">Todo el historial</option>
                <option value="current">Este mes</option>
              </select>
            </label>

            {filtersActive && (
              <button
                type="button"
                className="button button-clear"
                onClick={resetFilters}
              >
                Limpiar
              </button>
            )}
          </div>
        </div>

        {paginated.length > 0 ? (
          <>
            <div className="table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Movimiento</th>
                    <th>Categoría</th>
                    <th className="col-date">Fecha</th>
                    <th className="col-method">Método</th>
                    <th className="align-right">Importe</th>
                    <th className="col-actions">
                      <span className="sr-only">Acciones</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.map((transaction) => {
                    const itemCategory = getCategory(transaction.category);
                    const isIncome = transaction.amount > 0;

                    return (
                      <tr key={transaction.id}>
                        <td>
                          <div className="table-movement">
                            <span
                              className="transaction-category-icon"
                              style={{
                                color: itemCategory.color,
                                background: `color-mix(in srgb, ${itemCategory.color} 13%, transparent)`,
                              }}
                            >
                              <Icon name={itemCategory.icon} size={18} />
                            </span>
                            <div>
                              <strong>{transaction.merchant}</strong>
                              <span>{transaction.description}</span>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className="category-pill">
                            <i style={{ background: itemCategory.color }} />
                            {transaction.category}
                          </span>
                        </td>
                        <td className="col-date text-muted">
                          {formatDate(transaction.date, {
                            year: 'numeric',
                          })}
                        </td>
                        <td className="col-method text-muted">
                          {transaction.method}
                        </td>
                        <td
                          className={`align-right amount-cell ${
                            isIncome ? 'is-income' : 'is-expense'
                          }`}
                        >
                          {isIncome ? '+' : '−'}
                          {formatCurrency(Math.abs(transaction.amount))}
                        </td>
                        <td className="col-actions">
                          <button
                            type="button"
                            className="row-action"
                            aria-label={`Eliminar movimiento de ${transaction.merchant}`}
                            title="Eliminar movimiento"
                            onClick={() => deleteTransaction(transaction.id)}
                          >
                            <Icon name="trash" size={16} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <footer className="table-footer">
              <span>
                Mostrando{' '}
                <strong>{(safePage - 1) * PAGE_SIZE + 1}</strong>–
                <strong>
                  {Math.min(safePage * PAGE_SIZE, filtered.length)}
                </strong>{' '}
                de <strong>{filtered.length}</strong>
              </span>
              <div className="pagination">
                <button
                  type="button"
                  className="icon-button icon-button-sm"
                  onClick={() => setPage((current) => Math.max(1, current - 1))}
                  disabled={safePage === 1}
                  aria-label="Página anterior"
                >
                  <Icon name="chevronRight" size={17} className="flip-x" />
                </button>
                {Array.from({ length: pageCount }, (_, index) => index + 1)
                  .filter(
                    (number) =>
                      number === 1 ||
                      number === pageCount ||
                      Math.abs(number - safePage) <= 1,
                  )
                  .map((number, index, visible) => (
                    <span key={number} className="pagination-slot">
                      {index > 0 && number - visible[index - 1] > 1 && (
                        <i>…</i>
                      )}
                      <button
                        type="button"
                        className={number === safePage ? 'is-active' : ''}
                        onClick={() => setPage(number)}
                        aria-label={`Página ${number}`}
                        aria-current={number === safePage ? 'page' : undefined}
                      >
                        {number}
                      </button>
                    </span>
                  ))}
                <button
                  type="button"
                  className="icon-button icon-button-sm"
                  onClick={() =>
                    setPage((current) => Math.min(pageCount, current + 1))
                  }
                  disabled={safePage === pageCount}
                  aria-label="Página siguiente"
                >
                  <Icon name="chevronRight" size={17} />
                </button>
              </div>
            </footer>
          </>
        ) : (
          <div className="empty-state">
            <span>
              <Icon name="search" size={26} />
            </span>
            <h3>No encontramos movimientos</h3>
            <p>Prueba con otros filtros o registra un movimiento nuevo.</p>
            <div className="empty-actions">
              <button type="button" className="button button-ghost" onClick={resetFilters}>
                Limpiar filtros
              </button>
              <button
                type="button"
                className="button button-primary"
                onClick={openTransactionModal}
              >
                <Icon name="plus" size={17} />
                Añadir movimiento
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
