# Miniaturas musicales y futura incorporación de audio

## Miniaturas

Verificadas el 8 de noviembre de 2026: las nueve fuentes oficiales respondieron correctamente y se decodificaron como JPEG de 640 × 480. Fuente por ID: `https://i.ytimg.com/vi/{ID}/sddefault.jpg`.

Se generaron recortes centrales cuadrados locales de 320 y 480 píxeles, JPEG calidad 82, sin ampliar la imagen original. `srcset` y `sizes` seleccionan el tamaño según pantalla y densidad; `loading="lazy"`, `decoding="async"` y dimensiones explícitas reducen carga inicial y cambios de layout. Se conserva el cuadrado del diseño y sus estilos.

- Hasta Siempre Yanaca: https://i.ytimg.com/vi/cZzpsOK4njc/sddefault.jpg
- Hasta Siempre Yanaca (2006): https://i.ytimg.com/vi/f17g6OlxvII/sddefault.jpg
- Sirenayan (Carnavales): https://i.ytimg.com/vi/8xu4BnNQAP8/sddefault.jpg
- Si Lloras Por Mi (Huayno): https://i.ytimg.com/vi/A7UjnlMDLvY/sddefault.jpg
- Rio Churin (Huayno): https://i.ytimg.com/vi/LX_mz8MEkiY/sddefault.jpg
- Ponchito Rojo (Huayno): https://i.ytimg.com/vi/qTdK6Etz6Kw/sddefault.jpg
- Papel Sellado (Huayno): https://i.ytimg.com/vi/UolSYIt3j-Y/sddefault.jpg
- Mi Mollecito (Huayno): https://i.ytimg.com/vi/fMQDOI99XdI/sddefault.jpg
- Con Dinero o Sin Dinero (Carnavales): https://i.ytimg.com/vi/hghl3TVuaY8/sddefault.jpg

## Incorporación posterior de MP3 autorizados

El funcionamiento actual sigue siendo el enlace de cada `.music-play` a su video, interceptado por `js/videos.js` para abrir el modal. No se ha incorporado ningún reproductor vacío ni se ha descargado audio.

Cuando se reciban archivos MP3 y autorización de uso:

1. Registrar por canción el ID de video existente, título, URL real del MP3 y tipo `audio/mpeg`. El ID identifica también la versión (incluida la de 2006). No asignar URL hasta que el archivo exista y responda correctamente.
2. Incorporar un único `<audio controls preload="none">` compartido y accesible. Crear o mostrar el control solo al seleccionar una canción con archivo disponible; asignar su fuente en ese momento. La acción debe partir del usuario, sin autoplay al cargar la página.
3. Resolver primero la fuente autorizada antes del manejador de `.music-play` en `js/videos.js`; evitar dos manejadores que abran audio y video simultáneamente. Conservar el enlace de YouTube como alternativa y mantener intactas `.video-preview` y `.song-row` hasta que se autorice ampliar el alcance.
4. Al cambiar de canción, pausar y reiniciar la anterior. Coordinar la pausa del audio al abrir el modal de video y viceversa. Capturar errores de carga y ofrecer el enlace actual de YouTube.
5. Obtener la duración del MP3 con `loadedmetadata` y `audio.duration`. Etiquetarla como duración de audio; no reutilizar las duraciones actuales de video como si fueran de MP3.
6. Verificar respuestas HTTP, MIME, solicitudes Range, controles por teclado y reproducción en Desktop y Mobile. Para otro dominio, comprobar su configuración de acceso y las políticas del servidor.

No se inventaron rutas MP3 ni se añadieron dependencias. La preparación consiste en este plan de integración, sin modificar el reproductor actual.
