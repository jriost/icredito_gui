
"use client";

import * as React from "react";
import {
  type ColumnDef,
  type SortingState,
  type PaginationState,
  type RowSelectionState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useIsMobile } from "@/hooks/use-mobile";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  pageCount: number;
  pagination?: PaginationState;
  onPaginationChange?: React.Dispatch<React.SetStateAction<PaginationState>>;
  onSearchChange?: (value: string) => void;
  isLoading?: boolean;
  isError?: boolean;
  error?: Error | null;
  searchPlaceholder?: string;
  mobileCard?: (row: TData) => React.ReactNode;
  rowSelection?: RowSelectionState;
  setRowSelection?: React.Dispatch<React.SetStateAction<RowSelectionState>>;
  getRowId?: (row: TData) => string;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  pageCount,
  pagination,
  onPaginationChange,
  onSearchChange,
  isLoading = false,
  isError = false,
  error = null,
  searchPlaceholder = "Search...",
  mobileCard,
  rowSelection,
  setRowSelection,
  getRowId,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const isMobile = useIsMobile();

  const table = useReactTable({
    data,
    columns,
    pageCount,
    state: {
      sorting,
      ...(pagination && { pagination }),
      ...(rowSelection && { rowSelection }),
    },
    onSortingChange: setSorting,
    ...(onPaginationChange && { onPaginationChange }),
    ...(setRowSelection && { onRowSelectionChange: setRowSelection }),
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    ...(getRowId && { getRowId }),
    manualPagination: true,
    manualFiltering: true,
    manualSorting: true,
    enableRowSelection: true,
    debugTable: false,
  });

  const visibleColumns = table.getAllColumns().filter(c => c.getCanHide());
  
  const showMobileView = isMobile && mobileCard;

  return (
    <div className="w-full">
      {onSearchChange && (
        <div className="flex flex-col sm:flex-row items-center gap-4 py-4">
            <Input
                placeholder={searchPlaceholder}
                onChange={(event) => onSearchChange(event.target.value)}
                className="w-full sm:max-w-sm"
            />
            {visibleColumns.length > 0 && !showMobileView && (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full sm:w-auto sm:ml-auto">
                    Columnas <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                {visibleColumns.map((column) => {
                    return (
                        <DropdownMenuCheckboxItem
                        key={column.id}
                        className="capitalize"
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) =>
                            column.toggleVisibility(!!value)
                        }
                        >
                        {column.id.replace(/_/g, ' ')}
                        </DropdownMenuCheckboxItem>
                    );
                    })}
                </DropdownMenuContent>
            </DropdownMenu>
            )}
        </div>
      )}


      {showMobileView ? (
        <div className="space-y-4">
          {isLoading && Array.from({ length: pagination?.pageSize ?? 5 }).map((_, i) => <div key={i} className="p-4 border rounded-lg space-y-3 animate-pulse bg-muted/50 h-24" />)}
          {isError && (
             <div className="p-4 border rounded-lg text-center text-destructive">
                Error al cargar los datos: {error?.message}
            </div>
          )}
          {!isLoading && !isError && table.getRowModel().rows.length === 0 && (
             <div className="p-4 border rounded-lg text-center text-muted-foreground">
                No hay resultados.
            </div>
          )}
           {!isLoading && !isError && table.getRowModel().rows.map((row) => (
             <React.Fragment key={row.id}>
              {mobileCard(row.original)}
            </React.Fragment>
           ))}
        </div>
      ) : (
        <div className="rounded-md border">
          <div className="relative w-full overflow-auto">
              <Table>
              <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => {
                      return (
                          <TableHead key={header.id} style={{ minWidth: header.getSize() }}>
                          {header.isPlaceholder
                              ? null
                              : flexRender(
                                  header.column.columnDef.header,
                                  header.getContext()
                              )}
                          </TableHead>
      );
                      })}
                  </TableRow>
                  ))}
              </TableHeader>
              <TableBody>
                  {isLoading ? (
                  <TableRow>
                      <TableCell colSpan={columns.length} className="h-24 text-center">
                      Cargando...
                      </TableCell>
                  </TableRow>
                  ) : isError ? (
                  <TableRow>
                      <TableCell colSpan={columns.length} className="h-24 text-center text-destructive">
                      Error al cargar los datos: {error?.message}
                      </TableCell>
                  </TableRow>
                  ) : table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                      <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                      >
                      {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id}>
                          {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                          )}
                          </TableCell>
                      ))}
                      </TableRow>
                  ))
                  ) : (
                  <TableRow>
                      <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                      >
                      No hay resultados.
                      </TableCell>
                  </TableRow>
                  )}
              </TableBody>
              </Table>
          </div>
        </div>
      )}
      {pagination && onPaginationChange && (
        <div className="flex items-center justify-end space-x-2 py-4">
            <div className="flex-1 text-sm text-muted-foreground">
                {table.getFilteredSelectedRowModel().rows.length} de{' '}
                {table.getFilteredRowModel().rows.length} fila(s) seleccionada(s).
            </div>
            <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">
                    Página {table.getState().pagination.pageIndex + 1} de{" "}
                    {table.getPageCount() || 0}
                </span>
                <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                >
                Anterior
                </Button>
                <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                >
                Siguiente
                </Button>
            </div>
        </div>
      )}
    </div>
  );
}
