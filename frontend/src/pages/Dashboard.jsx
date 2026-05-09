import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Package, Truck, Shield, Activity, AlertTriangle, CheckCircle, Clock, Zap } from 'lucide-react';
import { apiService } from '../services/api';
import { useBlockchain } from '../hooks/useBlockchain';

const STATUS_COLORS = {
  MANUFACTURED: '#3b82f6',
  IN_TRANSIT_TO_DISTRIBUTOR: '#8b5cf6',
  AT_DISTRIBUTOR: '#06b6d4',
  IN_TRANSIT_TO_PHARMACY: '#f59e0b',
  AT_PHARMACY: '#10b981',
  IN_TRANSIT_TO_HOSPITAL: '#ef4444',
  AT_HOSPITAL: '#22c55e',
  DISPENSED: '#6b7280',
  RECALLED: '#dc2626',
};

export default function Dashboard() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: apiService.getStats,
  });

  const { blockNumber, isConnected, contractAddress } = useBlockchain();

  const statCards = [
    {
      title: 'Total Products',
      value: stats?.totalProducts || 0,
      icon: Package,
      color: 'text-blue-400',
      bg: 'bg-blue-900/20',
      border: 'border-blue-800',
    },
    {
      title: 'In Transit',
      value: stats?.inTransit || 0,
      icon: Truck,
      color: 'text-purple-400',
      bg: 'bg-purple-900/20',
      border: 'border-purple-800',
    },
    {
      title: 'Verified on Chain',
      value: stats?.verifiedOnChain || 0,
      icon: Shield,
      color: 'text-green-400',
      bg: 'bg-green-900/20',
      border: 'border-green-800',
    },
    {
      title: 'Recalled',
      value: stats?.recalled || 0,
      icon: AlertTriangle,
      color: 'text-red-400',
      bg: 'bg-red-900/20',
      border: 'border-red-800',
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">ChainMed Dashboard</h1>
          <p className="text-slate-400 mt-1">Decentralized Medical Supply Chain Overview</p>
        </div>
        <div className="flex items-center gap-2">
          {isConnected ? (
            <span className="flex items-center gap-1.5 px-3 py-1.5 bg-green-900/30 border border-green-700 rounded-full text-green-400 text-sm">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              Blockchain Connected
            </span>
          ) : (
            <span className="flex items-center gap-1.5 px-3 py-1.5 bg-yellow-900/30 border border-yellow-700 rounded-full text-yellow-400 text-sm">
              <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
              Connecting...
            </span>
          )}
        </div>
      </div>

      {/* Blockchain Info Bar */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2 text-sm">
          <Zap className="w-4 h-4 text-yellow-400" />
          <span className="text-slate-400">Block:</span>
          <span className="text-white font-mono">#{blockNumber || '...'}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Activity className="w-4 h-4 text-blue-400" />
          <span className="text-slate-400">Network:</span>
          <span className="text-white">Ethereum (Local / Sepolia)</span>
        </div>
        <div className="flex items-center gap-2 text-sm flex-1 min-w-0">
          <CheckCircle className="w-4 h-4 text-green-400 shrink-0" />
          <span className="text-slate-400 shrink-0">Contract:</span>
          <span className="text-green-400 font-mono text-xs truncate">{contractAddress || '0x5FbDB231...180aa3'}</span>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <div key={card.title} className={`${card.bg} border ${card.border} rounded-xl p-5 space-y-3`}>
            <div className="flex items-center justify-between">
              <p className="text-slate-400 text-sm">{card.title}</p>
              <card.icon className={`w-5 h-5 ${card.color}`} />
            </div>
            <p className={`text-3xl font-bold text-white`}>{card.value.toLocaleString()}</p>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Status Distribution */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Product Status Distribution</h2>
          {stats?.statusBreakdown ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={stats.statusBreakdown}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 11 }} angle={-20} textAnchor="end" height={50} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#f1f5f9' }} />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {stats.statusBreakdown.map((entry, i) => (
                    <Cell key={i} fill={STATUS_COLORS[entry.status] || '#3b82f6'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-64 flex items-center justify-center text-slate-500">
              No data available
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Recent Activity</h2>
            <Link to="/products" className="text-blue-400 text-sm hover:text-blue-300">View all</Link>
          </div>
          <div className="space-y-3">
            {(stats?.recentActivity || []).map((activity, i) => (
              <div key={i} className="flex items-start gap-3 py-2 border-b border-slate-700/50 last:border-0">
                <div className="w-2 h-2 rounded-full mt-2 shrink-0" style={{ backgroundColor: STATUS_COLORS[activity.status] || '#3b82f6' }}></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white truncate">{activity.productName}</p>
                  <p className="text-xs text-slate-400">{activity.status.replace(/_/g, ' ')} • {activity.location}</p>
                </div>
                <div className="text-xs text-slate-500 shrink-0">
                  {activity.timeAgo}
                </div>
              </div>
            ))}
            {!stats?.recentActivity?.length && (
              <p className="text-slate-500 text-sm text-center py-8">No recent activity</p>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link to="/register" className="bg-blue-600 hover:bg-blue-500 transition-colors rounded-xl p-5 flex items-center gap-3">
          <Package className="w-8 h-8 text-blue-200" />
          <div>
            <p className="text-white font-semibold">Register Product</p>
            <p className="text-blue-200 text-sm">Add new pharmaceutical to blockchain</p>
          </div>
        </Link>
        <Link to="/track" className="bg-purple-600 hover:bg-purple-500 transition-colors rounded-xl p-5 flex items-center gap-3">
          <Truck className="w-8 h-8 text-purple-200" />
          <div>
            <p className="text-white font-semibold">Track Product</p>
            <p className="text-purple-200 text-sm">Verify product on blockchain</p>
          </div>
        </Link>
        <Link to="/blockchain" className="bg-green-600 hover:bg-green-500 transition-colors rounded-xl p-5 flex items-center gap-3">
          <Shield className="w-8 h-8 text-green-200" />
          <div>
            <p className="text-white font-semibold">Blockchain Explorer</p>
            <p className="text-green-200 text-sm">View on-chain transactions</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
