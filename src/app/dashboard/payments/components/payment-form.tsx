"use client";

import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useQuery, useMutation, type QueryClient } from "@tanstack/react-query";

import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getErrorMessage } from "@/lib/utils";
import { getCards } from "@/lib/services/card-service";
import { createPayment } from "@/lib/services/payment-service";
import type { CreditCardSummary } from "@/lib/definitions";

const paymentFormSchema = z.object({
  creditCardId: z.string({ required_error: "Debe seleccionar una tarjeta." }),
  amount: z.coerce.number().min(1, "El monto debe ser mayor a 0."),
  currency: z.string().min(3, "La moneda es obligatoria.").max(3, "La moneda debe tener 3 caracteres."),
  merchantName: z.string().min(2, "El nombre del comercio es obligatorio."),
  merchantCategory: z.string().min(2, "La categoría es obligatoria."),
  description: z.string().optional(),
});

type PaymentFormValues = z.infer<typeof paymentFormSchema>;

interface PaymentFormProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  queryClient: QueryClient;
}

export function PaymentForm({ isOpen, onOpenChange, queryClient }: PaymentFormProps) {
  const { toast } = useToast();
  
  const { data: cards, isLoading: isLoadingCards } = useQuery<CreditCardSummary[]>({
    queryKey: ['cards'],
    queryFn: getCards,
  });

  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentFormSchema),
    defaultValues: {
      currency: "MXN",
      description: "",
    },
  });

  const mutation = useMutation({
    mutationFn: createPayment,
    onSuccess: () => {
      toast({ title: "Pago Registrado", description: "El pago se ha procesado correctamente." });
      queryClient.invalidateQueries({ queryKey: ["payments"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] }); // Payments also create transactions
      queryClient.invalidateQueries({ queryKey: ["dashboardData"] }); // And affect dashboard
      onOpenChange(false);
    },
    onError: (error) => toast({ title: "Error al registrar el pago", description: getErrorMessage(error), variant: "destructive" }),
  });

  const onSubmit = (values: PaymentFormValues) => {
    mutation.mutate(values);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Registrar Nuevo Pago</DialogTitle>
          <DialogDescription>Simula el pago en un comercio. Esto generará un cargo en la tarjeta seleccionada.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="creditCardId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tarjeta de Crédito</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoadingCards}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={isLoadingCards ? "Cargando tarjetas..." : "Seleccione una tarjeta"} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {cards?.map(card => (
                        <SelectItem key={card.id} value={card.id}>
                          {card.alias} ({card.maskedNumber})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="amount" render={({ field }) => (<FormItem><FormLabel>Monto</FormLabel><FormControl><Input type="number" placeholder="100.00" {...field} /></FormControl><FormMessage /></FormItem>)} />
              <FormField control={form.control} name="currency" render={({ field }) => (<FormItem><FormLabel>Moneda</FormLabel><FormControl><Input placeholder="MXN" {...field} /></FormControl><FormMessage /></FormItem>)} />
            </div>
            <FormField control={form.control} name="merchantName" render={({ field }) => (<FormItem><FormLabel>Nombre del Comercio</FormLabel><FormControl><Input placeholder="Amazon" {...field} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="merchantCategory" render={({ field }) => (<FormItem><FormLabel>Categoría del Comercio</FormLabel><FormControl><Input placeholder="E-commerce" {...field} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="description" render={({ field }) => (<FormItem><FormLabel>Descripción (Opcional)</FormLabel><FormControl><Input placeholder="Compra de libros" {...field} /></FormControl><FormMessage /></FormItem>)} />

            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancelar</Button>
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? "Procesando..." : "Realizar Pago"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
