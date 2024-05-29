'use client'
import dynamic from 'next/dynamic';
import { useState, useEffect } from "react";
import { selectOptions } from '@/utils/helpers';
import Image from 'next/image';
import { MAX_FILE_SIZE } from '@/app/constants/config';
import { v4 as uuidv4 } from 'uuid';
import { createClient } from '@/utils/supabase/client';
import { addMenuItem, uploadImage } from './actions'; // Import the addMenuItem and uploadImage functions

const DynamicSelect = dynamic(() => import('react-select'), { ssr: false });

const initialInput = {
    name: '',
    price: 0,
    categories: [],
    file: undefined,
};

const MenuAdmin = () => {
    const [input, setInput] = useState(initialInput);
    const [preview, setPreview] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [admin, setAdmin] = useState('');
    const supabase = createClient();

    useEffect(() => {
        // Fetch admin data or perform any initial setup
    }, []);

    const handleTextChange = (e) => {
        const { name, value } = e.target;
        setInput((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setInput((prev) => ({ ...prev, file }));
        setPreview(URL.createObjectURL(file));
    };

    const addMenuItemWithImage = async () => {
        // First, upload the image
        const imageKey = await uploadImage(input.file, admin);
        if (!imageKey) {
            setErrorMessage('Failed to upload image');
            return;
        }
        
        // Then, call addMenuItem with the image key
        await addMenuItem({
            name: input.name,
            categories: input.categories.map((c) => c.value, 'all'),
            price: input.price,
            imageKey: imageKey,
        });
    };

    return (
        <>
            <div className=''>
                <div className='mx-auto flex max-w-xl flex-col gap-2'>
                    <input
                        name='name'
                        className='h-12 rounded-sm border-none bg-gray-200'
                        type='text'
                        placeholder='Name'
                        onChange={handleTextChange}
                        value={input.name}
                    />

                    <input
                        name='price'
                        className='h-12 rounded-sm border-none bg-gray-200'
                        type='number'
                        placeholder='Price'
                        onChange={(e) => setInput((prev) => ({ ...prev, price: Number(e.target.value) }))}
                        value={input.price}
                    />

                    <DynamicSelect
                        value={input.categories}
                        onChange={(e) => setInput((prev) => ({ ...prev, categories: e }))}
                        isMulti
                        className='h-12'
                        options={selectOptions}
                    />

                    <label htmlFor='file' className='relative h-12 cursor-pointer rounded-sm bg-gray-200 font-medium text-indigo-600 focus-within:outline-none'>
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
                            onChange={handleFileChange}
                            accept='image/jpeg, image/png, image/jpg'
                            type='file'
                            className='sr-only'
                        />
                    </label>

                    <button
                        className='h-12 rounded-sm bg-gray-200 disabled:cursor-not-allowed'
                        disabled={!input.file || !input.name}
                        onClick={addMenuItemWithImage}>
                        Add menu item
                    </button>
                </div>
                {errorMessage && <p className='text-xs text-red-600'>{errorMessage}</p>}

                <div className='mx-auto mt-12 max-w-7xl'>
                    {/* Your menu items display code */}
                </div>
            </div>
        </>
    );
};

export default MenuAdmin;
