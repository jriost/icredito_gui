
"use client";

import * as React from "react";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { PlusCircle } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getPayments } from "@/lib/services/payment-service";
import type { PaginatedPayments, Payment } from "@/lib/definitions";
import { PaymentForm } from "./components/payment-form";

const queryClient = new QueryClient();

function PaymentsPageContent() {
  const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 10 });
  const [isFormOpen, setIsFormOpen] = React.useState(false);

  const { data, isLoading, isError, error } = useQuery<PaginatedPayments, Error>({
    queryKey: ["payments", pagination.pageIndex, pagination.pageSize],
    queryFn: () => getPayments(pagination.pageIndex + 1, pagination.pageSize),
    placeholderData: (previousData) => previousData,
  });

  const columns: ColumnDef<Payment>[] = [
    {
      accessorKey: "createdAt",
      header: "Fecha",
      cell: ({ row }) => {
        const date = row.original.createdAt;
        try {
          return date ? format(new Date(date), "dd/MM/yyyy HH:mm") : 'N/A';
        } catch (e) {
          return 'Fecha inválida';
        }
      },
    },
    {
      accessorKey: "merchantName",
      header: "Comercio",
    },
    {
      accessorKey: "amount",
      header: "Monto",
      cell: ({ row }) => new Intl.NumberFormat('es-MX', { style: 'currency', currency: row.original.currency || 'MXN' }).format(row.original.amount),
    },
    {
      accessorKey: "status",
      header: "Estado",
      cell: ({ row }) => <Badge variant={row.original.status === 'Completed' ? 'default' : 'destructive'}>{row.original.status}</Badge>,
    },
     {
      accessorKey: "reference",
      header: "Referencia",
    },
  ];

  return (
    <>
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Historial de Pagos</CardTitle>
                <CardDescription>
                  Consulta todas las transacciones de pago realizadas con tus tarjetas.
                </CardDescription>
              </div>
              <Button onClick={() => setIsFormOpen(true)}>
                <PlusCircle className="mr-2 h-4 w-4" /> Registrar Pago
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <DataTable
                columns={columns}
                data={data?.payments ?? []}
                pageCount={data?.totalPages ?? 0}
                pagination={pagination}
                onPaginationChange={setPagination}
                isLoading={isLoading}
                isError={isError}
                error={error}
            />
          </CardContent>
        </Card>
        <PaymentForm 
          isOpen={isFormOpen}
          onOpenChange={setIsFormOpen}
          queryClient={queryClient}
        />
    </>
  );
}


export default function PaymentsPage() {
    return (
        <QueryClientProvider client={queryClient}>
            <PaymentsPageContent />
        </QueryClientProvider>
    )
}
