import { useState, useEffect, useCallback } from 'react';
import {
  Alert, Box, Button, Chip, Dialog, DialogActions, DialogContent,
  DialogTitle, MenuItem, Paper, Stack, TextField, Typography, useMediaQuery,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { DataGrid } from '@mui/x-data-grid';
import { fetchArticles, createArticle, updateArticle } from '../../services/ArticleService';

import localArticles from '../../assets/article-content';

const statusOptions = ['active', 'inactive'];

const blankForm = {
  slug: '', title: '', paragraphs: '', preview: '', imageUrl: '', status: 'active',
};

const seedRows = localArticles.map((a, i) => ({
  id:         `A${String(70000 + i + 1).padStart(5, '0')}`,
  slug:       a.name,
  title:      a.title,
  paragraphs: a.content,
  preview:    a.content[0]?.slice(0, 80) ?? '',
  imageUrl:   a.image ?? '',
  status:     'active',
}));

const DashArticleListPage = () => {
  const theme    = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [articles,     setArticles]     = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [apiError,     setApiError]     = useState('');
  const [modal,        setModal]        = useState({ open: false, id: null });
  const [form,         setForm]         = useState({ ...blankForm });
  const [search,       setSearch]       = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const loadArticles = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await fetchArticles();
      const rows = (Array.isArray(data) ? data : []).map((a) => ({
        id:         a._id ?? a.id,
        slug:       a.slug,
        title:      a.title,
        paragraphs: a.paragraphs ?? [],
        preview:    a.preview ?? (a.paragraphs?.[0] ?? '').slice(0, 80),
        imageUrl:   a.imageUrl ?? '',
        status:     a.isActive === false ? 'inactive' : (a.status ?? 'active'),
      }));
      setArticles(rows.length ? rows : seedRows);
      setApiError('');
    } catch {
      setArticles(seedRows);
      setApiError('Backend not reachable – showing local article data.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadArticles(); }, [loadArticles]);

  const isEdit = Boolean(modal.id);

  const openModal = (article) => {
    setModal({ open: true, id: article?.id ?? null });
    setForm(article
      ? {
          slug:       article.slug,
          title:      article.title,
          preview:    article.preview,
          paragraphs: Array.isArray(article.paragraphs) ? article.paragraphs.join('\n') : (article.paragraphs ?? ''),
          imageUrl:   article.imageUrl ?? '',
          status:     article.status,
        }
      : { ...blankForm }
    );
  };
  const closeModal = () => { setModal({ open: false, id: null }); setForm({ ...blankForm }); };

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const paragraphsArr = typeof form.paragraphs === 'string'
      ? form.paragraphs.split('\n').filter(Boolean)
      : form.paragraphs;

    const payload = {
      slug:       form.slug.trim(),
      title:      form.title.trim(),
      preview:    form.preview.trim(),
      paragraphs: paragraphsArr,
      imageUrl:   form.imageUrl.trim(),
      isActive:   form.status === 'active',
      status:     form.status,
    };
    try {
      if (modal.id) {
        await updateArticle(modal.id, payload);
      } else {
        await createArticle(payload);
      }
      await loadArticles();
    } catch {
      if (modal.id) {
        setArticles((prev) => prev.map((a) => a.id === modal.id ? { ...a, ...payload, paragraphs: paragraphsArr, id: modal.id } : a));
      } else {
        setArticles((prev) => [...prev, { ...payload, paragraphs: paragraphsArr, id: `LOCAL-${Date.now()}` }]);
      }
    }
    closeModal();
  };

  const handleToggle = async (id, currentStatus) => {
    const nextStatus = currentStatus === 'active' ? 'inactive' : 'active';
    try {
      await updateArticle(id, { isActive: nextStatus === 'active', status: nextStatus });
      await loadArticles();
    } catch {
      setArticles((prev) => prev.map((a) => a.id === id ? { ...a, status: nextStatus } : a));
    }
  };

  const filtered = articles.filter((a) => {
    const q = search.toLowerCase();
    const matchSearch = !q || a.title?.toLowerCase().includes(q) || a.slug?.toLowerCase().includes(q);
    const matchStatus = !filterStatus || a.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const columns = [
    { field: 'id',    headerName: 'ID',    width: 90 },
    { field: 'slug',  headerName: 'Slug',  width: 140 },
    { field: 'title', headerName: 'Title', minWidth: 180, flex: 1 },
    {
      field: 'paragraphs',
      headerName: 'Paragraphs',
      width: 110,
      valueGetter: (_, row) => Array.isArray(row.paragraphs) ? row.paragraphs.length : 0,
    },
    { field: 'preview', headerName: 'Preview', minWidth: 200, flex: 2 },
    {
      field: 'status',
      headerName: 'Status',
      width: 110,
      renderCell: (params) => (
        <Chip
          size="small"
          label={params.row.status === 'active' ? 'Active' : 'Inactive'}
          color={params.row.status === 'active' ? 'success' : 'default'}
          variant={params.row.status === 'active' ? 'filled' : 'outlined'}
        />
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 180,
      sortable: false,
      renderCell: (params) => (
        <Stack direction="row" spacing={1} alignItems="center" sx={{ py: 0.5 }}>
          <Button size="small" variant="contained" color="warning" onClick={() => openModal(params.row)}>
            Edit
          </Button>
          <Button
            size="small"
            variant="contained"
            color={params.row.status === 'active' ? 'error' : 'success'}
            onClick={() => handleToggle(params.row.id, params.row.status)}
          >
            {params.row.status === 'active' ? 'Disable' : 'Enable'}
          </Button>
        </Stack>
      ),
    },
  ];

  return (
    <Box sx={{ width: '100%', minWidth: 0 }}>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Typography variant="h4">Articles</Typography>
        <Button variant="contained" onClick={() => openModal()}>Add Article</Button>
      </Box>

      {apiError && <Alert severity="warning" sx={{ mb: 2 }}>{apiError}</Alert>}

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ mb: 2 }} useFlexGap>
        <TextField
          size="small" placeholder="Search articles…" value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ minWidth: 220, flex: '1 1 220px' }}
        />
        <TextField
          select size="small" label="Status Filter"
          value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
          sx={{ minWidth: 150 }}
        >
          <MenuItem value="">All Statuses</MenuItem>
          {statusOptions.map((s) => (
            <MenuItem key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</MenuItem>
          ))}
        </TextField>
      </Stack>

      <Paper elevation={0} variant="outlined" sx={{ minWidth: 0, overflow: 'hidden' }}>
        <Box sx={{ height: { xs: 400, sm: 520 }, width: '100%' }}>
          <DataGrid
            rows={filtered} columns={columns} loading={loading} disableRowSelectionOnClick
            pageSizeOptions={[5, 10]}
            initialState={{ pagination: { paginationModel: { pageSize: 10, page: 0 } } }}
            sx={{ '& .MuiDataGrid-cell, & .MuiDataGrid-columnHeader': { outline: 'none' } }}
          />
        </Box>
      </Paper>

      <Dialog open={modal.open} onClose={closeModal} fullWidth fullScreen={isMobile} maxWidth="sm">
        <Box component="form" onSubmit={handleSubmit}>
          <DialogTitle>{isEdit ? 'Edit Article' : 'Add Article'}</DialogTitle>
          <DialogContent dividers sx={{ pt: 2, pb: 2 }}>
            <Stack spacing={2} sx={{ pt: 1 }}>
              <TextField name="slug"  label="Slug *"  value={form.slug}  onChange={handleChange} fullWidth required />
              <TextField name="title" label="Title *" value={form.title} onChange={handleChange} fullWidth required />
              <TextField name="preview" label="Preview" value={form.preview} onChange={handleChange} fullWidth multiline rows={2} />
              <TextField
                name="imageUrl"
                label="Cover Image URL"
                placeholder="https://example.com/image.jpg"
                value={form.imageUrl}
                onChange={handleChange}
                fullWidth
                helperText="Paste a public image URL to use as the article cover photo."
              />
              {/* Live preview of the image */}
              {form.imageUrl && (
                <Box
                  component="img"
                  src={form.imageUrl}
                  alt="Cover preview"
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                  sx={{ width: '100%', maxHeight: 180, objectFit: 'cover', borderRadius: 2, border: '1px solid #ddd' }}
                />
              )}
              <TextField
                name="paragraphs"
                label="Paragraphs (one per line)"
                value={typeof form.paragraphs === 'string' ? form.paragraphs : (Array.isArray(form.paragraphs) ? form.paragraphs.join('\n') : '')}
                onChange={handleChange}
                fullWidth multiline rows={6}
                helperText="Each line becomes one paragraph."
              />
              <TextField name="status" label="Status" select value={form.status} onChange={handleChange} fullWidth>
                {statusOptions.map((s) => (
                  <MenuItem key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</MenuItem>
                ))}
              </TextField>
            </Stack>
          </DialogContent>
          <DialogActions sx={{ pt: 2, pb: 2 }}>
            <Button onClick={closeModal}>Cancel</Button>
            <Button type="submit" variant="contained">{isEdit ? 'Save Changes' : 'Add'}</Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Box>
  );
};

export default DashArticleListPage;
