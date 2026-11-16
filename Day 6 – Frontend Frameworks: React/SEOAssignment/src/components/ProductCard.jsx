import { Link } from 'react-router';
import { formatPrice } from '../api';
import ProductImage from './ProductImage';

export default function ProductCard({ product, priority }) {
  return (
    <li className="product-card">
      <Link to={`/products/${product.id}`} className="product-link">
        <div className="card-image">
          <ProductImage src={product.thumbnail} title={product.title} priority={priority} />
        </div>
        <div className="card-info">
          <p className="category">{product.category.replaceAll('-', ' ')}</p>
          <h2>{product.title}</h2>
          <p className="rating"><span aria-hidden="true">★</span> {product.rating.toFixed(1)} <span className="rating-label">/ 5</span></p>
          <p className="card-bottom"><strong>{formatPrice(product.price)}</strong></p>
        </div>
      </Link>
    </li>
  );
}
