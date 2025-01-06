// src/layout/Sidebar.js
import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  IconButton,
  Box,
  Toolbar,
} from '@mui/material';
import {
  ChevronLeft as ChevronLeftIcon,
  Home as HomeIcon,
  Dashboard as DashboardIcon,
  Login as LoginIcon,
} from '@mui/icons-material';
import { styled, useTheme } from '@mui/material/styles';
import { Link } from 'react-router-dom';

// Define widths for the open/closed states
const drawerWidth = 240;
const closedDrawerWidth = 72;

// Style utility for "opened" drawer
const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.easeOut,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

// Style utility for "closed" (mini) drawer
const closedMixin = (theme) => ({
  width: closedDrawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
});

// Styled MUI Drawer
const DrawerStyled = styled(Drawer, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  width: drawerWidth,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  // If open, apply the "openedMixin", else "closedMixin"
  ...(open && {
    ...openedMixin(theme),
    '& .MuiDrawer-paper': openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    '& .MuiDrawer-paper': closedMixin(theme),
  }),
}));

const Sidebar = ({ open, onToggleDrawer }) => {
  const theme = useTheme();

  return (
    <DrawerStyled variant="permanent" open={open}>
      {/* Top toolbar row with a close button (optional) */}
      <Toolbar
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: open ? 'flex-end' : 'center',
          px: [1],
        }}
      >
        {open && (
          <IconButton onClick={onToggleDrawer}>
            <ChevronLeftIcon />
          </IconButton>
        )}
      </Toolbar>
      <Divider />

      {/* Sidebar items */}
      <List>
        <ListItem button component={Link} to="/">
          <ListItemIcon>
            <HomeIcon />
          </ListItemIcon>
          {open && <ListItemText primary="Home" />}
        </ListItem>

        <ListItem button component={Link} to="/dashboard">
          <ListItemIcon>
            <DashboardIcon />
          </ListItemIcon>
          {open && <ListItemText primary="Dashboard" />}
        </ListItem>

        <ListItem button component={Link} to="/login">
          <ListItemIcon>
            <LoginIcon />
          </ListItemIcon>
          {open && <ListItemText primary="Login" />}
        </ListItem>
      </List>
    </DrawerStyled>
  );
};

export default Sidebar;
