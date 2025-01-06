import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  TextField
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import api from '../services/api';
import BackdropForm from '../components/BackdropForm';
import ApplicationDetailsDialog from '../components/ApplicationDetailsDialog';
import EditApplicationDialog from '../components/EditApplicationDialog'; // your edit dialog

const Home = () => {
  const [applications, setApplications] = useState([]);
  const [selectedApp, setSelectedApp] = useState(null);
  const [openDetails, setOpenDetails] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);

  // MoreVert menu
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuRow, setMenuRow] = useState(null);

  // Edit dialog
  const [openEdit, setOpenEdit] = useState(false);

  // NEW: Search state
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch applications
  const fetchApplications = async () => {
    try {
      const res = await api.get('/api/applications');
      console.log(res.data)
      setApplications(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  // Row click => open details, unless the click is on the MoreVert cell
  const handleRowClick = (params) => {
    if (params.field === 'actions') return;
    setSelectedApp(params.row);
    setOpenDetails(true);
  };

  const handleCloseDetails = () => {
    setOpenDetails(false);
    setSelectedApp(null);
  };

  // ----- MoreVert menu logic -----
  const handleMenuOpen = (event, row) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setMenuRow(row);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuRow(null);
  };

  const handleEdit = () => {
    if (!menuRow) return;
    setOpenEdit(true);
    handleMenuClose();
  };

  const handleDelete = async () => {
    if (!menuRow) return;
    if (!window.confirm('Are you sure you want to delete this application?')) {
      return;
    }
    try {
      await api.delete(`/api/applications/${menuRow._id}`);
      fetchApplications();
    } catch (err) {
      console.error(err);
      alert('Delete failed.');
    }
    handleMenuClose();
  };

  // Edit dialog close
  const handleCloseEdit = () => {
    setOpenEdit(false);
    setMenuRow(null);
  };

  // After edit success => refetch data
  const handleEditSuccess = () => {
    setOpenEdit(false);
    fetchApplications();
  };

  // ---- DataGrid columns ----
  const columns = [
    { field: 'companyName', headerName: 'Company', flex: 1 },
    { field: 'position', headerName: 'Position', flex: 1 },
    { field: 'location', headerName: 'Location', flex: 1 },
    { field: 'status', headerName: 'Status', flex: 1 },
    {
      field: 'dateApplied',
      headerName: 'Date Applied',
      flex: 1,
      renderCell: (params) => {
        const rawDate = params.row?.dateApplied;
        if (!rawDate) return '';
        return new Date(rawDate).toLocaleDateString();
      }
    },
    {
      field: 'actions',
      headerName: 'Actions',
      sortable: false,
      renderCell: (params) => (
        <IconButton onClick={(e) => handleMenuOpen(e, params.row)}>
          <MoreVertIcon />
        </IconButton>
      )
    }
  ];

  // ---- Manual filtering by any field (searchTerm) ----
  // For each application, we convert the object fields to strings and see if they include the searchTerm.
  const filteredApplications = applications.filter((app) => {
    const lowerSearch = searchTerm.toLowerCase();
    // Check a few likely fields. Or check all fields (Object.values) if you want to be thorough.
    return (
      app.companyName?.toLowerCase().includes(lowerSearch) ||
      app.position?.toLowerCase().includes(lowerSearch) ||
      app.location?.toLowerCase().includes(lowerSearch) ||
      app.status?.toLowerCase().includes(lowerSearch) ||
      app.notes?.toLowerCase().includes(lowerSearch)
    );
  });

  return (
    <Box sx={{ height: '80vh', width: '100%' }}>
      <Typography variant="h4" sx={{ mb: 2 }}>
        Applications
      </Typography>

      {/* Add Application Button */}
      <Button
        variant="contained"
        onClick={() => setOpenAdd(true)}
        sx={{ mb: 2, mr: 2 }}
      >
        Add Application
      </Button>

      {/* Search Box (MUI TextField) */}
      <TextField
        label="Search..."
        variant="outlined"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ mb: 2 }}
      />

      <DataGrid
        rows={filteredApplications}
        columns={columns}
        getRowId={(row) => row._id}
        pageSize={10}
        rowsPerPageOptions={[10, 25, 50]}
        onRowClick={handleRowClick}
        disableColumnMenu
      />

      {/* MoreVert Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        onClick={(e) => e.stopPropagation()}
      >
        <MenuItem onClick={handleEdit}>Edit</MenuItem>
        <MenuItem onClick={handleDelete}>Delete</MenuItem>
      </Menu>

      {/* Details Dialog */}
      {selectedApp && (
        <ApplicationDetailsDialog
          open={openDetails}
          onClose={handleCloseDetails}
          application={selectedApp}
        />
      )}

      {/* Add Application Backdrop */}
      <BackdropForm
        open={openAdd}
        onClose={() => setOpenAdd(false)}
        onSuccess={() => {
          setOpenAdd(false);
          fetchApplications();
        }}
      />

      {/* Edit Application Dialog */}
      {menuRow && (
        <EditApplicationDialog
          open={openEdit}
          onClose={handleCloseEdit}
          application={menuRow}
          onSuccess={handleEditSuccess}
        />
      )}
    </Box>
  );
};

export default Home;
