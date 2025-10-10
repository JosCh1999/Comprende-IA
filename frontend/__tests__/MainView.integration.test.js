import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import MainView from '../components/MainView'; // Ruta correcta al componente

// Mockear axios para no hacer llamadas reales a la API
jest.mock('axios');

// Datos de prueba relevantes para "Comprende-IA"
const mockTexts = [
  {
    _id: 'text1',
    title: 'Impacto de la IA en la sociedad',
    content: 'Contenido del primer texto...',
  },
  {
    _id: 'text2',
    title: 'El futuro del aprendizaje automático',
    content: 'Contenido del segundo texto...',
  }
];

describe('Prueba de Integración para MainView', () => {
  it('debería obtener y mostrar la lista de textos correctamente', async () => {
    // 1. Configuración del Mock: Simula una respuesta exitosa de la API
    // Asumimos que la API para obtener los textos está en /api/texts
    axios.get.mockResolvedValue({ data: mockTexts });

    // 2. Renderizar el componente
    render(<MainView />);

    // 3. Esperar y Verificar
    // Usamos waitFor para esperar a que los títulos de los textos aparezcan
    await waitFor(() => {
      // Verificar que el título del primer texto está en el documento
      expect(screen.getByText('Impacto de la IA en la sociedad')).toBeInTheDocument();
      // Verificar que el título del segundo texto está en el documento
      expect(screen.getByText('El futuro del aprendizaje automático')).toBeInTheDocument();
    });

    // Opcional: Verificar que axios.get fue llamado al endpoint correcto
    expect(axios.get).toHaveBeenCalledWith('http://localhost:4000/api/texts');
  });

  it('debería mostrar un mensaje de error si la API para obtener textos falla', async () => {
    // 1. Configuración del Mock: Simula un error de la API
    axios.get.mockRejectedValue(new Error('Error de red'));

    // 2. Renderizar el componente
    render(<MainView />);

    // 3. Esperar y Verificar
    // Esperamos que aparezca un mensaje de error relevante
    await waitFor(() => {
      // La aserción puede necesitar ajuste según el mensaje de error real en tu componente
      expect(screen.getByText(/Error al cargar los textos/i)).toBeInTheDocument();
    });
  });
});