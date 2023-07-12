import './App.css';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import Header from './components/Header/header'
import Footer from './components/Footer/footer'
import Home from './components/client/Pages/Home/Home';
import Products from './components/client/Pages/Products/Products';
import ProductDetail from './components/client/Pages/Products/ProductDetail';
import Cart from './components/client/Pages/Cart/Cart';
import PurchaseHistory from './components/client/Pages/PurchaseHistory/PurchaseHistory';
import Management from './components/admin/Pages/Management'
import SignForm from './components/signForm/signForm'
import VerificationPage from './components/signForm/verificationPage';
import RedirectHandler from './components/others/redirectHandler';
import FetchAllData from './components/others/fetchAllData';

function App() {
  return (
    <>
      <Router>
        <Header/>
        <FetchAllData/>
        <Routes>
          <Route path='/' exact element={<Home/>}/>
          <Route path='/products' element={<Products/>}/>
          <Route path='/products/:productID' element={
              <ProductDetail/>
          }/>
          <Route path='/carts' element={<Cart/>}/>
          <Route path='/purchaseHistory' element={
            <RedirectHandler login={true}>
              <PurchaseHistory/>
            </RedirectHandler>
          }/>
          <Route path='/management' element={
            <RedirectHandler login={false}>
              <Management/>
            </RedirectHandler>
          }/>
          <Route path='/signForm' element={<SignForm/>}/>
          <Route path='/verification' element={<VerificationPage/>}/>
        </Routes>
        <Footer/>
      </Router>
    </>
  );
}

export default App;
