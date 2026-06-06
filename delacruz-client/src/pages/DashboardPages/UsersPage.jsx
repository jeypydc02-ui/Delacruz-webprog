import { useState, useEffect, useCallback } from 'react';
import {
  Alert, Box, Button, Chip, Dialog, DialogActions, DialogContent,
  DialogTitle, FormControlLabel, IconButton, InputAdornment, MenuItem,
  Paper, Stack, Switch, TextField, Typography, useMediaQuery,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import Visibility    from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { DataGrid }  from '@mui/x-data-grid';
import { fetchUsers, createUser, updateUser } from '../../services/UserService';
import { getRole } from '../../services/auth';
import { useNavigate } from 'react-router-dom';
import usersSeed from '../../assets/users.json';

const roles   = ['admin', 'editor', 'viewer'];
const genders = ['male', 'female', 'other'];

const blankForm = {
  firstName: '', lastName: '', age: '', gender: '',
  contactNumber: '', email: '', type: 'editor',
  username: '', password: '', address: '', isActive: true,
};

const labelize = (v) => v ? `${v.charAt(0).toUpperCase()}${v.slice(1)}` : '';

const validate = (form, users, modalId, isEdit) => {
  const errs = {};
  const required = [
    ['firstName','First name'],['lastName','Last name'],['age','Age'],
    ['gender','Gender'],['contactNumber','Contact number'],['email','Email'],
    ['type','Role'],['username','Username'],['address','Address'],
  ];
  // Password only required when adding; optional when editing
  if (!isEdit) required.push(['password','Password']);

  required.forEach(([k, label]) => {
    if (!String(form[k] ?? '').trim()) errs[k] = `${label} is required.`;
  });
  if (form.age && !/^\d+$/.test(String(form.age).trim())) errs.age = 'Age must be a number.';
  if (form.contactNumber && !/^\d{11}$/.test(String(form.contactNumber).trim()))
    errs.contactNumber = 'Must be exactly 11 digits.';
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (form.email && !emailRe.test(form.email)) errs.email = 'Enter a valid email.';
  if (form.email && emailRe.test(form.email) && users.some((u) => u.id !== modalId && u.email === form.email))
    errs.email = 'Email already exists.';
  if (form.username && /\s/.test(form.username)) errs.username = 'No spaces allowed.';
  if (form.username && !/\s/.test(form.username) && users.some((u) => u.id !== modalId && u.username === form.username))
    errs.username = 'Username already exists.';
  // If password is provided (edit or add), enforce min length
  if (form.password && form.password.length < 8) errs.password = 'At least 8 characters.';
  return errs;
};

// Map seed JSON → grid rows
const mapSeed = (raw) =>
  raw.map((u, i) => ({
    id:            u._id ?? u.id ?? i + 1,
    firstName:     u.firstName  ?? '',
    lastName:      u.lastName   ?? '',
    age:           String(u.age ?? ''),
    gender:        u.gender     ?? '',
    contactNumber: u.contactNumber ?? '',
    email:         u.email      ?? '',
    type:          u.type ?? u.role ?? 'editor',
    username:      u.username   ?? '',
    password:      u.password   ?? '',
    address:       u.address    ?? '',
    isActive:      typeof u.isActive === 'boolean' ? u.isActive : true,
  }));

const UsersPage = () => {
  const role = getRole();
  const navigate  = useNavigate();
  const theme     = useTheme();
  const isMobile  = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    if (role !== 'admin') navigate('/dashboard', { replace: true });
  }, [role, navigate]);

  const [users,        setUsers]        = useState([]);
  const [apiError,     setApiError]     = useState('');
  const [loading,      setLoading]      = useState(true);
  const [modal,        setModal]        = useState({ open: false, id: null });
  const [form,         setForm]         = useState({ ...blankForm });
  const [errors,       setErrors]       = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [search,       setSearch]       = useState('');
  const [filterRole,   setFilterRole]   = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await fetchUsers();
      const rows = (Array.isArray(data) ? data : []).map((u) => ({
        id:            u._id,
        firstName:     u.firstName,
        lastName:      u.lastName,
        age:           String(u.age),
        gender:        u.gender,
        contactNumber: u.contactNumber,
        email:         u.email,
        type:          u.type,
        username:      u.username,
        password:      '',
        address:       u.address,
        isActive:      u.isActive,
      }));
      setUsers(rows.length ? rows : mapSeed(usersSeed));
      setApiError('');
    } catch {
      setUsers(mapSeed(usersSeed));
      setApiError('Backend not reachable – showing local seed data.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadUsers(); }, [loadUsers]);

  const resetForm = () => { setForm({ ...blankForm }); setErrors({}); };
  const openModal = (u) => {
    setModal({ open: true, id: u?.id ?? null });
    setForm(u ? { ...blankForm, ...u, password: '' } : { ...blankForm });
    setErrors({});
  };
  const closeModal = () => { setModal({ open: false, id: null }); setShowPassword(false); resetForm(); };

  const handleChange = ({ target: { name, value, checked, type } }) => {
    setForm((p) => ({ ...p, [name]: type === 'checkbox' ? checked : value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: '' }));
  };

  const isEdit = Boolean(modal.id);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate(form, users, modal.id, isEdit);
    if (Object.keys(errs).length) { setErrors(errs); return; }

    const payload = {
      firstName:     form.firstName.trim(),
      lastName:      form.lastName.trim(),
      age:           form.age.trim(),
      gender:        form.gender,
      contactNumber: form.contactNumber.trim(),
      email:         form.email.trim(),
      type:          form.type,
      username:      form.username.trim(),
      address:       form.address.trim(),
      isActive:      form.isActive,
    };
    // Only include password if the user typed one
    if (form.password) payload.password = form.password;

    try {
      if (modal.id) {
        await updateUser(modal.id, payload);
      } else {
        await createUser(payload);
      }
      await loadUsers();
    } catch {
      setUsers((prev) =>
        modal.id
          ? prev.map((u) => (u.id === modal.id ? { ...u, ...payload } : u))
          : [...prev, { ...payload, id: Date.now() }]
      );
    }
    closeModal();
  };

  const toggleStatus = async (id, current) => {
    try {
      await updateUser(id, { isActive: !current });
      await loadUsers();
    } catch {
      setUsers((prev) => prev.map((u) => u.id === id ? { ...u, isActive: !u.isActive } : u));
    }
  };

  const filtered = users.filter((u) => {
    const q = search.toLowerCase();
    return (
      (!q || [u.firstName, u.lastName, u.email, u.username].some((v) => v?.toLowerCase().includes(q))) &&
      (!filterRole   || u.type     === filterRole) &&
      (!filterStatus || (filterStatus === 'active' ? u.isActive : !u.isActive))
    );
  });

  const fieldProps = (name, label, extra = {}) => ({
    name, label, value: form[name], onChange: handleChange,
    error: Boolean(errors[name]), helperText: errors[name], fullWidth: true, ...extra,
  });

  const columns = [
    { field: 'id',       headerName: 'ID',          width: 70 },
    { field: 'fullName', headerName: 'Full Name',   width: 170,
      valueGetter: (_, row) => `${row.firstName} ${row.lastName}`.trim() },
    { field: 'username', headerName: 'Username',    minWidth: 130 },
    { field: 'age',      headerName: 'Age',         width: 60 },
    { field: 'gender',   headerName: 'Gender',      width: 100, valueGetter: (_, row) => labelize(row.gender) },
    { field: 'contactNumber', headerName: 'Contact', minWidth: 130 },
    { field: 'email',    headerName: 'Email',       minWidth: 150 },
    { field: 'type',     headerName: 'Role',        width: 100, valueGetter: (_, row) => labelize(row.type) },
    // Gender column between Role and Status
    {
      field: 'genderBadge', headerName: 'Gender', width: 90,
      valueGetter: (_, row) => labelize(row.gender),
    },
    {
      field: 'isActive', headerName: 'Status', width: 100,
      renderCell: (params) => (
        <Chip size="small"
          label={params.row.isActive ? 'Active' : 'Inactive'}
          color={params.row.isActive ? 'success' : 'default'}
          variant={params.row.isActive ? 'filled' : 'outlined'}
        />
      ),
    },
    {
      field: 'actions', headerName: 'Actions', width: 200, sortable: false,
      renderCell: (params) => (
        <Stack direction="row" spacing={1} alignItems="center" sx={{ py: 0.5 }}>
          <Button size="small" variant="contained" color="warning" onClick={() => openModal(params.row)}>Edit</Button>
          <Button size="small" variant="contained"
            color={params.row.isActive ? 'error' : 'success'}
            onClick={() => toggleStatus(params.row.id, params.row.isActive)}
          >
            {params.row.isActive ? 'Disable' : 'Activate'}
          </Button>
        </Stack>
      ),
    },
  ];

  if (role !== 'admin') return null;

  return (
    <Box sx={{ width: '100%', minWidth: 0 }}>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Typography variant="h4">Users</Typography>
        <Button variant="contained" onClick={() => openModal()}>Add User</Button>
      </Box>

      {apiError && <Alert severity="warning" sx={{ mb: 2 }}>{apiError}</Alert>}

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ mb: 2 }} useFlexGap>
        <TextField size="small" placeholder="Search by name, email, or username…" value={search}
          onChange={(e) => setSearch(e.target.value)} sx={{ minWidth: 220, flex: '1 1 220px' }} />
        <TextField select size="small" label="Role" value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)} sx={{ minWidth: 120 }}>
          <MenuItem value="">All Roles</MenuItem>
          {roles.map((r) => <MenuItem key={r} value={r}>{labelize(r)}</MenuItem>)}
        </TextField>
        <TextField select size="small" label="Status" value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)} sx={{ minWidth: 130 }}>
          <MenuItem value="">All Statuses</MenuItem>
          <MenuItem value="active">Active</MenuItem>
          <MenuItem value="inactive">Inactive</MenuItem>
        </TextField>
      </Stack>

      <Paper elevation={0} variant="outlined" sx={{ minWidth: 0, overflow: 'hidden' }}>
        <Box sx={{ height: { xs: 400, sm: 520 }, width: '100%' }}>
          <DataGrid rows={filtered} columns={columns} loading={loading} disableRowSelectionOnClick
            pageSizeOptions={[5, 10]}
            initialState={{ pagination: { paginationModel: { pageSize: 10, page: 0 } } }}
            sx={{ '& .MuiDataGrid-cell, & .MuiDataGrid-columnHeader': { outline: 'none' } }}
          />
        </Box>
      </Paper>

      <Dialog open={modal.open} onClose={closeModal} fullWidth fullScreen={isMobile} maxWidth="md">
        <Box component="form" onSubmit={handleSubmit}>
          <DialogTitle>{isEdit ? 'Edit User' : 'Add User'}</DialogTitle>
          <DialogContent dividers sx={{ pt: 2, pb: 2 }}>
            <Stack spacing={2} sx={{ pt: 1 }}>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <TextField {...fieldProps('firstName', 'First Name')} />
                <TextField {...fieldProps('lastName',  'Last Name')} />
              </Stack>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <TextField {...fieldProps('age', 'Age')} />
                <TextField {...fieldProps('gender', 'Gender', { select: true })}>
                  {genders.map((g) => <MenuItem key={g} value={g}>{labelize(g)}</MenuItem>)}
                </TextField>
              </Stack>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <TextField {...fieldProps('contactNumber', 'Contact Number')} />
                <TextField {...fieldProps('email', 'Email', { type: 'email' })} />
              </Stack>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <TextField {...fieldProps('type', 'Role', { select: true })}>
                  {roles.map((r) => <MenuItem key={r} value={r}>{labelize(r)}</MenuItem>)}
                </TextField>
                <TextField {...fieldProps('username', 'Username')} />
              </Stack>
              {/* Password: placeholder says "New Password" in edit mode, "Password" in add mode */}
              <TextField
                name="password"
                label={isEdit ? 'New Password' : 'Password'}
                placeholder={isEdit ? 'Leave blank to keep current password' : 'Enter password'}
                value={form.password}
                onChange={handleChange}
                error={Boolean(errors.password)}
                helperText={errors.password || (isEdit ? 'Leave blank to keep existing password.' : '')}
                fullWidth
                type={showPassword ? 'text' : 'password'}
                slotProps={{ input: { endAdornment: (
                  <InputAdornment position="end">
                    <IconButton edge="end" onClick={() => setShowPassword((p) => !p)} onMouseDown={(e) => e.preventDefault()}>
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )}}}
              />
              <TextField {...fieldProps('address', 'Address', { multiline: true, rows: 2 })} />
              <FormControlLabel
                control={<Switch name="isActive" checked={form.isActive} onChange={handleChange} />}
                label={form.isActive ? 'User status: Active' : 'User status: Inactive'}
              />
            </Stack>
          </DialogContent>
          <DialogActions sx={{ pt: 2, pb: 2 }}>
            <Button onClick={closeModal}>Cancel</Button>
            <Button type="submit" variant="contained">{isEdit ? 'Save Changes' : 'Add User'}</Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Box>
  );
};

export default UsersPage;
