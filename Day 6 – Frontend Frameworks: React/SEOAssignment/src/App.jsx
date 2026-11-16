import { lazy, Suspense } from 'react';
import { Link, Route, Routes } from 'react-router';
import ProductList from './pages/ProductList';

// Download the detail page JavaScript only when it is needed.
const ProductDetail = lazy(() => import('./pages/ProductDetail'));

export default function App() {
  return (
    <div className="app-shell">
      <a className="skip-link" href="#main">Skip to content</a>
      <header className="site-header">
        <Link className="brand" to="/" aria-label="Little Market home">
          Products
        </Link>
      </header>
      <Suspense fallback={<main id="main" className="message" role="status">Opening product…</main>}>
        <Routes>
          <Route path="/" element={<ProductList />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="*" element={<main id="main" className="message"><h1>Page not found</h1><Link to="/">Back to products</Link></main>} />
        </Routes>
      </Suspense>
    </div>
  );
}
