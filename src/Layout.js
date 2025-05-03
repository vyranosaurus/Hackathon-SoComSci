import React from 'react';
import BottomNavigation from './components/BottomNavigation'; // Import your BottomNavigation component

// Layout Component
// This component provides a consistent layout with a fixed BottomNavigation.
const Layout = ({ children }) => {
  return (
    // Main container with relative positioning and padding at the bottom
    // to prevent content from being hidden by the fixed navigation.
    <div className="relative min-h-screen pb-16"> {/* Adjust pb-16 if your nav height changes */}
      {/* Render the content of the current route (passed as children) */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Render the fixed BottomNavigation */}
      {/* This component is now rendered inside the RouterProvider via App.js */}
      <BottomNavigation />
    </div>
  );
};

export default Layout;
