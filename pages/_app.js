import '@/styles/globals.css'
import Layouts from '@/components/layouts'
import { Provider } from 'react-redux'
import { store } from '../redux/store'

function App({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <Layouts>
        <Component {...pageProps} />
      </Layouts>
    </Provider>
  )
}

export default App
