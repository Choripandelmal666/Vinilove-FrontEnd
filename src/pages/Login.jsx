import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { validarCorreo, loginUsuario, loginConGoogle, destinoTrasLogin, GOOGLE_CLIENT_ID } from '../data/auth'

export default function Login() {
  const navigate = useNavigate()
  const botonGoogle = useRef(null)
  const [correo, setCorreo] = useState('')
  const [password, setPassword] = useState('')
  const [errores, setErrores] = useState([])

  useEffect(() => {
    let timer = 0
    function pintar() {
      if (!window.google || !botonGoogle.current) return false
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: async (respuesta) => {
          const resultado = await loginConGoogle(respuesta.credential)
          if (!resultado.exito) {
            setErrores([resultado.mensaje])
            return
          }
          setErrores([])
          navigate(destinoTrasLogin(resultado.usuario))
        },
      })
      botonGoogle.current.innerHTML = ''
      window.google.accounts.id.renderButton(botonGoogle.current, {
        theme: 'outline',
        size: 'large',
        width: 320,
        text: 'continue_with',
      })
      return true
    }
    if (!pintar()) {
      timer = window.setInterval(() => {
        if (pintar()) window.clearInterval(timer)
      }, 200)
    }
    return () => window.clearInterval(timer)
  }, [navigate])

  async function enviar(e) {
    e.preventDefault()
    const lista = []

    if (!correo || correo.length > 100 || !validarCorreo(correo.trim())) {
      lista.push('El correo debe ser válido y de un dominio permitido.')
    }
    if (!password || password.length < 4 || password.length > 30) {
      lista.push('La contraseña debe tener entre 4 y 30 caracteres.')
    }

    if (lista.length > 0) {
      setErrores(lista)
      return
    }

    const resultado = await loginUsuario(correo.trim(), password)
    if (!resultado.exito) {
      setErrores([resultado.mensaje])
      return
    }

    setErrores([])
    navigate(destinoTrasLogin(resultado.usuario))
  }

  return (
    <section className="row justify-content-center">
      <div className="col-md-5">
        <h1 className="mb-4">Iniciar sesión</h1>
        <form onSubmit={enviar}>
          <div className="mb-3">
            <label className="form-label">Correo</label>
            <input className="form-control" value={correo} onChange={(e) => setCorreo(e.target.value)} />
            <small>duoc.cl, profesor.duoc.cl, gmail.com, vinilove.com</small>
          </div>
          <div className="mb-3">
            <label className="form-label">Contraseña</label>
            <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>

          {errores.length > 0 && (
            <div className="alert alert-danger">
              {errores.map((msg) => (
                <p key={msg} className="mb-1">{msg}</p>
              ))}
            </div>
          )}

          <button type="submit" className="btn btn-primary w-100">Ingresar</button>
        </form>
        <div className="d-flex justify-content-center mt-3" ref={botonGoogle}></div>
        <p className="mt-3">
          ¿No tienes cuenta? <Link to="/registro">Regístrate</Link>
        </p>
      </div>
    </section>
  )
}