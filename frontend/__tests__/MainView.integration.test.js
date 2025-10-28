
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import MainView from '../components/MainView';

// Mockear axios para no hacer llamadas reales a la API
jest.mock('axios');

const mockUser = {
  nombre: 'Usuario de Prueba',
};

describe('Prueba de Integración para MainView', () => {
  it('debería permitir al usuario escribir texto, solicitar un análisis y mostrar los resultados', async () => {
    // 1. Configuración de Mocks para las llamadas a la API
    // Mock para guardar el texto
    axios.post.mockResolvedValue({
      data: { textId: 'mockTextId123' },
    });

    // Mock para el análisis de preguntas
    const mockAnalysisResults = {
      data: {
        questions: [
          { level: 'Fácil', question: '¿Cuál es la idea principal del texto?' },
          { level: 'Medio', question: '¿Qué implicaciones tiene el argumento central?' },
        ],
      },
    };
    axios.get.mockResolvedValue(mockAnalysisResults);

    // 2. Renderizar el componente
    render(<MainView user={mockUser} />);

    // 3. Simular la interacción del usuario
    // Escribir en el textarea
    const textarea = screen.getByPlaceholderText(/Pega aquí el artículo/i);
    fireEvent.change(textarea, { target: { value: 'Este es un texto de prueba para el análisis.' } });

    // Hacer clic en el botón de "Generar Preguntas"
    const questionsButton = screen.getByRole('button', { name: /Generar Preguntas/i });
    fireEvent.click(questionsButton);

    // 4. Verificar el estado de carga y las llamadas a la API
    // Verificar que el estado de carga se muestra
    expect(screen.getByText(/Analizando... Por favor, espera./i)).toBeInTheDocument();

    // Verificar que se llamó a la API para guardar el texto
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith('http://localhost:4000/api/save-text', {
        text: 'Este es un texto de prueba para el análisis.',
      });
    });

    // Verificar que se llamó a la API para analizar
    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith('http://localhost:4000/api/analyze/mockTextId123/questions');
    });
    
    // 5. Verificar que los resultados se muestran en la pantalla
    await waitFor(() => {
      // El mensaje de carga debe desaparecer
      expect(screen.queryByText(/Analizando... Por favor, espera./i)).not.toBeInTheDocument();
      
      // Los resultados deben estar visibles
      expect(screen.getByText('¿Cuál es la idea principal del texto?')).toBeInTheDocument();
      expect(screen.getByText('¿Qué implicaciones tiene el argumento central?')).toBeInTheDocument();
    });
  });

  it('debería mostrar un mensaje de error si la API falla', async () => {
    // 1. Configuración del Mock para simular un error
    axios.post.mockRejectedValue(new Error('Error de red'));

    // 2. Renderizar el componente
    render(<MainView user={mockUser} />);
    
    // 3. Simular la interacción del usuario
    fireEvent.change(screen.getByPlaceholderText(/Pega aquí el artículo/i), { 
      target: { value: 'Texto que causará un error.' } 
    });
    fireEvent.click(screen.getByRole('button', { name: /Generar Preguntas/i }));

    // 4. Esperar y Verificar el mensaje de error
    await waitFor(() => {
      expect(screen.getByText(/Hubo un error al comunicarse con la IA/i)).toBeInTheDocument();
    });
  });
});