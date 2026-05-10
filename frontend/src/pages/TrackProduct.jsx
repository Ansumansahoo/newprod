import { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';

export default function TrackProduct() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async e => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setError('');
    setResults(null);
    try {
      const data = await api.trackProduct(query.trim());
      setResults(data);
    } catch (err) {
      setError('Product not found. Please check the batch number or ID.');
    } finally {
      setLoading(false);
    }
  };

  const statusColors = {
    REGISTERED: 'bg-blue-100 text-blue-700',
    IN_TRANSIT: 'bg-yellow-100 text-yellow-700',
    DELIVERED: 'bg-green-100 text-green-700',
    RECALLED: 'bg-red-100 text-red-700'
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Track Product</h1>
      <div className="bg-white rounded-xl shadow p-6">
        <form onSubmit={handleSearch} className="flex gap-3">
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Enter batch number or product ID..."
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button type="submit" disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition">
            {loading ? 'Tracking...' : 'Track'}
          </button>
        </form>
        {error && (
          <div className="mt-4 p-3 bg-red-50 rounded-lg text-red-600 text-sm">{error}</div>
        )}
      </div>
      {results && (
        <div className="bg-white rounded-xl shadow p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-800">{results.name}</h2>
            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${statusColors[results.status] || 'bg-gray-100 text-gray-700'}`}>
              {results.status}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Batch Number', value: results.batchNumber },
              { label: 'Manufacturer', value: results.manufacturer },
              { label: 'Category', value: results.category },
              { label: 'Quantity', value: results.quantity },
            ].map(item => (
              <div key={item.label} className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-500">{item.label}</p>
                <p className="font-semibold text-gray-800">{item.value || 'N/A'}</p>
              </div>
            ))}
          </div>
          {results.blockchainTxHash && (
            <div className="p-3 bg-purple-50 rounded-lg">
              <p className="text-xs text-purple-600 font-semibold">Blockchain Verified</p>
              <p className="text-xs font-mono text-gray-600 mt-1 break-all">{results.blockchainTxHash}</p>
            </div>
          )}
          <Link to={`/products/${results.id}`}
            className="block text-center text-blue-600 hover:underline text-sm mt-2">
            View full supply chain history →
          </Link>
        </div>
      )}
    </div>
  );
}
