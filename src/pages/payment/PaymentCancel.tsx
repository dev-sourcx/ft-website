import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { XCircle, ArrowRight, RefreshCw } from 'lucide-react';
import { PageWrapper } from '../../components/layout';
import { Card, CardContent, Button } from '../../components/common';

const PaymentCancel = () => {
  const [searchParams] = useSearchParams();
  const paymentId = searchParams.get('payment_id');

  return (
    <PageWrapper showFooter={false}>
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4" data-testid="payment-cancel-page">
        <Card className="w-full max-w-md animate-scaleIn">
          <CardContent className="p-8 text-center">
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <XCircle className="w-10 h-10 text-red-500" />
            </div>
            <h1 className="text-2xl font-bold font-heading text-slate-900 mb-2">
              Payment Cancelled
            </h1>
            <p className="text-slate-500 mb-2">
              Your payment was not completed. No charges were made.
            </p>
            {paymentId && (
              <p className="text-xs text-slate-400 mb-6">
                Reference: {paymentId}
              </p>
            )}
            <div className="flex flex-col gap-3">
              <Link to="/student/teachers">
                <Button className="w-full" data-testid="try-again-btn">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Try Again
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

export default PaymentCancel;
