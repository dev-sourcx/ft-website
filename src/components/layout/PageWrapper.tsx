import React, { ReactNode } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

interface PageWrapperProps {
  children?: ReactNode;
  showFooter?: boolean;
  className?: string;
}

const PageWrapper = ({ children, showFooter = true, className = '' }: PageWrapperProps) => {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      <Navbar />
      <main className={`flex-1 ${className}`}>
        {children}
      </main>
      {showFooter && <Footer />}
    </div>
  );
};

export default PageWrapper;
