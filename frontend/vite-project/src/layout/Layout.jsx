// src/layout/Layout.js
import React, { useState } from 'react';
import { Box } from '@mui/material';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Footer from './Footer';
import { Outlet } from 'react-router-dom';

// This component orchestrates everything: top Navbar, left Sidebar, main content, and Footer.
const Layout = () => {
  const [open, setOpen] = useState(false);

  // Handler to toggle the drawer open/closed
  const handleDrawerToggle = () => {
    setOpen((prev) => !prev);
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* NAVBAR */}
      <Navbar open={open} onToggleDrawer={handleDrawerToggle} />
      
      {/* SIDEBAR (Drawer) */}
      <Sidebar open={open} onToggleDrawer={handleDrawerToggle} />
      
      {/* MAIN CONTENT + FOOTER */}
      <Box
        component="main"
        sx={{
          // Smooth transition for margin-left
          flexGrow: 1,
          p: 3,
          mt:5,
          transition: (theme) =>
            theme.transitions.create('margin', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen,
            }),
          // When open, leave space for the drawer, otherwise margin is small
          marginLeft: open ? '100px' : '30px', 
          // or whatever your “mini drawer” closed width is
        }}
      >
        {/* Put any offset you need for a fixed AppBar here, if the Navbar is fixed */}
        {/* <Toolbar />  <-- only if the Nav is position="fixed" and you need top spacing */}
        
        {/* Page Route Content */}
        <Outlet />

        {/* Footer at the bottom, also "shifted" with the same margin. */}
        <Footer />
      </Box>
    </Box>
  );
};

export default Layout;
