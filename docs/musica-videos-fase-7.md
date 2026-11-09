# Fase 7 — Música y Videos

Ruta: musica-y-videos.html. Figma de lectura: 6g6blQgqw9U4GF5CsrT1T2, Desktop 187:218 / Mobile 187:411. Se conservan hero, submenú, tres cards de lanzamientos pendientes, listado de seis canciones, footer y tokens. Se adapta Videos al carrusel de nueve solicitado.

## Cambios

- Modificado musica-y-videos.html.
- Creado css/musica-videos.css, estilos aislados; 3 cards desde 1200px, 2 entre 768 y 1199px, 1 hasta 767px.
- Descargadas nueve miniaturas JPEG 480×360 (se presentan en cajas 16:9 con object-fit: cover).
- Creados este informe y musica-videos-contenido.json.
- index.html, nosotros.html, contacto.html, CSS compartido, main.js y videos.js sin cambios, comprobado por SHA-256. No se añaden librerías.

## Contenido y red

Las nueve consultas oficiales oEmbed respondieron 200 con autor Carlos Kury (@CarlosKuryOficial) y títulos correspondientes a los enlaces del usuario. Nueve miniaturas 200 y decodificación local de 480×360. Nueve documentos /embed/ respondieron 200, pero no expusieron indicadores verificables de playabilityStatus/isEmbeddable: HTTP 200 y oEmbed no garantizan reproducción en todos los entornos. Se ofrece Abrir en YouTube en cada tarjeta y ayuda en el modal. No se descargaron videos. Las portadas/nombres de últimos lanzamientos están explícitamente pendientes; no se inventan fechas ni duraciones.

## Verificación

- 84 referencias locales existentes; anclas, ARIA e IDs únicos comprobados.
- Anidación básica de etiquetas comprobada; no sustituye validador HTML completo.
- Un H1; title, description, viewport y ausencia de noindex.
- Sin iframe inicial. js/videos.js reutilizado sin cambios.
- DOM simulado: 3/2/1 cards, paginación, siguiente/anterior, End, iframe bajo demanda, eliminación de iframe al cerrar, Escape y retorno de foco.
- No se ejecutaron pruebas visuales: inventario de navegador informa browser access host unavailable. Pendientes recortes, overflow, Desktop/Mobile real, swipe físico, menú con teclado real, lector de pantalla, reproducción y cierre de audio efectivos, consola y Lighthouse.

## Abrir en Chrome

Desde VS Code, usar Open with Live Server si está instalado y abrir la URL servida de musica-y-videos.html en Chrome. Se recomienda HTTP para que YouTube reciba el Referer. Abrir HTML directamente permite revisar la composición, pero el reproductor podría fallar por falta de Referer; usar enlaces externos como alternativa.
