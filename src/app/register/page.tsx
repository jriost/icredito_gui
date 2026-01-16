
'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Suspense, useActionState } from 'react'
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
import { register, type RegisterState } from '@/lib/actions'
import { CircleAlert } from 'lucide-react'
import { PlaceHolderImages } from '@/lib/placeholder-images'

function RegisterFormComponent() {
  const initialState: RegisterState = { message: null, errors: {} }
  const [state, dispatch] = useActionState(register, initialState)
  
  const logoImage = PlaceHolderImages.find(p => p.id === 'login-logo');

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full max-w-md"
    >
      <Card className="shadow-2xl border-border/20">
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
                <CardTitle className="text-2xl font-bold tracking-tight">Crear una cuenta</CardTitle>
              </div>
              <CardDescription className="text-center">
                  Ingresa tus datos para registrarte en iCredito.
              </CardDescription>
          </CardHeader>
          <form action={dispatch}>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                      <Label htmlFor="firstName">Nombre</Label>
                      <Input id="firstName" name="firstName" placeholder="John" required />
                       {state.errors?.firstName && <p className="mt-2 text-sm text-destructive">{state.errors.firstName.join(', ')}</p>}
                  </div>
                   <div className="space-y-2">
                      <Label htmlFor="lastName">Apellido</Label>
                      <Input id="lastName" name="lastName" placeholder="Doe" required />
                      {state.errors?.lastName && <p className="mt-2 text-sm text-destructive">{state.errors.lastName.join(', ')}</p>}
                  </div>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="username">Nombre de Usuario</Label>
                    <Input id="username" name="username" placeholder="johndoe" required />
                    {state.errors?.username && <p className="mt-2 text-sm text-destructive">{state.errors.username.join(', ')}</p>}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" name="email" placeholder="tu@email.com" required />
                    {state.errors?.email && <p className="mt-2 text-sm text-destructive">{state.errors.email.join(', ')}</p>}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="password">Contraseña</Label>
                    <Input id="password" type="password" name="password" required />
                    {state.errors?.password && <p className="mt-2 text-sm text-destructive">{state.errors.password.join(', ')}</p>}
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
                    <Input id="confirmPassword" type="password" name="confirmPassword" required />
                    {state.errors?.confirmPassword && <p className="mt-2 text-sm text-destructive">{state.errors.confirmPassword.join(', ')}</p>}
                </div>

                {state.message && (
                  <Alert variant="destructive">
                    <CircleAlert className="h-4 w-4" />
                    <AlertTitle>Error en el Registro</AlertTitle>
                    <AlertDescription>{state.message}</AlertDescription>
                  </Alert>
                )}
              </CardContent>
              <CardFooter className="flex flex-col items-stretch gap-4">
                <RegisterButton />
                 <p className="mt-2 text-center text-sm text-muted-foreground">
                    ¿Ya tienes una cuenta?{' '}
                    <Link href="/login" className="font-semibold text-primary hover:underline">
                        Inicia sesión
                    </Link>
                </p>
              </CardFooter>
          </form>
      </Card>
    </motion.div>
  )
}

function RegisterButton() {
  const { pending } = useFormStatus()
 
  return (
    <Button type="submit" className="w-full" aria-disabled={pending}>
      {pending ? 'Creando cuenta...' : 'Crear Cuenta'}
    </Button>
  )
}

export default function RegisterPage() {
  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-background p-4">
      <div className="absolute -left-40 -top-40 size-[40rem] animate-blob rounded-full bg-primary/30 opacity-70 blur-3xl filter" />
      <div className="animation-delay-2000 absolute -right-40 -top-20 size-[40rem] animate-blob rounded-full bg-accent/30 opacity-70 blur-3xl filter" />
      <div className="animation-delay-4000 absolute -bottom-40 left-20 size-[35rem] animate-blob rounded-full bg-secondary/30 opacity-70 blur-3xl filter" />
      <div className="relative z-10 py-8">
        <Suspense>
            <RegisterFormComponent />
        </Suspense>
      </div>
    </div>
  )
}
