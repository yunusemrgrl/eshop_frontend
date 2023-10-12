import Link from 'next/link'
import { registerAsync } from '@/redux/auth-slice'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

function Register() {
  const dispatch = useDispatch()
  const router = useRouter()
  const status = useSelector((state) => state.auth.status)

  const [user, setUser] = useState({
    adi: '',
    email: '',
    adres: '',
    password: ''
  })

  const handleChange = (e) => {
    setUser((prevState) => {
      return { ...prevState, [e.target.name]: e.target.value }
    })
  }

  const register = (e) => {
    e.preventDefault()
    dispatch(registerAsync(user))
  }

  useEffect(() => {
    if (status) {
      router.push('/')
      return () => {}
    }
  }, [status])

  return (
    <div className="h-screen">
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            className="mx-auto h-10 w-auto"
            src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
            alt="Your Company"
          />
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Kayıt ol
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" onSubmit={register}>
            <div>
              <label
                htmlFor="text"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                İsim
              </label>
              <div className="mt-2">
                <input
                  id="text"
                  name="adi"
                  type="text"
                  value={user.adi}
                  onChange={handleChange}
                  autoComplete="text"
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Email adresi
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={user.email}
                  onChange={handleChange}
                  autoComplete="email"
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="adres"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Adres
              </label>
              <div className="mt-2">
                <textarea
                  rows={4}
                  name="adres"
                  value={user.adres}
                  onChange={handleChange}
                  id="adres"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  defaultValue={''}
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Şifre
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={user.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Kaydol
              </button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm text-gray-500">
            Hesabın var mı ?
            <Link
              href={'/login'}
              passHref
              className="font-semibold leading-6 pl-2 underline text-indigo-600 hover:text-indigo-500"
            >
              Giriş Yap
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Register
