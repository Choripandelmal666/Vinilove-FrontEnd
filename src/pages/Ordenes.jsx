import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { listarPedidos } from '../data/api'

function dinero(valor) {
  return Number(valor || 0).toLocaleString('es-CL')
}

export default function Ordenes() {
  const [ordenes, setOrdenes] = useState([])
  const [aviso, setAviso] = useState('')

  useEffect(() => {
    listarPedidos()
      .then((lista) => setOrdenes(Array.isArray(lista) ? lista : []))
      .catch(() => setAviso('La lista se lee de la base cuando la API está activa.'))
  }, [])

  return (
    <section>
      <h1 className="mb-3">Órdenes</h1>
      <p className="text-secondary">Lista de pedidos. Cada fila abre el detalle con sus productos.</p>
      {aviso && <p>{aviso}</p>}
      {ordenes.length === 0 && !aviso && <p>Todavía no hay órdenes.</p>}
      {ordenes.length > 0 && (
        <table className="table">
          <thead>
            <tr>
              <th>N°</th>
              <th>Cliente</th>
              <th>Dirección</th>
              <th>Total</th>
              <th>Estado</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {ordenes.map((orden) => (
              <tr key={orden.id}>
                <td>{orden.id}</td>
                <td>{orden.nombre}</td>
                <td>{orden.direccion}</td>
                <td>${dinero(orden.total)}</td>
                <td>{orden.estado}</td>
                <td>
                  <Link to={`/ordenes/${orden.id}`}>Ver detalle</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  )
}
