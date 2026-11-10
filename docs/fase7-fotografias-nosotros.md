# Fase 7 — Fotografías oficiales y Nosotros

Implementación autorizada por el usuario después de revisar el plan fotográfico.

## Fuente de diseño

Figma de solo lectura: archivo `6g6blQgqw9U4GF5CsrT1T2`, Nosotros Desktop `211:364` (1440 px) y Mobile `211:498` (412 px). Consultados contexto, capturas y variables. Se reutilizan Inter, oro #c9a45c, bronce #5a3e1b, fondos y componentes locales. No se modificó Figma.

Estructura: cabecera fija, Hero, retrato y tarjeta biográfica, tres tarjetas de novedades, footer y volver arriba. Escritorio: márgenes 96 px, retrato 520 × 640, separación 56 px. Móvil: márgenes 24 px, retrato de 420 px de alto y contenido apilado. Tablet adapta columnas sin desbordamiento.

La biografía reproduce información proporcionada en el prototipo aprobado. No representa una investigación independiente. Las novedades del diseño no tienen fuentes, destinos ni fechas confirmadas: se conserva la estructura con estados explícitos de información pendiente y sin enlaces ficticios.

## Selección aprobada

- Hero Inicio: DSC_0507 carlos kury.png.
- Hero Música y Videos: CARLOS KURY 019.jpeg.
- Hero Nosotros: CARLOS KURY 004.jpeg.
- Contacto: DSC_0494 carlos kury.png reservada; la página pendiente no se modifica.
- Retrato biográfico en Inicio y Nosotros: CARLOS KURY 017.jpeg.
- Carrusel: DSC_0507, 014, 002, DSC_0494, 022.
- Galería: 012, 004, 019, 014, 022, 002.
- Novedades: 002, 014, 022.

Los Heroes reservan una zona lateral para el artista en escritorio. En móvil, la fotografía ocupa una franja superior y el texto queda debajo para conservar el rostro y la tipografía. Son adaptaciones autorizadas respecto a los fondos genéricos y títulos centrados de Figma.

## Recursos

36 WebP, anchos 480/800/1200/1800 px, calidad 85, orientación EXIF aplicada. Transparencias de los PNG compuestas sobre el fondo negro del sitio, sin generar ni retocar al artista. Las fotos conservan sus proporciones. Los nueve originales permanecen intactos; dimensiones, SHA-256 y tamaños derivados en `assets/images/official/manifest.json`.

Regeneración: ejecutar `scripts/phase7.py` con Python y Pillow. Solo escribe derivados y manifiesto; no modifica HTML. Las imágenes secundarias usan carga diferida y dimensiones explícitas; los Heroes tienen prioridad alta.

Las regiones musicales de Inicio y el contenido posterior al Hero de Música y Videos se compararon exactamente antes/después durante la implementación. No se editaron scripts de música, videos, carrusel o galería. El visor sigue reutilizando `currentSrc`, con versiones de galería de al menos 800 px.

## Verificación

Chrome headless, páginas Inicio, Música y Videos y Nosotros a 1440/768/390/360 px. Registro: `docs/qa/fase7-resultados.json`; capturas `docs/qa/fase7-*.png`. Verificados menú móvil y Escape, avance manual del carrusel fotográfico, apertura/avance/cierre de galería, imágenes cargadas y ausencia de errores de JavaScript y desbordamiento horizontal. Revisión visual de Heroes y retratos mediante capturas. Contacto conserva su estado pendiente.
