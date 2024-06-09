'use client'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { MAX_FILE_SIZE } from '@/app/constants/config'
import { selectOptions } from '@/utils/helpers'
import { createClient } from '@/utils/supabase/client'


const DynamicSelect = dynamic(() => import('react-select'), { ssr: false });

const initialInput = {
    name: '',
    description: '',
    time: 0,
    price: 0,
    file: undefined,
};

const MenuAdmin = () => {
  const [input, setInput] = useState(initialInput);
  const [preview, setPreview] = useState('');
  const [error, setError] = useState('');
  const [admin, setAdmin] = useState('');
  const [service, setService] = useState(""); 

const supabase = createClient();

    useEffect(() => {
      // create the preview
      if (!input.file) return
      const objectUrl = URL.createObjectURL(input.file)
      setPreview(objectUrl)
  
      // free memory when ever this component is unmounted
      return () => URL.revokeObjectURL(objectUrl)
    }, [input.file])
  
    const getUser = async () => {

    const { data: { user } } = await supabase.auth.getUser()
    console.log(user.user.role)
    if(user.user.role === 'admin'){
      setAdmin(user)
    }
    }

    const handleTextChange = (e) => {
      const { name, value } = e.target
      setInput((prev) => ({ ...prev, [name]: value }))
    }
    const handleDelete = async (imageKey, id) => {
      await deleteMenuItem({ imageKey, id })
      refetch()
    }
  
    const handleImgUpload = async () => {
      const { file } = input
      if (!file) return
  
      const { url, fields, key } = await createPresignedUrl({
        fileType: file.type,
      })
  
      const data = {
        ...fields,
        'Content-Type': file.type,
        file,
      }
  
      const formData = new FormData()
  
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value)
      })
  
      await fetch(url, {
        method: 'POST',
        body: formData,
      })
  
      return key
    }
  
    const addMenuItem = async () => {
      const key = await handleImgUpload()
      if (!key) throw new Error('No key')
  
      await addItem({
        imageKey: key,
        name: input.name,
        description: input.description,
        time: input.time,
        price: input.price,
      })
  
      refetch()
  
      // reset
      setInput(initialInput)
      setPreview('')
    }

    const handleFileSelect = (e) => {
      if (!e.target.files?.[0]) return setError('No file selected')
      if (e.target.files[0].size > MAX_FILE_SIZE) return setError('File too big')
      setInput((prev) => ({ ...prev, file: e.target.files[0] }))
    }
  
    
    return (
      <>
      <div className=''>
        <div className='mx-auto flex max-w-xl flex-col gap-2'>
          <input
            name='name'
            className='h-12 rounded-sm border-none bg-gray-200'
            type='text'
            placeholder='title'
            onChange={handleTextChange}
            value={input.name}
          />

<input
            name='description'
            className='h-12 rounded-sm border-none bg-gray-200'
            type='text'
            placeholder='description'
            onChange={handleTextChange}
            value={input.description}
          />

<input
            name='duration'
            className='h-12 rounded-sm border-none bg-gray-200'
            type='number'
            placeholder='duration(in minutes)'
            onChange={(e) => setInput({ time: Number(e.target.value) })}
            value={input.time}
          />

          <input
            name='price'
            className='h-12 rounded-sm border-none bg-gray-200'
            type='number'
            placeholder='price'
            onChange={(e) => setInput((prev) => ({ ...prev, price: Number(e.target.value) }))}
            value={input.price}
          />

          <DynamicSelect
            value={input.categories}
            // @ts-expect-error - when using dynamic import, typescript doesn't know about the onChange prop
            onChange={(e) => setInput((prev) => ({ ...prev, categories: e }))}
            isMulti
            className='h-12'
            options={selectOptions}
          />

          <label
            htmlFor='file'
            className='relative h-12 cursor-pointer rounded-sm bg-gray-200 font-medium text-indigo-600 focus-within:outline-none'>
            <span className='sr-only'>File input</span>
            <div className='flex h-full items-center justify-center'>
              {preview ? (
                <div className='relative h-3/4 w-full'>
                  <Image alt='preview' style={{ objectFit: 'contain' }} fill src={preview} />
                </div>
              ) : (
                <span>Select image</span>
              )}
            </div>
            <input
              name='file'
              id='file'
              onChange={handleFileSelect}
              accept='image/jpeg image/png image/jpg'
              type='file'
              className='sr-only'
            />
          </label>

          <button
            className='h-12 rounded-sm bg-gray-200 disabled:cursor-not-allowed'
            disabled={!input.file || !input.name}
            onClick={addMenuItem}>
            Add menu item
          </button>
        </div>
        {error && <p className='text-xs text-red-600'>{error}</p>}

        <div className='mx-auto mt-12 max-w-7xl'>
          <p className='text-lg font-medium'>Your menu items:</p>
          {/* <div className='mt-6 mb-12 grid grid-cols-4 gap-8'>
            {menuItems?.map((menuItem) => (
              <div key={menuItem.id}>
                <p>{menuItem.name}</p>
                <div className='relative h-40 w-40'>
                  <Image priority fill alt='' src={menuItem.url} />
                </div>
                <button
                  onClick={() => handleDelete(menuItem.imageKey, menuItem.id)}
                  className='text-xs text-red-500'>
                  delete
                </button>
              </div>
            ))}
          </div> */}
        </div>
      </div>
      </>
      );
};

export default MenuAdmin;
