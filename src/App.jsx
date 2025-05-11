import { useState } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import ProductCatalog from './pages/HomePage'
import ProductDetails from './components/ProductDetails'

function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route path='/' element={<ProductCatalog/>}/>
          <Route path='/productDetails' element={<ProductDetails/>}/>
        </Routes>
      </Router>
    </>
  )
}

export default App
