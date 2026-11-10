# Fase 8 — Contacto, primera etapa

Ruta: `contacto.html`. Implementación autorizada sin envío real. Fuente de diseño consultada mediante Figma MCP en modo lectura: archivo `6g6blQgqw9U4GF5CsrT1T2`, Desktop `185:176` y Mobile `185:373`, sesión `d0ecb3c9-0a4a-4f04-85b5-d8e0deff3621`. No se modificó Figma.

## Composición

Cabecera y menú móvil existentes, Hero, tarjetas Formulario/Música, formulario en sección bronce, footer y volver arriba. Tokens y componentes compartidos reutilizados sin cambiar sus archivos. Estilos y lógica nuevos exclusivos de Contacto.

El Hero sustituye la referencia temporal por `DSC_0494 carlos kury.png`, usando las variantes WebP existentes `kury-0494`. Foto proporcional con `contain`, texto a un lado en Desktop/Tablet y composición vertical móvil. Es la adaptación editorial solicitada respecto al Hero centrado del prototipo.

Se conservan los campos del diseño: nombre, email, teléfono opcional, motivo, mensaje y privacidad. Las opciones del selector se derivan de la descripción aprobada del Hero (contrataciones/shows, prensa, colaboraciones) y se añade Otro motivo. Formulario máximo 900 px, campos en parejas en escritorio y apilados en móvil. Aviso de privacidad reservado, sin texto legal definitivo ni enlace ficticio.

El correo y celular del prototipo siguen pendientes de confirmación; en esta página se muestran como pendientes y no se crean destinos mailto, tel o WhatsApp. Los iconos sociales heredados mantienen la indicación de enlaces oficiales pendientes. No se cambian las demás páginas ni sus datos.

## Envío desactivado

Configuración al inicio de `js/contacto.js`:

```js
{ endpoint: '', privacyApproved: false, privacyUrl: '' }
```

Para activar en una etapa posterior, el propietario debe proporcionar el endpoint real de Formspree y aprobar/publicar el aviso de privacidad. Las tres condiciones se comprueban conjuntamente. No hay endpoint ficticio, credenciales ni envío de datos en esta entrega.

Enviar y la casilla de privacidad permanecen desactivados. Revisar mensaje comprueba los campos localmente sin transmitirlos. Se muestra «Envío aún no disponible». Sin JavaScript, los campos y el envío permanecen desactivados y se explica el estado.

La integración prevista usa POST con FormData y Accept: application/json. Solo comunica recepción si obtiene HTTP correcto y JSON `ok: true` del servicio. Conserva los campos ante rechazo, respuesta no verificable o fallo de red, evita solicitudes simultáneas y contempla un límite de espera de 20 segundos. La aceptación de privacidad es obligatoria cuando se habilita el envío. No afirma entrega al buzón del destinatario.

## Validación y accesibilidad

Etiquetas visibles, `required`, autocomplete, email nativo, límites de longitud, rechazo de obligatorios con solo espacios, errores asociados mediante aria-describedby/aria-invalid, foco en el primer error y estado de formulario mediante región viva. Botones operables por teclado y foco dorado visible. Teléfono opcional sin patrón que excluya formatos internacionales. No se guardan mensajes en almacenamiento local.

## Pruebas realmente realizadas

Ejecutable de verificación: `scripts/qa-contacto.cjs`.

- Chrome headless a 1440, 768, 390 y 360 px: capturas completas, foto y logos cargados, cero desbordamiento horizontal y cero errores JavaScript.
- Campos obligatorios vacíos, nombre con espacios, email incorrecto/correcto, selector y mensaje; teléfono vacío admitido; corrección de errores.
- Menú móvil con Enter y Escape, restauración de foco, enlace al formulario, Tab entre campos y salto de controles desactivados.
- Validación de que no se realiza ninguna solicitud HTTP externa al revisar o pulsar Enter. Sin JavaScript, campos y envío desactivados.
- Pruebas de futura integración **solo en memoria**, reemplazando fetch por una función local: bloqueo por falta de endpoint/aprobación/enlace de privacidad, consentimiento, POST y datos, carga, rechazo HTTP, respuesta sin acuse, error de red y aceptación. No se enviaron mensajes reales ni se configuró el endpoint en los archivos.
- Contrastes calculados de los tokens: texto secundario/negro 11.76:1, oro/negro 8.47:1, blanco/bronce 9.81:1 y texto secundario/tarjeta 9.91:1. Revisión visual de foco y recortes en capturas. Sin nuevas animaciones; verificación con movimiento reducido.
- SHA-256 confirma que las otras tres páginas, CSS compartidos y scripts existentes no cambiaron. No se modificaron fotografías originales ni sus derivados.

Resultados: `docs/qa/contacto/resultados.json`. Capturas: `docs/qa/contacto/contacto-{ancho}.png`.

Pendiente para activación: endpoint real, correo receptor confirmado en el servicio, aviso de privacidad aprobado/publicado y prueba de recepción autorizada. Las pruebas actuales de integración son locales y no acreditan entrega real de correo.
