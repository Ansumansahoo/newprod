import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.getProduct(id),
      api.getProductEvents(id)
    ]).then(([p, e]) => {
      setProduct(p);
      setEvents(Array.isArray(e) ? e : []);
    }).catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="text-center py-12 text-gray-500">Loading...</div>;
  if (!product) return <div className="text-center py-12 text-red-500">Product not found</div>;

  const statusColors = {
    REGISTERED: 'bg-blue-100 text-blue-700',
    IN_TRANSIT: 'bg-yellow-100 text-yellow-700',
    DELIVERED: 'bg-green-100 text-green-700',
    RECALLED: 'bg-red-100 text-red-700'
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/products" className="text-blue-600 hover:underline text-sm">← Back to Products</Link>
      </div>
      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
            <p className="text-gray-500 mt-1">Batch: {product.batchNumber}</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${statusColors[product.status] || 'bg-gray-100 text-gray-700'}`}>
            {product.status}
          </span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          {[
            { label: 'Manufacturer', value: product.manufacturer },
            { label: 'Category', value: product.category },
            { label: 'Quantity', value: product.quantity },
            { label: 'Expiry Date', value: product.expiryDate ? new Date(product.expiryDate).toLocaleDateString() : 'N/A' }
          ].map(item => (
            <div key={item.label} className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-500">{item.label}</p>
              <p className="font-semibold text-gray-800 mt-1">{item.value || 'N/A'}</p>
            </div>
          ))}
        </div>
        {product.blockchainTxHash && (
          <div className="mt-4 p-3 bg-purple-50 rounded-lg">
            <p className="text-xs text-purple-600 font-semibold">Blockchain Transaction</p>
            <p className="text-xs text-gray-600 mt-1 font-mono break-all">{product.blockchainTxHash}</p>
          </div>
        )}
      </div>
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-lg font-bold text-gray-800 mb-4">Supply Chain Timeline</h2>
        {events.length === 0 ? (
          <p className="text-gray-400 text-sm">No events recorded yet</p>
        ) : (
          <div className="space-y-3">
            {events.map((event, i) => (
              <div key={i} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-3 h-3 rounded-full bg-blue-500 mt-1"></div>
                  {i < events.length - 1 && <div className="w-0.5 h-full bg-gray-200 mt-1"></div>}
                </div>
                <div className="pb-4">
                  <p className="font-semibold text-sm text-gray-800">{event.eventType}</p>
                  <p className="text-xs text-gray-500">{event.location} · {event.handledBy}</p>
                  <p className="text-xs text-gray-400 mt-1">{event.timestamp ? new Date(event.timestamp).toLocaleString() : ''}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
