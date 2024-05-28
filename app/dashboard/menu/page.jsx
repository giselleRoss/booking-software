'use client'
import dynamic from 'next/dynamic'
import React, { useEffect, useState } from 'react'
import { selectOptions } from '@/utils/helpers';
import Image from 'next/image';
import { MAX_FILE_SIZE } from '@/app/constants/config';
const DynamicSelect = dynamic(() => import('react-select'), { ssr: false })

const initialInput = {
    name: '',
    price: 0,
    categories: [],
    file: undefined,
  }

const MenuAdmin = () => {
    const [input, setInput] = useState(initialInput)
    const [preview, setPreview] = useState('');
    const [error, setError] = useState('')

    useEffect(() => {
        //create the preview
        if(input.file) return;
        const objectUrl = URL.createObjectURL(input.file);
        setPreview(objectUrl);
    }, [input.file])

    const handleTextChange = (e) => {
        const { name, value } = e.target
        setInput((prev) => ({ ...prev, [name]: value }))
      }

      const handleFileSelect = (e) => {
        if(!e.target.files?.[0]) return setError("No file selected");
        if(e.target.files[0].size > MAX_FILE_SIZE) return setError("File size is too big")
            setInput((prev) => ({...prev, file: e.target.files[0]}))
      }

  return (
   <div className=''>
        <div className='mx-auto flex max-w-xl flex-col gap-2'>
          <input
            name='name'
            className='h-12 rounded-sm border-none bg-gray-200'
            type='text'
            placeholder='name'
            onChange={handleTextChange}
            value={input.name}
          />

          <input
            name='price'
            className='h-12 rounded-sm border-none bg-gray-200'
            type='number'
            placeholder='price'
            onChange={(e) => setInput((prev) => ({ ...prev, price: Number(e.target.value) }))}
            value={input.price}
          />
          <input
            name='description'
            className='h-12 rounded-sm border-none bg-gray-200'
            type='number'
            placeholder='description'
            onChange={(e) => setInput((prev) => ({ ...prev, description: Number(e.target.value) }))}
            value={input.description}
          />

          <DynamicSelect
            value={input.categories}
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
                        <Image alt='preview' style={{objectFit: 'contain'}} fill src={preview}/>
                    </div>
                ) : (
                    <span>Select Image</span>
                )}
            </div>
            <input
              name='file'
              id='file'
              accept='image/jpeg image/png image/jpg'
              type='file'
              className='sr-only'
            />
          </label>
          <button
            className='h-12 rounded-sm bg-gray-200 disabled:cursor-not-allowed'
            disabled={!input.file || !input.name}>
            Add menu item
          </button>
        </div>

        <div className='mx-auto mt-12 max-w-7xl'>
          <p className='text-lg font-medium'>Your menu items:</p>
          <div className='mt-6 mb-12 grid grid-cols-4 gap-8'>
            
          </div>
        </div>
      </div>
  )
}
export default MenuAdmin;