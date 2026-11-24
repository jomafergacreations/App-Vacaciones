# Control Planning (antes PlanningApp y Vacaciones AGP)

App personal en un único `index.html` (HTML + CSS + JS, sin dependencias) para gestionar la elección de vacaciones en Menzies AGP según el convenio (BOE-A-2023-25956, arts. 32 y 33) y la jornada anual de cada persona. La clave de `localStorage` sigue siendo `vacaciones-agp-v1` para no perder datos. Se publica con GitHub Pages desde `main`. Es instalable como app de escritorio: `manifest.webmanifest`, iconos del avión (`icono-192.png`, `icono-512.png`, `icono-maskable-512.png`, `apple-touch-icon.png`, `favicon-32.png`) y un `sw.js` mínimo sin caché, para no romper el aviso de actualización. Los datos viven en el `localStorage` del navegador del usuario: nunca subir copias `.json` de datos al repositorio.

## Cómo publicar una versión

Cada publicación tiene que hacer estas tres cosas a la vez, en el mismo commit:

1. Subir `APP_VERSION` en `index.html` (semver: 3.2.0 → 3.3.0 para funciones nuevas, 3.2.1 para arreglos).
2. Añadir en `NOVEDADES` (en `index.html`) una entrada con la nueva versión y sus pasos `{ titulo, donde, texto }`. Es el recorrido obligatorio que el usuario ve después de actualizar. Texto en español, en frases claras y desde el punto de vista del usuario.
3. Poner la misma versión en `version.json`, con un resumen corto en `novedades`. La app abierta consulta este archivo cada minuto y bloquea la pantalla hasta que se actualice.

Si `version.json` lleva una versión mayor que la de `index.html`, la app entrará en bucle de actualización: subirlas siempre juntas.

## Estructura

- Inicio: departamento (Pasaje, Rampa, Operaciones) → producto (GroundHandling azul, RedBull naranja) → menú del producto (`vMenu`). Todo lo de dentro se filtra por ese contexto (`S.ctx`).
- Menú del producto (`vMenu`): tres globos.
  - Personal (vista `personal`): lista y ficha por pestañas (`PER_TABS`: Datos con `formTrab`, Jornada con `fichaJornada`, Vacaciones con `fichaVacaciones`, Contrato con `vTransformaciones(id)`), y modo Tabla (`tablaPersonal`) con el pegado desde Excel (`pegarCard`).
  - Grupos (vista `gestion`): pestañas `G_TABS` que reutilizan `vEquipos`, `vSkills`, `vRotaciones` y `vCupos`.
  - Vacaciones (vista `vacaciones`): al entrar, dos botones y una línea con la asignación (`siguientePaso`). `UI.vacModo` = `consultar` (`vConsultar`: tabla del año entero, una celda por persona y día, cabecera y nombres fijos, botones de mes, ZIP) o `editar` (`vEditar`: hoja anual de un trabajador como la del Excel, 12 meses × 31 días; al tocar un día, `hojaAcciones` ofrece asignar vacaciones, desprogramar, AJ, X o baja, o cambiar/quitar lo que haya; rangos con «Elegir el final en la hoja»). Letras de los días: `COD_DIA` (H, R, F, X, AJ, D, B). La asignación por pasos (`PASOS`: Grupos de elección › Elección › Resumen y cierre) sigue aparte. El informe del producto es la vista `pdf`.
  - Las secciones antiguas (plantilla, jornada, desprog, equipos, rotaciones, calendario…) se redirigen a su globo con `ALIAS`.
- PDF y ZIP se generan en la app sin librerías: `nuevoPDF()` (Helvetica, WinAnsi) y `hacerZIP()` (sin compresión). Nombre de cada ficha: «Nombre - año.pdf».
- Categorías: una skill puede ser «de super» (`skill.super`); quien tenga alguna es super, el resto agente (`catDe`). Cada grupo tiene cupo por categoría (`cupoAg`, `cupoSup`): cuántos agentes y supers del grupo pueden estar fuera a la vez (`companerosEnFechas`).
- Días de vacaciones: no se puede pasar de `derechoCiclo` (`excedeDias`). Los descansos y festivos de la rotación (`esDescanso`) no se pueden coger y, si un periodo los cruza, no cuentan (`statsRango(desde, hasta, w)`).
- Grupos de elección ≠ cupos de plantilla: los grupos solo marcan quién elige con quién y en qué orden (y el 10 % de desprogramaciones); los cupos limitan cuántos pueden estar fuera a la vez.
- Rotaciones: plantilla de 3 semanas (L-D) por departamento y producto; se asigna a grupos (`grupo.rotacionId`) o a una persona concreta (`trabajador.rotacionId`, que manda sobre la del grupo); `turnoDia(w, fecha)` da el turno de cada persona. La fase se fija por grupo o persona eligiendo en qué semana cae el 1 de enero (`rotAnio`, `rotSemana`, ver `inicioRot`); si no hay, se usa `rotacion.inicio`.
- Jornada (vista `jornada`): jornada garantizada por persona en horas o en % de `S.ajustes.jornadaBase` (1.700 h; `jornadaModo`, `jornadaValor`; un tiempo completo sin valor usa 1.700). `jornadaInfo(w)` cuenta los días del año: R, F, X, AJ (libres), H (vacaciones y desprogramaciones), baja y D.T. Con bajas, cómputo = jornada × (x − b) / x, donde x son los días de trabajo previstos y b los de baja; media = jornada / x; hechas = días trabajados hasta hoy × media.
- Leyenda del cuadrante: R descanso, F festivo, X festivo de empresa, AJ ajuste de jornada (para no pasar de la jornada anual), H vacaciones, PR y PNR permisos (aún sin usar), D.T. días de trabajo.
- Marcas por persona y día (`S.marcas`: AJ, X) mandan sobre la rotación en `turnoDia` y cuentan como libres. Bajas por rangos en `S.bajas`.
- Transformaciones: cambios de contrato con fecha (`S.transf`); `derechoCiclo(w, año)` prorratea los días de vacaciones por tramos. Solo se deshace la última de cada persona.
- Ajustes generales (convenio, Semana Santa, puentes, ponderación, reglas de desprogramación, copias) en el botón ⚙.
- Las vacaciones no se borran al cerrar ciclo: el histórico se consulta en el calendario anual. Los cálculos del ciclo filtran por año (`periodosDe`, `desprogDe`).
- Cualquier cambio de formato de datos debe migrarse en `normalizar()`.

## Convenciones

- Todo el texto de la interfaz en español, en tono claro y directo.
- Identidad visual: señalética de aeropuerto (asfalto `#22262E`, hormigón `#ECEEF1`, amarillo señal `#F6C300`, azul pista `#1F5FBF`; Barlow y Barlow Condensed).
- Animación: solo una entrada escalonada al cambiar de pantalla (`main.entrando` + `.anim` con `--i`) y respuestas a lo que se toca; respetar `prefers-reduced-motion`.
- Probar en móvil (390 px) y escritorio antes de publicar.
