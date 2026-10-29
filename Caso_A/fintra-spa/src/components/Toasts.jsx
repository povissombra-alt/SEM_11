import { useApp } from '../context/AppContext';
import Icon from './Icons';

export default function Toasts() {
  const { toasts, dismissToast } = useApp();

  return (
    <div className="toasts" aria-live="polite" aria-atomic="false">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast toast--${toast.tone || 'info'}`}>
          <span className="toast-icon">
            <Icon
              name={
                toast.tone === 'success' ? 'check' : toast.tone === 'error' ? 'alert' : 'bell'
              }
              size={17}
            />
          </span>
          <div className="toast-body">
            <strong>{toast.title}</strong>
            {toast.message && <p>{toast.message}</p>}
          </div>
          <button
            type="button"
            className="icon-btn toast-close"
            onClick={() => dismissToast(toast.id)}
            aria-label="Cerrar aviso"
          >
            <Icon name="close" size={15} />
          </button>
        </div>
      ))}
    </div>
  );
}
