'use client'
import Cart from '@/app/components/Cart'
import Menu from '@/app/components/Menu'
import Spinner from '@/app/components/Spinner'
import { parseISO } from 'date-fns'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { now } from '@/app/constants/config'


const MenuPage = () => {
  const router = useRouter()

  const [selectedTime, setSelectedTime] = useState(null) // as ISO string

  const [showCart, setShowCart] = useState(false)
  const [productsInCart, setProductsInCart] = useState([])
  const addToCart = (id, quantity) => {
    setProductsInCart((prev) => {
      const existing = prev.find((item) => item.id === id)
      if (existing) {
        return prev.map((item) => {
          if (item.id === id) return { ...item, quantity: item.quantity + quantity }
          return item
        })
      }
      return [...prev, { id, quantity }]
    })
  }

  const removeFromCart = (id) => {
    setProductsInCart((prev) => prev.filter((item) => item.id !== id))
  }

  useEffect(() => {
    const selectedTime = localStorage.getItem('selectedTime')
    if (!selectedTime) router.push('/')
    else {
      const date = parseISO(selectedTime)
      if (date < now) router.push('/')

      // Date is valid
      setSelectedTime(selectedTime)
    }
  }, [router])

  return (
    <>
      <Cart removeFromCart={removeFromCart} open={showCart} setOpen={setShowCart} products={productsInCart} />
      {selectedTime ? (
        <div className='mx-auto mt-12 max-w-7xl sm:px-6 lg:px-8'>
          {/* Cart Icon */}
          <div className='flex w-full justify-end'>
            <button
              type='button'
              onClick={() => setShowCart((prev) => !prev)}
              className='flex items-center justify-center rounded-lg bg-gray-200 p-3 text-lg font-medium text-indigo-600'>
              {/* <BsCart className='mr-2 text-lg' /> */}
              {productsInCart.reduce((acc, item) => acc + item.quantity, 0)}
            </button>
          </div>

          <Menu addToCart={addToCart} selectedTime={selectedTime} />
        </div>
      ) : (
        <div className='flex h-screen items-center justify-center'>
          <Spinner />
        </div>
      )}
    </>
  )
}

export default MenuPage