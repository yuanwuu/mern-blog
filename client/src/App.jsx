import {BrowserRouter,Routes,Route} from 'react-router-dom'
import Header from './components/Header'
import Home from './pages/Home'
import About from './pages/About'
import Projects from './pages/Projects'
import Dashboard from './pages/Dashboard'
import Signup from './pages/Signup'
import Signin from './pages/Signin'
import FooterCom from './components/Footer'
import PrivateRoute from './components/PrivateRoute'
import AdminPrivate from './components/AdminPrivate'
import CreatePost from './pages/CreatePost'

const App = () => {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/about' element={<About />} />
        <Route path='/projects' element={<Projects />} />
        <Route element={<PrivateRoute/>}>
          <Route path='/dashboard' element={<Dashboard />} />
        </Route>
        <Route element={<AdminPrivate/>}>
          <Route path='/create-post' element={<CreatePost />} />
        </Route>
        <Route path='/sign-up' element={<Signup />} />
        <Route path='/sign-in' element={<Signin />} />
      </Routes>
      <FooterCom />
    </BrowserRouter>
  )
}

export default App