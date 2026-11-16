import test from 'node:test';
import assert from 'node:assert/strict';
import { getWindow } from '../src/virtualization.js';

test('200 loaded products mount 20 initially, then discard earlier rows on scroll', () => {
  const top = getWindow(200, 390, 0, 844);
  assert.equal(top.start, 0);
  assert.equal(top.end, 20);
  const middle = getWindow(200, 390, top.rowStep * 30, 844);
  assert.equal(middle.start, 56);
  assert.equal(middle.end - middle.start, 20);
  assert.equal(middle.height, top.height); // DOM removal must not shrink scroll space.
});

test('last short batch is included and upward scrolling restores the start', () => {
  const bottom = getWindow(45, 390, 99999, 844);
  assert.equal(bottom.start, 26);
  assert.equal(bottom.end, 45);
  const top = getWindow(45, 390, 0, 844);
  assert.equal(top.start, 0);
  assert.equal(top.end, 20);
});

test('empty lists, narrow screens and tall screens stay in bounds', () => {
  assert.equal(getWindow(0, 320, 0, 844).height, 0);
  for (const width of [320, 390, 480]) {
    const view = getWindow(201, width, 2000, 6000);
    assert.ok(view.cardWidth > 0);
    assert.ok(view.start >= 0 && view.end <= 201);
    assert.ok(view.end - view.start >= Math.ceil(6000 / view.rowStep) * 2);
  }
});
