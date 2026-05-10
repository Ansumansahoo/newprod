import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.getProducts()
      .then(data => setProducts(Array.isArray(data) ? data : []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = products.filter(p =>
    p.name?.toLowerCase().includes(search.toLowerCase()) ||
    p.batchNumber?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Products</h1>
        <Link to="/register" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
          + Register Product
        </Link>
      </div>
      <input
        type="text"
        placeholder="Search products..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading products...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p className="text-lg">No products found</p>
          <p className="text-sm mt-2">Register a new product to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(product => (
            <Link key={product.id} to={`/products/${product.id}`}
              className="bg-white rounded-xl shadow p-5 hover:shadow-md transition">
              <div className="flex items-center justify-between mb-3">
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                  product.status === 'DELIVERED' ? 'bg-green-100 text-green-700' :
                  product.status === 'IN_TRANSIT' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-blue-100 text-blue-700'
                }`}>{product.status || 'REGISTERED'}</span>
                <span className="text-xs text-gray-400">{product.batchNumber}</span>
              </div>
              <h3 className="font-semibold text-gray-800">{product.name}</h3>
              <p className="text-sm text-gray-500 mt-1">{product.manufacturer}</p>
              <p className="text-xs text-gray-400 mt-2">
                Expires: {product.expiryDate ? new Date(product.expiryDate).toLocaleDateString() : 'N/A'}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
