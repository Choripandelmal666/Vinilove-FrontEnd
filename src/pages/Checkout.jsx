import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { obtenerUsuarioActual } from '../data/auth'
import { crearPedido } from '../data/api'

export default function Checkout({ carrito, vaciarCarrito }) {
  const navigate = useNavigate()
  const [nombre, setNombre] = useState('')
  const [direccion, setDireccion] = useState('')
  const [error, setError] = useState('')

  const total = carrito.reduce(
    (suma, item) => suma + item.precio * item.cantidad,
    0
  )

  async function pagar(e) {
    e.preventDefault()

    if (carrito.length === 0) {
      navigate('/compra-error')
      return
    }

    if (!nombre.trim() || !direccion.trim()) {
      setError('Completa nombre y dirección de entrega.')
      return
    }

    try {
      const usuario = obtenerUsuarioActual()
      await crearPedido({
        usuarioId: usuario?.id || null,
        nombre: nombre.trim(),
        direccion: direccion.trim(),
        items: carrito.map((item) => ({
          productoId: item.id,
          nombre: item.nombre,
          precio: item.precio,
          cantidad: item.cantidad,
        })),
      })
      vaciarCarrito?.()
      navigate('/compra-exito')
    } catch {
      navigate('/compra-error')
    }
  }

  return (
    <section>
      <h1 className="mb-4">Checkout</h1>
      <p>Total a pagar: <strong>${total.toLocaleString('es-CL')}</strong></p>

      {error && <p className="text-danger">{error}</p>}

      <form onSubmit={pagar}>
        <div className="mb-3">
          <label className="form-label">Nombre</label>
          <input
            className="form-control"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Dirección de entrega</label>
          <input
            className="form-control"
            value={direccion}
            onChange={(e) => setDireccion(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Confirmar pago
        </button>
      </form>

      <p className="mt-3">
        <Link to="/carrito">Volver al carrito</Link>
      </p>
    </section>
  )
}