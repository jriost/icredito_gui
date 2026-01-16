
"use client";

import React, { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import type { User } from "@/lib/definitions";

const userFormSchema = z.object({
  username: z.string().min(2, "El nombre de usuario debe tener al menos 2 caracteres."),
  firstName: z.string().min(2, "El nombre debe tener al menos 2 caracteres."),
  lastName: z.string().min(2, "El apellido debe tener al menos 2 caracteres."),
  email: z.string().email("Por favor, introduce un email válido."),
  password: z.string().optional(),
  isActive: z.boolean(),
});

type UserFormValues = z.infer<typeof userFormSchema>;

interface UserFormProps {
  user: Partial<User> | null;
  onSubmit: (values: Partial<UserFormValues>) => void;
  isPending: boolean;
  onCancel: () => void;
  isProfileForm?: boolean;
}

export function UserForm({ user, onSubmit, isPending, onCancel, isProfileForm = false }: UserFormProps) {

  const getDefaultValues = (user: Partial<User> | null): UserFormValues => {
    return {
      username: user?.username ?? "",
      firstName: user?.firstName ?? "",
      lastName: user?.lastName ?? "",
      email: user?.email ?? "",
      password: "",
      isActive: user?.isActive ?? true,
    };
  };

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: getDefaultValues(user),
  });

  useEffect(() => {
    form.reset(getDefaultValues(user));
  }, [user, form]);
  
  return (
    <>
      {!isProfileForm && (
        <DialogHeader>
          <DialogTitle>{user ? "Editar Usuario" : "Añadir Nuevo Usuario"}</DialogTitle>
          <DialogDescription>
            {user
              ? "Actualiza los detalles del usuario a continuación."
              : "Rellena el formulario para crear un nuevo usuario."}
          </DialogDescription>
        </DialogHeader>
      )}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre de usuario</FormLabel>
                  <FormControl>
                    <Input placeholder="johndoe" {...field} disabled={isProfileForm} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="john.doe@example.com" {...field} disabled={isProfileForm} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombres</FormLabel>
                  <FormControl>
                    <Input placeholder="John" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Apellidos</FormLabel>
                  <FormControl>
                    <Input placeholder="Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Contraseña</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="********" {...field} />
                  </FormControl>
                  <FormDescription>
                    {user ? "Dejar en blanco para mantener la contraseña actual." : "La contraseña es obligatoria para nuevos usuarios."}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {!isProfileForm && (
              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                        <FormLabel>Estado</FormLabel>
                        <FormDescription>
                            Indica si la cuenta de usuario está activa.
                        </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
          )}

          <DialogFooter>
             <Button type="button" variant="outline" onClick={onCancel}>
                Cancelar
              </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Guardando..." : "Guardar Cambios"}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </>
  );
}
