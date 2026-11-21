import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { listarPedidos } from '../data/api'

function dinero(valor) {
  return Number(valor || 0).toLocaleString('es-CL')
}

export default function DetalleOrden() {
  const { id } = useParams()
  const [orden, setOrden] = useState(undefined)

  useEffect(() => {
    listarPedidos()
      .then((lista) => {
        const encontrada = (Array.isArray(lista) ? lista : []).find((item) => String(item.id) === String(id))
        setOrden(encontrada || null)
      })
      .catch(() => setOrden(null))
  }, [id])

  if (orden === undefined) {
    return <p>Cargando orden...</p>
  }

  if (!orden) {
    return (
      <section>
        <h1>Orden no encontrada</h1>
        <Link to="/ordenes">Volver a órdenes</Link>
      </section>
    )
  }

  return (
    <section>
      <h1 className="mb-3">Orden #{orden.id}</h1>
      <p><strong>Cliente:</strong> {orden.nombre}</p>
      <p><strong>Dirección:</strong> {orden.direccion}</p>
      <p><strong>Estado:</strong> {orden.estado}</p>
      <p><strong>Total:</strong> ${dinero(orden.total)}</p>
      <h2 className="h5">Detalle</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Producto</th>
            <th>Cantidad</th>
            <th>Precio</th>
          </tr>
        </thead>
        <tbody>
          {(orden.items || []).map((item, indice) => (
            <tr key={`${item.productoId || item.nombre}-${indice}`}>
              <td>{item.nombre}</td>
              <td>{item.cantidad}</td>
              <td>${dinero(item.precio)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <Link to="/ordenes" className="btn btn-primary">Volver a órdenes</Link>
    </section>
  )
}
