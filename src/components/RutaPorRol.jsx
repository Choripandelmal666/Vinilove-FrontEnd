import { Navigate } from 'react-router-dom'
import { obtenerUsuarioActual } from '../data/auth'

export default function RutaPorRol({ roles, children }) {
  const usuario = obtenerUsuarioActual()
  const rol = usuario?.rol || 'invitado'
  if (roles.includes(rol)) return children
  if (!usuario) return <Navigate to="/login" replace />
  return <Navigate to={rol === 'vendedor' ? '/productos' : '/'} replace />
}
