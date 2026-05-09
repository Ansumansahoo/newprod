import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS || '0x5FbDB2315678afecb367f032d93F642f64180aa3';
const RPC_URL = import.meta.env.VITE_RPC_URL || 'http://localhost:8545';

// Minimal ABI for frontend interaction
const SUPPLY_CHAIN_ABI = [
  "function getProduct(uint256 productId) view returns (tuple(uint256 id, string name, string batchNumber, string manufacturer, uint256 manufactureDate, uint256 expiryDate, uint8 currentStatus, address currentHolder, bool isAuthentic, bool exists))",
  "function getProductHistory(uint256 productId) view returns (tuple(uint256 productId, uint8 status, address actor, string location, uint256 timestamp, string notes)[])",
  "function verifyProduct(uint256 productId) view returns (bool isAuthentic, bool isExpired, uint8 currentStatus)",
  "function productCount() view returns (uint256)",
  "function getActor(address actorAddress) view returns (string name, uint8 role, bool isActive)",
  "event ProductRegistered(uint256 indexed productId, string name, string batchNumber, address manufacturer)",
  "event StatusUpdated(uint256 indexed productId, uint8 newStatus, address actor, string location)"
];

export function useBlockchain() {
  const [provider, setProvider] = useState(null);
  const [contract, setContract] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [blockNumber, setBlockNumber] = useState(null);
  const [contractAddress] = useState(CONTRACT_ADDRESS);
  const [error, setError] = useState(null);

  useEffect(() => {
    const init = async () => {
      try {
        const jsonProvider = new ethers.JsonRpcProvider(RPC_URL);
        const supplyChainContract = new ethers.Contract(
          CONTRACT_ADDRESS,
          SUPPLY_CHAIN_ABI,
          jsonProvider
        );
        
        // Test connection
        const bn = await jsonProvider.getBlockNumber();
        setBlockNumber(bn);
        setProvider(jsonProvider);
        setContract(supplyChainContract);
        setIsConnected(true);

        // Subscribe to new blocks
        jsonProvider.on('block', (newBlockNumber) => {
          setBlockNumber(newBlockNumber);
        });
      } catch (err) {
        console.error('Blockchain connection error:', err);
        setError(err.message);
        setIsConnected(false);
      }
    };

    init();
    return () => {
      if (provider) {
        provider.removeAllListeners();
      }
    };
  }, []);

  const verifyProduct = async (productId) => {
    if (!contract) throw new Error('Not connected to blockchain');
    const result = await contract.verifyProduct(productId);
    return {
      isAuthentic: result.isAuthentic,
      isExpired: result.isExpired,
      status: Number(result.currentStatus),
    };
  };

  const getProductHistory = async (productId) => {
    if (!contract) throw new Error('Not connected to blockchain');
    const history = await contract.getProductHistory(productId);
    return history.map(event => ({
      productId: Number(event.productId),
      status: Number(event.status),
      actor: event.actor,
      location: event.location,
      timestamp: new Date(Number(event.timestamp) * 1000),
      notes: event.notes,
    }));
  };

  const getProductCount = async () => {
    if (!contract) return 0;
    return Number(await contract.productCount());
  };

  return {
    provider,
    contract,
    isConnected,
    blockNumber,
    contractAddress,
    error,
    verifyProduct,
    getProductHistory,
    getProductCount,
  };
}

export default useBlockchain;
