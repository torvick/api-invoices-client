import { DataGrid } from '@mui/x-data-grid';
import { Chip } from '@mui/material';

const asNumber = (v) => {
  if (v == null) return null;
  if (typeof v === 'number') return v;
  const n = parseFloat(String(v).replace(',', '.'));
  return Number.isFinite(n) ? n : null;
};

const normalizeActive = (v) => {
  if (typeof v === 'boolean') return v;
  if (typeof v === 'string') return v.toLowerCase() === 'true' || v === '1' || v === 't';
  if (typeof v === 'number') return v === 1;
  return false;
};

const normalizeRow = (r) => {
  const id              = r.id ?? '';
  const invoice_number  = r.invoice_number ?? '';
  const invoice_date    = r.invoice_date ?? '';
  const totalRaw        = r.total ?? 0;
  const status          = r.status ?? '';
  const activeRaw       = r.active ?? '';
  const currency        = 'MXN';

  return {
    id,
    invoice_number,
    invoice_date,
    total: asNumber(totalRaw),
    status,
    active: normalizeActive(activeRaw),
    currency,
  };
};

export default function InvoicesTable({
  rows = [],
  meta,
  loading,
  gridPaginationModel,
  gridSortModel,
  onGridChange,
}) {
  const cookedRows = (Array.isArray(rows) ? rows : []).filter(Boolean).map(normalizeRow);

  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'invoice_number', headerName: 'Invoice #', minWidth: 140, flex: 1 },
    {
      field: 'invoice_date',
      headerName: 'Fecha',
      width: 200,
      renderCell: (p) => {
        const v = p?.value;
        if (!v) return '';
        const d = new Date(v);
        return Number.isNaN(d.getTime()) ? String(v) : d.toLocaleString();
      },
    },
    {
      field: 'total',
      headerName: 'Total',
      width: 160,
      type: 'number',
      renderCell: (p) => {
        const v = p?.row?.total;
        const ccy = p?.row?.currency || 'MXN';
        return v == null ? '' : Number(v).toLocaleString('es-MX', { style: 'currency', currency: ccy });
      },
    },
    { field: 'status', headerName: 'Status', width: 140 },
    {
      field: 'active',
      headerName: 'Active',
      width: 120,
      sortable: false,
      renderCell: (p) =>
        p?.row?.active ? (
          <Chip size="small" label="Activo" color="success" />
        ) : (
          <Chip size="small" label="Inactivo" variant="outlined" />
        ),
    },
  ];

  return (
    <div style={{ height: 560, width: '100%' }}>
      <DataGrid
        rows={cookedRows}
        columns={columns}
        getRowId={(r) => r.id}
        loading={loading}
        disableColumnMenu
        disableRowSelectionOnClick
        density="compact"

        pagination
        paginationMode="server"
        rowCount={meta?.count ?? 0}
        paginationModel={gridPaginationModel}
        onPaginationModelChange={(model) => onGridChange({ type: 'pagination', model })}

        sortingMode="server"
        sortModel={gridSortModel}
        onSortModelChange={(model) => onGridChange({ type: 'sorting', model })}
      />
    </div>
  );
}
