# Fuente de diseño y decisiones

Actualización Fase 7: Nosotros y fotografías oficiales implementadas. Las descripciones de recursos temporales más abajo corresponden al estado inicial; consultar [fase7-fotografias-nosotros.md](fase7-fotografias-nosotros.md) para el estado vigente.

Consulta mediante Figma MCP del archivo aprobado facilitado por el usuario:
https://www.figma.com/design/6g6blQgqw9U4GF5CsrT1T2/Carlos-Kury?node-id=57-142

Se utilizaron exclusivamente herramientas de lectura de diseño, metadatos y variables. No se editaron nodos ni variables del archivo Figma.

| Referencia | Nodo |
|---|---|
| Página principal — Desktop 1440 | 57:142 |
| Página principal — Mobile 412 | 57:315 |
| UI Kit — Sistema de diseño | 213:408 |
| Navigation/Mobile, Home abierto | 2061:514 |
| Navigation/Mobile, Home cerrado | 2061:527 |

## Sistema

Tokens de color y tipografía consultados con `get_variable_defs` y `get_design_context`. Valores representados en `css/tokens.css` siguiendo la nomenclatura propuesta en el UI Kit.

- Inter, pesos 400/500/600/700; Display 64/72; H1 48/56; H2 32/40; H3 24/32; cuerpo 16/24; etiquetas 14/20; captions 12/16.
- Escritorio: 1440 px, margen 96 px, grilla de 12 columnas, canaleta 24 px.
- Móvil: margen 24 px, grilla de 4 columnas, canaleta 16 px; UI Kit documenta 390 px y pantalla de Inicio usa 412 px.
- Escala de espacio 8/16/24/40/64 px; radios 8/16/999 px; botones 52 px; toggle móvil 44 px.
- Colores base #0b0907, superficie #1a1411, elevado #241c17; texto #ffffff/#cfc6b8; oro #c9a45c, oro profundo #a07c3a, bronce #5a3e1b, bronce oscuro #3a2a12 y plata #c4cad2.

La fuente Inter se descargó de su distribuidor original, https://rsms.me/inter/font-files/InterVariable.woff2, y se conserva su licencia OFL. No se hacen solicitudes externas para cargar fuentes al visualizar el sitio.

## Composición y recursos

Se conserva el orden de secciones de Inicio, las imágenes de cada slot, el degradado del hero de escritorio y su capa oscura móvil. Las imágenes usan `object-fit: cover`; los logos usan `contain`; los SVG conservan sus dimensiones de 24 px.

La galería usa tres columnas de alturas alternadas en escritorio y un área vertical de 560 px con seis imágenes en móvil. Los carruseles usan scroll nativo con teclado y tacto; el de fotos añade controles anterior/siguiente sin autoavance.

El frame móvil incluye seis referencias de música y seis de video, mientras que escritorio muestra cuatro y tres respectivamente. Se conservaron las referencias adicionales solo en móvil, de acuerdo con ambas composiciones. Las tarjetas se adaptan al ancho disponible para evitar el recorte de texto presente en algunos anchos del prototipo.

El primer plano del hero se identifica como «Referencia temporal · no corresponde a Carlos Kury», enlazado a la referencia Pexels 1047442 del diseño. El resumen biográfico mantiene la leyenda «Referencia musical · retrato oficial pendiente». Las demás fotos y portadas se identifican como temporales en los textos alternativos y en el inventario.

Los destinos internos se asignaron a los cuatro HTML solicitados. El rótulo «Biografía» del prototipo apunta a `nosotros.html`; el resumen biográfico de Inicio conserva su contenido aprobado. No se implementó la página Nosotros.

Las redes sin URL oficial en el diseño son iconos informativos; las tarjetas de canales sí conservan sus enlaces genéricos explícitos. Los botones sin medio reproducible no inventan un destino externo. Esta limitación se comunica mediante el aviso de recurso pendiente y el README.
