import { useState, useEffect } from 'react';
import { api } from '../services/api';

export default function BlockchainExplorer() {
  const [transactions, setTransactions] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.getBlockchainTransactions(),
      api.getBlockchainStats()
    ]).then(([txs, s]) => {
      setTransactions(Array.isArray(txs) ? txs : []);
      setStats(s);
    }).catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Blockchain Explorer</h1>
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Transactions', value: stats.totalTransactions || 0, color: 'blue' },
            { label: 'Confirmed', value: stats.confirmedTransactions || 0, color: 'green' },
            { label: 'Products on Chain', value: stats.totalProducts || 0, color: 'purple' },
            { label: 'Network', value: stats.network || 'Ethereum', color: 'indigo' },
          ].map(stat => (
            <div key={stat.label} className={`bg-${stat.color}-50 rounded-xl p-4 border border-${stat.color}-100`}>
              <p className={`text-xs text-${stat.color}-600 font-semibold`}>{stat.label}</p>
              <p className={`text-2xl font-bold text-${stat.color}-700 mt-1`}>{stat.value}</p>
            </div>
          ))}
        </div>
      )}
      <div className="bg-white rounded-xl shadow">
        <div className="p-4 border-b">
          <h2 className="font-bold text-gray-800">Recent Transactions</h2>
        </div>
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading blockchain data...</div>
        ) : transactions.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-400 text-lg">No transactions yet</p>
            <p className="text-gray-400 text-sm mt-1">Transactions will appear here when products are registered on-chain</p>
          </div>
        ) : (
          <div className="divide-y">
            {transactions.map((tx, i) => (
              <div key={i} className="p-4 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800">{tx.eventType || 'Transaction'}</p>
                    <p className="text-xs font-mono text-gray-500 mt-1 truncate">{tx.transactionHash}</p>
                  </div>
                  <div className="ml-4 text-right">
                    <span className={`px-2 py-0.5 rounded-full text-xs ${tx.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {tx.status || 'PENDING'}
                    </span>
                    <p className="text-xs text-gray-400 mt-1">
                      {tx.timestamp ? new Date(tx.timestamp).toLocaleString() : 'Pending'}
                    </p>
                  </div>
                </div>
                {tx.blockNumber && (
                  <p className="text-xs text-gray-400 mt-1">Block #{tx.blockNumber}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
