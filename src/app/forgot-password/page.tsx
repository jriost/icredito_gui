'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Suspense, useEffect, useActionState } from 'react'
import { useFormStatus } from 'react-dom'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { requestPasswordReset, type PasswordResetState } from '@/lib/actions'
import { PlaceHolderImages } from '@/lib/placeholder-images'
import { CircleAlert, CircleCheck } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

function ForgotPasswordForm() {
  const { toast } = useToast()
  const initialState: PasswordResetState = { message: null, errors: {}, success: false }
  const [state, dispatch] = useActionState(requestPasswordReset, initialState)

  useEffect(() => {
    if (state.message) {
      toast({
        title: state.success ? "Solicitud Enviada" : "Error",
        description: state.message,
        variant: state.success ? "default" : "destructive",
      })
    }
  }, [state, toast])


  return (
    <Card className="w-full max-w-md bg-background/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-2xl font-bold tracking-tight">¿Olvidaste tu contraseña?</CardTitle>
        <CardDescription>
          No te preocupes. Ingresa tu email y te enviaremos un enlace para restablecerla.
        </CardDescription>
      </CardHeader>
      <form action={dispatch}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              name="email"
              placeholder="tu@email.com"
              required
              aria-describedby="email-error"
            />
            <div id="email-error" aria-live="polite" aria-atomic="true">
              {state.errors?.email &&
                state.errors.email.map((error: string) => (
                  <p className="mt-2 text-sm text-destructive" key={error}>
                    {error}
                  </p>
                ))}
            </div>
          </div>
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
          <Button variant="link" asChild>
            <Link href="/login">Volver a iniciar sesión</Link>
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}

function SubmitButton() {
  const { pending } = useFormStatus()
 
  return (
    <Button type="submit" className="w-full" aria-disabled={pending}>
      {pending ? 'Enviando...' : 'Enviar enlace'}
    </Button>
  )
}

export default function ForgotPasswordPage() {
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
          <ForgotPasswordForm />
        </Suspense>
      </div>
    </div>
  )
}
