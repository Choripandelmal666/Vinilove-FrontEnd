export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api'

function tokenDeSesion() {
  try {
    const sesion = JSON.parse(localStorage.getItem('viniLoveSesion') || 'null')
    return sesion?.token || sesion?.jwt || null
  } catch {
    return null
  }
}

export async function pedirJSON(url, opciones = {}) {
  const token = tokenDeSesion()
  const respuesta = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(opciones.headers || {}),
    },
    ...opciones,
  })

  if (respuesta.status === 204) {
    return null
  }

  const contenido = await respuesta.json().catch(() => null)
  if (!respuesta.ok) {
    throw new Error(contenido?.error || contenido?.detail || contenido?.message || 'Error en la API')
  }
  return contenido
}

export function obtenerCarrito(usuarioId) {
  return pedirJSON(`${API_URL}/carrito/${usuarioId}`)
}

export function guardarCarrito(usuarioId, items) {
  return pedirJSON(`${API_URL}/carrito/${usuarioId}`, {
    method: 'PUT',
    body: JSON.stringify(
      items.map((item) => ({
        productoId: item.id,
        cantidad: item.cantidad,
      }))
    ),
  })
}

export function crearPedido(pedido) {
  return pedirJSON(`${API_URL}/pedidos`, {
    method: 'POST',
    body: JSON.stringify(pedido),
  })
}

export function pedidosDeUsuario(usuarioId) {
  return pedirJSON(`${API_URL}/pedidos/usuario/${usuarioId}`)
}

export function listarPedidos() {
  return pedirJSON(`${API_URL}/pedidos`)
}

export function crearMensaje(mensaje) {
  return pedirJSON(`${API_URL}/contacto`, {
    method: 'POST',
    body: JSON.stringify(mensaje),
  })
}

export function obtenerBlog() {
  return pedirJSON(`${API_URL}/blog`)
}

export function listarUsuarios() {
  return pedirJSON(`${API_URL}/usuarios`)
}

export function actualizarPerfil(usuarioId, datos) {
  return pedirJSON(`${API_URL}/usuarios/${usuarioId}`, {
    method: 'PUT',
    body: JSON.stringify(datos),
  })
}

export function eliminarUsuario(usuarioId) {
  return pedirJSON(`${API_URL}/usuarios/${usuarioId}`, {
    method: 'DELETE',
  })
}

export function crearPublicacion(post) {
  return pedirJSON(`${API_URL}/blog`, {
    method: 'POST',
    body: JSON.stringify(post),
  })
}

export function eliminarPublicacion(id) {
  return pedirJSON(`${API_URL}/blog/${id}`, {
    method: 'DELETE',
  })
}

export function guardarVendedor(usuarioId, datos) {
  return pedirJSON(`${API_URL}/vendedores/${usuarioId}`, {
    method: 'PUT',
    body: JSON.stringify(datos),
  })
}
