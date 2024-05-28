import { createClient } from '@/utils/supabase/server';
import React from 'react'
import Link from 'next/link'
import { redirect } from 'next/navigation';

const Admin = async () => {
  const supabase = createClient();

const { data: { user } } = await supabase.auth.getUser()
console.log(user)
if(!user){
  redirect('/')
}
if(user.role !== 'admin'){
  redirect('/?message=User is not admin')
}

  return (
    <div className='flex h-screen w-full items-center justify-center gap-8 font-medium'>
      <Link className='rounded-md bg-gray-300 p-2' href='/dashboard/opening'>Opening Hours</Link>
      <Link className='rounded-md bg-gray-300 p-2' href='/dashboard/menu'>Menu</Link>
    </div>
  )
}
export default Admin;