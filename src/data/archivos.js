export function archivoADataUrl(archivo) {
  return new Promise((resolve, reject) => {
    const lector = new FileReader()
    lector.onerror = () => reject(new Error('No se pudo leer la imagen.'))
    lector.onload = () => {
      const original = new Image()
      original.onload = () => {
        const maximo = 900
        const escala = Math.min(1, maximo / Math.max(original.width, original.height))
        const lienzo = document.createElement('canvas')
        lienzo.width = Math.max(1, Math.round(original.width * escala))
        lienzo.height = Math.max(1, Math.round(original.height * escala))
        const contexto = lienzo.getContext('2d')
        contexto.drawImage(original, 0, 0, lienzo.width, lienzo.height)
        resolve(lienzo.toDataURL('image/jpeg', 0.72))
      }
      original.onerror = () => reject(new Error('El archivo no es una imagen válida.'))
      original.src = lector.result
    }
    lector.readAsDataURL(archivo)
  })
}
