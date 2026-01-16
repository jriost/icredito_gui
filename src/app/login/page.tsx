
'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Suspense, useEffect, useActionState } from 'react'
import { useSearchParams } from 'next/navigation'
import { useFormStatus } from 'react-dom'
import { motion } from 'framer-motion'

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
import { login, type LoginState } from '@/lib/actions'
import { CircleAlert } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { PlaceHolderImages } from '@/lib/placeholder-images'

function LoginFormComponent() {
  const searchParams = useSearchParams()
  const from = searchParams.get('from')
  const passwordReset = searchParams.get('password_reset')
  const { toast } = useToast()

  const initialState: LoginState = { message: null, errors: {} }
  const [state, dispatch] = useActionState(login, initialState)

  useEffect(() => {
    if (passwordReset) {
      toast({
        title: "Contraseña Restablecida",
        description: "Tu contraseña ha sido cambiada exitosamente. Ahora puedes iniciar sesión.",
        variant: "default",
      })
    }
  }, [passwordReset, toast])
  
  const loginImage = PlaceHolderImages.find(p => p.id === 'login-image');
  const logoImage = PlaceHolderImages.find(p => p.id === 'login-logo');

  return (
    <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-sm md:max-w-4xl"
      >
      <Card className="overflow-hidden md:grid md:grid-cols-2 shadow-2xl border-border/20">
        <div className="flex flex-col justify-center bg-card p-6 sm:p-10">
          <CardHeader>
              <div className="flex flex-col items-center justify-center gap-2 mb-4">
                {logoImage && (
                  <Image
                    src={logoImage.imageUrl}
                    alt={logoImage.description}
                    width={64}
                    height={64}
                    className="size-16"
                    data-ai-hint={logoImage.imageHint}
                  />
                )}
                <CardTitle className="text-2xl font-bold tracking-tight">iCredito</CardTitle>
              </div>
              <CardDescription className="text-center">
                  Ingresa tu usuario y contraseña para acceder a tu cuenta.
              </CardDescription>
          </CardHeader>
          <form action={dispatch}>
              <CardContent className="space-y-4">
              <input type="hidden" name="from" value={from || ''} />
              <div className="space-y-2">
                  <Label htmlFor="username">Usuario</Label>
                  <Input
                  id="username"
                  type="text"
                  name="username"
                  placeholder="tu-usuario"
                  required
                  aria-describedby="username-error"
                  defaultValue="testuser"
                  />
                  <div id="username-error" aria-live="polite" aria-atomic="true">
                  {state.errors?.username &&
                      state.errors.username.map((error: string) => (
                      <p className="mt-2 text-sm text-destructive" key={error}>
                          {error}
                      </p>
                      ))}
                  </div>
              </div>
              <div className="space-y-2">
                  <div className="flex items-center">
                  <Label htmlFor="password">Contraseña</Label>
                  <Link
                      href="/forgot-password"
                      className="ml-auto inline-block text-sm text-primary hover:underline"
                  >
                      ¿Olvidaste tu contraseña?
                  </Link>
                  </div>
                  <Input id="password" type="password" name="password" required 
                  aria-describedby="password-error"
                  defaultValue="password"
                  />
                  <div id="password-error" aria-live="polite" aria-atomic="true">
                  {state.errors?.password &&
                      state.errors.password.map((error: string) => (
                      <p className="mt-2 text-sm text-destructive" key={error}>
                          {error}
                      </p>
                      ))}
                  </div>
              </div>
              {state.message && (
                  <Alert variant="destructive">
                  <CircleAlert className="h-4 w-4" />
                  <AlertTitle>Error al iniciar sesión</AlertTitle>
                  <AlertDescription>
                      {state.message}
                  </AlertDescription>
                  </Alert>
              )}
              </CardContent>
              <CardFooter className="flex flex-col items-stretch gap-4">
                <LoginButton />
              </CardFooter>
          </form>
          <CardContent className="mt-4 text-center text-sm">
              ¿No tienes una cuenta?{" "}
              <Link href="/register" className="font-semibold text-primary hover:underline">
                  Regístrate
              </Link>
          </CardContent>
        </div>
        <div className="relative hidden h-full md:block">
           {loginImage && (
              <Image
                src={loginImage.imageUrl}
                alt={loginImage.description}
                fill
                className="object-cover"
                data-ai-hint={loginImage.imageHint}
              />
           )}
        </div>
      </Card>
    </motion.div>
  )
}

function LoginButton() {
  const { pending } = useFormStatus()
 
  return (
    <Button type="submit" className="w-full" aria-disabled={pending}>
      {pending ? 'Iniciando sesión...' : 'Iniciar Sesión'}
    </Button>
  )
}


export default function LoginPage() {
  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-background p-4">
      <div className="absolute -left-40 -top-40 size-[40rem] animate-blob rounded-full bg-primary/30 opacity-70 blur-3xl filter" />
      <div className="animation-delay-2000 absolute -right-40 -top-20 size-[40rem] animate-blob rounded-full bg-accent/30 opacity-70 blur-3xl filter" />
      <div className="animation-delay-4000 absolute -bottom-40 left-20 size-[35rem] animate-blob rounded-full bg-secondary/30 opacity-70 blur-3xl filter" />
      <div className="relative z-10">
        <Suspense>
            <LoginFormComponent />
        </Suspense>
      </div>
    </div>
  )
}
