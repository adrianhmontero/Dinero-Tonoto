# SPEC 01 — Barra de navegación inferior con cuatro pestañas

> **Estado:** implementado
> **Depende de:** ninguna
> **Fecha:** 2026-11-16
> **Objetivo:** Añadir una barra de navegación inferior con las pestañas Inicio, Movimientos, Estadísticas y Perfil, cada una mostrando una pantalla vacía con su título.

---

## Alcance

**Dentro:**

- Instalar `@react-navigation/native`, `@react-navigation/bottom-tabs` y `react-native-screens` (`react-native-safe-area-context` ya está instalado).
- Barra inferior con 4 pestañas: Inicio, Movimientos, Estadísticas, Perfil.
- Una pantalla por pestaña, en TypeScript, que solo muestra su título centrado.
- Iconos emoji en cada pestaña.
- Tema claro/oscuro automático según el sistema con modo oscuro activado por defecto (`useColorScheme`).
- Tipado TypeScript de las rutas.
- Sustituir la pantalla de plantilla (`NewAppScreen`) en `App.tsx` y adaptar `__tests__/App.test.tsx`.

**Fuera de alcance (para futuros specs):**

- Contenido real de cada pestaña (listas, gráficas, formularios, datos de perfil).
- Datos mock, persistencia y lógica de negocio.
- Navegación anidada (stacks, modales, detalle de movimiento).
- Librería de iconos (`react-native-vector-icons` u otra).
- Selector manual de tema.
- Cambios en código nativo (`ios/`, `android/`): Swift y Kotlin se quedan como están.

## Modelo de datos

Este spec no introduce estructuras de datos de negocio. Solo el tipado de rutas:

```ts
// src/navigation/types.ts
export type RootTabParamList = {
  Inicio: undefined;
  Movimientos: undefined;
  Estadisticas: undefined;
  Perfil: undefined;
};
```

Convenciones:

- Nombre de ruta sin tildes (`Estadisticas`); el título visible lleva tilde («Estadísticas»).
- Iconos: Inicio 🏠, Movimientos 💸, Estadísticas 📊, Perfil 👤.

## Estructura de archivos

```
App.tsx                              (modificado)
__tests__/App.test.tsx               (modificado)
package.json                         (modificado: dependencias)
src/navigation/types.ts              (nuevo)
src/navigation/TabNavigator.tsx      (nuevo)
src/screens/InicioScreen.tsx         (nuevo)
src/screens/MovimientosScreen.tsx    (nuevo)
src/screens/EstadisticasScreen.tsx   (nuevo)
src/screens/PerfilScreen.tsx         (nuevo)
src/components/ScreenTitle.tsx       (nuevo: título centrado reutilizable)
```

## Plan de implementación

1. Instalar dependencias: `npm install @react-navigation/native @react-navigation/bottom-tabs react-native-screens`. Verificar que `npm test` y `npx tsc --noEmit` siguen pasando.
2. Crear `src/navigation/types.ts` con `RootTabParamList`.
3. Crear `src/components/ScreenTitle.tsx`: recibe `title: string` y lo muestra centrado, con color según tema claro/oscuro.
4. Crear las 4 pantallas en `src/screens/`, cada una renderizando `<ScreenTitle>` con su título.
5. Crear `src/navigation/TabNavigator.tsx` con `createBottomTabNavigator<RootTabParamList>()`, las 4 pestañas, icono emoji por pestaña y colores de barra según tema.
6. Modificar `App.tsx`: envolver `TabNavigator` en `NavigationContainer` (con `DefaultTheme`/`DarkTheme` según `useColorScheme`) dentro de `SafeAreaProvider`, y eliminar `NewAppScreen`.
7. Actualizar `__tests__/App.test.tsx` para comprobar que se renderizan las 4 etiquetas de pestaña.

## Criterios de aceptación

- [ ] `npx tsc --noEmit` termina sin errores.
- [ ] `npm run lint` termina sin errores.
- [ ] `npm test` pasa, incluido el test que comprueba las 4 etiquetas de pestaña.
- [ ] La app arranca en Android sin errores en Metro ni pantalla roja.
- [ ] La barra inferior muestra exactamente 4 pestañas con las etiquetas Inicio, Movimientos, Estadísticas y Perfil, cada una con su icono emoji.
- [ ] Al pulsar cada pestaña se muestra una pantalla con su título centrado y nada más.
- [ ] La pestaña inicial al abrir la app es Inicio.
- [ ] Con el sistema en modo oscuro, el fondo de la pantalla y de la barra es oscuro y el título es legible; en modo claro ocurre lo contrario.
- [ ] La barra no queda tapada por la barra de gestos/navegación del sistema (respeta safe area).
- [ ] `App.tsx` ya no importa `@react-native/new-app-screen`.
- [ ] No hay archivos modificados en `ios/` ni `android/` (salvo los que genere la instalación de dependencias, si los hay).

## Decisiones tomadas y descartadas

- **Sí:** React Navigation `bottom-tabs`. Estándar en React Native, tipos TypeScript incluidos y compatible con el proyecto CLI actual.
- **No:** barra propia con estado local. Obliga a reimplementar transiciones y complica añadir stacks después.
- **No:** Expo Router. Exigiría migrar el proyecto.
- **Sí:** pestañas Inicio, Movimientos, Estadísticas, Perfil. Elección del usuario frente a la variante con Presupuesto y Ajustes.
- **Sí:** pantallas vacías con solo título. Elección del usuario; el contenido de cada pestaña va en specs posteriores, uno por pestaña.
- **No:** maqueta con datos mock. Se descartó para mantener el spec pequeño y centrado en la navegación.
- **Sí:** iconos emoji. Sin dependencias ni linkeo nativo adicional.
- **No:** `react-native-vector-icons`. Añade configuración nativa que no aporta valor en un esqueleto.
- **Sí:** tema claro/oscuro automático con `useColorScheme`. Es lo que ya usa `App.tsx`.
- **Sí:** mantener Swift y Kotlin tal cual. El usuario descartó eliminar Swift; el código nativo no se toca.
- **Sí:** rutas tipadas sin tildes, etiquetas visibles con tilde.

## Riesgos identificados

| Riesgo                                                                               | Mitigación                                                                                                           |
| ------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------- |
| `react-native-screens` es una librería nativa y exige recompilar la app.             | Tras instalar, ejecutar `npm run android` (no basta con recargar Metro).                                             |
| Compatibilidad de versiones de React Navigation con React 19.3 / RN 0.88.            | Instalar las últimas versiones estables y verificar con `npm test` y arranque real en el paso 1 antes de continuar. |
| Emojis con aspecto distinto según dispositivo/versión de Android.                    | Aceptado en este spec; se resolverá si se adopta una librería de iconos en otro spec.                                |
| Cambios generados por la instalación en `ios/` (p. ej. Podfile.lock tras `pod install`). | No ejecutar `pod install` en este spec; iOS no se verifica aquí.                                                     |

## Lo que **no** entra en este spec

- Contenido real de las pestañas (movimientos, gráficas, perfil).
- Datos mock y persistencia.
- Stacks, modales y navegación anidada.
- Librería de iconos y selector manual de tema.
- Cualquier cambio en Swift, Kotlin o configuración nativa.

Cada uno de ellos, si se aborda, va en su propio spec.
