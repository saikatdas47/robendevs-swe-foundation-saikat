import { useLayoutEffect, useRef, useState } from 'react';
import { getWindow } from '../virtualization';
import ProductCard from './ProductCard';

export default function VirtualProductGrid({ products, loading }) {
  const list = useRef(null);
  const [view, setView] = useState({ width: 480, start: 0, end: 20 });
  const [focusedIndex, setFocusedIndex] = useState(null);
  const [pendingFocus, setPendingFocus] = useState(null);

  useLayoutEffect(() => {
    let frame = null;
    function updateWindow() {
      frame = null;
      const box = list.current.getBoundingClientRect();
      const next = getWindow(products.length, box.width, -box.top, window.innerHeight);
      setView(previous => {
        if (previous.width === box.width && previous.start === next.start && previous.end === next.end) return previous;
        return { width: box.width, start: next.start, end: next.end };
      });
    }
    function scheduleUpdate() {
      if (frame === null) frame = requestAnimationFrame(updateWindow);
    }
    updateWindow();
    const resizeObserver = new ResizeObserver(scheduleUpdate);
    resizeObserver.observe(list.current);
    window.addEventListener('scroll', scheduleUpdate, { passive: true });
    window.addEventListener('resize', scheduleUpdate);
    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('scroll', scheduleUpdate);
      window.removeEventListener('resize', scheduleUpdate);
      if (frame !== null) cancelAnimationFrame(frame);
    };
  }, [products.length]);

  // Tab can move to a loaded card just outside the current virtual window.
  useLayoutEffect(() => {
    if (pendingFocus === null) return;
    list.current.querySelector(`[data-index="${pendingFocus}"] a`)?.focus();
    setPendingFocus(null);
  }, [pendingFocus]);

  const geometry = getWindow(products.length, view.width, 0, 0);
  const indices = [];
  for (let index = view.start; index < Math.min(view.end, products.length); index++) indices.push(index);
  // Do not remove a keyboard-focused card while the user scrolls away from it.
  if (focusedIndex !== null && focusedIndex < products.length && !indices.includes(focusedIndex)) {
    indices.push(focusedIndex);
    indices.sort((a, b) => a - b);
  }

  function handleKeyDown(event) {
    if (event.key !== 'Tab' || event.altKey || event.ctrlKey || event.metaKey) return;
    const card = event.target.closest('[data-index]');
    if (!card) return;
    const next = Number(card.dataset.index) + (event.shiftKey ? -1 : 1);
    if (next < 0 || next >= products.length) return; // Let Tab leave the list normally.
    event.preventDefault();
    setFocusedIndex(next);
    setPendingFocus(next);
  }

  return (
    <ul ref={list} className="product-grid virtual-grid" aria-label="Products" aria-busy={loading}
      style={{ height: geometry.height }} onKeyDown={handleKeyDown}
      onFocusCapture={event => {
        const card = event.target.closest('[data-index]');
        if (card) setFocusedIndex(Number(card.dataset.index));
      }}
      onBlurCapture={event => {
        if (!event.currentTarget.contains(event.relatedTarget)) setFocusedIndex(null);
      }}>
      {indices.map(index => <ProductCard key={products[index].id} product={products[index]}
        priority={index === 0} index={index} total={products.length}
        style={{
          width: geometry.cardWidth,
          height: geometry.cardHeight,
          top: Math.floor(index / 2) * geometry.rowStep,
          left: 16 + (index % 2) * (geometry.cardWidth + 12),
        }} />)}
    </ul>
  );
}
