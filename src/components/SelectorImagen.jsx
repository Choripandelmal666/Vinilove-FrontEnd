import { archivoADataUrl } from '../data/archivos'

export default function SelectorImagen({ id, preview, onChange }) {
  async function elegir(e) {
    const archivo = e.target.files?.[0]
    if (!archivo) return
    onChange(await archivoADataUrl(archivo))
  }

  return (
    <div>
      <input id={id} className="form-control" type="file" accept="image/*" onChange={elegir} />
      {preview && <img src={preview} alt="Vista previa" className="preview-imagen mt-2" />}
    </div>
  )
}
