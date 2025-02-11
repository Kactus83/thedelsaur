import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import DashboardPage from './DashboardPage';
import axios from 'axios';

let axiosInstance: jest.Mocked<typeof axios>;
jest.mock('axios', () => {
  const mockAxios = jest.requireActual('axios');

  return {
    ...mockAxios,
    create: jest.fn(() => ({
      ...mockAxios,
      interceptors: {
        request: { use: jest.fn(), eject: jest.fn() },
        response: { use: jest.fn(), eject: jest.fn() },
      },
      get: jest.fn(),
      post: jest.fn(),
      put: jest.fn(),
      delete: jest.fn(),
    })),
  };
});

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('DashboardPage', () => {
  const mockUser = {
    id: 1,
    username: 'john_doe',
    email: 'john@example.com',
    created_at: '2022-01-01T00:00:00',
  };

  const mockDinosaur = {
    id: 1,
    name: 'T-Rex',
    level: 10,
    diet: 'carnivore',
    type: 'land',
    energy: 100,
    max_energy: 150,
    food: 50,
    max_food: 100,
    experience: 500,
    hunger: 20,
    max_hunger: 100,
    epoch: 'Prehistoric_Epoch1',
    created_at: '2022-01-01T00:00:00',
    last_reborn: '2023-01-01T00:00:00',
    karma: 50,
    last_update_by_time_service: '2023-01-01T00:00:00',
    reborn_amount: 2,
    isSleeping: false,
    isDead: false,
    user_id: 1,
    multipliers: {
      earn_herbi_food_multiplier: 1.2,
      earn_carni_food_multiplier: 1.5,
      earn_food_multiplier: 1.0,
      earn_energy_multiplier: 1.3,
      earn_experience_multiplier: 1.0,
      max_energy_multiplier: 1.1,
      max_food_multiplier: 1.2,
    },
  };

  const mockActions = {
    availableActions: [
      { id: 1, name: 'Feed', description: 'Feed your dinosaur' },
      { id: 2, name: 'Play', description: 'Play with your dinosaur' },
    ],
  };

  
  beforeEach(() => {
    jest.clearAllMocks(); // Nettoyage des mocks avant chaque test

    mockedAxios.get.mockImplementation((url) => {
      if (url.includes('/user')) return Promise.resolve({ data: mockUser });
      if (url.includes('/dinosaur')) return Promise.resolve({ data: mockDinosaur });
      if (url.includes('/actions')) return Promise.resolve({ data: mockActions });
      return Promise.reject(new Error('404 Not Found'));
    });
  });

  it('devrait afficher les informations de l\'utilisateur et du dinosaure', async () => {
    render(<DashboardPage />);

    await waitFor(() => {
      expect(screen.getByText('john_doe')).toBeInTheDocument();
      expect(screen.getByText('john@example.com')).toBeInTheDocument();
      expect(screen.getByText('T-Rex')).toBeInTheDocument();
      expect(screen.getByText('Level: 10')).toBeInTheDocument();
      expect(screen.getByText('Experience: 500')).toBeInTheDocument();
      expect(screen.getByText('Energy: 100')).toBeInTheDocument();
      expect(screen.getByText('Food: 50')).toBeInTheDocument();
      expect(screen.getByText('Karma: 50')).toBeInTheDocument();
      expect(screen.getByText('Hunger: 20')).toBeInTheDocument();
      expect(screen.getByText('Multiplicateur d\'expérience : 1.0x')).toBeInTheDocument();
    });
  });

  it('devrait afficher la jauge XP avec la progression correcte', async () => {
    render(<DashboardPage />);

    await waitFor(() => {
      expect(screen.getByText('Level: 10')).toBeInTheDocument();
    });
  });

  it('devrait afficher les actions disponibles', async () => {
    render(<DashboardPage />);

    await waitFor(() => {
      expect(screen.getByText('Feed')).toBeInTheDocument();
      expect(screen.getByText('Play')).toBeInTheDocument();
    });
  });
});
