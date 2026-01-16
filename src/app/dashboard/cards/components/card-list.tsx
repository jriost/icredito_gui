"use client";

import * as React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  type ColumnDef,
  type PaginationState,
} from "@tanstack/react-table";
import { MoreHorizontal, Lock, Unlock, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DataTable } from "@/components/ui/data-table";
import { useToast } from "@/hooks/use-toast";
import { getErrorMessage } from "@/lib/utils";
import type { CreditCardSummary, CreditCardDetail } from "@/lib/definitions";
import { getCards, deleteCard, blockCard, activateCard } from "@/lib/services/card-service";

interface CardsListProps {
  onEdit: (card: CreditCardDetail) => void;
}

export function CardsList({ onEdit }: CardsListProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = React.useState(false);
  const [cardToDelete, setCardToDelete] = React.useState<CreditCardDetail | null>(null);

  const [searchTerm, setSearchTerm] = React.useState("");
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  });

  const { data: cards, isLoading, isError, error } = useQuery<CreditCardSummary[], Error>({
    queryKey: ["cards"],
    queryFn: getCards,
  });
  
  const filteredData = React.useMemo(() => {
    if (!cards) return [];
    const lowercasedFilter = searchTerm.toLowerCase();
    return cards.filter(card =>
      (card.alias?.toLowerCase() || '').includes(lowercasedFilter) ||
      (card.brand?.toLowerCase() || '').includes(lowercasedFilter) ||
      (card.maskedNumber?.toLowerCase() || '').includes(lowercasedFilter)
    );
  }, [cards, searchTerm]);

  const pageCount = Math.ceil(filteredData.length / pagination.pageSize);

  const paginatedData = React.useMemo(() => {
    const start = pagination.pageIndex * pagination.pageSize;
    const end = start + pagination.pageSize;
    return filteredData.slice(start, end);
  }, [filteredData, pagination]);

  const mutationOptions = {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cards"] });
      toast({ title: "Acción completada", description: "El estado de la tarjeta ha sido actualizado." });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: getErrorMessage(error), variant: "destructive" });
    },
  };

  const deleteMutation = useMutation({ ...mutationOptions, mutationFn: deleteCard });
  const blockMutation = useMutation({ ...mutationOptions, mutationFn: blockCard });
  const activateMutation = useMutation({ ...mutationOptions, mutationFn: activateCard });

  const handleDeleteRequest = (card: CreditCardDetail) => {
    setCardToDelete(card);
    setIsDeleteAlertOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (cardToDelete) {
      deleteMutation.mutate(cardToDelete.id, {
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["cards"] });
            toast({ title: "Tarjeta eliminada" });
            setIsDeleteAlertOpen(false);
        }
      });
    }
  };

  const columns: ColumnDef<CreditCardSummary>[] = [
    {
      accessorKey: "brand",
      header: "Marca",
      cell: ({ row }) => <Badge variant="outline">{row.original.brand}</Badge>,
    },
    {
      accessorKey: "maskedNumber",
      header: "Número",
    },
    {
      accessorKey: "alias",
      header: "Alias",
    },
    {
      accessorKey: "status",
      header: "Estado",
      cell: ({ row }) => <Badge variant={row.original.status === 'Active' ? 'default' : 'destructive'}>{row.original.status}</Badge>,
    },
    {
        accessorKey: "currentBalance",
        header: "Saldo Actual",
        cell: ({ row }) => new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(row.original.currentBalance)
    },
    {
        accessorKey: "availableCredit",
        header: "Crédito Disponible",
        cell: ({ row }) => new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(row.original.availableCredit)
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Abrir menú</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => onEdit(row.original as CreditCardDetail)}>Editar Alias</DropdownMenuItem>
            <DropdownMenuSeparator />
            {row.original.status === "Active" ? (
              <DropdownMenuItem onClick={() => blockMutation.mutate(row.original.id)}>
                <Lock className="mr-2 h-4 w-4" /> Bloquear
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem onClick={() => activateMutation.mutate(row.original.id)}>
                <Unlock className="mr-2 h-4 w-4" /> Activar
              </DropdownMenuItem>
            )}
            <DropdownMenuItem onClick={() => handleDeleteRequest(row.original as CreditCardDetail)} className="text-destructive">
              <Trash2 className="mr-2 h-4 w-4" /> Eliminar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <>
      <DataTable
        columns={columns}
        data={paginatedData}
        pageCount={pageCount}
        pagination={pagination}
        onPaginationChange={setPagination}
        onSearchChange={setSearchTerm}
        isLoading={isLoading}
        isError={isError}
        error={error}
        searchPlaceholder="Buscar por alias, marca o número..."
      />
      <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará permanentemente la tarjeta{" "}
              <strong>{cardToDelete?.alias} ({cardToDelete?.maskedNumber})</strong>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} disabled={deleteMutation.isPending}>
              {deleteMutation.isPending ? "Eliminando..." : "Eliminar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
