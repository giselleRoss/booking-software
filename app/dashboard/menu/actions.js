'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'

export async function createMenuItems(formdata){
    const supabase = createClient();
    const item = {
        name: formdata.get('name'),
        description: formdata.get('description'),
        price: formdata.get('price'),
    }
    
}