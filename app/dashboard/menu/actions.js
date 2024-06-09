'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { v4 as uuidv4 } from 'uuid';
    const supabase = createClient();

    
    
    export async function addMenuItem(formData) {
        const { data, error } = await supabase
            .from('services')
            .insert([
                { name: formData.name, description: 'otherValue', price: 'otherValue', url: 'otherValue' },
            ])
            .select();
        // Handle response or errors here
    }
    
    export async function uploadImage(file, admin) {
        const { data, error } = await supabase.storage.from('nikki-images').upload(admin + '/' + uuidv4(), file);
        if (data) {
            return data.Key; // Return the uploaded image key
        } else {
            console.error(error);
            return null;
        }
    }

export async function getUser(){
      
        const {
          data: { user },
        } = await supabase.auth.getUser()
      console.log(user.role)
      return user;
      }
      export default getUser;
    