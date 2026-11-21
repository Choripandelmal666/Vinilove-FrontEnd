import { API_URL, pedirJSON } from './api'

const DOMINIOS_PERMITIDOS = ['duoc.cl', 'profesor.duoc.cl', 'gmail.com', 'vinilove.com']
const CLAVE_USUARIOS = 'viniLoveUsuarios'
const CLAVE_SESION = 'viniLoveSesion'
export const GOOGLE_CLIENT_ID = '185438849862-8u4lcrqrsltvsfm1u73n60b544esem7n.apps.googleusercontent.com'

const ADMIN_INICIAL = {
  run: '19011022K',
  correo: 'admin@vinilove.com',
  nombre: 'Admin',
  apellidos: 'Vinilove',
  password: 'admin1234',
  rol: 'admin',
}

function asegurarAdmin(usuarios) {
  const existe = usuarios.some(
    (u) => u.correo.toLowerCase() === ADMIN_INICIAL.correo
  )
  if (!existe) {
    usuarios.push({ ...ADMIN_INICIAL })
    localStorage.setItem(CLAVE_USUARIOS, JSON.stringify(usuarios))
  }
  return usuarios
}

export function validarCorreo(correo) {
  if (!correo) return false
  const partes = correo.split('@')
  if (partes.length !== 2) return false
  return DOMINIOS_PERMITIDOS.includes(partes[1].toLowerCase())
}

export function validarRUN(run) {
  const regexRUN = /^[0-9]{7,8}[0-9kK]{1}$/
  return regexRUN.test(run)
}

export function obtenerUsuarios() {
  const datos = localStorage.getItem(CLAVE_USUARIOS)
  const usuarios = datos ? JSON.parse(datos) : []
  return asegurarAdmin(Array.isArray(usuarios) ? usuarios : [])
}

export function esAdmin(usuario = obtenerUsuarioActual()) {
  return usuario?.rol === 'admin'
}

export function esVendedor(usuario = obtenerUsuarioActual()) {
  return usuario?.rol === 'vendedor'
}

export function esCliente(usuario = obtenerUsuarioActual()) {
  return usuario?.rol === 'cliente'
}

export function destinoTrasLogin(usuario) {
  if (usuario?.rol === 'admin') return '/admin'
  if (usuario?.rol === 'vendedor') return '/productos'
  return '/'
}

export async function registrarUsuario(nuevo) {
  try {
    await pedirJSON(`${API_URL}/usuarios/registro`, {
      method: 'POST',
      body: JSON.stringify(nuevo),
    })
    return { exito: true }
  } catch (error) {
    return { exito: false, mensaje: error.message }
  }
}

export async function loginUsuario(correo, password) {
  try {
    const usuario = await pedirJSON(`${API_URL}/usuarios/login`, {
      method: 'POST',
      body: JSON.stringify({ correo, password }),
    })
    localStorage.setItem(CLAVE_SESION, JSON.stringify(usuario))
    window.dispatchEvent(new Event('vinilove-sesion'))
    return { exito: true, usuario }
  } catch (error) {
    return { exito: false, mensaje: error.message }
  }
}

export async function loginConGoogle(credential) {
  try {
    const usuario = await pedirJSON(`${API_URL}/usuarios/google`, {
      method: 'POST',
      body: JSON.stringify({ credential }),
    })
    localStorage.setItem(CLAVE_SESION, JSON.stringify(usuario))
    window.dispatchEvent(new Event('vinilove-sesion'))
    return { exito: true, usuario }
  } catch (error) {
    return { exito: false, mensaje: error.message }
  }
}

export function obtenerUsuarioActual() {
  const datos = localStorage.getItem(CLAVE_SESION)
  return datos ? JSON.parse(datos) : null
}

export function cerrarSesion() {
  localStorage.removeItem(CLAVE_SESION)
  window.dispatchEvent(new Event('vinilove-sesion'))
}