import React, { useState, useEffect, useLayoutEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiDollarSign, FiArrowUp, FiArrowDown, FiArrowRight, FiClock, FiCheckCircle, FiAlertCircle, FiSend } from 'react-icons/fi';
import { vendorTheme as themeColors } from '../../../../theme';
import BottomNav from '../../components/layout/BottomNav';
import LogoLoader from '../../../../components/common/LogoLoader';
import vendorWalletService from '../../../../services/vendorWalletService';
import { toast } from 'react-hot-toast';

const Wallet = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [wallet, setWallet] = useState({
    balance: 0,
    dues: 0,
    earnings: 0,
    amountDue: 0,
    totalCashCollected: 0,
    totalSettled: 0,
    totalWithdrawn: 0,
    pendingSettlements: 0,
    cashLimit: 10000
  });
  const [transactions, setTransactions] = useState([]);
  const [filter, setFilter] = useState('all');

  useLayoutEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const root = document.getElementById('root');
    const bgStyle = themeColors.backgroundGradient;

    if (html) html.style.background = bgStyle;
    if (body) body.style.background = bgStyle;
    if (root) root.style.background = bgStyle;

    return () => {
      if (html) html.style.background = '';
      if (body) body.style.background = '';
      if (root) root.style.background = '';
    };
  }, []);

  useEffect(() => {
    loadWalletData();
  }, []);

  const loadWalletData = async () => {
    try {
      setLoading(true);
      const [walletRes, txnRes] = await Promise.all([
        vendorWalletService.getWallet(),
        vendorWalletService.getTransactions({ limit: 50 })
      ]);

      if (walletRes.success) {
        setWallet(walletRes.data);
      }

      if (txnRes.success) {
        setTransactions(txnRes.data || []);
      }
    } catch (error) {
      console.error('Error loading wallet:', error);
      toast.error('Failed to load wallet data');
    } finally {
      setLoading(false);
    }
  };

  const filteredTransactions = transactions.filter(txn => {
    if (filter === 'all') return true;
    return txn.type === filter;
  });

  const getTransactionIcon = (type) => {
    switch (type) {
      case 'cash_collected':
        return <FiArrowDown className="w-5 h-5 text-red-500" />;
      case 'earnings_credit':
        return <FiArrowUp className="w-5 h-5 text-green-500" />;
      case 'settlement':
        return <FiSend className="w-5 h-5 text-blue-500" />;
      case 'withdrawal':
        return <FiDollarSign className="w-5 h-5 text-purple-500" />;
      case 'tds_deduction':
        return <FiAlertCircle className="w-5 h-5 text-amber-500" />;
      case 'commission':
        return <FiDollarSign className="w-5 h-5 text-orange-500" />;
      case 'platform_fee':
        return <FiAlertCircle className="w-5 h-5 text-rose-500" />;
      default:
        return <FiDollarSign className="w-5 h-5 text-gray-500" />;
    }
  };

  const getTransactionLabel = (type) => {
    switch (type) {
      case 'cash_collected':
        return 'Cash Collected';
      case 'earnings_credit':
        return 'Earnings Credited';
      case 'settlement':
        return 'Settlement Paid';
      case 'withdrawal':
        return 'Withdrawal Payout';
      case 'tds_deduction':
        return 'TDS Deduction';
      case 'commission':
        return 'Commission';
      case 'platform_fee':
        return 'Platform Charge';
      default:
        return type;
    }
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  if (loading) {
    return <LogoLoader />;
  }

  return (
    <div className="min-h-screen pb-24" style={{ background: '#FFFFFF' }}>
      <header className="px-6 py-5 flex items-center justify-between bg-transparent">
        <h1 className="text-xl font-black text-gray-900">Wallet & Ledger</h1>
        <div className="w-10 h-10 rounded-2xl bg-white shadow-sm flex items-center justify-center border border-gray-100">
          <FiDollarSign className="w-5 h-5 text-black" />
        </div>
      </header>

      <main className="px-5 pt-8">
        {/* Simple Total Earnings Card */}
        <div 
          className="rounded-[40px] p-10 shadow-2xl shadow-[#0F4A44]/20 mb-10 relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #0F4A44 0%, #0D3D38 100%)' }}
        >
          {/* Ambient Glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl" />
          
          <div className="relative z-10 text-center">
            <div className="flex flex-col items-center gap-2 mb-6">
              <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-xl border border-white/10 mb-2">
                <FiDollarSign className="w-7 h-7 text-white" />
              </div>
              <p className="text-[12px] font-black text-white/50 uppercase tracking-[0.3em]">Total Earnings</p>
            </div>            
            
            <h2 className="text-5xl font-black text-white tracking-tighter mb-4">
              ₹{wallet.earnings.toLocaleString()}
            </h2>
            
            <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full border border-white/5 backdrop-blur-md mb-8">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              <span className="text-[10px] font-black text-white uppercase tracking-widest">Life-time profit</span>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => navigate('/vendor/wallet/settle')}
                className="flex-1 bg-white text-[#0F4A44] py-4 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] shadow-xl shadow-black/20 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                Settle Dues <FiSend className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-10">
          <div className="bg-white rounded-[32px] p-6 shadow-sm border border-black/5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-[#0F4A44]/5 flex items-center justify-center">
                <FiArrowDown className="w-4 h-4 text-[#0F4A44]" />
              </div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Cash Kept</p>
            </div>
            <p className="text-xl font-black text-gray-900 tracking-tight">₹{wallet.totalCashCollected?.toLocaleString() || 0}</p>
          </div>

          <div className="bg-white rounded-[32px] p-6 shadow-sm border border-black/5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-[#0F4A44]/5 flex items-center justify-center">
                <FiCheckCircle className="w-4 h-4 text-[#0F4A44]" />
              </div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Settled</p>
            </div>
            <p className="text-xl font-black text-gray-900 tracking-tight">₹{wallet.totalSettled?.toLocaleString() || 0}</p>
          </div>
        </div>

        {/* Cash Limit Indicator (Subtle) */}
        <div className="bg-white rounded-[32px] p-6 shadow-sm border border-black/5 mb-10">
          <div className="flex items-center justify-between mb-4">
            <p className="text-[11px] font-black text-gray-900 uppercase tracking-widest">Account Health</p>
            <p className="text-[11px] font-black text-[#0F4A44]">
              {Math.round((wallet.dues / (wallet.cashLimit || 10000)) * 100)}%
            </p>
          </div>
          <div className="w-full h-2.5 bg-gray-50 rounded-full overflow-hidden border border-black/[0.02]">
            <div
              className={`h-full transition-all duration-1000 rounded-full ${
                (wallet.dues / (wallet.cashLimit || 10000)) > 0.8 ? 'bg-red-500' : 'bg-[#0F4A44]'
              }`}
              style={{ width: `${Math.min(100, (wallet.dues / (wallet.cashLimit || 10000)) * 100)}%` }}
            />
          </div>
        </div>

        {/* Filter Buttons (Black Theme) */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
          {[
            { id: 'all', label: 'All' },
            { id: 'cash_collected', label: 'Cash' },
            { id: 'settlement', label: 'Settlements' },
            { id: 'withdrawal', label: 'Payouts' },
          ].map((filterOption) => (
            <button
              key={filterOption.id}
              onClick={() => setFilter(filterOption.id)}
              className={`px-6 py-2.5 rounded-full font-black text-xs whitespace-nowrap transition-all duration-300 ${
                filter === filterOption.id
                  ? 'bg-black text-white shadow-lg shadow-gray-200'
                  : 'bg-white text-gray-400 border border-gray-100'
              }`}
            >
              {filterOption.label}
            </button>
          ))}
        </div>

        {/* Transactions List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-2 px-1">
            <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">Transaction History</h3>
          </div>
          
          {filteredTransactions.length === 0 ? (
            <div className="bg-white rounded-[32px] p-12 text-center border border-gray-100">
              <FiDollarSign className="w-12 h-12 mx-auto mb-4 text-gray-200" />
              <p className="text-sm font-bold text-gray-400">No transactions yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredTransactions.map((txn) => {
                const isNegative = ['cash_collected', 'tds_deduction', 'withdrawal', 'platform_fee'].includes(txn.type);
                
                return (
                  <div
                    key={txn._id}
                    className="bg-white rounded-[24px] p-4 shadow-sm border border-gray-100 flex items-center gap-4"
                  >
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                      isNegative ? 'bg-red-50 text-red-500' : 'bg-gray-50 text-black'
                    }`}>
                      {getTransactionIcon(txn.type)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <p className="text-sm font-black text-gray-900 truncate">
                          {getTransactionLabel(txn.type)}
                        </p>
                        <p className={`text-sm font-black ${isNegative ? 'text-red-500' : 'text-gray-900'}`}>
                          {isNegative ? '-' : '+'}₹{Math.abs(txn.amount).toLocaleString()}
                        </p>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-[10px] font-bold text-gray-400 truncate max-w-[150px]">
                          {txn.description}
                        </p>
                        <span className="text-[9px] font-black text-gray-300 uppercase">
                          {formatDate(txn.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <button
          onClick={() => navigate('/vendor/wallet/settlements')}
          className="w-full mt-10 mb-10 py-4 rounded-[20px] font-black text-xs text-gray-400 bg-white border border-gray-100 flex items-center justify-center gap-2 active:scale-95 transition-all uppercase tracking-widest"
        >
          View Full Ledger <FiArrowRight className="w-4 h-4" />
        </button>
      </main>

      <BottomNav />
    </div>
  );
};

export default Wallet;
