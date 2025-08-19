import { useEffect, useMemo, useState } from 'react';
import { fetchInvoices } from '../api/client';
import { format } from 'date-fns';
const ymd = (d) => format(d, 'yyyy-MM-dd');

export function useInvoices() {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [params, setParams] = useState({
    start_date: ymd(startOfMonth),
    end_date: ymd(now),
    invoice_number: '',
    status: '',
    sort_by: 'invoice_date',
    sort_dir: 'asc',
    page: 1,
    per_page: 50,
  });

  const [rows, setRows] = useState([]);
  const [meta, setMeta] = useState({ count: 0, page: 1, per_page: 50, total_pages: 0 });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  useEffect(() => {
    let aborted = false;
    (async () => {
      try {
        setLoading(true); setErr('');
        const { items, meta } = await fetchInvoices(params);
        if (!aborted) { setRows(items); setMeta(meta); }
      } catch (e) {
        if (!aborted) setErr(e.message || 'Error');
      } finally {
        if (!aborted) setLoading(false);
      }
    })();
    return () => { aborted = true; };
  }, [params]);

  const gridPaginationModel = useMemo(() => ({
    page: (params.page ?? 1) - 1,
    pageSize: params.per_page ?? 50,
  }), [params.page, params.per_page]);

  const gridSortModel = useMemo(() => ([
    { field: params.sort_by, sort: params.sort_dir },
  ]), [params.sort_by, params.sort_dir]);

  return { rows, meta, params, setParams, loading, err, gridPaginationModel, gridSortModel };
}
