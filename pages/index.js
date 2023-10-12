import Link from 'next/link'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import {
  addShoppingCartAsync,
  getProductAsync,
  setShoppingCart,
  setTotalOrderValue
} from '@/redux/product-slice'


function Home() {
  const dispatch = useDispatch()
  const products = useSelector((state) => state.product.products)
  const user = useSelector((state) => state.auth.user)

  useEffect(() => {
    dispatch(getProductAsync())
  }, [user])

  const addShoppingCart = async (product) => {
    const userId = user.id
    if (userId) {
      let qty = 0
      const shoppingCart =
        JSON.parse(localStorage.getItem(`user_${userId}_cart`)) || []
      const existingProductIndex = shoppingCart.findIndex(
        (p) => p.id === product.id
      )
      if (existingProductIndex === -1) {
        // ürün daha önce eklenmemiş, yeni bir ürün olarak array'e ekleyelim
        shoppingCart.push({ ...product, quantity: 1 })
      } else {
        // ürün daha önce eklenmiş, adedini arttıralım
        shoppingCart[existingProductIndex].quantity++
        qty = shoppingCart[existingProductIndex].quantity
      }
      localStorage.setItem(`user_${userId}_cart`, JSON.stringify(shoppingCart))
      await dispatch(addShoppingCartAsync({ id: product.id, qty }))
      await getShoppingCartProduct()
      const totalPrice = shoppingCart.reduce(
        (total, product) =>
          total + parseFloat(product.fiyat) * product.quantity,
        0
      )
      dispatch(setTotalOrderValue(totalPrice))
    } else {
      alert('Lütfen giriş yapın.')
    }
  }

  const getShoppingCartProduct = () => {
    const userId = user.id
    if (userId) {
      const shoppingCart =
        JSON.parse(localStorage.getItem(`user_${userId}_cart`)) || []
      dispatch(setShoppingCart(shoppingCart))
    } else {
      alert('Lütfen giriş yapın.')
    }
  }

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <h2 className="text-xl font-bold text-gray-900">
          Önerilen Ürünler
        </h2>

        <div className="mt-8 grid grid-cols-1  gap-y-12 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8">
          {products.length == 0 && (
            <div className="flex w-full justify-center gap-x-2">
              <span className="inline-flex rounded-full h-6 w-6 border-4 border-blue-700 animate-spin"></span>{' '}
              <p>Loading...</p>
            </div>
          )}
          {products.length > 0 &&
            products.map((product) => (
              <div key={product.id} className="flex flex-col justify-between">
                <Link href={'/urun/' + product.id} passHref>
                  <div className="relative">
                    <div className="relative h-72 w-full overflow-hidden rounded-lg">
                      <img
                        src={`${process.env.BASE_URL.concat(product.foto1)}`}
                        alt={product.adi}
                        className="h-full w-full object-cover object-center"
                      />
                    </div>
                    <div className="relative mt-4">
                      <h3 className="text-sm font-medium text-gray-900">
                        {product.adi}
                      </h3>
                      <h3 className="text-sm font-medium text-gray-400">
                        {product?.user?.adi.toUpperCase()}
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        {product.aciklama}
                      </p>
                    </div>
                    <div className="absolute inset-x-0 top-0 flex h-72 items-end justify-end overflow-hidden rounded-lg p-4">
                      <div
                        aria-hidden="true"
                        className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-black opacity-50"
                      />
                      <p className="relative text-lg font-semibold text-white">
                        {product.fiyat}TL
                      </p>
                    </div>
                  </div>
                </Link>

                <div className="mt-6" onClick={() => addShoppingCart(product)}>
                  <span className="relative flex items-center cursor-pointer justify-center rounded-md border border-transparent bg-gray-100 px-8 py-2 text-sm font-medium text-gray-900 hover:bg-gray-200">
                    Add to bag
                    <span className="sr-only">, {'product.name'}</span>
                  </span>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}

export default Home
