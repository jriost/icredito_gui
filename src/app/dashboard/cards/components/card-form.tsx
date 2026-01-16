"use client"

import { useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useMutation, useQueryClient } from "@tanstack/react-query"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { getErrorMessage } from "@/lib/utils"
import { createCard, updateCard } from "@/lib/services/card-service"
import type { CreditCardDetail } from "@/lib/definitions"

const cardFormSchema = z.object({
  alias: z.string().min(2, "El alias debe tener al menos 2 caracteres."),
  // Campos para creación
  cardNumber: z.string().optional(),
  cardholderName: z.string().optional(),
  expirationMonth: z.coerce.number().optional(),
  expirationYear: z.coerce.number().optional(),
  cvv: z.string().optional(),
  brand: z.string().optional(),
  type: z.string().optional(),
  creditLimit: z.coerce.number().optional(),
})

type CardFormValues = z.infer<typeof cardFormSchema>

interface CardFormProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  card: CreditCardDetail | null
}

export function CardForm({ isOpen, onOpenChange, card }: CardFormProps) {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const isEditing = !!card

  const form = useForm<CardFormValues>({
    resolver: zodResolver(cardFormSchema),
    defaultValues: {
      alias: "",
      cardNumber: "",
      cardholderName: "",
      expirationMonth: undefined,
      expirationYear: undefined,
      cvv: "",
      brand: "",
      type: "",
      creditLimit: undefined,
    },
  })

  useEffect(() => {
    if (isOpen) {
      if (card) {
        form.reset({ alias: card.alias })
      } else {
        form.reset({
          alias: "",
          cardNumber: "",
          cardholderName: "",
          expirationMonth: undefined,
          expirationYear: undefined,
          cvv: "",
          brand: "",
          type: "",
          creditLimit: undefined,
        })
      }
    }
  }, [card, isOpen, form])

  const mutation = useMutation({
    mutationFn: (data: CardFormValues) => {
      if (isEditing) {
        return updateCard(card.id, { alias: data.alias })
      } else {
        return createCard(data)
      }
    },
    onSuccess: () => {
      toast({
        title: `Tarjeta ${isEditing ? "actualizada" : "creada"}`,
        description: "Los cambios se han guardado correctamente.",
      })
      queryClient.invalidateQueries({ queryKey: ["cards"] })
      onOpenChange(false)
    },
    onError: (error) => {
      toast({
        title: `Error al ${isEditing ? "actualizar" : "crear"}`,
        description: getErrorMessage(error),
        variant: "destructive",
      })
    },
  })

  const onSubmit = (values: CardFormValues) => {
    mutation.mutate(values)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditing ? "Editar Tarjeta" : "Crear Nueva Tarjeta"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Actualiza el alias de tu tarjeta."
              : "Completa los detalles para añadir una nueva tarjeta."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="alias"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Alias</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: Tarjeta de Viajes" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {!isEditing && (
              <>
                <FormField
                  control={form.control}
                  name="cardNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Número de Tarjeta</FormLabel>
                      <FormControl>
                        <Input placeholder="**** **** **** ****" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="cardholderName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre del Titular</FormLabel>
                      <FormControl>
                        <Input placeholder="JOHN DOE" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-3 gap-4">
                    <FormField control={form.control} name="expirationMonth" render={({ field }) => (<FormItem><FormLabel>Mes Exp</FormLabel><FormControl><Input type="number" placeholder="MM" {...field} /></FormControl></FormItem>)} />
                    <FormField control={form.control} name="expirationYear" render={({ field }) => (<FormItem><FormLabel>Año Exp</FormLabel><FormControl><Input type="number" placeholder="YY" {...field} /></FormControl></FormItem>)} />
                    <FormField control={form.control} name="cvv" render={({ field }) => (<FormItem><FormLabel>CVV</FormLabel><FormControl><Input placeholder="123" {...field} /></FormControl></FormItem>)} />
                </div>
                 <div className="grid grid-cols-2 gap-4">
                    <FormField control={form.control} name="brand" render={({ field }) => (<FormItem><FormLabel>Marca</FormLabel><FormControl><Input placeholder="Visa" {...field} /></FormControl></FormItem>)} />
                    <FormField control={form.control} name="type" render={({ field }) => (<FormItem><FormLabel>Tipo</FormLabel><FormControl><Input placeholder="Gold" {...field} /></FormControl></FormItem>)} />
                 </div>
                <FormField
                  control={form.control}
                  name="creditLimit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Límite de Crédito</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="10000" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </>
            )}
            <DialogFooter>
              <DialogClose asChild><Button type="button" variant="ghost">Cancelar</Button></DialogClose>
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? "Guardando..." : "Guardar"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
