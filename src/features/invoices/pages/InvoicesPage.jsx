import { Alert, Stack } from '@mui/material';
import InvoicesFilters from '../components/InvoicesFilters';
import InvoicesTable from '../components/InvoicesTable';
import { useInvoices } from '../hooks/useInvoices';

export default function InvoicesPage() {
  const { rows, meta, params, setParams, loading, err, gridPaginationModel, gridSortModel } = useInvoices();

  const onGridChange = ({ type, model }) => {
    if (type === 'pagination') {
      const { page, pageSize } = model; // page: 0-based
      setParams(p => ({ ...p, page: page + 1, per_page: pageSize })); // ⬅️ 1-based
    }
    if (type === 'sorting') {
      const entry = model?.[0];
      setParams(p => ({
        ...p,
        sort_by: entry?.field || 'invoice_date',
        sort_dir: entry?.sort || 'asc',
        page: 1,
      }));
    }
  };

  return (
    <Stack spacing={2}>
      <h1>Invoices</h1>

      <InvoicesFilters
        params={params}
        setParams={setParams}
        loading={loading}
      />

      {err && <Alert severity="error">{err}</Alert>}

      <InvoicesTable
        rows={rows}
        meta={meta}
        loading={loading}
        gridPaginationModel={gridPaginationModel}
        gridSortModel={gridSortModel}
        onGridChange={onGridChange}
      />
    </Stack>
  );
}
