import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Package, Truck, Shield, Activity, AlertTriangle, CheckCircle } from 'lucide-react';
import { api } from '../services/api';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [recentProducts, setRecentProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.getDashboardStats().catch(() => null),
      api.getProducts().catch(() => [])
    ]).then(([statsData, products]) => {
      setStats(statsData);
      setRecentProducts(Array.isArray(products) ? products.slice(0, 5) : []);
    }).finally(() => setLoading(false));
  }, []);

  const statCards = [
    {
      label: 'Total Products',
      value: stats?.totalProducts ?? '—',
      icon: Package,
      color: 'blue',
      link: '/products'
    },
    {
      label: 'In Transit',
      value: stats?.inTransit ?? '—',
      icon: Truck,
      color: 'yellow',
      link: '/products'
    },
    {
      label: 'Delivered',
      value: stats?.delivered ?? '—',
      icon: CheckCircle,
      color: 'green',
      link: '/products'
    },
    {
      label: 'Blockchain Records',
      value: stats?.blockchainRecords ?? '—',
      icon: Shield,
      color: 'purple',
      link: '/blockchain'
    },
  ];

  const chartData = stats?.monthlyData || [
    { month: 'Jan', registered: 0, delivered: 0 },
    { month: 'Feb', registered: 0, delivered: 0 },
    { month: 'Mar', registered: 0, delivered: 0 },
    { month: 'Apr', registered: 0, delivered: 0 },
    { month: 'May', registered: 0, delivered: 0 },
  ];

  const statusColors = {
    REGISTERED: 'bg-blue-100 text-blue-700',
    IN_TRANSIT: 'bg-yellow-100 text-yellow-700',
    DELIVERED: 'bg-green-100 text-green-700',
    RECALLED: 'bg-red-100 text-red-700',
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <Link to="/register"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm">
          + Register Product
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading dashboard...</div>
      ) : (
        <>
          {/* Stat Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {statCards.map(card => {
              const Icon = card.icon;
              return (
                <Link key={card.label} to={card.link}
                  className="bg-white rounded-xl shadow p-4 hover:shadow-md transition">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-500">{card.label}</span>
                    <Icon className={`w-5 h-5 text-${card.color}-500`} />
                  </div>
                  <p className={`text-2xl font-bold text-${card.color}-600`}>{card.value}</p>
                </Link>
              );
            })}
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow p-5">
              <h2 className="font-semibold text-gray-800 mb-4">Monthly Activity</h2>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="registered" fill="#3b82f6" name="Registered" />
                  <Bar dataKey="delivered" fill="#22c55e" name="Delivered" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-xl shadow p-5">
              <h2 className="font-semibold text-gray-800 mb-4">Recent Products</h2>
              {recentProducts.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-40 text-gray-400">
                  <Package className="w-10 h-10 mb-2 opacity-30" />
                  <p>No products yet</p>
                  <Link to="/register" className="mt-2 text-blue-500 text-sm hover:underline">
                    Register your first product
                  </Link>
                </div>
              ) : (
                <div className="space-y-2">
                  {recentProducts.map(p => (
                    <Link key={p.id} to={`/products/${p.id}`}
                      className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-gray-50">
                      <div>
                        <p className="font-medium text-sm text-gray-800">{p.name}</p>
                        <p className="text-xs text-gray-400">{p.batchNumber}</p>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-xs ${statusColors[p.status] || 'bg-gray-100 text-gray-600'}`}>
                        {p.status || 'REGISTERED'}
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl p-6 text-white">
            <h2 className="font-bold text-lg mb-2">ChainMed - Powered by Ethereum</h2>
            <p className="text-blue-100 text-sm mb-4">
              Every product registration and status update is permanently recorded on the Ethereum blockchain,
              ensuring complete transparency and immutability of your medical supply chain.
            </p>
            <div className="flex gap-3">
              <Link to="/register"
                className="bg-white text-blue-600 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-50 transition">
                Register Product
              </Link>
              <Link to="/blockchain"
                className="border border-white text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-white hover:text-blue-600 transition">
                View Blockchain
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
