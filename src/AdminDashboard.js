import React, { useState, useEffect } from 'react';
import {
    AppBar, Toolbar, Typography, Box, Drawer, List, ListItem, ListItemIcon, ListItemText, CssBaseline, Divider,
    IconButton, Menu, MenuItem, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button,
    Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField
} from '@mui/material';
import { Person as PersonIcon, Assignment as AssignmentIcon, Delete as DeleteIcon, Edit as EditIcon, Check as CheckIcon, Close as CloseIcon } from '@mui/icons-material';
import AccountCircle from '@mui/icons-material/AccountCircle';
import axios from 'axios';

const drawerWidth = 240;

const AdminDashboard = () => {
    const [view, setView] = useState('users');
    const [anchorEl, setAnchorEl] = useState(null);
    const [users, setUsers] = useState([]);
    const [pendingRequests, setPendingRequests] = useState([]);
    const [pendingUnrestrictRequests, setPendingUnrestrictRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editUser, setEditUser] = useState(null);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);

    useEffect(() => {
        fetchUsers();
        fetchPendingRequests();
        fetchPendingUnrestrictRequests();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await axios.get('http://localhost:8080/users');
            setUsers(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching users:', error);
            setLoading(false);
        }
    };

    const fetchPendingRequests = async () => {
        try {
            const response = await axios.get('http://localhost:8080/users/pending-restriction-requests');
            setPendingRequests(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching pending restriction requests:', error);
            setLoading(false);
        }
    };

    const fetchPendingUnrestrictRequests = async () => {
        try {
            const response = await axios.get('http://localhost:8080/users/pending-unrestrict-requests');
            setPendingUnrestrictRequests(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching pending unrestrict requests:', error);
            setLoading(false);
        }
    };

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:8080/users/${id}`);
            fetchUsers();
            setDeleteDialogOpen(false);
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    const handleUpdate = (user) => {
        setEditUser(user);
        setEditDialogOpen(true);
    };

    const handleApprove = async (id) => {
        try {
            await axios.post(`http://localhost:8080/users/approve-restriction/${id}`);
            fetchPendingRequests();
        } catch (error) {
            console.error('Error approving restriction request:', error);
        }
    };

    const handleDeny = async (id) => {
        try {
            await axios.post(`http://localhost:8080/users/deny-restriction/${id}`);
            fetchPendingRequests();
        } catch (error) {
            console.error('Error denying restriction request:', error);
        }
    };

    const handleApproveUnrestrict = async (id) => {
        try {
            await axios.post(`http://localhost:8080/users/approve-unrestrict/${id}`);
            fetchPendingUnrestrictRequests();
            fetchUsers();  // Refresh user list to reflect status change
        } catch (error) {
            console.error('Error approving unrestrict request:', error);
        }
    };

    const handleDenyUnrestrict = async (id) => {
        try {
            await axios.post(`http://localhost:8080/users/deny-unrestrict/${id}`);
            fetchPendingUnrestrictRequests();
        } catch (error) {
            console.error('Error denying unrestrict request:', error);
        }
    };

    const handleEditDialogClose = () => {
        setEditDialogOpen(false);
        setEditUser(null);
    };

    const handleEditFormChange = (event) => {
        const { name, value } = event.target;
        setEditUser({
            ...editUser,
            [name]: value,
        });
    };

    const handleEditFormSubmit = async (event) => {
        event.preventDefault();
        try {
            await axios.put(`http://localhost:8080/users/${editUser.id}`, editUser);
            setEditDialogOpen(false);
            fetchUsers();
        } catch (error) {
            console.error('Error updating user:', error);
        }
    };

    const openDeleteDialog = (user) => {
        setUserToDelete(user);
        setDeleteDialogOpen(true);
    };

    const closeDeleteDialog = () => {
        setUserToDelete(null);
        setDeleteDialogOpen(false);
    };

    const renderTable = () => {
        let filteredUsers;
        if (view === 'pendingRestrictions') {
            filteredUsers = pendingRequests;
        } else if (view === 'pendingUnrestrictions') {
            filteredUsers = pendingUnrestrictRequests;
        } else {
            filteredUsers = users.filter(user => view === 'users' ? user.role === 1 : user.role === 2);
        }

        return (
            <TableContainer component={Paper} sx={{ width: '100%' }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Username</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredUsers.map(user => (
                            <TableRow key={user.id}>
                                <TableCell>{user.id}</TableCell>
                                <TableCell>{user.username}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>{user.status}</TableCell>
                                <TableCell>
                                    {view === 'pendingRestrictions' ? (
                                        <>
                                            <IconButton color="success" onClick={() => handleApprove(user.id)}>
                                                <CheckIcon />
                                            </IconButton>
                                            <IconButton color="error" onClick={() => handleDeny(user.id)}>
                                                <CloseIcon />
                                            </IconButton>
                                        </>
                                    ) : view === 'pendingUnrestrictions' ? (
                                        <>
                                            <IconButton color="success" onClick={() => handleApproveUnrestrict(user.id)}>
                                                <CheckIcon />
                                            </IconButton>
                                            <IconButton color="error" onClick={() => handleDenyUnrestrict(user.id)}>
                                                <CloseIcon />
                                            </IconButton>
                                        </>
                                    ) : (
                                        <>
                                            <IconButton onClick={() => openDeleteDialog(user)} aria-label="delete">
                                                <DeleteIcon />
                                            </IconButton>
                                            <IconButton onClick={() => handleUpdate(user)} aria-label="update">
                                                <EditIcon />
                                            </IconButton>
                                        </>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        );
    };

    if (loading) {
        return <Typography>Loading...</Typography>;
    }

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                <Toolbar>
                    <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
                        Admin Dashboard
                    </Typography>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Typography variant="h6" component="div" sx={{ marginRight: 2 }}>
                            Admin
                        </Typography>
                        <IconButton
                            edge="end"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleMenu}
                            color="inherit"
                        >
                            <AccountCircle />
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorEl}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={Boolean(anchorEl)}
                            onClose={handleClose}
                        >
                            <MenuItem onClick={handleClose}>Profile</MenuItem>
                            <MenuItem onClick={handleClose}>Logout</MenuItem>
                        </Menu>
                    </div>
                </Toolbar>
            </AppBar>
            <Drawer
                variant="permanent"
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                        boxSizing: 'border-box',
                    },
                }}
            >
                <Toolbar />
                <Divider />
                <List>
                    <ListItem button onClick={() => setView('users')}>
                        <ListItemIcon>
                            <PersonIcon />
                        </ListItemIcon>
                        <ListItemText primary="Users" />
                    </ListItem>
                    <ListItem button onClick={() => setView('librarians')}>
                        <ListItemIcon>
                            <AssignmentIcon />
                        </ListItemIcon>
                        <ListItemText primary="Librarians" />
                    </ListItem>
                    <ListItem button onClick={() => setView('pendingRestrictions')}>
                        <ListItemIcon>
                            <AssignmentIcon />
                        </ListItemIcon>
                        <ListItemText primary="Pending Restrictions" />
                    </ListItem>
                    <ListItem button onClick={() => setView('pendingUnrestrictions')}>
                        <ListItemIcon>
                            <AssignmentIcon />
                        </ListItemIcon>
                        <ListItemText primary="Pending Unrestrictions" />
                    </ListItem>
                </List>
            </Drawer>
            <Box
                component="main"
                sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3, marginLeft: 0, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}
            >
                <Toolbar />
                <Typography variant="h4" gutterBottom>
                    {view === 'users' ? 'User Account List' : view === 'librarians' ? 'Librarian Account List' : view === 'pendingUnrestrictions' ? 'Pending Unrestriction Requests' : 'Pending Restriction Requests'}
                </Typography>
                {renderTable()}
            </Box>

            <Dialog open={editDialogOpen} onClose={handleEditDialogClose}>
                <DialogTitle>Edit User</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Update the details of the user.
                    </DialogContentText>
                    {editUser && (
                        <Box component="form" onSubmit={handleEditFormSubmit} sx={{ mt: 2 }}>
                            <TextField
                                margin="normal"
                                fullWidth
                                id="username"
                                label="Username"
                                name="username"
                                value={editUser.username}
                                onChange={handleEditFormChange}
                            />
                            <TextField
                                margin="normal"
                                fullWidth
                                id="email"
                                label="Email"
                                name="email"
                                value={editUser.email}
                                onChange={handleEditFormChange}
                            />
                            <TextField
                                margin="normal"
                                fullWidth
                                id="enabled"
                                label="Enabled"
                                name="enabled"
                                value={editUser.enabled}
                                onChange={handleEditFormChange}
                            />
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleEditFormSubmit} color="primary" variant="contained">Save</Button>
                    <Button onClick={handleEditDialogClose} variant="outlined">Cancel</Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={deleteDialogOpen}
                onClose={closeDeleteDialog}
            >
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete this account?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => handleDelete(userToDelete.id)} color="primary" variant="contained">Delete</Button>
                    <Button onClick={closeDeleteDialog} variant="outlined">Cancel</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default AdminDashboard;
