import { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { useDispatch, useSelector } from 'react-redux'
import { ShoppingCartModel } from '@/redux/common-slice'
import Link from 'next/link'
import { setShoppingCart, setTotalOrderValue } from '@/redux/product-slice'

function ShoppingCart() {
  const dispatch = useDispatch()
  const open = useSelector((state) => state.common.shoppingCartStatus)
  const products = useSelector((state) => state.product.shoppingCartProducts)
  const total = useSelector((state) => state.product.total)
  const user = useSelector((state) => state.auth.user)

  const closeShoppinCardModel = () => {
    dispatch(ShoppingCartModel(false))
  }

  const removeShoppingCartItem = async (productId) => {
    const userId = user.id
    if (userId) {
      const shoppingCart =
        JSON.parse(localStorage.getItem(`user_${userId}_cart`)) || []
      const updatedShoppingCart = shoppingCart.filter((p) => p.id !== productId)
      localStorage.setItem(
        `user_${userId}_cart`,
        JSON.stringify(updatedShoppingCart)
      )
      await dispatch(setShoppingCart(updatedShoppingCart))
      const totalPrice = updatedShoppingCart.reduce(
        (total, product) =>
          total + parseFloat(product.fiyat) * product.quantity,
        0
      )
      await dispatch(setTotalOrderValue(totalPrice))
    } else {
      alert('Lütfen giriş yapın.')
    }
  }

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-50"
        onClose={closeShoppinCardModel}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                  <div className="flex h-full  flex-col overflow-y-scroll bg-white shadow-xl">
                    <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                      <div className="flex items-start justify-between">
                        <Dialog.Title className="text-lg font-medium text-gray-900">
                          Sepetim
                        </Dialog.Title>
                        <div className="ml-3 flex h-7 items-center">
                          <button
                            type="button"
                            className="-m-2 p-2 text-gray-400 hover:text-gray-500"
                            onClick={() => closeShoppinCardModel()}
                          >
                            <span className="sr-only">Kapat</span>
                            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                          </button>
                        </div>
                      </div>

                      <div className="mt-8">
                        <div className="flow-root">
                          <ul
                            role="list"
                            className="-my-6 divide-y divide-gray-200"
                          >
                            {products.map((product) => (
                              <li key={product.id} className="flex py-6">
                                <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                                  <img
                                    src={`${process.env.BASE_URL.concat(product.foto1)}`}
                                    alt={product.id}
                                    className="h-full w-full object-cover object-center"
                                  />
                                </div>

                                <div className="ml-4 flex flex-1 flex-col">
                                  <div>
                                    <div className="flex justify-between text-base font-medium text-gray-900">
                                      <h3>
                                        <Link
                                          href={'urun/' + product.id}
                                          legacyBehavior
                                        >
                                          <a>{product.adi}</a>
                                        </Link>
                                      </h3>
                                      <p className="ml-4">{product.fiyat}TL</p>
                                    </div>
                                    <p className="mt-1 text-sm text-gray-500">
                                      {product.aciklama}
                                    </p>
                                  </div>
                                  <div className="flex flex-1 items-end justify-between text-sm">
                                    <p className="text-gray-500">
                                      Adet {product.quantity}
                                    </p>

                                    <div className="flex">
                                      <button
                                        onClick={() =>
                                          removeShoppingCartItem(product.id)
                                        }
                                        type="button"
                                        className="font-medium text-indigo-600 hover:text-indigo-500"
                                      >
                                        Kaldır
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
                      <div className="flex justify-between text-base font-medium text-gray-900">
                        <p>Toplam</p>
                        <p>{total ? total + 'TL' : ''}</p>
                      </div>
                      <p className="mt-0.5 text-sm text-gray-500">
                        Kargolama ve vergiler dahil.
                      </p>
                      <div className="mt-6">
                        <Link href="/checkout" legacyBehavior>
                          <a className="flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700">
                            Öde
                          </a>
                        </Link>
                      </div>
                      <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
                        <p>
                          ya da
                          <button
                            type="button"
                            className="font-medium text-indigo-600 hover:text-indigo-500"
                            onClick={() => closeShoppinCardModel()}
                          >
                             Alışverişe Devam Et
                            <span aria-hidden="true"> &rarr;</span>
                          </button>
                        </p>
                      </div>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}

export default ShoppingCart
