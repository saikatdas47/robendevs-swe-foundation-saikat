import { useCallback, useEffect, useRef, useState } from 'react';
import { BATCH_SIZE, getProducts } from '../api';
import VirtualProductGrid from '../components/VirtualProductGrid';

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [hasMore, setHasMore] = useState(true);
  const [total, setTotal] = useState(null);
  const nextSkip = useRef(0);
  const busy = useRef(false);
  const finished = useRef(false);
  const controller = useRef(null);
  const sentinel = useRef(null);

  const loadMore = useCallback(async () => {
    // A ref changes immediately, unlike a state update: block repeated observer calls.
    if (busy.current || finished.current) return;
    busy.current = true;
    setLoading(true);
    setError('');
    const request = new AbortController();
    controller.current = request;
    try {
      const skip = nextSkip.current;
      // Both pages must succeed before committing this cycle. Retry uses the same skip.
      const [first, second] = await Promise.all([
        getProducts(skip, request.signal),
        getProducts(skip + BATCH_SIZE, request.signal),
      ]);
      if (request.signal.aborted) return;
      const incoming = [...first.products, ...second.products];
      setProducts(previous => {
        const seen = new Set(previous.map(product => product.id));
        return [...previous, ...incoming.filter(product => {
          if (seen.has(product.id)) return false;
          seen.add(product.id);
          return true;
        })];
      });
      nextSkip.current = skip + BATCH_SIZE * 2;
      setTotal(first.total);
      finished.current = nextSkip.current >= first.total || incoming.length === 0;
      setHasMore(!finished.current);
    } catch (failure) {
      if (!request.signal.aborted) {
        request.abort(); // Also stop the other page if it is still in flight.
        setError(failure.message || 'Something went wrong. Please try again.');
      }
    } finally {
      busy.current = false;
      // On unmount the request is aborted; no UI updates are needed.
      if (controller.current === request) setLoading(false);
    }
  }, []);

  useEffect(() => {
    document.title = 'Little Market — Everyday finds';
    loadMore();
    return () => {
      controller.current?.abort();
      controller.current = null;
    };
  }, [loadMore]);

  useEffect(() => {
    if (loading || error || !hasMore || !('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) loadMore();
    }, { rootMargin: '300px' });
    if (sentinel.current) observer.observe(sentinel.current);
    return () => observer.disconnect();
  }, [loading, error, hasMore, loadMore]);

  return (
    <main id="main" className="virtual-page">
      <div className="section-heading">
        <h1>All products</h1>
        {total !== null && <span>{total} products</span>}
      </div>
      {products.length > 0 ? (
        <VirtualProductGrid products={products} loading={loading} />
      ) : (
        <ul className="product-grid" aria-label="Products" aria-busy={loading}>
          {loading && Array.from({ length: BATCH_SIZE * 2 }, (_, index) => (
            <li key={index} className="product-card skeleton" aria-hidden="true">
              <div className="card-image" />
              <div className="card-info">
                <p className="category">&nbsp;</p>
                <h2>&nbsp;</h2>
                <p className="rating">&nbsp;</p>
                <p className="card-bottom"><strong>&nbsp;</strong></p>
              </div>
            </li>
          ))}
        </ul>
      )}
      <div ref={sentinel} className="load-area">
        <p role="status" aria-live="polite">{loading ? 'Loading products…' : !hasMore ? `You’ve seen all ${products.length} products. Thanks for exploring!` : `${products.length} products loaded`}</p>
        {error && <p role="alert" className="error">{error}</p>}
        {!loading && hasMore && <button onClick={loadMore}>{error ? 'Try again' : 'Load more products'} <span aria-hidden="true">↓</span></button>}
      </div>
    </main>
  );
}
