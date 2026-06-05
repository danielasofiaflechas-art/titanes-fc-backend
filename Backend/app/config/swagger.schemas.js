export const swaggerSchemas = {
  // ==============================
  // 📌 AUTH & COMMON RESPONSES
  // ==============================
  LoginRequest: {
    type: 'object',
    required: ['email', 'password'],
    properties: {
      email: { type: 'string', format: 'email', example: 'admin@titanesfc.com', description: 'Correo electrónico del usuario' },
      password: { type: 'string', format: 'password', example: 'admin123', description: 'Contraseña' }
    }
  },
  LoginResponse: {
    type: 'object',
    properties: {
      status: { type: 'string', example: 'success' },
      message: { type: 'string', example: 'Login exitoso' },
      token: { type: 'string', description: 'Token JWT de acceso', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
      usuario: { $ref: '#/components/schemas/Usuario' }
    }
  },
  JwtResponse: {
    type: 'object',
    properties: {
      token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' }
    }
  },
  SuccessResponse: {
    type: 'object',
    properties: {
      status: { type: 'string', example: 'success' },
      message: { type: 'string', example: 'Operación realizada con éxito' },
      data: { type: 'object', description: 'Datos resultantes de la operación' }
    }
  },
  ErrorResponse: {
    type: 'object',
    properties: {
      status: { type: 'string', example: 'error' },
      message: { type: 'string', example: 'Ocurrió un error inesperado en el servidor' }
    }
  },
  ValidationError: {
    type: 'object',
    properties: {
      status: { type: 'string', example: 'error' },
      message: { type: 'string', example: 'Errores de validación' },
      errors: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            field: { type: 'string', example: 'email' },
            message: { type: 'string', example: 'El email no tiene un formato válido' }
          }
        }
      }
    }
  },
  NotFoundResponse: {
    type: 'object',
    properties: {
      status: { type: 'string', example: 'error' },
      message: { type: 'string', example: 'Recurso no encontrado' }
    }
  },
  UnauthorizedResponse: {
    type: 'object',
    properties: {
      status: { type: 'string', example: 'error' },
      message: { type: 'string', example: 'No autorizado o token inválido' }
    }
  },

  // ==============================
  // 👤 USUARIOS
  // ==============================
  Usuario: {
    type: 'object',
    properties: {
      id: { type: 'integer', example: 1 },
      rol_id: { type: 'integer', example: 2 },
      nombre: { type: 'string', example: 'Juan' },
      apellido: { type: 'string', example: 'Pérez' },
      email: { type: 'string', format: 'email', example: 'juan.perez@titanesfc.com' },
      telefono: { type: 'string', example: '3001234567' },
      estado: { type: 'string', enum: ['activo', 'inactivo', 'suspendido'], example: 'activo' },
      ultimo_acceso: { type: 'string', format: 'date-time', example: '2023-10-15T14:30:00Z' }
    }
  },
  UsuarioCreate: {
    type: 'object',
    required: ['rol_id', 'nombre', 'apellido', 'email', 'password'],
    properties: {
      rol_id: { type: 'integer', example: 2, description: 'ID del rol asignado' },
      nombre: { type: 'string', example: 'Carlos', description: 'Nombre del usuario' },
      apellido: { type: 'string', example: 'Gómez', description: 'Apellido del usuario' },
      email: { type: 'string', format: 'email', example: 'carlos.gomez@titanesfc.com' },
      password: { type: 'string', format: 'password', example: 'segura123' },
      telefono: { type: 'string', example: '3109876543' },
      estado: { type: 'string', enum: ['activo', 'inactivo', 'suspendido'], example: 'activo' }
    }
  },
  UsuarioUpdate: {
    type: 'object',
    properties: {
      rol_id: { type: 'integer', example: 2 },
      nombre: { type: 'string', example: 'Carlos' },
      apellido: { type: 'string', example: 'Gómez' },
      telefono: { type: 'string', example: '3109876543' },
      estado: { type: 'string', enum: ['activo', 'inactivo', 'suspendido'], example: 'activo' }
    }
  },
  UsuarioResponse: {
    type: 'object',
    properties: {
      status: { type: 'string', example: 'success' },
      data: { $ref: '#/components/schemas/Usuario' }
    }
  },
  UsuariosListResponse: {
    type: 'object',
    properties: {
      status: { type: 'string', example: 'success' },
      data: {
        type: 'array',
        items: { $ref: '#/components/schemas/Usuario' }
      },
      total: { type: 'integer', example: 42 }
    }
  },

  // ==============================
  // ⚽ JUGADORES
  // ==============================
  Jugador: {
    type: 'object',
    properties: {
      id: { type: 'integer', example: 10 },
      usuario_id: { type: 'integer', example: 5 },
      categoria_id: { type: 'integer', example: 3 },
      fecha_nacimiento: { type: 'string', format: 'date', example: '2005-08-12' },
      posicion_principal: { type: 'string', example: 'Delantero' },
      estatura: { type: 'number', format: 'float', example: 1.82 },
      peso: { type: 'number', format: 'float', example: 75.5 },
      pierna_habil: { type: 'string', enum: ['derecha', 'izquierda', 'ambidiestro'], example: 'derecha' }
    }
  },
  PerfilJugador: {
    type: 'object',
    allOf: [
      { $ref: '#/components/schemas/Jugador' },
      {
        type: 'object',
        properties: {
          nombre_completo: { type: 'string', example: 'Juan Pérez' },
          categoria_nombre: { type: 'string', example: 'Sub-17' },
          estadisticas: { type: 'object' }
        }
      }
    ]
  },
  CategoriaJugador: {
    type: 'object',
    properties: {
      id: { type: 'integer', example: 3 },
      nombre: { type: 'string', example: 'Sub-17' },
      edad_minima: { type: 'integer', example: 15 },
      edad_maxima: { type: 'integer', example: 17 }
    }
  },
  RendimientoJugador: {
    type: 'object',
    properties: {
      test_id: { type: 'integer', example: 1 },
      fecha: { type: 'string', format: 'date', example: '2023-11-01' },
      resultado: { type: 'number', example: 85.5 },
      observaciones: { type: 'string', example: 'Mejora en resistencia aeróbica' }
    }
  },

  // ==============================
  // 🏋️ ENTRENADORES
  // ==============================
  Entrenador: {
    type: 'object',
    properties: {
      id: { type: 'integer', example: 2 },
      usuario_id: { type: 'integer', example: 4 },
      especialidad: { type: 'string', example: 'Preparador Físico' },
      experiencia_anios: { type: 'integer', example: 8 },
      licencia: { type: 'string', example: 'CONMEBOL PRO' }
    }
  },
  Entrenamiento: {
    type: 'object',
    properties: {
      id: { type: 'integer', example: 15 },
      categoria_id: { type: 'integer', example: 3 },
      fecha: { type: 'string', format: 'date', example: '2023-11-20' },
      hora_inicio: { type: 'string', example: '16:00' },
      hora_fin: { type: 'string', example: '18:00' },
      ubicacion: { type: 'string', example: 'Cancha Principal' },
      tipo: { type: 'string', example: 'Táctico' },
      estado: { type: 'string', enum: ['programado', 'completado', 'cancelado'], example: 'programado' }
    }
  },
  Asistencia: {
    type: 'object',
    properties: {
      jugador_id: { type: 'integer', example: 10 },
      estado: { type: 'string', enum: ['presente', 'ausente', 'excusado', 'tardanza'], example: 'presente' },
      minutos_jugados: { type: 'integer', example: 120 }
    }
  },
  PlanEntrenamiento: {
    type: 'object',
    properties: {
      id: { type: 'integer', example: 5 },
      entrenador_id: { type: 'integer', example: 2 },
      jugador_id: { type: 'integer', example: 10 },
      titulo: { type: 'string', example: 'Plan Potencia Piernas' },
      descripcion: { type: 'string', example: 'Rutina enfocada en fuerza explosiva' },
      fecha_inicio: { type: 'string', format: 'date', example: '2023-11-01' },
      fecha_fin: { type: 'string', format: 'date', example: '2023-11-30' },
      estado: { type: 'string', enum: ['asignado', 'en_progreso', 'completado', 'cancelado'], example: 'en_progreso' }
    }
  },

  // ==============================
  // 📈 RENDIMIENTO
  // ==============================
  Evaluacion: {
    type: 'object',
    properties: {
      id: { type: 'integer', example: 8 },
      jugador_id: { type: 'integer', example: 10 },
      entrenador_id: { type: 'integer', example: 2 },
      periodo: { type: 'string', example: 'Q3-2023' },
      calificacion_tecnica: { type: 'number', format: 'float', example: 8.5 },
      calificacion_tactica: { type: 'number', format: 'float', example: 7.0 },
      calificacion_fisica: { type: 'number', format: 'float', example: 9.0 },
      calificacion_psicologica: { type: 'number', format: 'float', example: 8.0 },
      comentarios: { type: 'string', example: 'Excelente actitud en el campo' },
      fecha_evaluacion: { type: 'string', format: 'date-time', example: '2023-10-01T10:00:00Z' }
    }
  },
  TestFisico: {
    type: 'object',
    properties: {
      id: { type: 'integer', example: 1 },
      nombre: { type: 'string', example: 'Test de Cooper' },
      descripcion: { type: 'string', example: 'Prueba de resistencia aeróbica de 12 minutos' },
      tipo_metrica: { type: 'string', example: 'Distancia' },
      unidad_medida: { type: 'string', example: 'Metros' }
    }
  },
  DashboardRendimiento: {
    type: 'object',
    properties: {
      jugador: { $ref: '#/components/schemas/PerfilJugador' },
      evaluaciones_recientes: { type: 'array', items: { $ref: '#/components/schemas/Evaluacion' } },
      resultados_tests: { type: 'array', items: { $ref: '#/components/schemas/RendimientoJugador' } },
      asistencia_porcentaje: { type: 'number', format: 'float', example: 95.5 }
    }
  },

  // ==============================
  // 🏆 CAMPEONATOS
  // ==============================
  Campeonato: {
    type: 'object',
    properties: {
      id: { type: 'integer', example: 1 },
      nombre: { type: 'string', example: 'Liga Departamental 2023' },
      fecha_inicio: { type: 'string', format: 'date', example: '2023-08-01' },
      fecha_fin: { type: 'string', format: 'date', example: '2023-12-15' },
      categoria_id: { type: 'integer', example: 3 },
      estado: { type: 'string', enum: ['proximo', 'en_curso', 'finalizado'], example: 'en_curso' }
    }
  },
  Equipo: {
    type: 'object',
    properties: {
      id: { type: 'integer', example: 4 },
      nombre: { type: 'string', example: 'Titanes FC Sub-17 A' },
      entrenador_id: { type: 'integer', example: 2 },
      categoria_id: { type: 'integer', example: 3 }
    }
  },
  Partido: {
    type: 'object',
    properties: {
      id: { type: 'integer', example: 25 },
      campeonato_id: { type: 'integer', example: 1 },
      equipo_local_id: { type: 'integer', example: 4 },
      equipo_visitante_id: { type: 'integer', example: 7 },
      fecha_hora: { type: 'string', format: 'date-time', example: '2023-11-25T15:00:00Z' },
      lugar: { type: 'string', example: 'Estadio Municipal' },
      goles_local: { type: 'integer', example: 2 },
      goles_visitante: { type: 'integer', example: 1 },
      estado: { type: 'string', enum: ['programado', 'en_juego', 'finalizado', 'suspendido'], example: 'finalizado' }
    }
  },

  // ==============================
  // 💰 FINANZAS
  // ==============================
  Mensualidad: {
    type: 'object',
    properties: {
      id: { type: 'integer', example: 100 },
      jugador_id: { type: 'integer', example: 10 },
      mes: { type: 'integer', example: 11 },
      anio: { type: 'integer', example: 2023 },
      monto: { type: 'number', format: 'float', example: 150000.00 },
      estado: { type: 'string', enum: ['pendiente', 'pagado', 'vencido'], example: 'pagado' },
      fecha_pago: { type: 'string', format: 'date-time', example: '2023-11-05T09:30:00Z' }
    }
  },
  Pago: {
    type: 'object',
    properties: {
      metodo_pago: { type: 'string', enum: ['efectivo', 'transferencia', 'tarjeta'], example: 'transferencia' },
      referencia: { type: 'string', example: 'TRX-987654321' },
      monto_pagado: { type: 'number', format: 'float', example: 150000.00 }
    }
  },
  Transaccion: {
    type: 'object',
    properties: {
      id: { type: 'integer', example: 500 },
      tipo: { type: 'string', enum: ['ingreso', 'egreso'], example: 'ingreso' },
      concepto: { type: 'string', example: 'Pago mensualidad Noviembre 2023 - Juan Pérez' },
      monto: { type: 'number', format: 'float', example: 150000.00 },
      fecha: { type: 'string', format: 'date-time', example: '2023-11-05T09:30:00Z' },
      referencia: { type: 'string', example: 'TRX-987654321' }
    }
  },
  Caja: {
    type: 'object',
    properties: {
      balance_actual: { type: 'number', format: 'float', example: 2500000.00 },
      total_ingresos_mes: { type: 'number', format: 'float', example: 3000000.00 },
      total_egresos_mes: { type: 'number', format: 'float', example: 500000.00 },
      transacciones_recientes: { type: 'array', items: { $ref: '#/components/schemas/Transaccion' } }
    }
  },

  // ==============================
  // ⚽ JUGADORES - Create & List
  // ==============================
  JugadorCreate: {
    type: 'object',
    required: ['usuario_id', 'categoria_id', 'posicion_principal'],
    properties: {
      usuario_id: { type: 'integer', example: 5, description: 'ID del usuario asociado' },
      categoria_id: { type: 'integer', example: 3, description: 'ID de la categoría' },
      fecha_nacimiento: { type: 'string', format: 'date', example: '2005-08-12' },
      posicion_principal: { type: 'string', example: 'Delantero' },
      estatura: { type: 'number', format: 'float', example: 1.82 },
      peso: { type: 'number', format: 'float', example: 75.5 },
      pierna_habil: { type: 'string', enum: ['derecha', 'izquierda', 'ambidiestro'], example: 'derecha' }
    }
  },
  JugadorUpdate: {
    type: 'object',
    properties: {
      categoria_id: { type: 'integer', example: 3 },
      posicion_principal: { type: 'string', example: 'Delantero' },
      estatura: { type: 'number', format: 'float', example: 1.82 },
      peso: { type: 'number', format: 'float', example: 75.5 },
      pierna_habil: { type: 'string', enum: ['derecha', 'izquierda', 'ambidiestro'], example: 'derecha' }
    }
  },
  JugadoresListResponse: {
    type: 'object',
    properties: {
      success: { type: 'boolean', example: true },
      message: { type: 'string', example: 'Jugadores obtenidos correctamente' },
      data: {
        type: 'array',
        items: { $ref: '#/components/schemas/Jugador' }
      },
      total: { type: 'integer', example: 28 }
    }
  },
  JugadorResponse: {
    type: 'object',
    properties: {
      success: { type: 'boolean', example: true },
      message: { type: 'string', example: 'Jugador obtenido correctamente' },
      data: { $ref: '#/components/schemas/Jugador' }
    }
  },

  // ==============================
  // 🏋️ ENTRENADORES - Create & List
  // ==============================
  EntrenadorCreate: {
    type: 'object',
    required: ['usuario_id', 'especialidad'],
    properties: {
      usuario_id: { type: 'integer', example: 4 },
      especialidad: { type: 'string', example: 'Preparador Físico' },
      experiencia_anios: { type: 'integer', example: 8 },
      licencia: { type: 'string', example: 'CONMEBOL PRO' }
    }
  },
  EntrenadorUpdate: {
    type: 'object',
    properties: {
      especialidad: { type: 'string', example: 'Preparador Físico' },
      experiencia_anios: { type: 'integer', example: 8 },
      licencia: { type: 'string', example: 'CONMEBOL PRO' }
    }
  },
  EntrenadoresListResponse: {
    type: 'object',
    properties: {
      success: { type: 'boolean', example: true },
      message: { type: 'string', example: 'Entrenadores obtenidos correctamente' },
      data: {
        type: 'array',
        items: { $ref: '#/components/schemas/Entrenador' }
      },
      total: { type: 'integer', example: 5 }
    }
  },
  EntrenadorResponse: {
    type: 'object',
    properties: {
      success: { type: 'boolean', example: true },
      message: { type: 'string', example: 'Entrenador obtenido correctamente' },
      data: { $ref: '#/components/schemas/Entrenador' }
    }
  },

  // ==============================
  // 🏋️ ENTRENAMIENTOS - Create & List
  // ==============================
  EntrenamientoCreate: {
    type: 'object',
    required: ['categoria_id', 'fecha_hora', 'objetivo_sesion'],
    properties: {
      categoria_id: { type: 'integer', example: 3 },
      entrenador_id: { type: 'integer', example: 2 },
      fecha_hora: { type: 'string', format: 'date-time', example: '2023-11-20T16:00:00Z' },
      ubicacion: { type: 'string', example: 'Cancha Principal' },
      objetivo_sesion: { type: 'string', example: 'Técnica ofensiva' },
      duracion_minutos: { type: 'integer', example: 120 },
      tipo_entrenamiento: { type: 'string', enum: ['técnico', 'físico', 'táctico', 'mixto'], example: 'táctico' }
    }
  },
  EntrenamientoUpdate: {
    type: 'object',
    properties: {
      objetivo_sesion: { type: 'string', example: 'Técnica ofensiva' },
      ubicacion: { type: 'string', example: 'Cancha Principal' },
      duracion_minutos: { type: 'integer', example: 120 },
      tipo_entrenamiento: { type: 'string', enum: ['técnico', 'físico', 'táctico', 'mixto'] }
    }
  },
  EntrenamientosListResponse: {
    type: 'object',
    properties: {
      success: { type: 'boolean', example: true },
      message: { type: 'string', example: 'Entrenamientos obtenidos correctamente' },
      data: {
        type: 'array',
        items: { $ref: '#/components/schemas/Entrenamiento' }
      },
      total: { type: 'integer', example: 12 }
    }
  },
  RegistroAsistenciaRequest: {
    type: 'object',
    required: ['entrenamientos_id', 'asistencias'],
    properties: {
      entrenamientos_id: { type: 'integer', example: 15 },
      asistencias: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            jugador_id: { type: 'integer', example: 10 },
            estado: { type: 'string', enum: ['presente', 'ausente', 'excusado', 'tardanza'], example: 'presente' }
          }
        }
      }
    }
  },

  // ==============================
  // 📝 PLANES - Create & List
  // ==============================
  EjercicioCreate: {
    type: 'object',
    required: ['nombre', 'descripcion'],
    properties: {
      nombre: { type: 'string', example: 'Sentadilla Profunda' },
      descripcion: { type: 'string', example: 'Ejercicio de piernas con peso' },
      grupo_muscular: { type: 'string', example: 'Piernas' },
      series: { type: 'integer', example: 4 },
      repeticiones: { type: 'integer', example: 12 },
      intensidad: { type: 'string', enum: ['baja', 'media', 'alta'], example: 'alta' }
    }
  },
  PlanEntrenamientoCreate: {
    type: 'object',
    required: ['titulo', 'descripcion', 'fecha_inicio', 'fecha_fin'],
    properties: {
      titulo: { type: 'string', example: 'Plan Potencia Piernas' },
      descripcion: { type: 'string', example: 'Rutina enfocada en fuerza explosiva' },
      fecha_inicio: { type: 'string', format: 'date', example: '2023-11-01' },
      fecha_fin: { type: 'string', format: 'date', example: '2023-11-30' },
      notas: { type: 'string', example: 'Aumentar intensidad cada semana' }
    }
  },
  PlanEntrenamientoUpdate: {
    type: 'object',
    properties: {
      titulo: { type: 'string', example: 'Plan Potencia Piernas' },
      descripcion: { type: 'string', example: 'Rutina enfocada en fuerza explosiva' },
      fecha_inicio: { type: 'string', format: 'date' },
      fecha_fin: { type: 'string', format: 'date' },
      estado: { type: 'string', enum: ['asignado', 'en_progreso', 'completado', 'cancelado'] },
      notas: { type: 'string' }
    }
  },
  PlanesListResponse: {
    type: 'object',
    properties: {
      success: { type: 'boolean', example: true },
      message: { type: 'string', example: 'Planes obtenidos correctamente' },
      data: {
        type: 'array',
        items: { $ref: '#/components/schemas/PlanEntrenamiento' }
      },
      total: { type: 'integer', example: 8 }
    }
  },

  // ==============================
  // 📈 RENDIMIENTO - Create & List
  // ==============================
  EvaluacionCreate: {
    type: 'object',
    required: ['jugador_id', 'periodo', 'calificacion_tecnica'],
    properties: {
      jugador_id: { type: 'integer', example: 10 },
      periodo: { type: 'string', example: 'Q3-2023' },
      calificacion_tecnica: { type: 'number', format: 'float', minimum: 0, maximum: 10, example: 8.5 },
      calificacion_tactica: { type: 'number', format: 'float', minimum: 0, maximum: 10, example: 7.0 },
      calificacion_fisica: { type: 'number', format: 'float', minimum: 0, maximum: 10, example: 9.0 },
      calificacion_psicologica: { type: 'number', format: 'float', minimum: 0, maximum: 10, example: 8.0 },
      comentarios: { type: 'string', example: 'Excelente actitud en el campo' }
    }
  },
  EvaluacionUpdate: {
    type: 'object',
    properties: {
      calificacion_tecnica: { type: 'number', format: 'float', minimum: 0, maximum: 10 },
      calificacion_tactica: { type: 'number', format: 'float', minimum: 0, maximum: 10 },
      calificacion_fisica: { type: 'number', format: 'float', minimum: 0, maximum: 10 },
      calificacion_psicologica: { type: 'number', format: 'float', minimum: 0, maximum: 10 },
      comentarios: { type: 'string' }
    }
  },
  TestFisicoCreate: {
    type: 'object',
    required: ['jugador_id', 'test_id', 'resultado'],
    properties: {
      jugador_id: { type: 'integer', example: 10 },
      test_id: { type: 'integer', example: 1, description: 'ID del tipo de test (Cooper, Salto Vertical, etc)' },
      resultado: { type: 'number', format: 'float', example: 2850, description: 'Resultado en la unidad de medida del test' },
      observaciones: { type: 'string', example: 'Mejora en resistencia aeróbica' }
    }
  },
  EvaluacionesListResponse: {
    type: 'object',
    properties: {
      success: { type: 'boolean', example: true },
      message: { type: 'string', example: 'Evaluaciones obtenidas correctamente' },
      data: {
        type: 'array',
        items: { $ref: '#/components/schemas/Evaluacion' }
      },
      total: { type: 'integer', example: 15 }
    }
  },

  // ==============================
  // 🏆 CAMPEONATOS - Create & List
  // ==============================
  CampeonatoCreate: {
    type: 'object',
    required: ['nombre', 'categoria_id', 'fecha_inicio', 'fecha_fin'],
    properties: {
      nombre: { type: 'string', example: 'Liga Departamental 2023' },
      descripcion: { type: 'string', example: 'Campeonato regional Sub-17' },
      categoria_id: { type: 'integer', example: 3 },
      fecha_inicio: { type: 'string', format: 'date', example: '2023-08-01' },
      fecha_fin: { type: 'string', format: 'date', example: '2023-12-15' },
      lugar: { type: 'string', example: 'Departamento del Valle' }
    }
  },
  CampeonatoUpdate: {
    type: 'object',
    properties: {
      nombre: { type: 'string', example: 'Liga Departamental 2023' },
      descripcion: { type: 'string', example: 'Campeonato regional Sub-17' },
      fecha_inicio: { type: 'string', format: 'date' },
      fecha_fin: { type: 'string', format: 'date' },
      estado: { type: 'string', enum: ['proximo', 'en_curso', 'finalizado'] },
      lugar: { type: 'string' }
    }
  },
  CampeonatosListResponse: {
    type: 'object',
    properties: {
      success: { type: 'boolean', example: true },
      message: { type: 'string', example: 'Campeonatos obtenidos correctamente' },
      data: {
        type: 'array',
        items: { $ref: '#/components/schemas/Campeonato' }
      },
      total: { type: 'integer', example: 4 }
    }
  },
  CampeonatoResponse: {
    type: 'object',
    properties: {
      success: { type: 'boolean', example: true },
      message: { type: 'string', example: 'Campeonato obtenido correctamente' },
      data: { $ref: '#/components/schemas/Campeonato' }
    }
  },
  EquipoCreate: {
    type: 'object',
    required: ['nombre', 'categoria_id'],
    properties: {
      nombre: { type: 'string', example: 'Titanes FC Sub-17 A' },
      entrenador_id: { type: 'integer', example: 2 },
      categoria_id: { type: 'integer', example: 3 },
      color_camiseta: { type: 'string', example: 'Rojo' }
    }
  },
  EquiposListResponse: {
    type: 'object',
    properties: {
      success: { type: 'boolean', example: true },
      message: { type: 'string', example: 'Equipos obtenidos correctamente' },
      data: {
        type: 'array',
        items: { $ref: '#/components/schemas/Equipo' }
      },
      total: { type: 'integer', example: 6 }
    }
  },
  PartidoCreate: {
    type: 'object',
    required: ['campeonato_id', 'equipo_local_id', 'equipo_visitante_id', 'fecha_hora'],
    properties: {
      campeonato_id: { type: 'integer', example: 1 },
      equipo_local_id: { type: 'integer', example: 4 },
      equipo_visitante_id: { type: 'integer', example: 7 },
      fecha_hora: { type: 'string', format: 'date-time', example: '2023-11-25T15:00:00Z' },
      lugar: { type: 'string', example: 'Estadio Municipal' },
      arbitro: { type: 'string', example: 'Carlos López' }
    }
  },
  PartidoUpdate: {
    type: 'object',
    properties: {
      fecha_hora: { type: 'string', format: 'date-time' },
      lugar: { type: 'string' },
      arbitro: { type: 'string' },
      goles_local: { type: 'integer' },
      goles_visitante: { type: 'integer' },
      estado: { type: 'string', enum: ['programado', 'en_juego', 'finalizado', 'suspendido'] }
    }
  },
  PartidosListResponse: {
    type: 'object',
    properties: {
      success: { type: 'boolean', example: true },
      message: { type: 'string', example: 'Partidos obtenidos correctamente' },
      data: {
        type: 'array',
        items: { $ref: '#/components/schemas/Partido' }
      },
      total: { type: 'integer', example: 18 }
    }
  },
  PartidoResponse: {
    type: 'object',
    properties: {
      success: { type: 'boolean', example: true },
      message: { type: 'string', example: 'Partido obtenido correctamente' },
      data: { $ref: '#/components/schemas/Partido' }
    }
  },

  // ==============================
  // 💰 FINANZAS - Create & List
  // ==============================
  MensualidadCreate: {
    type: 'object',
    required: ['jugador_id', 'mes', 'anio', 'monto'],
    properties: {
      jugador_id: { type: 'integer', example: 10 },
      mes: { type: 'integer', minimum: 1, maximum: 12, example: 11 },
      anio: { type: 'integer', example: 2023 },
      monto: { type: 'number', format: 'float', example: 150000.00 },
      concepto: { type: 'string', example: 'Mensualidad Noviembre' }
    }
  },
  MensualidadUpdate: {
    type: 'object',
    properties: {
      monto: { type: 'number', format: 'float' },
      estado: { type: 'string', enum: ['pendiente', 'pagado', 'vencido', 'parcial'] },
      concepto: { type: 'string' }
    }
  },
  MensualidadesListResponse: {
    type: 'object',
    properties: {
      success: { type: 'boolean', example: true },
      message: { type: 'string', example: 'Mensualidades obtenidas correctamente' },
      data: {
        type: 'array',
        items: { $ref: '#/components/schemas/Mensualidad' }
      },
      total: { type: 'integer', example: 54 }
    }
  },
  MensualidadResponse: {
    type: 'object',
    properties: {
      success: { type: 'boolean', example: true },
      message: { type: 'string', example: 'Mensualidad obtenida correctamente' },
      data: { $ref: '#/components/schemas/Mensualidad' }
    }
  },
  InscripcionCampeonatoCreate: {
    type: 'object',
    required: ['campeonato_id', 'equipo_id', 'monto_inscripcion'],
    properties: {
      campeonato_id: { type: 'integer', example: 1 },
      equipo_id: { type: 'integer', example: 4 },
      monto_inscripcion: { type: 'number', format: 'float', example: 500000.00 },
      fecha_limite_pago: { type: 'string', format: 'date', example: '2023-07-31' }
    }
  },
  InscripcionesListResponse: {
    type: 'object',
    properties: {
      success: { type: 'boolean', example: true },
      message: { type: 'string', example: 'Inscripciones obtenidas correctamente' },
      data: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            campeonato_id: { type: 'integer' },
            equipo_id: { type: 'integer' },
            monto_inscripcion: { type: 'number', format: 'float' },
            estado_pago: { type: 'string' },
            fecha_inscripcion: { type: 'string', format: 'date-time' }
          }
        }
      },
      total: { type: 'integer', example: 8 }
    }
  },
  TransaccionCreate: {
    type: 'object',
    required: ['tipo', 'concepto', 'monto'],
    properties: {
      tipo: { type: 'string', enum: ['ingreso', 'egreso'], example: 'ingreso' },
      concepto: { type: 'string', example: 'Pago mensualidad Noviembre 2023 - Juan Pérez' },
      monto: { type: 'number', format: 'float', example: 150000.00 },
      referencia: { type: 'string', example: 'TRX-987654321' },
      descripcion: { type: 'string', example: 'Pago realizado por transferencia bancaria' }
    }
  },
  TransaccionesListResponse: {
    type: 'object',
    properties: {
      success: { type: 'boolean', example: true },
      message: { type: 'string', example: 'Transacciones obtenidas correctamente' },
      data: {
        type: 'array',
        items: { $ref: '#/components/schemas/Transaccion' }
      },
      total: { type: 'integer', example: 142 }
    }
  },
  CajaResponse: {
    type: 'object',
    properties: {
      success: { type: 'boolean', example: true },
      message: { type: 'string', example: 'Información de caja obtenida' },
      data: { $ref: '#/components/schemas/Caja' }
    }
  }
};
