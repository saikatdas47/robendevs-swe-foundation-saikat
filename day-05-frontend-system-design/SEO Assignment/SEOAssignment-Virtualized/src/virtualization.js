// Two columns. Keep at least 10 rows (20 cards), including nearby off-screen rows.
export function getWindow(productCount, width, scrollTop, viewportHeight) {
  const cardWidth = (width - 32 - 12) / 2; // 16px side padding, 12px column gap
  const cardHeight = cardWidth + 150; // square image/borders + fixed info area
  const rowStep = cardHeight + 16; // 16px row gap
  const rowCount = Math.ceil(productCount / 2);
  const windowRows = Math.max(10, Math.ceil(viewportHeight / rowStep) + 4);
  const firstVisibleRow = Math.floor(Math.max(0, scrollTop) / rowStep);
  const startRow = Math.min(Math.max(0, firstVisibleRow - 2), Math.max(0, rowCount - windowRows));

  return {
    cardWidth,
    cardHeight,
    rowStep,
    height: Math.max(0, rowCount * rowStep - 16),
    start: startRow * 2,
    end: Math.min(productCount, (startRow + windowRows) * 2),
  };
}
