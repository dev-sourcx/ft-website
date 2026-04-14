import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, FileText, Mail, Phone, LogOut } from 'lucide-react';
import { PageWrapper } from '../../components/layout';
import { Card, CardContent, Button } from '../../components/common';
import { useAuth } from '../../context/AuthContext';

const PendingApproval = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <PageWrapper showFooter={false}>
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center py-12 px-4 bg-dot-grid">
        <Card className="w-full max-w-lg animate-slideUp">
          <CardContent className="p-8 text-center">
            <div className="w-20 h-20 bg-amber-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Clock className="w-10 h-10 text-amber-600" />
            </div>
            
            <h1 className="text-2xl font-bold font-heading text-slate-900 mb-2">
              Profile Under Review
            </h1>
            
            <p className="text-slate-600 mb-6">
              Thank you for registering as a teacher, <strong>{user?.title} {user?.firstName}</strong>! 
              Your profile is currently being reviewed by our admin team.
            </p>

            <div className="bg-slate-50 rounded-xl p-4 mb-6 text-left">
              <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#7B0080]" />
                What happens next?
              </h3>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 bg-[#7B0080] text-white rounded-full flex items-center justify-center text-xs flex-shrink-0">1</span>
                  Our team will verify your qualifications and documents
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 bg-[#7B0080] text-white rounded-full flex items-center justify-center text-xs flex-shrink-0">2</span>
                  We may contact you if additional information is needed
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 bg-[#7B0080] text-white rounded-full flex items-center justify-center text-xs flex-shrink-0">3</span>
                  Once approved, you'll have full access to your dashboard
                </li>
              </ul>
            </div>

            <div className="bg-blue-50 rounded-xl p-4 mb-6">
              <p className="text-sm text-blue-700">
                <strong>Typical review time:</strong> 24-48 hours
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-center gap-2 text-sm text-slate-500">
                <Mail className="w-4 h-4" />
                <span>Questions? Contact us at support@findteacher.co.za</span>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-200">
              <Button 
                variant="secondary" 
                onClick={handleLogout}
                className="w-full"
                data-testid="logout-pending-btn"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageWrapper>
  );
};

export default PendingApproval;
