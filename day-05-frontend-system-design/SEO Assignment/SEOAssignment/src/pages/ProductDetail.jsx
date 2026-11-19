import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router';
import { formatPrice, getProduct } from '../api';
import ProductImage from '../components/ProductImage';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    window.scrollTo(0, 0);
    document.title = 'Product details — Little Market';
    async function loadProduct() {
      setLoading(true);
      setError('');
      setProduct(null);
      try {
        const result = await getProduct(id, controller.signal);
        if (controller.signal.aborted) return;
        setProduct(result);
        document.title = `${result.title} — Little Market`;
      } catch (failure) {
        if (!controller.signal.aborted) setError(failure.message);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }
    loadProduct();
    return () => controller.abort();
  }, [id, attempt]);

  return (
    <main id="main" className="detail-page">
      <Link className="back-link" to="/">← Back to collection</Link>
      {loading && <div className="detail-loading" role="status">Loading your find…</div>}
      {error && <div className="message"><h1>Couldn’t open this product</h1><p role="alert" className="error">{error}</p><button onClick={() => setAttempt(attempt + 1)}>Try again</button></div>}
      {product && <article>
        <div className="detail-image"><ProductImage key={product.id} src={product.images?.[0] || product.thumbnail} title={product.title} priority /></div>
        <div className="detail-info">
          <p className="eyebrow">{product.category.replaceAll('-', ' ')}{product.brand ? ` / ${product.brand}` : ''}</p>
          <h1>{product.title}</h1>
          <p className="rating"><span aria-hidden="true">★</span> {product.rating.toFixed(1)} out of 5</p>
          <div className="detail-price"><strong>{formatPrice(product.price)}</strong><span className="stock">{product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}</span></div>
          <p className="description">{product.description}</p>
          <dl className="facts">
            <div><dt>Availability</dt><dd>{product.availabilityStatus || 'Not specified'}</dd></div>
            <div><dt>Shipping</dt><dd>{product.shippingInformation || 'Not specified'}</dd></div>
            <div><dt>Returns</dt><dd>{product.returnPolicy || 'Not specified'}</dd></div>
            <div><dt>Warranty</dt><dd>{product.warrantyInformation || 'Not specified'}</dd></div>
          </dl>
        </div>
      </article>}
    </main>
  );
}
