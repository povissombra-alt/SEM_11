import { Link } from 'react-router-dom';
import Icon from '../components/Icon';

export default function NotFound() {
  return (
    <div className="not-found">
      <span className="not-found-code">404</span>
      <div className="not-found-icon">
        <Icon name="search" size={28} />
      </div>
      <h2>Esta ruta no existe</h2>
      <p>
        Puede que el enlace esté roto o que la página se haya movido. La buena
        noticia: tu resumen sigue a un clic.
      </p>
      <Link to="/" className="button button-primary">
        <Icon name="arrowRight" size={17} />
        Volver al resumen
      </Link>
    </div>
  );
}
