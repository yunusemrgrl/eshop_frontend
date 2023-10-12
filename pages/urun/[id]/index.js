/*
  This example requires some changes to your config:

  ```
  // tailwind.config.js
  module.exports = {
    // ...
    plugins: [
      // ...
      require('@tailwindcss/forms'),
      require('@tailwindcss/typography'),
      require('@tailwindcss/aspect-ratio'),
    ],
  }
  ```
*/
import { Fragment, useEffect, useState } from 'react'
import {
  Dialog,
  Disclosure,
  Popover,
  RadioGroup,
  Tab,
  Transition
} from '@headlessui/react'
import {
  Bars3Icon,
  HeartIcon,
  MagnifyingGlassIcon,
  MinusIcon,
  PlusIcon,
  ShoppingBagIcon,
  UserIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'
import { StarIcon } from '@heroicons/react/20/solid'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import {
  addShoppingCartAsync,
  getProductAsync,
  getProductDetailAsync,
  setShoppingCart,
  setTotalOrderValue
} from '@/redux/product-slice'
import Link from 'next/link'


const product = {
  name: 'Zip Tote Basket',
  price: '$140',
  rating: 4,
  images: [
    {
      id: 1,
      name: 'Angled view',
      src: 'https://tailwindui.com/img/ecommerce-images/product-page-03-product-01.jpg',
      alt: 'Angled front view with bag zipped and handles upright.'
    }
    // More images...
  ],
  colors: [
    {
      name: 'Washed Black',
      bgColor: 'bg-gray-700',
      selectedColor: 'ring-gray-700'
    },
    { name: 'White', bgColor: 'bg-white', selectedColor: 'ring-gray-400' },
    {
      name: 'Washed Gray',
      bgColor: 'bg-gray-500',
      selectedColor: 'ring-gray-500'
    }
  ],
  description: `
    <p>The Zip Tote Basket is the perfect midpoint between shopping tote and comfy backpack. With convertible straps, you can hand carry, should sling, or backpack this convenient and spacious bag. The zip top and durable canvas construction keeps your goods protected for all-day use.</p>
  `,
  details: [
    {
      name: 'Features',
      items: [
        'Multiple strap configurations',
        'Spacious interior with top zip',
        'Leather handle and tabs',
        'Interior dividers',
        'Stainless strap loops',
        'Double stitched construction',
        'Water-resistant'
      ]
    }
    // More sections...
  ]
}
const relatedProducts = [
  {
    id: 1,
    name: 'Zip Tote Basket',
    color: 'White and black',
    href: '#',
    imageSrc:
      'https://tailwindui.com/img/ecommerce-images/product-page-03-related-product-01.jpg',
    imageAlt:
      'Front of zip tote bag with white canvas, black canvas straps and handle, and black zipper pulls.',
    price: '$140'
  }
  // More products...
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function ProductDetail() {
  const dispatch = useDispatch()
  const router = useRouter()
  const productDetail = useSelector((state) => state.product.product)
  const products = useSelector((state) => state.product.products)
  const user = useSelector((state) => state.auth.user)

  useEffect(() => {
    const id = router.query.id
    dispatch(getProductDetailAsync(id))
    dispatch(getProductAsync())
  }, [router.query.id])

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
      <main className="mx-auto max-w-7xl sm:px-6 sm:pt-16 lg:px-8">
        <div className="mx-auto max-w-2xl lg:max-w-none">
          {/* Product */}
          <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8">
            {/* Image gallery */}
            <Tab.Group as="div" className="flex flex-col-reverse">
              {/* Image selector */}
              <div className="mx-auto mt-6 hidden w-full max-w-2xl sm:block lg:max-w-none">
                <Tab.List className="grid grid-cols-4 gap-6">
                  <Tab
                    key={productDetail.id}
                    className="relative flex h-24 cursor-pointer items-center justify-center rounded-md bg-white text-sm font-medium uppercase text-gray-900 hover:bg-gray-50 focus:outline-none focus:ring focus:ring-opacity-50 focus:ring-offset-4"
                  >
                    {({ selected }) => (
                      <>
                        <span className="sr-only">{productDetail.adi}</span>
                        <span className="absolute inset-0 overflow-hidden rounded-md">
                          <img
                                                                src={`${process.env.BASE_URL.concat(productDetail.foto1)}`}

                            alt=""
                            className="h-full w-full object-cover object-center"
                          />
                        </span>
                        <span
                          className={classNames(
                            selected ? 'ring-indigo-500' : 'ring-transparent',
                            'pointer-events-none absolute inset-0 rounded-md ring-2 ring-offset-2'
                          )}
                          aria-hidden="true"
                        />
                      </>
                    )}
                  </Tab>
                </Tab.List>
              </div>

              <Tab.Panels className="aspect-h-1 aspect-w-1 w-full">
                <Tab.Panel key={productDetail.adi}>
                  <img
                                    src={`${process.env.BASE_URL.concat(productDetail.foto1)}`}
                                    alt={productDetail.adi}
                    className="h-full w-full object-cover object-center sm:rounded-lg"
                  />
                </Tab.Panel>
              </Tab.Panels>
            </Tab.Group>

            {/* Product info */}
            <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                {productDetail.adi}
              </h1>

              <h3 className="text-xl font-bold tracking-tight text-gray-600 pt-2">
                {productDetail?.user?.adi.toUpperCase()}
              </h3>

              <div className="mt-3">
                <h2 className="sr-only">Product information</h2>
                <p className="text-3xl tracking-tight text-gray-900">
                  {productDetail.fiyat} TL
                </p>
              </div>

              {/* Reviews */}
              <div className="mt-3">
                <h3 className="sr-only">Reviews</h3>
                <div className="flex items-center">
                  <div className="flex items-center">
                    {[0, 1, 2, 3, 4].map((rating) => (
                      <StarIcon
                        key={rating}
                        className={classNames(
                          product.rating > rating
                            ? 'text-indigo-500'
                            : 'text-gray-300',
                          'h-5 w-5 flex-shrink-0'
                        )}
                        aria-hidden="true"
                      />
                    ))}
                  </div>
                  <p className="sr-only">{product.rating} out of 5 stars</p>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="sr-only">Description</h3>

                <div
                  className="space-y-6 text-base text-gray-700"
                  dangerouslySetInnerHTML={{ __html: productDetail.aciklama }}
                />
              </div>

              <form className="mt-6">
                {/* Colors */}

                <div className="mt-10 flex">
                  <button
                    type="button"
                    onClick={() => addShoppingCart(productDetail)}
                    className="flex max-w-xs flex-1 items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50 sm:w-full"
                  >
                    Add to bag
                  </button>
                </div>
              </form>

              <section aria-labelledby="details-heading" className="mt-12">
                <h2 id="details-heading" className="sr-only">
                  Additional details
                </h2>

                <div className="divide-y divide-gray-200 border-t">
                  {product.details.map((detail) => (
                    <Disclosure as="div" key={detail.name}>
                      {({ open }) => (
                        <>
                          <h3>
                            <Disclosure.Button className="group relative flex w-full items-center justify-between py-6 text-left">
                              <span
                                className={classNames(
                                  open ? 'text-indigo-600' : 'text-gray-900',
                                  'text-sm font-medium'
                                )}
                              >
                                {detail.name}
                              </span>
                              <span className="ml-6 flex items-center">
                                {open ? (
                                  <MinusIcon
                                    className="block h-6 w-6 text-indigo-400 group-hover:text-indigo-500"
                                    aria-hidden="true"
                                  />
                                ) : (
                                  <PlusIcon
                                    className="block h-6 w-6 text-gray-400 group-hover:text-gray-500"
                                    aria-hidden="true"
                                  />
                                )}
                              </span>
                            </Disclosure.Button>
                          </h3>
                          <Disclosure.Panel
                            as="div"
                            className="prose prose-sm pb-6"
                          >
                            <ul role="list">
                              {detail.items.map((item) => (
                                <li key={item}>{item}</li>
                              ))}
                            </ul>
                          </Disclosure.Panel>
                        </>
                      )}
                    </Disclosure>
                  ))}
                </div>
              </section>
            </div>
          </div>

          <section
            aria-labelledby="related-heading"
            className="mt-10 border-t border-gray-200 px-4 py-16 sm:px-0"
          >
            <h2
              id="related-heading"
              className="text-xl font-bold text-gray-900"
            >
              Önerilen Ürünler
            </h2>

            <div className="mt-8 grid grid-cols-1 gap-y-12 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8">
              {products.slice(0, 4).map((product) => (
                <div key={product.id} className="flex flex-col justify-between">
                  <Link href={'/urun/' + product.id}>
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
                        <h3 className="text-sm font-medium text-gray-600">
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
                          {product.fiyat} TL
                        </p>
                      </div>
                    </div>
                  </Link>
                  <div
                    className="mt-6"
                    onClick={() => addShoppingCart(product)}
                  >
                    <span className="relative cursor-pointer flex items-center justify-center rounded-md border border-transparent bg-gray-100 px-8 py-2 text-sm font-medium text-gray-900 hover:bg-gray-200">
                      Add to bag
                      <span className="sr-only">, {product.name}</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
