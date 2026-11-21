import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

export default function CarritoFlotante({ carrito, cambiarCantidad, eliminarDelCarrito }) {
  const [abierto, setAbierto] = useState(false)
  const location = useLocation()
  const cantidadAnterior = useRef(0)
  const yaMontado = useRef(false)
  const cantidad = carrito.reduce((suma, item) => suma + item.cantidad, 0)
  const total = carrito.reduce((suma, item) => suma + Number(item.precio) * item.cantidad, 0)

  useEffect(() => {
    if (yaMontado.current && cantidad > cantidadAnterior.current) {
      setAbierto(true)
    }
    cantidadAnterior.current = cantidad
    yaMontado.current = true
  }, [cantidad])

  if (location.pathname === '/carrito' || location.pathname === '/checkout') {
    return null
  }

  return (
    <div className="carrito-flotante">
      {abierto && (
        <div className="carrito-flotante-panel">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <strong>Tu carrito</strong>
            <button type="button" className="btn btn-sm btn-outline-light" onClick={() => setAbierto(false)}>
              Cerrar
            </button>
          </div>
          {carrito.length === 0 ? (
            <p className="mb-0">Todavía no agregas vinilos.</p>
          ) : (
            <>
              {carrito.map((item) => (
                <div key={item.id} className="carrito-flotante-item">
                  <div>
                    <strong>{item.nombre}</strong>
                    <div>${Number(item.precio).toLocaleString('es-CL')}</div>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <button type="button" className="btn btn-sm btn-outline-light" onClick={() => cambiarCantidad(item.id, -1)}>−</button>
                    <span>{item.cantidad}</span>
                    <button type="button" className="btn btn-sm btn-outline-light" onClick={() => cambiarCantidad(item.id, 1)}>+</button>
                    <button type="button" className="btn btn-sm btn-danger" onClick={() => eliminarDelCarrito(item.id)}>Quitar</button>
                  </div>
                </div>
              ))}
              <p className="mt-3 mb-2 fw-bold">Total: ${total.toLocaleString('es-CL')}</p>
              <Link to="/carrito" className="btn btn-outline-light btn-sm me-2" onClick={() => setAbierto(false)}>Ver carrito</Link>
              <Link to="/checkout" className="btn btn-primary btn-sm" onClick={() => setAbierto(false)}>Pagar</Link>
            </>
          )}
        </div>
      )}
      <button type="button" className="carrito-flotante-boton" onClick={() => setAbierto((valor) => !valor)}>
        Carrito <span>{cantidad}</span>
      </button>
    </div>
  )
}
