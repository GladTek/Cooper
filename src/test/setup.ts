import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';
import createFetchMock from 'vitest-fetch-mock';

// Mock fetch
const fetchMock = createFetchMock(vi);
fetchMock.enableMocks();

// IntersectionObserver Mock
class MockIntersectionObserver {
  observe = vi.fn();
  disconnect = vi.fn();
  unobserve = vi.fn();
}

Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  configurable: true,
  value: MockIntersectionObserver,
});

// ResizeObserver Mock
class MockResizeObserver {
  observe = vi.fn();
  disconnect = vi.fn();
  unobserve = vi.fn();
}

Object.defineProperty(window, 'ResizeObserver', {
  writable: true,
  configurable: true,
  value: MockResizeObserver,
});
