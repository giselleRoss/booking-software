import React, { useState } from 'react'
import { createClient } from '@/utils/supabase/client';

const Menu = () => {
  const [services, setServices] = useState([]);
  const [filter, setFilter] = useState('')

  useEffect(() => {
    const fetchServices = async () => {
      const supabase = createClient();
      const { data: services } = await supabase.from("services").select("*");
      setServices(services);
    };
    fetchServices();
  }, []);
  return (
    <div className='bg-white'>
    <div className='mx-auto max-w-2xl py-16 px-4 sm:py-24 lg:max-w-full'>
      <div className='flex w-full justify-between'>
        <h2 className='flex items-center gap-4 text-2xl font-bold tracking-tight text-gray-900'>
          <HiArrowLeft className='cursor-pointer' onClick={() => router.push('/')} />
          On our menu for {format(parseISO(selectedTime), 'MMM do, yyyy')}
        </h2>
        
      </div>

      <div className='mt-6 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8'>
        {services?.map((service) => (
          <div key={service.id} className='group relative'>
            <div className='min-h-80 aspect-w-1 aspect-h-1 lg:aspect-none w-full overflow-hidden rounded-md bg-gray-200 hover:opacity-75 lg:h-80'>
              <div className='relative h-full w-full object-cover object-center lg:h-full lg:w-full'>
                <Image src={service.url} alt={service.name} fill style={{ objectFit: 'cover' }} />
              </div>
            </div>
            <div className='mt-4 flex justify-between'>
              <div>
                <h3 className='text-sm text-gray-700'>
                  <p>{service.name}</p>
                </h3>
                <p className='mt-1 text-sm text-gray-500'>
                  {service.description}
                </p>
                <p className='mt-1 text-sm text-gray-500'>
                  {service.duration}
                </p>
              </div>
              <p className='text-sm font-medium text-gray-900'>${service.price.toFixed(2)}</p>
            </div>

            <Button
              className='mt-4'
              onClick={() => {
                addToCart(service.id, 1)
              }}>
              Add to cart
            </Button>
          </div>
        ))}
      </div>
    </div>
  </div>
  )
}
export default Menu;