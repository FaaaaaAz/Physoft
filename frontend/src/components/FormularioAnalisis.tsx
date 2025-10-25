import { useState } from 'react'
import { IoClose, IoSave, IoDocument, IoChevronDown, IoChevronUp } from 'react-icons/io5'
import '../styles/FormularioAnalisis.css'

interface FormularioAnalisisProps {
  atleta: any
  onClose: () => void
}

function FormularioAnalisis({ atleta, onClose }: FormularioAnalisisProps) {
  const [bloqueExpandido, setBloqueExpandido] = useState<string>('A')
  const [guardandoBorrador, setGuardandoBorrador] = useState(false)

  // Estado del formulario
  const [formData, setFormData] = useState({
    // Bloque A
    fechaInicio: '',
    fechaFin: '',
    evaluador: '',
    atletaNombre: atleta?.nombre || '',
    contacto: '',
    
    // Bloque B
    sexo: '',
    disciplina: '',
    posicion: '',
    somatotipo: '',
    edad: '',
    altura: '',
    peso: '',
    
    // Bloque C
    motivoConsulta: '',
    herramientas: [] as string[],
    herramientasOtro: '',
    
    // Bloque D1 - Rendimiento
    minutosJugados: '',
    comentarioRendimiento: '',
    
    // Bloque D2 - Gait
    indiceSimetria: '',
    oblicuidadCadera: '',
    rotacionCadera: '',
    notaAsimetrias: '',
    
    // Bloque D3 - FreeEMG
    balanceActivacion: '',
    ladoApoyoDominante: '',
    diferenciaActivacion: '',
    
    // Bloque D4 - Equilibrio
    equilibrioDer: {
      areaElipse: '',
      oscilacionAP: '',
      oscilacionML: '',
      indiceEquilibrio: ''
    },
    equilibrioIzq: {
      areaElipse: '',
      oscilacionAP: '',
      oscilacionML: '',
      indiceEquilibrio: ''
    },
    observacionesEquilibrio: '',
    
    // Bloque E
    primerAnalisis: '',
    segundoAnalisis: '',
    
    // Bloque F
    clasificacionGlobal: '',
    puntosDebiles: ['', '', ''],
    margenesMejora: [{porcentaje: '', valorAbsoluto: ''}, {porcentaje: '', valorAbsoluto: ''}, {porcentaje: '', valorAbsoluto: ''}],
    recomendaciones: '',
    fechaSeguimiento: ''
  })

  const disciplinas = ['Fútbol', 'Básquet', 'Rugby', 'Atletismo', 'Tenis', 'Handball', 'Voleibol', 'Natación', 'Otro']
  const herramientasDisponibles = ['BTS / FreeEMG', 'G-Walk', 'BioBit / Equilibrio', 'Wyscout', 'Otros']

  const toggleBloque = (bloque: string) => {
    setBloqueExpandido(bloqueExpandido === bloque ? '' : bloque)
  }

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleNestedChange = (parent: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [parent]: { ...(prev as any)[parent], [field]: value }
    }))
  }

  const handleArrayChange = (field: string, index: number, value: string) => {
    setFormData(prev => {
      const newArray = [...(prev as any)[field]]
      newArray[index] = value
      return { ...prev, [field]: newArray }
    })
  }

  const handleHerramientaToggle = (herramienta: string) => {
    setFormData(prev => ({
      ...prev,
      herramientas: prev.herramientas.includes(herramienta)
        ? prev.herramientas.filter(h => h !== herramienta)
        : [...prev.herramientas, herramienta]
    }))
  }

  const handleGuardarBorrador = async () => {
    setGuardandoBorrador(true)
    // Simular guardado
    await new Promise(resolve => setTimeout(resolve, 1000))
    setGuardandoBorrador(false)
    alert('Borrador guardado exitosamente')
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Formulario enviado:', formData)
    alert('Análisis guardado exitosamente')
    onClose()
  }

  return (
    <div className="formulario-fullscreen">
      <div className="formulario-header">
        <div className="formulario-header-content">
          <div>
            <h1 className="formulario-title">
              <IoDocument />
              Informe de Evaluación Kinesiológica
            </h1>
            <p className="formulario-subtitle">
              {atleta?.nuevo ? 'Nuevo Atleta' : atleta?.nombre || 'Análisis Deportivo'}
            </p>
          </div>
          <div className="formulario-header-actions">
            <button
              type="button"
              className="btn-secondary"
              onClick={handleGuardarBorrador}
              disabled={guardandoBorrador}
            >
              {guardandoBorrador ? 'Guardando...' : 'Guardar Borrador'}
            </button>
            <button type="button" className="btn-close-form" onClick={onClose}>
              <IoClose />
            </button>
          </div>
        </div>
      </div>

      <form className="formulario-content" onSubmit={handleSubmit}>
        <div className="formulario-container">
          
          {/* BLOQUE A - Información de sesión */}
          <div className="form-bloque">
            <div className="bloque-header" onClick={() => toggleBloque('A')}>
              <h2 className="bloque-title">
                <span className="bloque-letra">A</span>
                Información de Sesión (Filiación)
              </h2>
              {bloqueExpandido === 'A' ? <IoChevronUp /> : <IoChevronDown />}
            </div>
            
            {bloqueExpandido === 'A' && (
              <div className="bloque-content">
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label required">Fecha y Hora — Evaluación (Inicio)</label>
                    <input
                      type="datetime-local"
                      className="form-input"
                      value={formData.fechaInicio}
                      onChange={(e) => handleChange('fechaInicio', e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label required">Fecha y Hora — Evaluación (Fin)</label>
                    <input
                      type="datetime-local"
                      className="form-input"
                      value={formData.fechaFin}
                      onChange={(e) => handleChange('fechaFin', e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label required">Evaluador (Kinesiólogo / Terapeuta)</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Nombre completo del evaluador"
                      value={formData.evaluador}
                      onChange={(e) => handleChange('evaluador', e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label required">Atleta</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Nombre del atleta"
                      value={formData.atletaNombre}
                      onChange={(e) => handleChange('atletaNombre', e.target.value)}
                      required
                      disabled={!atleta?.nuevo}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Contacto (Email o Teléfono)</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="email@ejemplo.com o +54 9 11 1234-5678"
                    value={formData.contacto}
                    onChange={(e) => handleChange('contacto', e.target.value)}
                  />
                </div>
              </div>
            )}
          </div>

          {/* BLOQUE B - Datos antropométricos */}
          <div className="form-bloque">
            <div className="bloque-header" onClick={() => toggleBloque('B')}>
              <h2 className="bloque-title">
                <span className="bloque-letra">B</span>
                Datos Antropométricos / Clasificación
              </h2>
              {bloqueExpandido === 'B' ? <IoChevronUp /> : <IoChevronDown />}
            </div>
            
            {bloqueExpandido === 'B' && (
              <div className="bloque-content">
                <div className="form-row-3">
                  <div className="form-group">
                    <label className="form-label required">Sexo</label>
                    <select
                      className="form-select"
                      value={formData.sexo}
                      onChange={(e) => handleChange('sexo', e.target.value)}
                      required
                    >
                      <option value="">Seleccionar...</option>
                      <option value="Masculino">Masculino</option>
                      <option value="Femenino">Femenino</option>
                      <option value="Otro">Otro / Prefiero no decir</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label required">Disciplina</label>
                    <select
                      className="form-select"
                      value={formData.disciplina}
                      onChange={(e) => handleChange('disciplina', e.target.value)}
                      required
                    >
                      <option value="">Seleccionar...</option>
                      {disciplinas.map(d => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Posición (si aplica)</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Ej: Delantero, Base, etc."
                      value={formData.posicion}
                      onChange={(e) => handleChange('posicion', e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-row-4">
                  <div className="form-group">
                    <label className="form-label required">Somatotipo</label>
                    <select
                      className="form-select"
                      value={formData.somatotipo}
                      onChange={(e) => handleChange('somatotipo', e.target.value)}
                      required
                    >
                      <option value="">Seleccionar...</option>
                      <option value="Mesomorfo">Mesomorfo</option>
                      <option value="Ectomorfo">Ectomorfo</option>
                      <option value="Endomorfo">Endomorfo</option>
                      <option value="No definido">No definido</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label required">Edad (años)</label>
                    <input
                      type="number"
                      className="form-input"
                      min="1"
                      placeholder="25"
                      value={formData.edad}
                      onChange={(e) => handleChange('edad', e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label required">Altura (cm)</label>
                    <input
                      type="number"
                      step="0.1"
                      className="form-input"
                      placeholder="175.5"
                      value={formData.altura}
                      onChange={(e) => handleChange('altura', e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label required">Peso (kg)</label>
                    <input
                      type="number"
                      step="0.1"
                      className="form-input"
                      placeholder="72.5"
                      value={formData.peso}
                      onChange={(e) => handleChange('peso', e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* BLOQUE C - Motivo de consulta */}
          <div className="form-bloque">
            <div className="bloque-header" onClick={() => toggleBloque('C')}>
              <h2 className="bloque-title">
                <span className="bloque-letra">C</span>
                Motivo de Consulta / Alcance
              </h2>
              {bloqueExpandido === 'C' ? <IoChevronUp /> : <IoChevronDown />}
            </div>
            
            {bloqueExpandido === 'C' && (
              <div className="bloque-content">
                <div className="form-group">
                  <label className="form-label">Motivo de Consulta (breve)</label>
                  <textarea
                    className="form-textarea"
                    rows={3}
                    placeholder="Descripción breve del motivo de la evaluación..."
                    value={formData.motivoConsulta}
                    onChange={(e) => handleChange('motivoConsulta', e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Herramientas Utilizadas</label>
                  <div className="checkbox-group">
                    {herramientasDisponibles.map(herramienta => (
                      <label key={herramienta} className="checkbox-label">
                        <input
                          type="checkbox"
                          checked={formData.herramientas.includes(herramienta)}
                          onChange={() => handleHerramientaToggle(herramienta)}
                        />
                        <span>{herramienta}</span>
                      </label>
                    ))}
                  </div>
                  {formData.herramientas.includes('Otros') && (
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Especificar otras herramientas..."
                      value={formData.herramientasOtro}
                      onChange={(e) => handleChange('herramientasOtro', e.target.value)}
                      style={{ marginTop: '12px' }}
                    />
                  )}
                </div>
              </div>
            )}
          </div>

          {/* BLOQUE D - KPIs (solo estructura básica, puedes expandir) */}
          <div className="form-bloque">
            <div className="bloque-header" onClick={() => toggleBloque('D')}>
              <h2 className="bloque-title">
                <span className="bloque-letra">D</span>
                KPIs y Pruebas
              </h2>
              {bloqueExpandido === 'D' ? <IoChevronUp /> : <IoChevronDown />}
            </div>
            
            {bloqueExpandido === 'D' && (
              <div className="bloque-content">
                {/* D1 - Rendimiento */}
                <div className="subbloque">
                  <h3 className="subbloque-title">D1 - Rendimiento / Wyscout</h3>
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Minutos Jugados</label>
                      <input
                        type="number"
                        className="form-input"
                        min="0"
                        placeholder="90"
                        value={formData.minutosJugados}
                        onChange={(e) => handleChange('minutosJugados', e.target.value)}
                      />
                    </div>
                    <div className="form-group flex-2">
                      <label className="form-label">Comentario / Observación</label>
                      <textarea
                        className="form-textarea"
                        rows={2}
                        placeholder="Mapa de calor, rol en partido, etc..."
                        value={formData.comentarioRendimiento}
                        onChange={(e) => handleChange('comentarioRendimiento', e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Adjuntar Archivo (PNG/PDF/CSV - Max 10MB)</label>
                    <input type="file" className="form-file" accept=".png,.pdf,.csv" />
                  </div>
                </div>

                {/* D2 - Gait / G-Walk */}
                <div className="subbloque">
                  <h3 className="subbloque-title">D2 - Gait / G-Walk</h3>
                  <div className="form-row-3">
                    <div className="form-group">
                      <label className="form-label">Índice de Simetría (%)</label>
                      <input
                        type="number"
                        className="form-input"
                        min="0"
                        max="100"
                        placeholder="85"
                        value={formData.indiceSimetria}
                        onChange={(e) => handleChange('indiceSimetria', e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Oblicuidad de Cadera (° o mm)</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="5.2°"
                        value={formData.oblicuidadCadera}
                        onChange={(e) => handleChange('oblicuidadCadera', e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Rotación de Cadera (°)</label>
                      <input
                        type="number"
                        className="form-input"
                        placeholder="12"
                        value={formData.rotacionCadera}
                        onChange={(e) => handleChange('rotacionCadera', e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Nota sobre Asimetrías</label>
                    <textarea
                      className="form-textarea"
                      rows={2}
                      placeholder="Observaciones sobre patrones de marcha..."
                      value={formData.notaAsimetrias}
                      onChange={(e) => handleChange('notaAsimetrias', e.target.value)}
                    />
                  </div>
                </div>

                {/* D3 - FreeEMG */}
                <div className="subbloque">
                  <h3 className="subbloque-title">D3 - FreeEMG / Activación Muscular</h3>
                  <div className="form-row-3">
                    <div className="form-group">
                      <label className="form-label">Balance de Activación</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="1.2 o 85%"
                        value={formData.balanceActivacion}
                        onChange={(e) => handleChange('balanceActivacion', e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Lado de Apoyo Dominante</label>
                      <select
                        className="form-select"
                        value={formData.ladoApoyoDominante}
                        onChange={(e) => handleChange('ladoApoyoDominante', e.target.value)}
                      >
                        <option value="">Seleccionar...</option>
                        <option value="Derecho">Derecho</option>
                        <option value="Izquierdo">Izquierdo</option>
                        <option value="Indeterminado">Indeterminado</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Diferencia de Activación (%)</label>
                      <input
                        type="number"
                        className="form-input"
                        placeholder="±15"
                        value={formData.diferenciaActivacion}
                        onChange={(e) => handleChange('diferenciaActivacion', e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Adjuntar Señal / CSV</label>
                    <input type="file" className="form-file" accept=".csv,.json" />
                  </div>
                </div>

                {/* D4 - Equilibrio */}
                <div className="subbloque">
                  <h3 className="subbloque-title">D4 - Equilibrio / BioBit</h3>
                  
                  <div className="equilibrio-grid">
                    <div className="equilibrio-lado">
                      <h4 className="equilibrio-lado-title">Pierna Derecha</h4>
                      <div className="form-row">
                        <div className="form-group">
                          <label className="form-label-small">Área Elipse (cm²)</label>
                          <input
                            type="number"
                            step="0.01"
                            className="form-input-small"
                            placeholder="12.5"
                            value={formData.equilibrioDer.areaElipse}
                            onChange={(e) => handleNestedChange('equilibrioDer', 'areaElipse', e.target.value)}
                          />
                        </div>
                        <div className="form-group">
                          <label className="form-label-small">Oscilación AP (mm)</label>
                          <input
                            type="number"
                            step="0.1"
                            className="form-input-small"
                            placeholder="8.3"
                            value={formData.equilibrioDer.oscilacionAP}
                            onChange={(e) => handleNestedChange('equilibrioDer', 'oscilacionAP', e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="form-row">
                        <div className="form-group">
                          <label className="form-label-small">Oscilación ML (mm)</label>
                          <input
                            type="number"
                            step="0.1"
                            className="form-input-small"
                            placeholder="6.7"
                            value={formData.equilibrioDer.oscilacionML}
                            onChange={(e) => handleNestedChange('equilibrioDer', 'oscilacionML', e.target.value)}
                          />
                        </div>
                        <div className="form-group">
                          <label className="form-label-small">Índice Equilibrio (0-1)</label>
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            max="1"
                            className="form-input-small"
                            placeholder="0.85"
                            value={formData.equilibrioDer.indiceEquilibrio}
                            onChange={(e) => handleNestedChange('equilibrioDer', 'indiceEquilibrio', e.target.value)}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="equilibrio-lado">
                      <h4 className="equilibrio-lado-title">Pierna Izquierda</h4>
                      <div className="form-row">
                        <div className="form-group">
                          <label className="form-label-small">Área Elipse (cm²)</label>
                          <input
                            type="number"
                            step="0.01"
                            className="form-input-small"
                            placeholder="13.2"
                            value={formData.equilibrioIzq.areaElipse}
                            onChange={(e) => handleNestedChange('equilibrioIzq', 'areaElipse', e.target.value)}
                          />
                        </div>
                        <div className="form-group">
                          <label className="form-label-small">Oscilación AP (mm)</label>
                          <input
                            type="number"
                            step="0.1"
                            className="form-input-small"
                            placeholder="9.1"
                            value={formData.equilibrioIzq.oscilacionAP}
                            onChange={(e) => handleNestedChange('equilibrioIzq', 'oscilacionAP', e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="form-row">
                        <div className="form-group">
                          <label className="form-label-small">Oscilación ML (mm)</label>
                          <input
                            type="number"
                            step="0.1"
                            className="form-input-small"
                            placeholder="7.4"
                            value={formData.equilibrioIzq.oscilacionML}
                            onChange={(e) => handleNestedChange('equilibrioIzq', 'oscilacionML', e.target.value)}
                          />
                        </div>
                        <div className="form-group">
                          <label className="form-label-small">Índice Equilibrio (0-1)</label>
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            max="1"
                            className="form-input-small"
                            placeholder="0.78"
                            value={formData.equilibrioIzq.indiceEquilibrio}
                            onChange={(e) => handleNestedChange('equilibrioIzq', 'indiceEquilibrio', e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Observaciones (ángulos de cadera / compensaciones)</label>
                    <textarea
                      className="form-textarea"
                      rows={2}
                      placeholder="Compensaciones observadas en ambos lados..."
                      value={formData.observacionesEquilibrio}
                      onChange={(e) => handleChange('observacionesEquilibrio', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* BLOQUE E - Análisis textual */}
          <div className="form-bloque">
            <div className="bloque-header" onClick={() => toggleBloque('E')}>
              <h2 className="bloque-title">
                <span className="bloque-letra">E</span>
                Análisis Textual
              </h2>
              {bloqueExpandido === 'E' ? <IoChevronUp /> : <IoChevronDown />}
            </div>
            
            {bloqueExpandido === 'E' && (
              <div className="bloque-content">
                <div className="form-group">
                  <label className="form-label">Primer Análisis (Observaciones del evaluador)</label>
                  <textarea
                    className="form-textarea-large"
                    rows={6}
                    placeholder="Observaciones generales, hallazgos iniciales, patrones identificados..."
                    value={formData.primerAnalisis}
                    onChange={(e) => handleChange('primerAnalisis', e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Segundo Análisis (Interpretación de datos y recomendaciones técnicas)</label>
                  <textarea
                    className="form-textarea-large"
                    rows={6}
                    placeholder="Interpretación de los KPIs, correlaciones, recomendaciones específicas..."
                    value={formData.segundoAnalisis}
                    onChange={(e) => handleChange('segundoAnalisis', e.target.value)}
                  />
                </div>
              </div>
            )}
          </div>

          {/* BLOQUE F - Conclusiones */}
          <div className="form-bloque">
            <div className="bloque-header" onClick={() => toggleBloque('F')}>
              <h2 className="bloque-title">
                <span className="bloque-letra">F</span>
                Conclusiones y Plan
              </h2>
              {bloqueExpandido === 'F' ? <IoChevronUp /> : <IoChevronDown />}
            </div>
            
            {bloqueExpandido === 'F' && (
              <div className="bloque-content">
                <div className="form-group">
                  <label className="form-label required">Clasificación Global vs Cohorte</label>
                  <select
                    className="form-select"
                    value={formData.clasificacionGlobal}
                    onChange={(e) => handleChange('clasificacionGlobal', e.target.value)}
                    required
                  >
                    <option value="">Seleccionar...</option>
                    <option value="Bajo">Por debajo (Bajo)</option>
                    <option value="Medio">En promedio (Medio)</option>
                    <option value="Alto">Por encima (Alto)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Top 3 Puntos Débiles</label>
                  {[0, 1, 2].map(index => (
                    <input
                      key={index}
                      type="text"
                      className="form-input"
                      placeholder={`Punto débil ${index + 1}`}
                      value={formData.puntosDebiles[index]}
                      onChange={(e) => handleArrayChange('puntosDebiles', index, e.target.value)}
                      style={{ marginBottom: '8px' }}
                    />
                  ))}
                </div>

                <div className="form-group">
                  <label className="form-label">Márgenes de Mejora Estimados</label>
                  {[0, 1, 2].map(index => (
                    <div key={index} className="margen-mejora-row">
                      <span className="margen-label">Punto {index + 1}:</span>
                      <input
                        type="number"
                        className="form-input-inline"
                        placeholder="%"
                        value={formData.margenesMejora[index].porcentaje}
                        onChange={(e) => {
                          const newMargenes = [...formData.margenesMejora]
                          newMargenes[index].porcentaje = e.target.value
                          handleChange('margenesMejora', newMargenes)
                        }}
                      />
                      <input
                        type="text"
                        className="form-input-inline"
                        placeholder="Valor absoluto"
                        value={formData.margenesMejora[index].valorAbsoluto}
                        onChange={(e) => {
                          const newMargenes = [...formData.margenesMejora]
                          newMargenes[index].valorAbsoluto = e.target.value
                          handleChange('margenesMejora', newMargenes)
                        }}
                      />
                    </div>
                  ))}
                </div>

                <div className="form-group">
                  <label className="form-label">Recomendaciones para Entrenador</label>
                  <textarea
                    className="form-textarea-large"
                    rows={5}
                    placeholder="Acciones concretas, ejercicios específicos, prioridades de entrenamiento..."
                    value={formData.recomendaciones}
                    onChange={(e) => handleChange('recomendaciones', e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Fecha de Seguimiento / Próxima Evaluación</label>
                  <input
                    type="date"
                    className="form-input"
                    value={formData.fechaSeguimiento}
                    onChange={(e) => handleChange('fechaSeguimiento', e.target.value)}
                  />
                </div>
              </div>
            )}
          </div>

          {/* BLOQUE G - Archivos */}
          <div className="form-bloque">
            <div className="bloque-header" onClick={() => toggleBloque('G')}>
              <h2 className="bloque-title">
                <span className="bloque-letra">G</span>
                Archivos y Metadatos
              </h2>
              {bloqueExpandido === 'G' ? <IoChevronUp /> : <IoChevronDown />}
            </div>
            
            {bloqueExpandido === 'G' && (
              <div className="bloque-content">
                <div className="form-group">
                  <label className="form-label">Adjuntar Análisis BTS (Archivo Original)</label>
                  <input
                    type="file"
                    className="form-file"
                    accept=".csv,.json,.xml,.bts,.zip,.pdf"
                  />
                  <p className="form-help">
                    Formatos aceptados: CSV, JSON, XML, BTS, ZIP, PDF (Máx. 50MB)
                  </p>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Footer con botones de acción */}
        <div className="formulario-footer">
          <div className="formulario-footer-content">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <div className="footer-actions-right">
              <button type="button" className="btn-secondary" onClick={handleGuardarBorrador}>
                Guardar como Borrador
              </button>
              <button type="submit" className="btn-primary">
                <IoSave />
                Guardar Análisis
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}

export default FormularioAnalisis
