import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { obtenerUsuarioActual, cerrarSesion } from '../data/auth'
import { actualizarPerfil, pedidosDeUsuario } from '../data/api'
import SelectorImagen from '../components/SelectorImagen'

export default function Perfil() {
  const navigate = useNavigate()
  const [usuario, setUsuario] = useState(null)
  const [pedidos, setPedidos] = useState([])
  const [mensaje, setMensaje] = useState('')
  const [nombreUsuario, setNombreUsuario] = useState('')
  const [fotoPerfil, setFotoPerfil] = useState('')

  useEffect(() => {
    const actual = obtenerUsuarioActual()
    if (!actual) {
      navigate('/login')
      return
    }
    setUsuario(actual)
    setNombreUsuario(actual.nombreUsuario || '')
    setFotoPerfil(actual.fotoPerfil || '')
    if (actual.id) {
      pedidosDeUsuario(actual.id).then(setPedidos).catch(() => setPedidos([]))
    }
  }, [navigate])

  function salir() {
    cerrarSesion()
    navigate('/login')
  }

  function guardarSesion(actualizado) {
    localStorage.setItem('viniLoveSesion', JSON.stringify(actualizado))
    setUsuario(actualizado)
    window.dispatchEvent(new Event('vinilove-sesion'))
  }

  async function guardarPerfil(e) {
    e.preventDefault()
    if (!usuario?.id) {
      setMensaje('Iniciá sesión con la API para guardar el perfil.')
      return
    }
    if (!/^[a-zA-Z0-9._]{3,20}$/.test(nombreUsuario.trim())) {
      setMensaje('El nombre de usuario debe tener entre 3 y 20 letras o números.')
      return
    }
    try {
      const actualizado = await actualizarPerfil(usuario.id, {
        nombreUsuario: nombreUsuario.trim(),
        fotoPerfil,
      })
      guardarSesion(actualizado)
      setMensaje('Perfil actualizado.')
    } catch (error) {
      setMensaje(error.message)
    }
  }

  if (!usuario) {
    return <p>Cargando perfil...</p>
  }

  return (
    <section className="row justify-content-center">
      <div className="col-md-6">
        <h1 className="mb-4">Mi perfil</h1>
        {fotoPerfil && <img src={fotoPerfil} alt="Foto de perfil" className="foto-perfil mb-3" />}
        <h2 className="h5">Datos de registro</h2>
        <p><strong>Nombre:</strong> {usuario.nombre} {usuario.apellidos}</p>
        <p><strong>RUN:</strong> {usuario.run}</p>
        <p><strong>Correo:</strong> {usuario.correo}</p>
        <p><strong>Rol:</strong> {usuario.rol}</p>

        <form className="mb-4" onSubmit={guardarPerfil}>
          <h2 className="h5">Editar perfil</h2>
          <div className="mb-2">
            <label className="form-label">Nombre de usuario</label>
            <input className="form-control" value={nombreUsuario} onChange={(e) => setNombreUsuario(e.target.value)} />
          </div>
          <div className="mb-2">
            <label className="form-label">Foto de perfil</label>
            <SelectorImagen id="fotoPerfil" preview={fotoPerfil} onChange={setFotoPerfil} />
          </div>
          <button type="submit" className="btn btn-primary">Guardar perfil</button>
        </form>

        {mensaje && <p className="mt-2">{mensaje}</p>}

        {pedidos.length > 0 && (
          <>
            <h2 className="h5">Mis pedidos</h2>
            <ul>
              {pedidos.map((pedido) => (
                <li key={pedido.id}>
                  Pedido #{pedido.id}: ${Number(pedido.total).toLocaleString('es-CL')} — {pedido.estado}
                  {pedido.items?.length > 0 && (
                    <ul>
                      {pedido.items.map((item, indice) => (
                        <li key={`${item.nombre}-${indice}`}>{item.nombre} × {item.cantidad}</li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </>
        )}

        <button type="button" className="btn btn-outline-dark me-2" onClick={salir}>
          Cerrar sesión
        </button>
        <Link to="/" className="btn btn-primary">Volver al inicio</Link>
      </div>
    </section>
  )
}