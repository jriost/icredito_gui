
"use client";

import * as React from "react";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { getTransactions } from "@/lib/services/transaction-service";
import type { PaginatedTransactions, Transaction } from "@/lib/definitions";

const queryClient = new QueryClient();

function TransactionsPageContent() {
  const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 10 });

  const { data, isLoading, isError, error } = useQuery<PaginatedTransactions, Error>({
    queryKey: ["transactions", pagination.pageIndex, pagination.pageSize],
    queryFn: () => getTransactions(pagination.pageIndex + 1, pagination.pageSize),
    placeholderData: (previousData) => previousData,
  });

  const columns: ColumnDef<Transaction>[] = [
    {
      accessorKey: "date",
      header: "Fecha",
      cell: ({ row }) => {
        const date = row.original.date;
        try {
          return date ? format(new Date(date), "dd/MM/yyyy HH:mm") : 'N/A';
        } catch (e) {
          return 'Fecha inválida';
        }
      },
    },
    {
      accessorKey: "cardMaskedNumber",
      header: "Tarjeta",
    },
     {
      accessorKey: "type",
      header: "Tipo",
      cell: ({ row }) => <Badge variant={row.original.type === 'Purchase' ? 'secondary' : 'default'}>{row.original.type}</Badge>,
    },
    {
      accessorKey: "description",
      header: "Descripción",
    },
    {
      accessorKey: "amount",
      header: "Monto",
      cell: ({ row }) => new Intl.NumberFormat('es-MX', { style: 'currency', currency: row.original.currency || 'MXN' }).format(row.original.amount),
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Historial de Transacciones</CardTitle>
        <CardDescription>
          Consulta todos los movimientos realizados con tus tarjetas.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <DataTable
            columns={columns}
            data={data?.transactions ?? []}
            pageCount={data?.totalPages ?? 0}
            pagination={pagination}
            onPaginationChange={setPagination}
            isLoading={isLoading}
            isError={isError}
            error={error}
        />
      </CardContent>
    </Card>
  );
}


export default function TransactionsPage() {
    return (
        <QueryClientProvider client={queryClient}>
            <TransactionsPageContent />
        </QueryClientProvider>
    )
}
