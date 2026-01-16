'use server'

import { z } from 'zod'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import axios from 'axios'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!

// -----------------------------------------------------------------------------
// LOGIN
// -----------------------------------------------------------------------------

const loginSchema = z.object({
  username: z.string().min(1, { message: 'El nombre de usuario es obligatorio.' }),
  password: z.string().min(1, { message: 'La contraseña es obligatoria.' }),
})

export type LoginState = {
  errors?: {
    username?: string[]
    password?: string[]
  }
  message?: string | null
}

const setAuthCookies = async (data: any) => {
  const cookieStore = await cookies()

  cookieStore.set('auth_token', data.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24, // 1 día
    path: '/',
    sameSite: 'lax',
  })

  const userData = JSON.stringify({
    userId: data.userId,
    fullName: `${data.firstName} ${data.lastName}`,
    email: data.email,
  })

  cookieStore.set('user_data', userData, {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24,
    path: '/',
    sameSite: 'lax',
  })
}

export async function login(
  prevState: LoginState,
  formData: FormData
): Promise<LoginState | never> {
  const rawFormData = Object.fromEntries(formData.entries())
  const validatedFields = loginSchema.safeParse(rawFormData)

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Campos inválidos.',
    }
  }

  const { username, password } = validatedFields.data

  let data
  try {
    const response = await axios.post(`${API_BASE_URL}/api/auth/login`, {
      username,
      password,
    })
    data = response.data
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      let errorMessage = 'Usuario o contraseña no válidos.'

      if (error.response.data?.title) {
        errorMessage = error.response.data.title
      } else if (Array.isArray(error.response.data?.errors)) {
        errorMessage = error.response.data.errors
          .map((e: any) => e.description)
          .join(' ')
      } else if (typeof error.response.data === 'string') {
        errorMessage = error.response.data
      }

      return { message: errorMessage }
    }

    return {
      message: 'No se pudo conectar con el servidor. Inténtalo más tarde.',
    }
  }

  await setAuthCookies(data)

  const from = formData.get('from') as string | null
  redirect(from || '/dashboard')
}

// -----------------------------------------------------------------------------
// REGISTER
// -----------------------------------------------------------------------------

const registerSchema = z
  .object({
    username: z.string().min(2, 'El nombre de usuario es obligatorio.'),
    email: z.string().email('Debe ser un email válido.'),
    firstName: z.string().min(2, 'El nombre es obligatorio.'),
    lastName: z.string().min(2, 'El apellido es obligatorio.'),
    password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres.'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden.',
    path: ['confirmPassword'],
  })

export type RegisterState = {
  errors?: {
    username?: string[]
    email?: string[]
    firstName?: string[]
    lastName?: string[]
    password?: string[]
    confirmPassword?: string[]
  }
  message?: string | null
}

export async function register(
  prevState: RegisterState,
  formData: FormData
): Promise<RegisterState | never> {
  const rawFormData = Object.fromEntries(formData.entries())
  const validatedFields = registerSchema.safeParse(rawFormData)

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Campos inválidos. Por favor revisa la información.',
    }
  }

  const { username, email, password, firstName, lastName } =
    validatedFields.data

  let data
  try {
    const response = await axios.post(`${API_BASE_URL}/api/auth/register`, {
      username,
      email,
      password,
      firstName,
      lastName,
    })
    data = response.data
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      let errorMessage = 'No se pudo completar el registro.'

      if (error.response.data?.title) {
        errorMessage = error.response.data.title
      } else if (typeof error.response.data === 'string') {
        errorMessage = error.response.data
      }

      return { message: errorMessage }
    }

    return { message: 'No se pudo conectar con el servidor.' }
  }

  await setAuthCookies(data)
  redirect('/dashboard')
}

// -----------------------------------------------------------------------------
// LOGOUT
// -----------------------------------------------------------------------------

export async function logout(): Promise<never> {
  const cookieStore = await cookies()
  cookieStore.delete('auth_token')
  cookieStore.delete('user_data')
  redirect('/login')
}

// -----------------------------------------------------------------------------
// PASSWORD RESET
// -----------------------------------------------------------------------------

export type PasswordResetState = {
  message: string | null
  errors?: Record<string, string[]>
  success: boolean
}

export async function requestPasswordReset(
  prevState: PasswordResetState,
  formData: FormData
): Promise<PasswordResetState> {
  const email = formData.get('email') as string

  try {
    await axios.post(`${API_BASE_URL}/api/auth/request-password-reset`, {
      email,
    })
    return {
      success: true,
      message:
        'Si existe una cuenta con este email, recibirás un enlace para restablecer tu contraseña.',
    }
  } catch {
    return {
      success: false,
      message: 'Ocurrió un error al procesar tu solicitud.',
    }
  }
}

const resetPasswordSchema = z.object({
  token: z.string(),
  password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres.'),
})

export type ResetPasswordState = {
  message: string | null
  errors?: Record<string, string[]>
  success: boolean
}

export async function resetPassword(
  prevState: ResetPasswordState,
  formData: FormData
): Promise<ResetPasswordState | never> {
  const validatedFields = resetPasswordSchema.safeParse(
    Object.fromEntries(formData.entries())
  )

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Datos inválidos.',
    }
  }

  const { token, password } = validatedFields.data

  try {
    await axios.post(`${API_BASE_URL}/api/auth/reset-password`, {
      token,
      password,
    })
    redirect('/login?password_reset=true')
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return {
        success: false,
        message:
          error.response.data?.title ||
          'No se pudo restablecer la contraseña.',
      }
    }

    return {
      success: false,
      message: 'Ocurrió un error inesperado.',
    }
  }
}
