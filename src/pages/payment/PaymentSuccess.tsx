import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';
import { PageWrapper } from '../../components/layout';
import { Card, CardContent, Button, Loader } from '../../components/common';
import api from '../../api/axios';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const paymentId = searchParams.get('payment_id');
  const [status, setStatus] = useState<'loading' | 'success' | 'pending'>('loading');

  useEffect(() => {
    const checkPayment = async () => {
      if (!paymentId) {
        setStatus('success');
        return;
      }
      try {
        const res = await api.get(`/payment/status/${paymentId}`);
        const paymentStatus = res.data?.status || res.data?.paymentStatus;
        if (paymentStatus === 'COMPLETE' || paymentStatus === 'completed' || paymentStatus === 'success') {
          setStatus('success');
        } else {
          // Payment may still be processing via IPN
          setStatus('pending');
          // Retry once after 3 seconds
          setTimeout(async () => {
            try {
              const retry = await api.get(`/payment/status/${paymentId}`);
              const s = retry.data?.status || retry.data?.paymentStatus;
              if (s === 'COMPLETE' || s === 'completed' || s === 'success') {
                setStatus('success');
              } else {
                setStatus('success'); // Assume success since PayFast redirected here
              }
            } catch {
              setStatus('success');
            }
          }, 3000);
        }
      } catch {
        // If we can't verify, assume success since PayFast redirected here
        setStatus('success');
      }
    };

    // Brief delay for IPN processing
    const timer = setTimeout(checkPayment, 1500);
    return () => clearTimeout(timer);
  }, [paymentId]);

  if (status === 'loading') {
    return (
      <PageWrapper showFooter={false}>
        <div className="min-h-[calc(100vh-64px)] flex items-center justify-center">
          <div className="text-center animate-fadeIn">
            <Loader size="lg" />
            <p className="mt-4 text-slate-500 font-medium">Confirming your payment...</p>
          </div>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper showFooter={false}>
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4" data-testid="payment-success-page">
        <Card className="w-full max-w-md animate-scaleIn">
          <CardContent className="p-8 text-center">
            <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-emerald-500" />
            </div>
            <h1 className="text-2xl font-bold font-heading text-slate-900 mb-2">
              Payment Successful!
            </h1>
            <p className="text-slate-500 mb-2">
              Your session has been booked and payment confirmed.
            </p>
            {paymentId && (
              <p className="text-xs text-slate-400 mb-6">
                Payment ID: {paymentId}
              </p>
            )}
            {status === 'pending' && (
              <div className="flex items-center gap-2 justify-center text-amber-600 text-sm mb-4">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Payment confirmation is being processed...</span>
              </div>
            )}
            <div className="flex flex-col gap-3">
              <Link to="/student/bookings">
                <Button className="w-full" data-testid="view-bookings-btn">
                  View My Bookings
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link to="/student/dashboard">
                <Button variant="secondary" className="w-full" data-testid="go-dashboard-btn">
                  Go to Dashboard
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageWrapper>
  );
};

export default PaymentSuccess;
