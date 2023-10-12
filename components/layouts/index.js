import Navigation from '@/components/layouts/Navigation'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Footer from '@/components/layouts/Footer'
import ShoppingCart from '@/components/shopping-cart'
import { useSelector } from 'react-redux'

const Layouts = ({ children }) => {
  const router = useRouter()
  const [isAuthPage, setIsAuthPage] = useState(false)
  const status = useSelector((state) => state.auth.status)
  const token = useSelector((state) => state.auth.token)

  useEffect(() => {
    if (router.pathname === '/login' || router.pathname === '/register') {
      setIsAuthPage(!isAuthPage)
    }
  }, [status, token])

  return (
    <>
      <nav>{!isAuthPage && <Navigation />}</nav>
      <main>{children}</main>
      {!isAuthPage && <Footer />}
      {!isAuthPage && <ShoppingCart />}
    </>
  )
}
export default Layouts
