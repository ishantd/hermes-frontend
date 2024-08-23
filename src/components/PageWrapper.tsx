import React, { ReactNode } from 'react';

interface PageWrapperProps {
  children: ReactNode;
}

const PageWrapper: React.FC<PageWrapperProps> = ({ children }) => {
  return (
    <div className="bg-gray-900 text-white min-h-screen">
      {children}
    </div>
  );
};

export default PageWrapper;