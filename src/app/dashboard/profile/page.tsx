
"use client"

import * as React from "react"
import { useQuery, useMutation, useQueryClient, QueryClient, QueryClientProvider } from "@tanstack/react-query"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { getProfile, updateProfile } from "@/lib/services/auth-service"
import type { User } from "@/lib/definitions"
import { Skeleton } from "@/components/ui/skeleton"
import { UserForm } from "../users/user-form"
import { getErrorMessage } from "@/lib/utils"

const queryClient = new QueryClient();

function ProfilePage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: user, isLoading, isError, error } = useQuery<User, Error>({
    queryKey: ["userProfile"],
    queryFn: getProfile,
  });

  const mutation = useMutation({
    mutationFn: (values: Partial<User>) => updateProfile(values),
    onSuccess: () => {
      toast({ title: "Perfil actualizado", description: "Tus cambios han sido guardados." });
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
    },
    onError: (error) => {
      toast({
        title: "Error al actualizar",
        description: getErrorMessage(error),
        variant: "destructive",
      });
    },
  });

  const handleFormSubmit = (values: any) => {
    mutation.mutate(values);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mi Perfil</CardTitle>
        <CardDescription>
          Aquí puedes actualizar tu información personal.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading && (
          <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <div className="flex justify-end">
                <Skeleton className="h-10 w-24" />
              </div>
          </div>
        )}
        {isError && <p className="text-destructive">Error al cargar el perfil: {getErrorMessage(error)}</p>}
        {user && !isLoading && (
          <UserForm 
            user={user} 
            onSubmit={handleFormSubmit}
            isPending={mutation.isPending}
            onCancel={() => {}} 
            isProfileForm={true}
          />
        )}
      </CardContent>
    </Card>
  )
}

export default function ProfilePageWrapper() {
  return (
    <QueryClientProvider client={queryClient}>
      <ProfilePage />
    </QueryClientProvider>
  )
}
