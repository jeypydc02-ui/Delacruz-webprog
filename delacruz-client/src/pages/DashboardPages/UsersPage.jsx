import { useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  IconButton,
  InputAdornment,
  MenuItem,
  Paper,
  Stack,
  Switch,
  TextField,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import Visibility    from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { DataGrid }  from '@mui/x-data-grid';
import usersSeed     from '../../assets/users.json';

// ── constants ────────────────────────────────────────────────────────────────
const roles   = ['admin', 'editor', 'viewer'];
const genders = ['male', 'female', 'other'];

const blankForm = {
  firstName:     '',
  lastName:      '',
  age:           '',
  gender:        '',
  contactNumber: '',
  email:         '',
  role:          'editor',
  username:      '',
  password:      '',
  address:       '',
  isActive:      true,
};

// ── helpers ──────────────────────────────────────────────────────────────────
const labelize = (value) =>
  value ? `${value.charAt(0).toUpperCase()}${value.slice(1)}` : '';

const loadUsers = () => {
  try {
    return {
      users: JSON.parse(JSON.stringify(usersSeed)).map((user, index) => ({
        id:            Number(user.id) || index + 1,
        firstName:     String(user.firstName  ?? '').trim(),
        lastName:      String(user.lastName   ?? '').trim(),
        age:           String(user.age        ?? '').trim(),
        gender:        genders.includes(String(user.gender ?? '').trim().toLowerCase())
                         ? String(user.gender).trim().toLowerCase()
                         : '',
        contactNumber: String(user.contactNumber ?? '').trim(),
        email:         String(user.email     ?? '').trim().toLowerCase(),
        role:          roles.includes(String(user.role ?? '').trim().toLowerCase())
                         ? String(user.role).trim().toLowerCase()
                         : 'editor',
        username:      String(user.username  ?? '').trim().toLowerCase(),
        password:      String(user.password  ?? ''),
        address:       String(user.address   ?? '').trim(),
        isActive:      typeof user.isActive === 'boolean' ? user.isActive : true,
      })),
      error: '',
    };
  } catch {
    return { users: [], error: 'Unable to read users from src/assets/users.json.' };
  }
};

const seed = loadUsers();

// ── Enhancement 3 · validation rules ────────────────────────────────────────
const validate = (form, users, modelId) => {
  const nextErrors = {};
  const mustHave = [
    ['firstName',     'First name'],
    ['lastName',      'Last name'],
    ['age',           'Age'],
    ['gender',        'Gender'],
    ['contactNumber', 'Contact number'],
    ['email',         'Email'],
    ['role',          'Role'],
    ['username',      'Username'],
    ['password',      'Password'],
    ['address',       'Address'],
  ];

  mustHave.forEach(([key, label]) => {
    if (!String(form[key] ?? '').trim()) {
      nextErrors[key] = `${label} is required.`;
    }
  });

  // age must be a number only
  if (form.age && !/^\d+$/.test(String(form.age).trim())) {
    nextErrors.age = 'Age must be a number only.';
  }

  // contact number must be exactly 11 digits
  if (form.contactNumber && !/^\d{11}$/.test(String(form.contactNumber).trim())) {
    nextErrors.contactNumber = 'Contact number must be exactly 11 digits.';
  }

  // email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (form.email && !emailRegex.test(form.email)) {
    nextErrors.email = 'Enter a valid email address.';
  }

  // email uniqueness
  if (
    form.email &&
    emailRegex.test(form.email) &&
    users.some((u) => u.id !== modelId && u.email === form.email)
  ) {
    nextErrors.email = 'Email address already exists.';
  }

  // username must not contain spaces
  if (form.username && /\s/.test(form.username)) {
    nextErrors.username = 'Username must not contain spaces.';
  }

  // username uniqueness
  if (
    form.username &&
    !/\s/.test(form.username) &&
    users.some((u) => u.id !== modelId && u.username === form.username)
  ) {
    nextErrors.username = 'Username already exists.';
  }

  // password must be at least 8 characters
  if (form.password && form.password.length < 8) {
    nextErrors.password = 'Password must be at least 8 characters.';
  }

  return nextErrors;
};

// ── UsersPage ────────────────────────────────────────────────────────────────
const UsersPage = () => {
  const theme      = useTheme();
  const isMobile   = useMediaQuery(theme.breakpoints.down('sm'));

  // state
  const [users,           setUsers]           = useState(seed.users);
  const [modal,           setModal]           = useState({ open: false, id: null });
  const [form,            setForm]            = useState({ ...blankForm });
  const [errors,          setErrors]          = useState({});
  const [showPassword,    setShowPassword]    = useState(false);

  // ── Enhancement 2 · search + filter state ──────────────────────────────
  const [search,          setSearch]          = useState('');
  const [filterRole,      setFilterRole]      = useState('');
  const [filterGender,    setFilterGender]    = useState('');
  const [filterStatus,    setFilterStatus]    = useState('');

  // ── handlers ─────────────────────────────────────────────────────────────
  const resetForm = () => { setForm({ ...blankForm }); setErrors({}); };

  const openModal = (user) => {
    setModal({ open: true, id: user?.id ?? null });
    setForm(user ? { ...blankForm, ...user } : { ...blankForm });
    setErrors({});
  };

  const closeModal = () => {
    setModal({ open: false, id: null });
    setShowPassword(false);
    resetForm();
  };

  const handleChange = ({ target: { name, value, checked, type } }) => {
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const nextErrors = validate(form, users, modal.id);
    if (Object.keys(nextErrors).length) { setErrors(nextErrors); return; }

    const newUser = {
      firstName:     form.firstName.trim(),
      lastName:      form.lastName.trim(),
      age:           form.age.trim(),
      gender:        form.gender.trim().toLowerCase(),
      contactNumber: form.contactNumber.trim(),
      email:         form.email.trim().toLowerCase(),
      role:          form.role.trim().toLowerCase(),
      username:      form.username.trim().toLowerCase(),
      password:      form.password,
      address:       form.address.trim(),
      isActive:      form.isActive,
    };

    setUsers((prev) =>
      modal.id
        ? prev.map((u) => (u.id === modal.id ? { ...u, ...newUser } : u))
        : [
            ...prev,
            {
              id: prev.reduce((max, u) => Math.max(max, Number(u.id) || 0), 0) + 1,
              ...newUser,
            },
          ]
    );
    closeModal();
  };

  const toggleStatus = (id) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, isActive: !u.isActive } : u))
    );
  };

  // ── Enhancement 2 · filtered rows ──────────────────────────────────────
  const filteredUsers = users.filter((u) => {
    const q = search.toLowerCase();
    const matchesSearch =
      !q ||
      (u.firstName    || '').toLowerCase().includes(q) ||
      (u.lastName     || '').toLowerCase().includes(q) ||
      (u.email        || '').toLowerCase().includes(q) ||
      (u.username     || '').toLowerCase().includes(q);

    const matchesRole   = !filterRole   || u.role   === filterRole;
    const matchesGender = !filterGender || u.gender === filterGender;
    const matchesStatus =
      !filterStatus ||
      (filterStatus === 'active'   &&  u.isActive) ||
      (filterStatus === 'inactive' && !u.isActive);

    return matchesSearch && matchesRole && matchesGender && matchesStatus;
  });

  // ── fieldProps helper for dialog TextFields ─────────────────────────────
  const fieldProps = (name, label, extra = {}) => ({
    name,
    label,
    value: form[name],
    onChange: handleChange,
    error: Boolean(errors[name]),
    helperText: errors[name],
    fullWidth: true,
    ...extra,
  });

  // ── DataGrid columns ────────────────────────────────────────────────────
  const columns = [
    { field: 'id', headerName: 'ID', width: 60 },
    {
      field: 'fullName',
      headerName: 'Full Name',
      width: 170,
      valueGetter: (value, row) => `${row.firstName} ${row.lastName}`.trim(),
    },
    { field: 'username', headerName: 'Username', minWidth: 130 },
    { field: 'age',      headerName: 'Age',      width: 60 },
    {
      field: 'gender',
      headerName: 'Gender',
      width: 110,
      valueGetter: (_, row) => labelize(row.gender),
    },
    { field: 'contactNumber', headerName: 'Contact Number', minWidth: 130 },
    { field: 'email',         headerName: 'Email',          minWidth: 130 },
    {
      field: 'role',
      headerName: 'Role',
      width: 110,
      valueGetter: (_, row) => labelize(row.role),
    },
    {
      field: 'isActive',
      headerName: 'Status',
      width: 110,
      sortable: false,
      renderCell: (params) => (
        <Chip
          size="small"
          label={params.row.isActive ? 'Active' : 'Inactive'}
          color={params.row.isActive ? 'success' : 'default'}
          variant={params.row.isActive ? 'filled' : 'outlined'}
        />
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 220,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Stack direction="row" spacing={1} alignItems="center" sx={{ py: 0.5 }}>
          <Button
            size="small"
            variant="contained"
            color="warning"
            onClick={() => openModal(params.row)}
            sx={{ minWidth: 52 }}
          >
            Edit
          </Button>
          <Button
            size="small"
            variant="contained"
            color={params.row.isActive ? 'error' : 'success'}
            onClick={() => toggleStatus(params.row.id)}
            sx={{ minWidth: 80 }}
          >
            {params.row.isActive ? 'Disable' : 'Activate'}
          </Button>
        </Stack>
      ),
    },
  ];

  // ── render ────────────────────────────────────────────────────────────────
  return (
    <Box sx={{ width: '100%', minWidth: 0 }}>
      {/* page header */}
      <Box
        sx={{
          mb: 3,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        <Typography variant="h4">Users</Typography>
        <Button
          variant="contained"
          onClick={() => openModal()}
          sx={{ width: { xs: '100%', sm: 'auto' } }}
        >
          Add User
        </Button>
      </Box>

      {seed.error ? (
        <Alert severity="error" sx={{ mb: 2 }}>{seed.error}</Alert>
      ) : null}

      {/* ── Enhancement 2 · search bar + dropdown filters ── */}
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={1.5}
        sx={{ mb: 2, flexWrap: 'wrap' }}
        useFlexGap
      >
        {/* search */}
        <TextField
          size="small"
          placeholder="Search by name, email, or username…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ minWidth: 220, flex: '1 1 220px' }}
        />

        {/* role filter */}
        <TextField
          select
          size="small"
          label="Role"
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
          sx={{ minWidth: 120 }}
        >
          <MenuItem value="">All Roles</MenuItem>
          {roles.map((r) => (
            <MenuItem key={r} value={r}>{labelize(r)}</MenuItem>
          ))}
        </TextField>

        {/* gender filter */}
        <TextField
          select
          size="small"
          label="Gender"
          value={filterGender}
          onChange={(e) => setFilterGender(e.target.value)}
          sx={{ minWidth: 120 }}
        >
          <MenuItem value="">All Genders</MenuItem>
          {genders.map((g) => (
            <MenuItem key={g} value={g}>{labelize(g)}</MenuItem>
          ))}
        </TextField>

        {/* status filter */}
        <TextField
          select
          size="small"
          label="Status"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          sx={{ minWidth: 130 }}
        >
          <MenuItem value="">All Statuses</MenuItem>
          <MenuItem value="active">Active</MenuItem>
          <MenuItem value="inactive">Inactive</MenuItem>
        </TextField>
      </Stack>

      {/* data grid */}
      <Paper sx={{ xs: 1.5, sm: 2, minWidth: 0, overflow: 'hidden' }} elevation={0} variant="outlined">
        <Box sx={{ height: { xs: 400, sm: 520 }, width: '100%', minWidth: 0, overflow: 'hidden' }}>
          <DataGrid
            rows={filteredUsers}
            columns={columns}
            disableRowSelectionOnClick
            pageSizeOptions={[5, 10]}
            initialState={{
              pagination: { paginationModel: { pageSize: 5, page: 0 } },
            }}
            sx={{
              minWidth: 0,
              '& .MuiDataGrid-cell, & .MuiDataGrid-columnHeader': { outline: 'none' },
            }}
          />
        </Box>
        {users.length === 0 && (
          <Alert severity="info">No users found. Use Add User to create your first record.</Alert>
        )}
      </Paper>

      {/* ── Add / Edit Dialog ── */}
      <Dialog
        open={modal.open}
        onClose={closeModal}
        fullWidth
        fullScreen={isMobile}
        maxWidth="md"
      >
        <Box component="form" onSubmit={handleSubmit}>
          <DialogTitle>
            {modal.id ? 'Edit User' : 'Add User'}
          </DialogTitle>

          <DialogContent dividers sx={{ pt: 2, pb: 2 }}>
            <Stack spacing={2} sx={{ pt: 1 }}>

              {/* first + last name */}
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <TextField {...fieldProps('firstName', 'First Name')} />
                <TextField {...fieldProps('lastName',  'Last Name')}  />
              </Stack>

              {/* age + gender */}
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <TextField {...fieldProps('age', 'Age')} />
                <TextField {...fieldProps('gender', 'Gender', { select: true })}>
                  {genders.map((g) => (
                    <MenuItem key={g} value={g}>{labelize(g)}</MenuItem>
                  ))}
                </TextField>
              </Stack>

              {/* contact + email */}
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <TextField {...fieldProps('contactNumber', 'Contact Number')} />
                <TextField {...fieldProps('email', 'Email Address', { type: 'email' })} />
              </Stack>

              {/* role + username */}
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <TextField {...fieldProps('role', 'Role', { select: true })}>
                  {roles.map((r) => (
                    <MenuItem key={r} value={r}>{labelize(r)}</MenuItem>
                  ))}
                </TextField>
                <TextField {...fieldProps('username', 'Username')} />
              </Stack>

              {/* password */}
              <TextField
                {...fieldProps('password', 'Password')}
                type={showPassword ? 'text' : 'password'}
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          edge="end"
                          onClick={() => setShowPassword((prev) => !prev)}
                          onMouseDown={(event) => event.preventDefault()}
                          aria-label={showPassword ? 'Hide password' : 'Show password'}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />

              {/* address */}
              <TextField {...fieldProps('address', 'Address', { multiline: true, rows: 3 })} />

              {/* active toggle */}
              <FormControlLabel
                control={
                  <Switch
                    name="isActive"
                    checked={form.isActive}
                    onChange={handleChange}
                  />
                }
                label={form.isActive ? 'User status: Active' : 'User status: Inactive'}
              />
            </Stack>
          </DialogContent>

          <DialogActions sx={{ pt: 3, pb: 2 }}>
            <Button onClick={closeModal}>Cancel</Button>
            <Button type="submit" variant="contained">
              {modal.id ? 'Update User' : 'Save User'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Box>
  );
};

export default UsersPage;
