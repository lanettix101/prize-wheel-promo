# Prize Wheel Promo

Ruleta de la fortuna interactiva para **sorteos y campañas promocionales**. Los participantes giran una ruleta con premios ponderados y, al detenerse, la app anuncia al ganador con un modal y efecto confeti. Incluye gestor de premios, logotipo central configurable y reloj en vivo de la zona horaria del evento.

![React](https://img.shields.io/badge/React-18-61DAFB) ![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178C6) ![Vite](https://img.shields.io/badge/Vite-7-646CFF)

## Alcance

Experiencia web lista para desplegar en una promoción (URL pública, proyectada en un punto de venta o embebida en un evento). Configurable por un operador sin conocimientos técnicos.

## Funcionalidades

- **Ruleta ponderada** — cada premio tiene un peso; a mayor peso, mayor probabilidad de resultar ganador.
- **Gestión de premios** — agregar, eliminar, editar y reordenar sectores en vivo.
- **Imagen central configurable** — sube el logotipo de la marca al centro de la ruleta.
- **Modal de ganador + confeti** — animación de celebración al terminar el giro (`react-confetti`).
- **Reloj en tiempo real** — fijado a la zona horaria del evento (`America/Caracas`), utilizable para sortear en un horario exacto.
- **UI en español** — pensada para campañas LATAM.
- **Diseño on-brand** — tema rosa/personalizado con Tailwind CSS y tipografía Nunito.

## Cómo funciona internamente

```
┌──────────────┐   ┌─────────┐   ┌───────────────┐
│ InputPanel   │ → │  Wheel  │ → │ WinnerModal   │
│ (premios,    │   │ (SVG +  │   │ (confeti +    │
│  pesos, logo)│   │  giro)  │   │  resultado)   │
└──────────────┘   └─────────┘   └───────────────┘
```

### Mecánica del giro

1. `constants.ts` define los colores de los sectores y los premios por defecto.
2. `Wheel.tsx` renderiza la ruleta como **SVG** con tamaño proporcional al peso de cada premio.
3. La selección del ganador usa la distribución de pesos (sampleo con mayor densidad hacia los premios de mayor peso).
4. Al detenerse, `WinnerModal` muestra el premio con el efecto confeti.

El estado se mantiene tipado con las interfaces `WheelItem` y `WheelState` (`types.ts`).

## Requisitos

- Node.js 18+

## Puesta en marcha

```bash
npm install
npm run dev
```

| Comando | Descripción |
|---|---|
| `npm run dev` | Servidor de desarrollo en `:3000` |
| `npm run build` | Build de producción en `dist/` |
| `npm run preview` | Previsualización del build |

## Estructura

```
├── App.tsx                 # Orquestación y estado principal
├── constants.ts            # Colores de sectores + premios por defecto
├── types.ts                # Interfaces WheelItem y WheelState
├── components/
│   ├── Wheel.tsx           # Ruleta SVG con giro ponderado
│   ├── InputPanel.tsx      # Panel de premios, pesos y logotipo
│   └── WinnerModal.tsx     # Anuncio del ganador + confeti
├── index.html / index.tsx  # Entrada React + Tailwind (CDN)
├── vite.config.ts / tsconfig.json
└── .github/workflows/check.yml  # CI: build check en push/PR
```

## Licencia

Proyecto de portfolio. Desarrollado por **@Lanetting_ Creative Solutions**.