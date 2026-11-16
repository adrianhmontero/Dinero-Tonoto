/**
 * @format
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import App from '../App';

jest.mock(
  'react-native-safe-area-context',
  () => require('react-native-safe-area-context/jest/mock').default,
);

test('renders the four tab labels', async () => {
  let renderer!: ReactTestRenderer.ReactTestRenderer;
  await ReactTestRenderer.act(async () => {
    renderer = ReactTestRenderer.create(<App />);
  });
  await ReactTestRenderer.act(async () => {
    await new Promise<void>(resolve => setImmediate(resolve));
  });

  const json = JSON.stringify(renderer.toJSON());
  ['Inicio', 'Movimientos', 'Estadísticas', 'Perfil'].forEach(label => {
    expect(json).toContain(label);
  });

  await ReactTestRenderer.act(async () => {
    renderer.unmount();
  });
});
