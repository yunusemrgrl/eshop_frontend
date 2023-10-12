import {
  CreditCardIcon,
  UserCircleIcon,
  PlusCircleIcon
} from '@heroicons/react/24/outline'
import { PhotoIcon } from '@heroicons/react/20/solid'
import { Fragment, useEffect, useState } from 'react'
import { addProductAsync, getAllOrder, getOrderAsync, confirmOrder } from '@/redux/product-slice'
import { useDispatch, useSelector } from 'react-redux'
import { updateUserAsync } from '@/redux/auth-slice'

const navigation = [
  {
    id: 1,
    name: 'Bilgilerim',
    href: '#',
    icon: UserCircleIcon,
    current: false
  },
  { id: 2, name: 'Ürün Ekle', href: '#', icon: PlusCircleIcon, current: true },
  {
    id: 3,
    name: 'Siparişlerim',
    href: '#',
    icon: CreditCardIcon,
    current: false
  },
  {
    id: 4,
    name: 'Tüm Siparişler',
    href: '#',
    icon: CreditCardIcon,
    current: false
  }
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Dashboard() {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.auth.user)
  const orderedProduct = useSelector((state) => state.product.orderedProduct)
  const allOrderedProduct = useSelector((state) => state.product.allOrderedProduct)

  const [product, setProduct] = useState({
    adi: '',
    aciklama: '',
    adet: '',
    fiyat: '',
    satista_mi: 0
  })

  const [updateUser, setUpdateUser] = useState({
    adi: user.adi ?? '',
    email: user.email ?? '',
    adres: user.adres ?? '',
    password: ''
  })

  const handleChange = (e) => {
    setProduct((prev) => {
      return { ...prev, [e.target.name]: e.target.value }
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const userId = user.id
    if (userId) {
      dispatch(addProductAsync({ product, userId }))
      setProduct({
        adi: '',
        aciklama: '',
        adet: '',
        fiyat: '',
        satista_mi: 0
      })
    } else {
      alert('Giriş Yap!')
    }
  }

  const updateUserInfo = (e) => {
    e.preventDefault()
    console.log(updateUser)
    dispatch(updateUserAsync(updateUser))
    //window.location.replace('/login')
  }

  const handleUpdateUser = (e) => {
    setUpdateUser((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const changeOrderStatus = async (id, status) => {
    const userId = user.id

    await dispatch(confirmOrder({id, status})) 
    if (userId) {
      dispatch(getOrderAsync(userId))
      if (user.email == "admin@test.com"){
        dispatch(getAllOrder())
      }
    }
  }

  async function imageUpload(event) {
    setProduct({
      ...product,
      ['file']: event.target.files[0]
    })
  }

  const [selectedId, setSelectedId] = useState(navigation[0].id)

  useEffect(() => {
    const userId = user.id
    if (userId) {
      dispatch(getOrderAsync(userId))
      if (user.email == "admin@test.com"){
        dispatch(getAllOrder())
      }
    }
  }, [])

  function convertUtcToJsDate(utcDate) {
    // UTC tarih/zaman formatını JS tarih objesine çevirir
    let jsDate = new Date(utcDate)

    // Gün, ay ve yıl değerlerini alır
    let day = jsDate.getUTCDate()
    let month = jsDate.getUTCMonth() + 1 // 0-11 arası değer döndürür, bu yüzden 1 eklenir
    let year = jsDate.getUTCFullYear()

    // YYYY-MM-DD formatına dönüştürür
    let dateString =
      day.toString().padStart(2, '0') +
      '-' +
      month.toString().padStart(2, '0') +
      '-' +
      year

    // Dönüştürülmüş tarih objesi ve tarih string'ini içeren bir obje döndürür
    return dateString
  }

  return (
    <div className="lg:grid lg:grid-cols-12 lg:gap-x-5">
      <aside className="px-2 py-6 sm:px-6 lg:col-span-3 lg:px-0 lg:py-0">
        <nav className="space-y-1">
          {navigation.slice(0,3).map((item) => (
              <span
              onClick={() => setSelectedId(item.id)}
              key={item.name}
              className={classNames(
                item.id === selectedId
                  ? 'bg-gray-50 text-indigo-700 hover:bg-white hover:text-indigo-700'
                  : 'text-gray-900 hover:bg-gray-50 hover:text-gray-900',
                'group flex items-center rounded-md px-3 py-2 text-sm font-medium'
              )}
              aria-current={item.current ? 'page' : undefined}
            >
              <item.icon
                className={classNames(
                  item.id === selectedId
                    ? 'text-indigo-500 group-hover:text-indigo-500'
                    : 'text-gray-400 group-hover:text-gray-500',
                  '-ml-1 mr-3 h-6 w-6 flex-shrink-0'
                )}
                aria-hidden="true"
              />
              <span className="truncate">{item.name}</span>
            </span>
          ))}
           {user.email == "admin@test.com" && navigation.slice(3,4).map((item) => (
              <span
              onClick={() => setSelectedId(item.id)}
              key={item.name}
              className={classNames(
                item.id === selectedId
                  ? 'bg-gray-50 text-indigo-700 hover:bg-white hover:text-indigo-700'
                  : 'text-gray-900 hover:bg-gray-50 hover:text-gray-900',
                'group flex items-center rounded-md px-3 py-2 text-sm font-medium'
              )}
              aria-current={item.current ? 'page' : undefined}
            >
              <item.icon
                className={classNames(
                  item.id === selectedId
                    ? 'text-indigo-500 group-hover:text-indigo-500'
                    : 'text-gray-400 group-hover:text-gray-500',
                  '-ml-1 mr-3 h-6 w-6 flex-shrink-0'
                )}
                aria-hidden="true"
              />
              <span className="truncate">{item.name}</span>
            </span>
          ))}
        </nav>
      </aside>

      <div className="space-y-6 sm:px-6 lg:col-span-9 lg:px-0">
        {selectedId === 1 && (
          <div className="space-y-10 divide-y divide-gray-900/10 pt-6">
            <div className="grid grid-cols-1 gap-x-8 gap-y-8 pt-10 md:grid-cols-3">
              <div className="px-4 sm:px-0">
                <h2 className="text-base font-semibold leading-7 text-gray-900">
                  Kişisel Bilgiler
                </h2>
                <p className="mt-1 text-sm leading-6 text-gray-600">
                  Hesaba ait adres ve kişisel bilgiler burada yer almaktadır.
                </p>
              </div>

              <form
                onSubmit={updateUserInfo}
                className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2"
              >
                <div className="px-4 py-6 sm:p-8">
                  <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                    <div className="sm:col-span-4">
                      <label
                        htmlFor="first-name"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Ad Soyad
                      </label>
                      <div className="mt-2">
                        <input
                          value={updateUser?.adi}
                          type="text"
                          name="adi"
                          id="adi"
                          onChange={handleUpdateUser}
                          autoComplete="ad soyad"
                          className="block w-full rounded-md outline-0  border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-4">
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Email adresi
                      </label>
                      <div className="mt-2">
                        <input
                          value={updateUser?.email}
                          id="email"
                          name="email"
                          type="email"
                          disabled
                          autoComplete="email"
                          onChange={handleUpdateUser}
                          className="block w-full rounded-md outline-0  border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                      </div>
                    </div>

                    <div className="col-span-full">
                      <label
                        htmlFor="street-address"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Ev adresi
                      </label>
                      <div className="mt-2">
                        <textarea
                          rows={4}
                          value={updateUser?.adres}
                          name="adres"
                          id="adres"
                          onChange={handleUpdateUser}
                          className="block w-full rounded-md border-0 outline-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          defaultValue={''}
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-4">
                      <label
                        htmlFor="first-name"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Yeni Şifre
                      </label>
                      <div className="mt-2">
                        <input
                          value={updateUser?.password}
                          type="password"
                          name="password"
                          id="password"
                          onChange={handleUpdateUser}
                          autoComplete="password"
                          className="block w-full rounded-md border-0 outline-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400  focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-x-6 border-t border-gray-900/10 px-4 py-4 sm:px-8">
                  <button
                    type="button"
                    className="text-sm font-semibold leading-6 text-gray-900"
                  >
                    İptal
                  </button>
                  <button
                    type="submit"
                    className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    Kaydet
                  </button>
                </div>
              </form>
            </div>

            <div className="grid grid-cols-1 gap-x-8 gap-y-8 pt-10 md:grid-cols-3">
              <div className="px-4 sm:px-0">
                <h2 className="text-base font-semibold leading-7 text-gray-900">
                  Bildirimler
                </h2>
                <p className="mt-1 text-sm leading-6 text-gray-600">
                  Siparişler hakkında değişiklikler yapıldığında bildirim almak
                  istiyorsanız buradan değiştirebilirsiniz.
                </p>
              </div>

              <form className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2">
                <div className="px-4 py-6 sm:p-8">
                  <div className="max-w-2xl space-y-10">
                    <fieldset>
                      <legend className="text-sm font-semibold leading-6 text-gray-900">
                        Email ile
                      </legend>
                      <div className="mt-6 space-y-6">
                        <div className="relative flex gap-x-3">
                          <div className="flex h-6 items-center">
                            <input
                              id="candidates"
                              name="candidates"
                              type="checkbox"
                              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                            />
                          </div>
                          <div className="text-sm leading-6">
                            <label
                              htmlFor="candidates"
                              className="font-medium text-gray-900"
                            >
                              Kargo Durumları
                            </label>
                            <p className="text-gray-500"></p>
                          </div>
                        </div>
                        <div className="relative flex gap-x-3">
                          <div className="flex h-6 items-center">
                            <input
                              id="offers"
                              name="offers"
                              type="checkbox"
                              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                            />
                          </div>
                          <div className="text-sm leading-6">
                            <label
                              htmlFor="offers"
                              className="font-medium text-gray-900"
                            >
                              Teklifler
                            </label>
                          </div>
                        </div>
                      </div>
                    </fieldset>
                    <fieldset>
                      <legend className="text-sm font-semibold leading-6 text-gray-900">
                        Anlık Bildirimler
                      </legend>
                      <p className="mt-1 text-sm leading-6 text-gray-600">
                        SMS ile cep telefonunuza gönderilir.
                      </p>
                      <div className="mt-6 space-y-6">
                        <div className="flex items-center gap-x-3">
                          <input
                            id="push-everything"
                            name="push-notifications"
                            type="radio"
                            className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                          />
                          <label
                            htmlFor="push-everything"
                            className="block text-sm font-medium leading-6 text-gray-900"
                          >
                            Tüm Bildirimler
                          </label>
                        </div>
                        <div className="flex items-center gap-x-3">
                          <input
                            id="push-email"
                            name="push-notifications"
                            type="radio"
                            className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                          />
                          <label
                            htmlFor="push-email"
                            className="block text-sm font-medium leading-6 text-gray-900"
                          >
                            Email ile Aynı Bildirimler
                          </label>
                        </div>
                        <div className="flex items-center gap-x-3">
                          <input
                            id="push-nothing"
                            name="push-notifications"
                            type="radio"
                            className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                          />
                          <label
                            htmlFor="push-nothing"
                            className="block text-sm font-medium leading-6 text-gray-900"
                          >
                            Bildirim İstemiyorum
                          </label>
                        </div>
                      </div>
                    </fieldset>
                  </div>
                </div>
                <div className="flex items-center justify-end gap-x-6 border-t border-gray-900/10 px-4 py-4 sm:px-8">
                  <button
                    type="button"
                    className="text-sm font-semibold leading-6 text-gray-900"
                  >
                    İptal
                  </button>
                  <button
                    type="submit"
                    className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    Kaydet
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {selectedId === 2 && (
          <form onSubmit={handleSubmit}>
            <div className="shadow sm:overflow-hidden sm:rounded-md">
              <div className="space-y-6 bg-white px-4 py-6 sm:p-6">
                <div>
                  <h3 className="text-base font-semibold leading-6 text-gray-900">
                    Ürün Ekle
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Ürün ile ilgili bütün boşlukları doldurunuz
                  </p>
                </div>

                <div className="grid grid-cols-6 gap-6">
                  <div className="col-span-6 sm:col-span-3">
                    <label
                      htmlFor="adi"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Ürün Adı
                    </label>
                    <input
                      type="text"
                      name="adi"
                      id="adi"
                      value={product.adi}
                      onChange={handleChange}
                      autoComplete="adi"
                      className="mt-2 block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>

                  <div className="col-span-6">
                    <label
                      htmlFor="aciklama"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Ürün Açıklama
                    </label>
                    <input
                      type="text"
                      name="aciklama"
                      id="aciklama"
                      value={product.aciklama}
                      onChange={handleChange}
                      autoComplete="aciklama"
                      className="mt-2 block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>

                  <div className="col-span-6 sm:col-span-2">
                    <label
                      htmlFor="adet"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Ürün Adet
                    </label>
                    <input
                      type="text"
                      name="adet"
                      id="adet"
                      value={product.adet}
                      onChange={handleChange}
                      autoComplete="adet"
                      className="mt-2 block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>

                  <div className="col-span-6 sm:col-span-2">
                    <label
                      htmlFor="fiyat"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Ürün Fiyatı
                    </label>
                    <input
                      type="text"
                      name="fiyat"
                      id="fiyat"
                      value={product.fiyat}
                      onChange={handleChange}
                      autoComplete="fiyat"
                      className="mt-2 block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>

                  <div className="col-span-6 sm:col-span-2">
                    <label
                      htmlFor="satista_mi"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Satış Durumu
                    </label>
                    <select
                      id="satista_mi"
                      name="satista_mi"
                      value={product.satista_mi}
                      onChange={handleChange}
                      autoComplete="satista_mi"
                      className="mt-2 block w-full rounded-md border-0 bg-white py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    >
                      <option value={0}>Pasif</option>
                      <option value={1}>Aktif</option>
                    </select>
                  </div>

                  <div className="col-span-full">
                    <label
                      htmlFor="cover-photo"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Ürün Fotoğrafı
                    </label>
                    <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                      <div className="text-center">
                        <PhotoIcon
                          className="mx-auto h-12 w-12 text-gray-300"
                          aria-hidden="true"
                        />
                        <div className="mt-4 flex text-sm leading-6 text-gray-600">
                          <label
                            htmlFor="foto1"
                            className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                          >
                            <span>Fotoğraf Yükle</span>
                            <input
                              id="foto1"
                              name="foto1"
                              type="file"
                              onChange={(e) => imageUpload(e)}
                              className="sr-only"
                            />
                          </label>
                          <p className="pl-1">veya sürükle bırak</p>
                        </div>
                        <p className="text-xs leading-5 text-gray-600">
                          PNG, JPG, GIF up to 10MB
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 text-right sm:px-6">
                <button
                  type="submit"
                  className="inline-flex justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Save
                </button>
              </div>
            </div>
          </form>
        )}

        {selectedId === 3 && (
          <div className="px-4 sm:px-6 lg:px-8 pt-6">
            <div className="sm:flex sm:items-center">
              <div className="sm:flex-auto">
                <h1 className="text-base font-semibold leading-6 text-gray-900">
                  Siparişlerim
                </h1>
                <p className="mt-2 text-sm text-gray-700"></p>
              </div>
            </div>
            <div className="mt-8 flow-root">
              <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                  <table className="min-w-full">
                    <thead className="bg-white">
                      <tr>
                        <th
                          scope="col"
                          className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-3"
                        >
                          Ürün
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                        >
                          Ürün Fiyat
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                        >
                          Adet
                        </th>
                        <th
                          scope="col"
                          className="relative py-3.5 pl-3 pr-4 sm:pr-3"
                        >
                          <span className="sr-only">Edit</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white">
                      {orderedProduct.map((order) => (
                        <Fragment key={order.id}>
                          <tr className="border-t border-gray-200">
                            <th
                              colSpan={5}
                              scope="colgroup"
                              className="bg-gray-50 py-2 pl-4 pr-3  text-sm font-semibold text-gray-900 sm:pl-3"
                            >
                              <div className="flex justify-between">
                                <span>
                                  Tarih: {convertUtcToJsDate(order.created_at)}
                                </span>
                                <span>
                                  Toplam Tutar: {order?.toplam_tutar}TL
                                </span>
                                <span>
                                  Sipariş Durumu :{' '}
                                  {
                                  order?.status === 0 && order?.status !== 1 && order?.status !== 2 ? (
                                    <div>Onay Bekleniyor</div>
                                ) : order?.status === 1 && order?.status !== 0 ? (
                                    <div>Onaylandı</div>
                                ) : order?.status === 3 ? (
                                    <div>İptal Edildi</div>
                                ) : (
                                    <div>Kargoya Verildi</div>
                                )
                                
                                  }
                                </span>
                                {
                                  order?.status == 0 && 
                                  <button 
                                  onClick={() => changeOrderStatus(order.id, "iptal")}
                                  className="rounded bg-indigo-500 px-2 py-1 text-xs font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500">
                                  İptal Et
                                  </button>
                                }
                              </div>
                            </th>
                          </tr>
                          {order.siparis_urun.map((urun, personIdx) => (
                            <tr
                              key={urun.id}
                              className={classNames(
                                personIdx === 0
                                  ? 'border-gray-300'
                                  : 'border-gray-200',
                                'border-t'
                              )}
                            >
                                   <img 
                                    src={`${process.env.BASE_URL.concat(urun.urun?.foto1)}`}
                                      alt={urun.urun?.adi}
                                    className="h-24 w-24 object-cover object-center sm:rounded-lg"
                                  />
                              <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-3">
                                {urun.urun?.adi}
                              </td>
                              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                {urun.urun?.fiyat}TL
                              </td>
                              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                {urun?.adet}
                              </td>
                            </tr>
                          ))}
                        </Fragment>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}
        {selectedId === 4 && user.email == "admin@test.com" && (
          <div className="px-4 sm:px-6 lg:px-8 pt-6">
            <div className="sm:flex sm:items-center">
              <div className="sm:flex-auto">
                <h1 className="text-base font-semibold leading-6 text-gray-900">
                  Tüm Siparişler
                </h1>
                <p className="mt-2 text-sm text-gray-700"></p>
              </div>
            </div>
            <div className="mt-8 flow-root">
              <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                  <table className="min-w-full">
                    <thead className="bg-white">
                      <tr>
                        <th
                          scope="col"
                          className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-3"
                        >
                          Ürün
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                        >
                          Ürün Fiyat
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                        >
                          Adet
                        </th>
                        <th
                          scope="col"
                          className="relative py-3.5 pl-3 pr-4 sm:pr-3"
                        >
                          <span className="sr-only">Edit</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white">
                      {allOrderedProduct.map((order) => (
                        <Fragment key={order.id}>
                          <tr className="border-t border-gray-200">
                            <th
                              colSpan={5}
                              scope="colgroup"
                              className="bg-gray-50 py-2 pl-4 pr-3  text-sm font-semibold text-gray-900 sm:pl-3"
                            >
                              <div className="flex justify-between">
                                <span>
                                  Tarih: {convertUtcToJsDate(order.created_at)}
                                </span>
                                <span>
                                  Toplam Tutar: {order?.toplam_tutar}TL
                                </span>
                                <span>
                                  Sipariş Durumu :{' '}
                                  {      order?.status === 0 && order?.status !== 1 && order?.status !== 2 ? (
                                    <div>Onay Bekleniyor</div>
                                ) : order?.status === 1 && order?.status !== 0 ? (
                                    <div>Onaylandı</div>
                                ) : order?.status === 3 ? (
                                    <div>İptal Edildi</div>
                                ) : (
                                    <div>Kargoya Verildi</div>
                                )
                                }

                                </span>
                                {
                                  order.status == 0 && 
                                  <button 
                                onClick={() => changeOrderStatus(order.id)}
                                className="rounded bg-indigo-500 px-2 py-1 text-xs font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500">
                                  Onayla
                                </button>} 
                                {
                                  order.status == 1 && 
                                  <button 
                                onClick={() => changeOrderStatus(order.id)}
                                className="rounded bg-indigo-500 px-2 py-1 text-xs font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500">
                                  Kargoya Ver
                                </button>} 
                              </div>
                            </th>
                          </tr>
                          {order.siparis_urun.map((urun, personIdx) => (
                            <tr
                              key={urun.id}
                              className={classNames(
                                personIdx === 0
                                  ? 'border-gray-300'
                                  : 'border-gray-200',
                                'border-t'
                              )}
                            >
                               <img 
                                    src={`${process.env.BASE_URL.concat(urun.urun?.foto1)}`}
                                      alt={urun.urun?.adi}
                                    className="h-24 w-24 object-cover object-center sm:rounded-lg"
                                  />
                              <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-3">
                                {urun.urun?.adi}
                              </td>
                              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                {urun.urun?.fiyat}TL
                              </td>
                              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                {urun?.adet}
                              </td>
                            </tr>
                          ))}
                        </Fragment>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
