import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import CarritoFlotante from './components/CarritoFlotante'
import Footer from './components/Footer'
import Inicio from './pages/Inicio'
import Productos from './pages/Productos'
import DetalleProducto from './pages/DetalleProducto'
import Categorias from './pages/Categorias'
import Ofertas from './pages/Ofertas'
import Carrito from './pages/Carrito'
import Checkout from './pages/Checkout'
import CompraExito from './pages/CompraExito'
import CompraError from './pages/CompraError'
import Login from './pages/Login'
import Registro from './pages/Registro'
import Contacto from './pages/Contacto'
import Perfil from './pages/Perfil'
import Admin from './pages/Admin'
import Blog from './pages/Blog'
import Ordenes from './pages/Ordenes'
import DetalleOrden from './pages/DetalleOrden'
import RutaPorRol from './components/RutaPorRol'
import { obtenerUsuarioActual } from './data/auth'
import { guardarCarrito, obtenerCarrito } from './data/api'
import './App.css'


function leerCarrito() {
  try {
    const datos = localStorage.getItem('viniloverCarrito')
    return datos ? JSON.parse(datos) : []
  } catch {
    return []
  }
}

const TIENDA = ['invitado', 'cliente', 'admin']
const STAFF = ['admin', 'vendedor']

function App() {
  const [carrito, setCarrito] = useState(leerCarrito)
  const [rol, setRol] = useState(() => obtenerUsuarioActual()?.rol || 'invitado')

  useEffect(() => {
    function leerRol() {
      setRol(obtenerUsuarioActual()?.rol || 'invitado')
    }
    window.addEventListener('vinilove-sesion', leerRol)
    return () => window.removeEventListener('vinilove-sesion', leerRol)
  }, [])

  function publicar(lista) {
    setCarrito(lista)
    localStorage.setItem('viniloverCarrito', JSON.stringify(lista))
    const usuario = obtenerUsuarioActual()
    if (usuario?.id && usuario.rol !== 'vendedor') {
      guardarCarrito(usuario.id, lista).catch(() => {})
    }
  }

  useEffect(() => {
    let vigente = true

    async function sincronizar() {
      const usuario = obtenerUsuarioActual()
      if (!usuario?.id || usuario.rol === 'vendedor') return
      try {
        const remoto = await obtenerCarrito(usuario.id)
        if (!vigente) return
        if (remoto.length === 0) {
          const local = leerCarrito()
          if (local.length > 0) {
            const guardado = await guardarCarrito(usuario.id, local)
            if (vigente) publicar(guardado)
            return
          }
        }
        publicar(remoto)
      } catch {
        // Si la API no responde, el carrito local sigue visible.
      }
    }

    sincronizar()
    window.addEventListener('vinilove-sesion', sincronizar)
    return () => {
      vigente = false
      window.removeEventListener('vinilove-sesion', sincronizar)
    }
  }, [])

  function agregarAlCarrito(producto) {
    const indice = carrito.findIndex((item) => item.id === producto.id)
    if (indice !== -1) {
      const copia = [...carrito]
      copia[indice] = { ...copia[indice], cantidad: copia[indice].cantidad + 1 }
      publicar(copia)
      return
    }
    publicar([...carrito, { ...producto, cantidad: 1 }])
  }

  function cambiarCantidad(id, cambio) {
    publicar(
      carrito
        .map((item) =>
          item.id === id
            ? { ...item, cantidad: item.cantidad + cambio }
            : item
        )
        .filter((item) => item.cantidad > 0)
    )
  }

  function eliminarDelCarrito(id) {
    publicar(carrito.filter((item) => item.id !== id))
  }

  function vaciarCarrito() {
    publicar([])
  }

  const comprar = rol === 'vendedor' ? undefined : agregarAlCarrito

  return (
    <BrowserRouter>
      <div className="pm-marquee-wrap">
        <div className="pm-marquee-track">
          <span className="pm-item">Paga hasta 6 cuotas sin interés</span>
          <span className="pm-item">5% dcto extra nuevos clientes</span>
          <span className="pm-item">Envíos a todo Chile</span>
          <span className="pm-item">Paga hasta 6 cuotas sin interés</span>
          <span className="pm-item">5% dcto extra nuevos clientes</span>
          <span className="pm-item">Envíos a todo Chile</span>
        </div>
      </div>
      <Navbar />
      <main className="container py-4">
        <Routes>
          <Route path="/" element={<RutaPorRol roles={TIENDA}><Inicio /></RutaPorRol>} />
          <Route path="/productos" element={<Productos agregarAlCarrito={comprar} />} />
          <Route path="/productos/:id" element={<DetalleProducto agregarAlCarrito={comprar} />} />
          <Route path="/categorias" element={<RutaPorRol roles={TIENDA}><Categorias agregarAlCarrito={comprar} /></RutaPorRol>} />
          <Route path="/ofertas" element={<RutaPorRol roles={TIENDA}><Ofertas agregarAlCarrito={comprar} /></RutaPorRol>} />
          <Route
            path="/carrito"
            element={
              <RutaPorRol roles={TIENDA}>
                <Carrito
                  carrito={carrito}
                  cambiarCantidad={cambiarCantidad}
                  eliminarDelCarrito={eliminarDelCarrito}
                />
              </RutaPorRol>
            }
          />
          <Route path="/checkout" element={<RutaPorRol roles={TIENDA}><Checkout carrito={carrito} vaciarCarrito={vaciarCarrito} /></RutaPorRol>} />
          <Route path="/compra-exito" element={<RutaPorRol roles={TIENDA}><CompraExito /></RutaPorRol>} />
          <Route path="/compra-error" element={<RutaPorRol roles={TIENDA}><CompraError /></RutaPorRol>} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/contacto" element={<RutaPorRol roles={TIENDA}><Contacto /></RutaPorRol>} />
          <Route path="/perfil" element={<RutaPorRol roles={['cliente', 'admin']}><Perfil /></RutaPorRol>} />
          <Route path="/admin" element={<RutaPorRol roles={['admin']}><Admin /></RutaPorRol>} />
          <Route path="/blog" element={<RutaPorRol roles={TIENDA}><Blog /></RutaPorRol>} />
          <Route path="/ordenes" element={<RutaPorRol roles={STAFF}><Ordenes /></RutaPorRol>} />
          <Route path="/ordenes/:id" element={<RutaPorRol roles={STAFF}><DetalleOrden /></RutaPorRol>} />
        </Routes>
      </main>
      <Footer />
      {rol !== 'vendedor' && (
        <CarritoFlotante
          carrito={carrito}
          cambiarCantidad={cambiarCantidad}
          eliminarDelCarrito={eliminarDelCarrito}
        />
      )}
    </BrowserRouter>
  )
}

export default App
