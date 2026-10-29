import { CATEGORIES } from '../data/seed';
import { useApp } from '../context/AppContext';
import { dateShort, moneySigned } from '../lib/format';
import Icon from './Icons';

export default function TransactionTable({ items, emptyMessage }) {
  const { privacy } = useApp();

  if (!items.length) {
    return (
      <div className="empty">
        <span className="empty-icon">
          <Icon name="search" size={22} />
        </span>
        <strong>Sin resultados</strong>
        <p>{emptyMessage || 'No hay movimientos que coincidan con los filtros.'}</p>
      </div>
    );
  }

  return (
    <div className="table-wrap">
      <table className="table">
        <thead>
          <tr>
            <th>Movimiento</th>
            <th>Fecha</th>
            <th>Método</th>
            <th>Estado</th>
            <th className="right">Importe</th>
          </tr>
        </thead>
        <tbody>
          {items.map((movement) => {
            const color = CATEGORIES[movement.category]?.color || '#94a3b8';
            return (
              <tr key={movement.id}>
                <td>
                  <div className="mv">
                    <span
                      className="mv-dot"
                      style={{
                        background: `${color}1f`,
                        color,
                        borderColor: `${color}55`,
                      }}
                    >
                      {movement.description.charAt(0).toUpperCase()}
                    </span>
                    <div className="mv-text">
                      <span className="mv-name">{movement.description}</span>
                      <span className="mv-cat">{movement.category}</span>
                    </div>
                  </div>
                </td>
                <td className="muted nowrap">{dateShort(movement.date)}</td>
                <td className="muted nowrap">{movement.method}</td>
                <td>
                  <span
                    className={`status ${movement.status === 'Pendiente' ? 'pending' : 'done'}`}
                  >
                    <i />
                    {movement.status}
                  </span>
                </td>
                <td className={`right amount ${movement.type}`}>
                  {moneySigned(movement, privacy)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
