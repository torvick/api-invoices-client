import { useEffect, useMemo, useState } from 'react';
import { Box, Grid, TextField, MenuItem, Button, Paper, Stack } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { format, parseISO, isAfter } from 'date-fns';
import SearchIcon from '@mui/icons-material/Search';
import ClearAllIcon from '@mui/icons-material/ClearAll';

const toDateOrNull = (s) => {
  if (!s) return null;
  try { return parseISO(s); } catch { return null; }
};
const ymd = (d) => (d ? format(d, 'yyyy-MM-dd') : '');

export default function InvoicesFilters({ params, setParams, loading }) {
  const [start, setStart] = useState(params.start_date || '');
  const [end, setEnd] = useState(params.end_date || '');
  const [invoiceNumber, setInvoiceNumber] = useState(params.invoice_number || '');
  const [statusLocal, setStatusLocal] = useState(params.status || '');

  useEffect(() => {
    setStart(params.start_date || '');
    setEnd(params.end_date || '');
    setInvoiceNumber(params.invoice_number || '');
    setStatusLocal(params.status || '');
  }, [params.start_date, params.end_date, params.invoice_number, params.status]);

  const startD = useMemo(() => toDateOrNull(start), [start]);
  const endD   = useMemo(() => toDateOrNull(end), [end]);
  const invalidRange = useMemo(() => (startD && endD ? isAfter(startD, endD) : false), [startD, endD]);
  const canSearch = Boolean(start && end) && !invalidRange;

  const handleSearch = () => {
    if (!canSearch || loading) return;
    setParams((p) => ({
      ...p,
      start_date: start,
      end_date: end,
      invoice_number: invoiceNumber,
      status: statusLocal,
      page: 1,
    }));
  };

  const handleClear = () => {
    setInvoiceNumber('');
    setStatusLocal('');
    setParams((p) => ({ ...p, invoice_number: '', status: '', page: 1 }));
  };

  return (
    <Paper variant="outlined" sx={{ p: { xs: 2, md: 3 }, mb: 6 }}>
      <Box
        sx={{
          display: 'grid',
          gap: 3,
          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
          alignItems: 'flex-end',
        }}
      >
        <Box>
          <DatePicker
            label="Inicio (YYYY-MM-DD)"
            value={startD}
            onChange={(d) => setStart(ymd(d))}
            slotProps={{
              textField: {
                size: 'small',
                fullWidth: true,
                error: invalidRange,
                helperText: invalidRange ? 'Inicio > Fin' : '',
              },
            }}
          />
        </Box>

        <Box>
          <DatePicker
            label="Fin (YYYY-MM-DD)"
            value={endD}
            onChange={(d) => setEnd(ymd(d))}
            slotProps={{
              textField: {
                size: 'small',
                fullWidth: true,
                error: invalidRange,
                helperText: invalidRange ? 'Rango inválido' : '',
              },
            }}
          />
        </Box>

        <Box>
          <TextField
            size="small"
            fullWidth
            label="Nº Factura"
            value={invoiceNumber}
            onChange={(e) => setInvoiceNumber(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleSearch(); }}
          />
        </Box>

        <Box>
          <TextField
            size="small"
            fullWidth
            select
            label="Estado"
            value={statusLocal}
            onChange={(e) => setStatusLocal(e.target.value)}
            SelectProps={{
              displayEmpty: true,
              renderValue: (selected) =>
                selected || <span style={{ color: 'rgba(255,255,255,0.6)' }}>Estado</span>,
            }}
            sx={{ '& .MuiSelect-select': { minHeight: 40, display: 'flex', alignItems: 'center' } }}
          >
            <MenuItem value="">Estado</MenuItem>
            <MenuItem value="Vigente">Vigente</MenuItem>
            <MenuItem value="Cancelado">Cancelado</MenuItem>
            <MenuItem value="Pendiente">Pendiente</MenuItem>
            <MenuItem value="Pagado">Pagado</MenuItem>
            <MenuItem value="Vencido">Vencido</MenuItem>
          </TextField>
        </Box>

        <Box sx={{ gridColumn: { xs: '1', sm: '1 / -1' } }}>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={1.5}
            justifyContent="center"
          >
            <Button
              variant="outlined"
              color="primary"
              startIcon={<ClearAllIcon />}
              onClick={handleClear}
              disabled={loading}
              sx={{
                minHeight: 44,
                px: 2.5,
                fontWeight: 600,
                borderWidth: 2,
                borderColor: 'primary.main',
                '&:hover': { borderWidth: 2 },
              }}
            >
              LIMPIAR
            </Button>

            <Button
              variant="contained"
              color="primary"
              startIcon={<SearchIcon />}
              onClick={handleSearch}
              disabled={!canSearch || loading}
              sx={{ minHeight: 44, px: 2.5, fontWeight: 700, boxShadow: 'none' }}
            >
              BUSCAR
            </Button>
          </Stack>
        </Box>
      </Box>
    </Paper>
  );
}
