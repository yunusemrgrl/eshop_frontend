/*
  This example requires some changes to your config:

  ```
  // tailwind.config.js
  module.exports = {
    // ...
    plugins: [
      // ...
      require('@tailwindcss/forms'),
    ],
  }
  ```
*/
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import { ShoppingCartModel } from '@/redux/common-slice'
import { addOrderAsync } from '@/redux/product-slice'
import { useRouter } from 'next/router'

export default function Checkout() {
  const dispatch = useDispatch()
  const router = useRouter()
  const products = useSelector((state) => state.product.shoppingCartProducts)
  const total = useSelector((state) => state.product.total)
  const user = useSelector((state) => state.auth.user)

  useEffect(() => {
    dispatch(ShoppingCartModel(false))
    const userId = user.id
    if (!userId) {
      alert('Lütfen giriş yapın!')
    }
  }, [])

  const [adres, setAdres] = useState(user.adres ? user.adres : "")

  const handleSubmit = (e) => {
    e.preventDefault()
    const userId = user.id

    if (userId) {
      const product =
        JSON.parse(localStorage.getItem(`user_${userId}_cart`)) || []
      dispatch(addOrderAsync({ product, total, adres, userId }))
      setAdres('')
      router.push('/')
      localStorage.removeItem(`user_${userId}_cart`)
      // todo ana sayfaya yönlendir
    }
  }

  return (
    <div className="bg-white">
      {/* Background color split screen for large screens */}
      <div
        className="fixed left-0 top-0 hidden h-full w-1/2 bg-white lg:block"
        aria-hidden="true"
      />
      <div
        className="fixed right-0 top-0 hidden h-full w-1/2 bg-indigo-900 lg:block"
        aria-hidden="true"
      />

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 gap-x-16 lg:grid-cols-2 lg:px-8 lg:pt-16">
        <h1 className="sr-only">Ödeme</h1>

        <section
          aria-labelledby="summary-heading"
          className="bg-indigo-900 py-12 text-indigo-300 md:px-10 lg:col-start-2 lg:row-start-1 lg:mx-auto lg:w-full lg:max-w-lg lg:bg-transparent lg:px-0 lg:pb-24 lg:pt-0"
        >
          <div className="mx-auto max-w-2xl px-4 lg:max-w-none lg:px-0">
            <h2 id="summary-heading" className="sr-only">
              Özet
            </h2>

            <ul
              role="list"
              className="divide-y divide-white divide-opacity-10 text-sm font-medium"
            >
              {products.length > 0 &&
                products.map((product) => (
                  <li
                    key={product.id}
                    className="flex items-start space-x-4 py-6"
                  >
                    <img
                                                         src={`${process.env.BASE_URL.concat(product.foto1)}`}

                      alt={product.imageAlt}
                      className="h-20 w-20 flex-none rounded-md object-cover object-center"
                    />
                    <div className="flex-auto space-y-1">
                      <h3 className="text-white">{product.adi}</h3>
                      <p>{product.aciklama}</p>
                      <p>{product.quantity} Adet</p>
                    </div>
                    <p className="flex-none text-base font-medium text-white">
                      {product.fiyat}TL
                    </p>
                  </li>
                ))}
            </ul>
            {products.length == 0 && <p className="text-4xl">Sepet boş </p>}
            {products.length > 0 && (
              <dl>
                <div className="flex items-center justify-between border-t border-white border-opacity-10 pt-6 text-white">
                  <dt className="text-base">Total</dt>
                  <dd className="text-base"> {total ? total + ' TL' : ''}</dd>
                </div>
              </dl>
            )}
          </div>
        </section>

        {products.length > 0 && (
          <section
            aria-labelledby="payment-and-shipping-heading"
            className="py-16 lg:col-start-1 lg:row-start-1 lg:mx-auto lg:w-full lg:max-w-lg lg:pb-24 lg:pt-0"
          >
            <h2 id="payment-and-shipping-heading" className="sr-only">
              Ödeme ve kargo detay
            </h2>

            <form onSubmit={handleSubmit}>
              <div className="mx-auto max-w-2xl px-4 lg:max-w-none lg:px-0">
                <div className="mt-10">
                  <h3 className="text-lg font-medium text-gray-900">
                    Ödeme Detay
                  </h3>

                  <div className="mt-6 grid grid-cols-3 gap-x-4 gap-y-6 sm:grid-cols-4">
                    <div className="col-span-3 sm:col-span-4">
                      <label
                        htmlFor="card-number"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Kart Numarası
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          id="card-number"
                          name="card-number"
                          autoComplete="cc-number"
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                      </div>
                    </div>

                    <div className="col-span-2 sm:col-span-3">
                      <label
                        htmlFor="expiration-date"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Bitiş tarihi (MM/YY)
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          name="expiration-date"
                          id="expiration-date"
                          autoComplete="cc-exp"
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="cvc"
                        className="block text-sm font-medium text-gray-700"
                      >
                        CVC
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          name="cvc"
                          id="cvc"
                          autoComplete="csc"
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-10">
                  <h3 className="text-lg font-medium text-gray-900">
                    Kargo Adresi
                  </h3>

                  <div>
                    <div className="mt-2">
                      <textarea
                        rows={4}
                        name="adres"
                        id="adres"
                        value={adres}
                        onChange={(e) => setAdres(e.target.value)}
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        defaultValue={''}
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-10">
                  <h3 className="text-lg font-medium text-gray-900">
                    Ödeme Yöntemleri
                  </h3>

                  <div className="mt-6 flex items-center">
                    <input
                      id="same-as-shipping"
                      name="same-as-shipping"
                      type="checkbox"
                      defaultChecked
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <div className="ml-2">
                      <label
                        htmlFor="same-as-shipping"
                        className="text-sm font-medium text-gray-900"
                      >
                        Kargo ile Aynı Adres
                      </label>
                    </div>
                  </div>
                </div>

                <div className="mt-10 flex justify-end border-t border-gray-200 pt-6">
                  <button
                    type="submit"
                    className="rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50"
                  >
                    Şimdi Öde
                  </button>
                </div>
              </div>
            </form>
          </section>
        )}
      </div>
    </div>
  )
}
