import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="page">
      <div className="empty-state">
        <span className="empty-emoji">🎵</span>
        <h3>Esta página no existe</h3>
        <p>La ruta que intentaste abrir no forma parte de la aplicación.</p>
        <Link to="/" className="btn btn-primary">
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}
