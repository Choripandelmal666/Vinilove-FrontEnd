import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { esAdmin, obtenerUsuarioActual } from '../data/auth'
import { agregarProducto, eliminarProducto, obtenerProductos } from '../data/productos'
import { eliminarUsuario, listarUsuarios } from '../data/api'
import SelectorImagen from '../components/SelectorImagen'

export default function Admin() {
  const navigate = useNavigate()
  const [autorizado, setAutorizado] = useState(false)
  const [productos, setProductos] = useState([])
  const [nombre, setNombre] = useState('')
  const [artista, setArtista] = useState('')
  const [precio, setPrecio] = useState('')
  const [categoria, setCategoria] = useState('Rock')
  const [oferta, setOferta] = useState(false)
  const [imagen, setImagen] = useState('')
  const [usuarios, setUsuarios] = useState([])

  async function cargarProductos() {
    const lista = await obtenerProductos()
    setProductos(lista)
  }

  useEffect(() => {
    if (!esAdmin()) {
      navigate('/login')
      return
    }
    setAutorizado(true)
    cargarProductos()
    listarUsuarios().then(setUsuarios).catch(() => setUsuarios([]))
  }, [navigate])

  async function agregar(e) {
    e.preventDefault()
    if (!nombre.trim() || !artista.trim() || !precio || !imagen) return

    const nuevo = {
      id: nombre.toLowerCase().replaceAll(' ', '-') + '-' + Date.now(),
      nombre: nombre.trim(),
      artista: artista.trim(),
      precio: Number(precio),
      anio: '2024',
      categoria,
      oferta,
      imagen,
      descripcion: 'Producto agregado desde el panel admin.',
    }

    await agregarProducto(nuevo)
    await cargarProductos()
    setNombre('')
    setArtista('')
    setPrecio('')
    setOferta(false)
    setImagen('')
  }

  async function borrarUsuario(usuario) {
    const confirma = window.confirm(`¿Borrar el perfil de ${usuario.nombreUsuario || usuario.nombre}?`)
    if (!confirma) return
    await eliminarUsuario(usuario.id)
    setUsuarios((lista) => lista.filter((item) => item.id !== usuario.id))
  }

  async function borrar(id) {
    await eliminarProducto(id)
    await cargarProductos()
  }

  if (!autorizado) {
    return <p>Acceso restringido. Entrá con la cuenta admin.</p>
  }

  return (
    <section>
      <h1 className="mb-4">Panel admin</h1>
      <p className="text-secondary">
        Productos, ofertas, usuarios y vendedores salen de MySQL a través de Spring Boot.
        <a className="ms-2" href="http://localhost:8080/swagger-ui.html" target="_blank" rel="noreferrer">Abrir Swagger</a>
      </p>

      <form className="row g-3 mb-4" onSubmit={agregar}>
        <div className="col-md-4">
          <input
            className="form-control"
            placeholder="Nombre del álbum"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
        </div>
        <div className="col-md-3">
          <input
            className="form-control"
            placeholder="Artista"
            value={artista}
            onChange={(e) => setArtista(e.target.value)}
          />
        </div>
        <div className="col-md-2">
          <input
            className="form-control"
            type="number"
            placeholder="Precio"
            value={precio}
            onChange={(e) => setPrecio(e.target.value)}
          />
        </div>
        <div className="col-md-2">
          <select
            className="form-select"
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
          >
            <option>Rock</option>
            <option>Metal</option>
            <option>Grunge</option>
          </select>
        </div>
        <div className="col-md-1 d-flex align-items-center">
          <div className="form-check">
            <input
              id="checkOferta"
              className="form-check-input"
              type="checkbox"
              checked={oferta}
              onChange={(e) => setOferta(e.target.checked)}
            />
            <label className="form-check-label" htmlFor="checkOferta">
              Oferta
            </label>
          </div>
        </div>
        <div className="col-12">
          <label className="form-label">Imagen del vinilo</label>
          <SelectorImagen id="imagenAdmin" preview={imagen} onChange={setImagen} />
        </div>
        <div className="col-12">
          <button type="submit" className="btn btn-primary">
            Agregar producto
          </button>
        </div>
      </form>

      <table className="table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Artista</th>
            <th>Precio</th>
            <th>Categoría</th>
            <th>Oferta</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {productos.map((item) => (
            <tr key={item.id}>
              <td>{item.nombre}</td>
              <td>{item.artista}</td>
              <td>${Number(item.precio).toLocaleString('es-CL')}</td>
              <td>{item.categoria}</td>
              <td>{item.oferta ? 'Sí' : 'No'}</td>
              <td>
                <button
                  type="button"
                  className="btn btn-sm btn-danger"
                  onClick={() => borrar(item.id)}
                >
                  Borrar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 className="h4 mt-5">Perfiles</h2>
      <p className="text-secondary">Podés borrar un perfil. La cuenta admin principal se queda.</p>
      <table className="table">
        <thead>
          <tr>
            <th>Usuario</th>
            <th>Nombre</th>
            <th>Correo</th>
            <th>RUN</th>
            <th>Rol</th>
            <th>Tienda</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((usuario) => (
            <tr key={usuario.id}>
              <td>{usuario.nombreUsuario || '—'}</td>
              <td>{usuario.nombre} {usuario.apellidos}</td>
              <td>{usuario.correo}</td>
              <td>{usuario.run}</td>
              <td>{usuario.rol}</td>
              <td>{usuario.nombreTienda || '—'}</td>
              <td>
                {usuario.correo !== 'admin@vinilove.com' && usuario.id !== obtenerUsuarioActual()?.id && (
                  <button type="button" className="btn btn-sm btn-danger" onClick={() => borrarUsuario(usuario)}>
                    Borrar perfil
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  )
}
