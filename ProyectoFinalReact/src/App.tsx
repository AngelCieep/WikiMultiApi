import './App.css'
import Footer from "./layout/Footer.tsx";
import Navbar from "./layout/Navbar.tsx";
import Home from "./pages/Home.tsx";
import {Route, Routes} from "react-router-dom";
import CarteleraPage from "./pages/CarteleraPage.tsx";
import TicketsPage from "./pages/TicketsPage.tsx";
import ContactPage from "./pages/ContactPage.tsx";
import LoginRegistrerPage from "./pages/LoginRegistrerPage.tsx";
import NOTFoundComponent from "./components/404NF.tsx";
import MovieDetail from "./components/MovieDetail.tsx";

function App() {
  return (
    <>
        <Navbar />
        {/*<Home />*/}
        <Routes>
            <Route path="/" element={<Home />}/>
            <Route path="/cartelera" element={<CarteleraPage />}/>
            <Route path="/movie/:id" element={<MovieDetail />}/>
            <Route path="/cartelera" element={<CarteleraPage />}/>
            <Route path="/tickets" element={<TicketsPage />}/>
            <Route path="/contacto" element={<ContactPage />}/>
            <Route path="/login" element={<LoginRegistrerPage />}/>
            <Route path="*" element={<NOTFoundComponent/>}/>
        </Routes>
        <Footer />
    </>
  )
}

export default App
