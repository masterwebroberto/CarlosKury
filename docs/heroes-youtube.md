# Hero con miniaturas oficiales

Actualización: 8 de noviembre de 2026. Se revisaron visualmente las nueve miniaturas registradas. No se descargaron videos ni se extrajeron fotogramas adicionales.

- Inicio: Rio Churin (Huayno), https://www.youtube.com/watch?v=LX_mz8MEkiY . Fuente: https://i.ytimg.com/vi/LX_mz8MEkiY/maxresdefault.jpg
- Música y Videos: Papel Sellado (Huayno), https://www.youtube.com/watch?v=UolSYIt3j-Y . Fuente: https://i.ytimg.com/vi/UolSYIt3j-Y/maxresdefault.jpg

Ambas fuentes respondieron correctamente y se decodificaron a 1280 × 720. Se conservan sus JPEG originales. WebP calidad 82: Desktop 800 × 450 y 1280 × 720; Mobile 384 × 480 y 576 × 720 con recorte de 576 × 720 en origen (x=260 en Inicio y x=400 en Música y Videos). Sin ampliación de píxeles en los archivos generados.

Se conserva object-fit:cover; object-position 44% center en Inicio y 56% top en Música y Videos. Picture selecciona el recorte Mobile hasta 767px. Se mantienen las dimensiones de los contenedores y los degradados originales; imágenes absolutas con dimensiones explícitas, sin intervenir en el flujo del contenido.

## Pruebas realizadas

Chrome headless, viewports internos exactos de 1440 y 390px: las cuatro combinaciones cargan WebP y seleccionan el recurso esperado, sin desbordamiento horizontal. Revisión visual de las cuatro capturas para comprobar recortes y legibilidad. Hero Inicio: 660px de alto en Desktop y 568px en Mobile; Hero Música y Videos: 340px en ambos. Comparación de HTML confirma que solo cambian la imagen Hero y su crédito; no se modificaron CSS, JS, carruseles, galerías ni reproductores.

## Pendiente

Pruebas en dispositivos físicos, otros navegadores y medición CLS/LCP con red limitada. No se realizó auditoría numérica de contraste; se revisó visualmente y se mantuvieron los degradados existentes.

## Reversión

Las fotografías previas 6f551.png y sus versiones optimized permanecen intactas. docs/heroes-anteriores.json guarda el img y el crédito anteriores para cada página: reemplazar el picture nuevo por ese img y restaurar el crédito para revertir.

## Recursos

- LX_mz8MEkiY-1280.webp: 150960 bytes
- LX_mz8MEkiY-800.webp: 81920 bytes
- LX_mz8MEkiY-mobile-384.webp: 37490 bytes
- LX_mz8MEkiY-mobile-576.webp: 64548 bytes
- LX_mz8MEkiY-source.jpg: 156251 bytes
- UolSYIt3j-Y-1280.webp: 177942 bytes
- UolSYIt3j-Y-800.webp: 93212 bytes
- UolSYIt3j-Y-mobile-384.webp: 45708 bytes
- UolSYIt3j-Y-mobile-576.webp: 82552 bytes
- UolSYIt3j-Y-source.jpg: 183526 bytes
