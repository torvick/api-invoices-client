import { http } from '@/shared/lib/http';
import qs from 'qs';

export async function fetchInvoices(params) {
  const query = qs.stringify(
    {
      start_date: params.start_date,
      end_date: params.end_date,
      invoice_number: params.invoice_number || undefined,
      status: params.status || undefined,
      sort_by: params.sort_by || 'invoice_date',
      sort_dir: params.sort_dir || 'asc',
      page: params.page ?? 1,
      per_page: params.per_page ?? 50,
    },
    { addQueryPrefix: true, skipNulls: true }
  );

  const json = await http(`/api/v1/invoices${query}`);
  const items = json?.data?.invoices ?? [];
  const meta = json?.meta ?? {};
  return { items, meta };
}
