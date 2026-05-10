const API_BASE = import.meta.env.VITE_API_URL || 'https://chainmed-backend.up.railway.app';

async function request(path, options = {}) {
  try {
    const resp = await fetch(API_BASE + path, {
      headers: { 'Content-Type': 'application/json', ...options.headers },
      ...options
    });
    if (!resp.ok) throw new Error('HTTP ' + resp.status);
    return resp.json();
  } catch (err) {
    console.warn('API error:', path, err.message);
    throw err;
  }
}

export const api = {
  // Products
  getProducts: () => request('/api/products'),
  getProduct: (id) => request('/api/products/' + id),
  registerProduct: (data) => request('/api/products', { method: 'POST', body: JSON.stringify(data) }),
  updateStatus: (id, status, data) => request('/api/products/' + id + '/status', { method: 'PUT', body: JSON.stringify({ status, ...data }) }),
  trackProduct: (query) => request('/api/products/track?q=' + encodeURIComponent(query)),
  searchProducts: (q) => request('/api/products/search?q=' + encodeURIComponent(q)),

  // Events / History
  getProductEvents: (id) => request('/api/products/' + id + '/history'),
  addEvent: (id, event) => request('/api/products/' + id + '/events', { method: 'POST', body: JSON.stringify(event) }),

  // Blockchain
  getBlockchainTransactions: () => request('/api/blockchain/transactions'),
  getBlockchainStats: () => request('/api/blockchain/stats'),
  verifyProduct: (id) => request('/api/blockchain/verify/' + id),

  // Stats
  getStats: () => request('/api/stats'),
  getDashboardStats: () => request('/api/stats/dashboard'),
};
