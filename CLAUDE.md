# Vacaciones AGP

App personal en un único `index.html` (HTML + CSS + JS, sin dependencias) para gestionar la elección de vacaciones en Menzies AGP según el convenio (BOE-A-2023-25956, arts. 32 y 33). Se publica con GitHub Pages desde `main`. Los datos viven en el `localStorage` del navegador del usuario: nunca subir copias `.json` de datos al repositorio.

## Cómo publicar una versión

Cada publicación tiene que hacer estas tres cosas a la vez, en el mismo commit:

1. Subir `APP_VERSION` en `index.html` (semver: 3.2.0 → 3.3.0 para funciones nuevas, 3.2.1 para arreglos).
2. Añadir en `NOVEDADES` (en `index.html`) una entrada con la nueva versión y sus pasos `{ titulo, donde, texto }`. Es el recorrido obligatorio que el usuario ve después de actualizar. Texto en español, en frases claras y desde el punto de vista del usuario.
3. Poner la misma versión en `version.json`, con un resumen corto en `novedades`. La app abierta consulta este archivo cada minuto y bloquea la pantalla hasta que se actualice.

Si `version.json` lleva una versión mayor que la de `index.html`, la app entrará en bucle de actualización: subirlas siempre juntas.

## Estructura

- Inicio: departamento (Pasaje, Rampa, Operaciones) → producto (GroundHandling azul, RedBull naranja) → menú del producto (`vMenu`). Todo lo de dentro se filtra por ese contexto (`S.ctx`).
- Menú: tarjeta «Asignación de vacaciones» (único sitio con barra de pasos: Grupos › Elección › Resumen y cierre, `PASOS`) y secciones sueltas (`SECCIONES`): Trabajadores, Skills, Cupos, Rotaciones, Transformaciones, Desprogramaciones, Calendario y Exportar PDF.
- Rotaciones: plantilla de 3 semanas (L-D) por departamento y producto; se asigna a grupos (`grupo.rotacionId`); `turnoDia(w, fecha)` da el turno de cada persona.
- Transformaciones: cambios de contrato con fecha (`S.transf`); `derechoCiclo(w, año)` prorratea los días de vacaciones por tramos. Solo se deshace la última de cada persona.
- Ajustes generales (convenio, Semana Santa, puentes, ponderación, reglas de desprogramación, copias) en el botón ⚙.
- Las vacaciones no se borran al cerrar ciclo: el histórico se consulta en el calendario anual. Los cálculos del ciclo filtran por año (`periodosDe`, `desprogDe`).
- Cualquier cambio de formato de datos debe migrarse en `normalizar()`.

## Convenciones

- Todo el texto de la interfaz en español, en tono claro y directo.
- Identidad visual: señalética de aeropuerto (asfalto `#22262E`, hormigón `#ECEEF1`, amarillo señal `#F6C300`, azul pista `#1F5FBF`; Barlow y Barlow Condensed).
- Probar en móvil (390 px) y escritorio antes de publicar.
