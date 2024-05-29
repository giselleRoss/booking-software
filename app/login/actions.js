'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'

export async function login(formData) {
  const supabase = createClient()

  const user = {
    email: formData.get('email'),
    password: formData.get('password'),
  }

  const { error } = await supabase.auth.signInWithPassword(user)

  if (error) {
    redirect('/login?message=Could not authenticate your account.')
  }
console.log(user)

  const { data, error: metadataError } = await supabase.auth.getUser();

  if (metadataError) {
    console.error(metadataError)
    return  
  }

  // Check if the user is an admin
  if (data.user.role === 'admin') {
revalidatePath('/dashboard', 'layout')
  redirect('/dashboard')
  } else {
    revalidatePath('/', 'layout')
    redirect('/')
  }
}


export async function signup(formData) {
  const supabase = createClient()

  const data = {
    email: formData.get('email'),
    password: formData.get('password'),
  }

  const { error } = await supabase.auth.signUp(data)

  if (error) {
    redirect('/login?message=Could not create account')
  }

  revalidatePath('/', 'layout')
  redirect('/')
}
export async function logout() {
  const supabase = createClient()

  const { error } = await supabase.auth.signOut();

  if (error) {
    redirect('/error')
  }

  revalidatePath('/', 'layout')
  redirect('/')
}
