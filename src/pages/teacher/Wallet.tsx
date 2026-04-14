import React, { useState, useEffect } from 'react';
import { 
  Wallet as WalletIcon, ArrowUpRight, ArrowDownLeft, 
  Clock, CheckCircle, DollarSign, TrendingUp, Building
} from 'lucide-react';
import { PageWrapper } from '../../components/layout';
import { Card, CardContent, Button, Badge, Loader, Modal, Input } from '../../components/common';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { formatCurrency, getRelativeTime, getApiErrorMessage } from '../../utils/helpers';

const TeacherWallet = () => {
  const { user } = useAuth();
  const [walletSummary, setWalletSummary] = useState({
    availableBalance: 0,
    pendingEarnings: 0,
    totalEarned: 0,
  });
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [processing, setProcessing] = useState(false);
  
  const [withdrawForm, setWithdrawForm] = useState({
    amount: '',
    bankName: '',
    accountNumber: '',
    branchCode: '',
  });

  useEffect(() => {
    fetchWalletData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const fetchWalletData = async () => {
    if (!user?.id) return;
    
    try {
      const [summaryRes, txRes] = await Promise.all([
        api.get(`/wallet/${user.id}/summary?user_type=teacher`),
        api.get(`/transactions/${user.id}?user_type=teacher`),
      ]);
      
      setWalletSummary(summaryRes.data);
      setTransactions(txRes.data);
    } catch (error: any) {
      if (process.env.NODE_ENV === 'development') console.error('Error fetching wallet data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async () => {
    const amount = parseFloat(withdrawForm.amount);
    
    if (isNaN(amount) || amount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    if (amount > walletSummary.availableBalance) {
      toast.error('Amount exceeds available balance');
      return;
    }

    if (!withdrawForm.bankName || !withdrawForm.accountNumber) {
      toast.error('Please fill in bank details');
      return;
    }

    setProcessing(true);
    try {
      await api.post('/wallet/withdraw', {
        user_id: user.id,
        amount: amount,
        bank_details: {
          bank_name: withdrawForm.bankName,
          account_number: withdrawForm.accountNumber,
          branch_code: withdrawForm.branchCode,
        }
      });

      toast.success('Withdrawal request submitted');
      setShowWithdrawModal(false);
      setWithdrawForm({ amount: '', bankName: '', accountNumber: '', branchCode: '' });
      fetchWalletData();
    } catch (error: any) {
      toast.error(getApiErrorMessage(error, 'Failed to process withdrawal'));
    } finally {
      setProcessing(false);
    }
  };

  const getTransactionIcon = (type) => {
    switch (type) {
      case 'earning':
      case 'credit':
        return <ArrowDownLeft className="w-5 h-5 text-emerald-500" />;
      case 'withdrawal':
      case 'debit':
        return <ArrowUpRight className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-slate-400" />;
    }
  };

  if (loading) {
    return (
      <PageWrapper>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-center py-12">
            <Loader size="lg" />
          </div>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8" data-testid="teacher-wallet-page">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-6">Earnings & Wallet</h1>

        {/* Summary Cards */}
        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-[#7B0080] to-[#A020A0] text-white">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-2">
                <WalletIcon className="w-5 h-5 opacity-80" />
                <span className="text-sm opacity-80">Available</span>
              </div>
              <p className="text-2xl font-bold">
                {formatCurrency(walletSummary.availableBalance || 0)}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-2">
                <Clock className="w-5 h-5 text-amber-500" />
                <span className="text-sm text-slate-500">Pending</span>
              </div>
              <p className="text-2xl font-bold text-slate-900">
                {formatCurrency(walletSummary.pendingEarnings || 0)}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp className="w-5 h-5 text-emerald-500" />
                <span className="text-sm text-slate-500">Total Earned</span>
              </div>
              <p className="text-2xl font-bold text-slate-900">
                {formatCurrency(walletSummary.totalEarned || 0)}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Withdraw Button */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-slate-900">Request Withdrawal</h3>
                <p className="text-sm text-slate-500 mt-1">
                  Withdraw your available balance to your bank account
                </p>
              </div>
              <Button 
                onClick={() => setShowWithdrawModal(true)}
                disabled={walletSummary.availableBalance <= 0}
                data-testid="withdraw-btn"
              >
                <DollarSign className="w-4 h-4 mr-2" />
                Withdraw
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Transactions */}
        <Card>
          <CardContent className="p-6">
            <h2 className="font-semibold text-slate-900 mb-4">Transaction History</h2>
            
            {transactions.length === 0 ? (
              <div className="text-center py-8">
                <WalletIcon className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500">No transactions yet</p>
                <p className="text-sm text-slate-400">Your earnings will appear here</p>
              </div>
            ) : (
              <div className="space-y-3">
                {transactions.map((tx) => (
                  <div 
                    key={tx.id}
                    className="flex items-center justify-between p-4 bg-slate-50 rounded-xl"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                        {getTransactionIcon(tx.type)}
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{tx.description}</p>
                        <p className="text-sm text-slate-500">
                          {getRelativeTime(tx.createdAt)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-semibold ${
                        tx.type === 'earning' || tx.type === 'credit' 
                          ? 'text-emerald-600' 
                          : 'text-red-500'
                      }`}>
                        {tx.type === 'earning' || tx.type === 'credit' ? '+' : '-'}
                        {formatCurrency(tx.amount)}
                      </p>
                      <Badge 
                        variant={tx.status === 'completed' ? 'success' : 'warning'}
                        size="sm"
                      >
                        {tx.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Withdraw Modal */}
        <Modal
          isOpen={showWithdrawModal}
          onClose={() => setShowWithdrawModal(false)}
          title="Request Withdrawal"
        >
          <div className="space-y-4">
            <div className="bg-slate-50 rounded-xl p-4 mb-4">
              <p className="text-sm text-slate-500">Available Balance</p>
              <p className="text-2xl font-bold text-[#7B0080]">
                {formatCurrency(walletSummary.availableBalance || 0)}
              </p>
            </div>

            <Input
              label="Amount to Withdraw (ZAR)"
              type="number"
              value={withdrawForm.amount}
              onChange={(e) => setWithdrawForm(prev => ({ ...prev, amount: e.target.value }))}
              placeholder="Enter amount"
              max={walletSummary.availableBalance}
              data-testid="withdraw-amount"
            />

            <Input
              label="Bank Name"
              value={withdrawForm.bankName}
              onChange={(e) => setWithdrawForm(prev => ({ ...prev, bankName: e.target.value }))}
              placeholder="e.g., FNB, Standard Bank"
              leftIcon={<Building className="w-5 h-5" />}
              data-testid="withdraw-bank"
            />

            <Input
              label="Account Number"
              value={withdrawForm.accountNumber}
              onChange={(e) => setWithdrawForm(prev => ({ ...prev, accountNumber: e.target.value }))}
              placeholder="Your account number"
              data-testid="withdraw-account"
            />

            <Input
              label="Branch Code"
              value={withdrawForm.branchCode}
              onChange={(e) => setWithdrawForm(prev => ({ ...prev, branchCode: e.target.value }))}
              placeholder="e.g., 250655"
              data-testid="withdraw-branch"
            />

            <div className="flex gap-3 pt-4">
              <Button 
                variant="secondary" 
                className="flex-1"
                onClick={() => setShowWithdrawModal(false)}
              >
                Cancel
              </Button>
              <Button 
                className="flex-1"
                onClick={handleWithdraw}
                loading={processing}
                data-testid="confirm-withdraw"
              >
                Submit Request
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </PageWrapper>
  );
};

export default TeacherWallet;
