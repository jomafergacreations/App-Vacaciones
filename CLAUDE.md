# Control Planning

App personal para Menzies AGP en un único `index.html` (HTML + CSS + JS, sin dependencias). Se publica con GitHub Pages desde `main`. Es instalable como app de escritorio (`manifest.webmanifest`, iconos del avión, `sw.js` mínimo sin caché).

Desde la versión 10 la app se rehace desde cero, por partes. La versión anterior (Vacaciones AGP / PlanningApp, hasta la 9.1.4) está congelada en `antigua/`, con su propio `version.json`, para consultar sus datos; no se toca.

Los datos viven en el `localStorage` del navegador (clave `control-planning-v10`; la versión anterior usa `vacaciones-agp-v1`). Nunca subir copias `.json` de datos al repositorio.

## Cómo publicar una versión

En el mismo commit:

1. Subir `APP_VERSION` en `index.html` (semver: funciones nuevas suben el segundo número; arreglos, el tercero).
2. Añadir en `NOVEDADES` una entrada con la nueva versión y sus pasos `{ titulo, donde, texto }`: es el recorrido que el usuario ve al actualizar. En español, claro y desde su punto de vista.
3. Poner la misma versión en `version.json`, con un resumen corto en `novedades`. La app abierta lo consulta cada minuto y bloquea la pantalla hasta que se actualice.

Si `version.json` lleva una versión mayor que la de `index.html`, la app entra en bucle de actualización: subirlas siempre juntas.

## Estructura actual

- Inicio: departamento (`DEPARTAMENTOS`: Pasaje, Rampa, Operaciones) → producto (`PRODUCTOS`: GroundHandling azul, RedBull naranja) → menú del producto (globos). Todo se filtra por `UI.dep` y `UI.prod` (`plantilla()`).
- Año de cálculo `S.anio` en la cabecera.
- Personal (vista `personal`): resumen por contrato, tabla de trabajadores (tarjetas en móvil), búsqueda, filtro por contrato, ficha en diálogo (`abrirFicha`, `pintarFicha`, `guardarFicha`) y «Pegar lista» desde Excel (nombre, contrato, horas semanales).
- Contratos (`CONTRATOS`): `completo`, `parcial` y `discontinuo`.
- Jornada: cada trabajador guarda la jornada tal como se escribió (`modo`: `semana` | `pct` | `anio`, y `valor`). `pctDe`, `semanaDe` y `anualBase` convierten con `S.ajustes.hSemana` (40) y `S.ajustes.hAnio` (1.700). Un tiempo completo es siempre el 100 %. Los fijos discontinuos tienen periodos de actividad (`actividad: [{desde, hasta}]`), y su jornada anual es la base × días de actividad del año / días del año (`anualDe`, `diasActividad`).
- Ajustes (⚙): horas de un tiempo completo, copia de seguridad (descargar y restaurar) y enlace a la versión anterior.
- Cualquier cambio de formato de datos se migra en `normalizar()`.

## Convenciones

- Todo el texto de la interfaz en español, en tono claro y directo.
- Identidad visual: señalética de aeropuerto (asfalto `#22262E`, hormigón `#ECEEF1`, amarillo señal `#F6C300`, azul pista `#1F5FBF`; Barlow y Barlow Condensed). Contratos: completo azul, parcial morado, discontinuo naranja.
- Animación: solo una entrada escalonada al cambiar de pantalla (`main.entrando` + `.anim` con `--i`) y respuestas a lo que se toca; respetar `prefers-reduced-motion`.
- Probar en móvil (390 px) y escritorio antes de publicar.
