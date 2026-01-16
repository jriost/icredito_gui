"use client"

import Image from "next/image"
import Link from "next/link"
import { Suspense, useEffect, useActionState } from "react"
import { useFormStatus } from "react-dom"
import { useSearchParams } from 'next/navigation'
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { useToast } from "@/hooks/use-toast"
import { resetPassword, type ResetPasswordState } from "@/lib/actions"
import { PlaceHolderImages } from "@/lib/placeholder-images"
import { CircleAlert, CircleCheck } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"


const passwordResetSchema = z.object({
  password: z.string().min(8, { message: "La contraseña debe tener al menos 8 caracteres." }),
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden.",
  path: ["confirmPassword"],
})

type ResetPasswordFormValues = z.infer<typeof passwordResetSchema>

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? "Cambiando contraseña..." : "Cambiar Contraseña"}
    </Button>
  )
}

function ResetPasswordFormComponent() {
  const { toast } = useToast()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(passwordResetSchema),
    defaultValues: {
      password: "",
      confirmPassword: ""
    }
  })

  const initialState: ResetPasswordState = { message: null, errors: {}, success: false }
  const [state, dispatch] = useActionState(resetPassword, initialState)

  useEffect(() => {
    if (state.message) {
      toast({
        title: state.success ? "Éxito" : "Error",
        description: state.message,
        variant: state.success ? "default" : "destructive",
      })
    }
  }, [state, toast])

  if (!token) {
    return (
      <Card className="w-full max-w-md bg-background/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-2xl font-bold tracking-tight">Token Inválido</CardTitle>
          <CardDescription>
            El enlace para restablecer la contraseña no es válido o ha expirado.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Button asChild className="w-full">
            <Link href="/forgot-password">Solicitar un nuevo enlace</Link>
          </Button>
        </CardFooter>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md bg-background/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-2xl font-bold tracking-tight">Restablecer Contraseña</CardTitle>
        <CardDescription>
          Ingresa tu nueva contraseña a continuación.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form action={dispatch} className="space-y-4">
          <CardContent className="space-y-4">
             <input type="hidden" name="token" value={token} />
             <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nueva Contraseña</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="********" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirmar Nueva Contraseña</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="********" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             {state.message && (
             <Alert variant={state.success ? "default" : "destructive"} className={state.success ? 'border-green-500 text-green-700 dark:border-green-600 dark:text-green-400 [&>svg]:text-green-500 dark:[&>svg]:text-green-600' : ''}>
              {state.success ? <CircleCheck className="h-4 w-4" /> : <CircleAlert className="h-4 w-4" />}
              <AlertTitle>{state.success ? "Éxito" : "Error"}</AlertTitle>
              <AlertDescription>
                {state.message}
              </AlertDescription>
            </Alert>
          )}
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <SubmitButton />
          </CardFooter>
        </form>
      </Form>
    </Card>
  )
}


export default function ResetPasswordPage() {
  const loginImage = PlaceHolderImages.find(p => p.id === 'login-image');

  return (
    <div className="relative min-h-screen w-full">
      {loginImage && (
        <Image
          src={loginImage.imageUrl}
          alt={loginImage.description}
          fill
          className="object-cover"
          data-ai-hint={loginImage.imageHint}
        />
      )}
      <div className="absolute inset-0 bg-black/60" />
      <div className="relative z-10 flex min-h-screen items-center justify-center p-4">
        <Suspense>
          <ResetPasswordFormComponent />
        </Suspense>
      </div>
    </div>
  )
}
