import React from 'react';
import BottomNavigation from './components/BottomNavigation'; 



const Layout = ({ children }) => {
  return (
    
    
    <div className="relative min-h-screen pb-16"> {}
      {}
      <main className="flex-grow">
        {children}
      </main>

      {}
      {}
      <BottomNavigation />
    </div>
  );
};

export default Layout;
