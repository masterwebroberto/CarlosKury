# Optimización de imágenes — etapa 1

Modificado: index.html. Añadidos: 22 WebP en assets/images/optimized/ y este informe. Originales, CSS, JS y otras páginas conservados por SHA-256.

| Original | KiB original | Variantes WebP: ancho y peso |
|---|---:|---|
| 05997.png | 136.4 | 480px: 28.0 KiB; 800px: 75.9 KiB |
| 1f83e.png | 105.4 | 480px: 19.9 KiB; 800px: 52.6 KiB |
| 2f3df.png | 140.8 | 480px: 37.7 KiB; 800px: 81.4 KiB |
| 4de23.png | 135.9 | 480px: 33.3 KiB; 800px: 74.8 KiB |
| 6f551.png | 307.1 | 480px: 27.0 KiB; 800px: 60.5 KiB; 1280px: 163.1 KiB |
| 878e4.png | 143.7 | 480px: 34.3 KiB; 800px: 63.0 KiB; 1200px: 109.9 KiB |
| 9288d.png | 85.0 | 480px: 18.9 KiB; 800px: 41.0 KiB |
| a709b.png | 2296.3 | 170px: 13.0 KiB; 340px: 39.0 KiB; 510px: 75.4 KiB |
| fc20c.png | 507.9 | 150px: 4.0 KiB; 300px: 10.7 KiB; 450px: 18.8 KiB |

Fotografías: WebP calidad 90. Logos: WebP lossless tras redimensionado proporcional, conservando alfa. Conversiones completas sin ahorro significativo descartadas. Galería: resolución completa para conservar nitidez del lightbox que reutiliza currentSrc; solo 878e4 usa WebP completo (1200×1800). Fuera de galería: fotografías responsive 480/800 px y recurso completo; hero añade 1280 px. sizes del carrusel contempla object-fit: cover. Hero Mobile usa estimación conservadora de 960 px para su alto; no es medición de navegador. No cambian cajas CSS ni dimensiones HTML de logos.

## Verificaciones realizadas

- SHA-256: originales, CSS, JS y otras páginas intactos.
- 140 referencias locales verificadas en disco.
- 22 WebP decodificados completamente; proporciones comprobadas y alfa conservado en logos.
- Comparación HTML normalizada: solo atributos de entrega de imágenes.
- Comparación visual en lámina a tamaño reducido: sin diferencias evidentes; no es prueba del sitio en navegador ni validación pixel a pixel.
- Prioridad alta del hero y lazy secundario conservados; añadido lazy al logo footer.

## Posible CLS de cabecera

CSS Mobile reserva 406px antes de header--enhanced y 90px después. main.js añade la clase con defer. Podría desplazar 316px si hay pintado previo. No se modifica sin traza para atribuir CLS. Fuente swap y aparición de controles siguen pendientes de atribución.

## Pendiente

Carga HTTP/MIME WebP; currentSrc a varios DPR/ancho; capturas responsive 1440/1024/768/390/360; recortes, nitidez y desbordamientos; interacciones y Lighthouse antes/después. No hay nueva puntuación medida. El repositorio aumenta de peso al conservar originales.
