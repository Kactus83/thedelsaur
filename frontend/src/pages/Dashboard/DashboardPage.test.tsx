import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import DashboardPage from './DashboardPage';
import axios from 'axios';
import { MemoryRouter } from 'react-router-dom';


jest.mock('axios', () => {
  return {
      interceptors: {
          request: { use: jest.fn(), eject: jest.fn() },
          response: { use: jest.fn(), eject: jest.fn() },
      },
      create: () => {
        return {
          interceptors: {
            request: {eject: jest.fn(), use: jest.fn()},
            response: {eject: jest.fn(), use: jest.fn()},
          },
          get: jest.fn(),
        };
      },
      get: jest.fn(),
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

  // const mockDinosaur = {
  //   id: 1,
  //   name: 'T-Rex',
  //   level: 10,
  //   diet: 'carnivore',
  //   type: 'land',
  //   energy: 100,
  //   max_energy: 150,
  //   food: 50,
  //   max_food: 100,
  //   experience: 500,
  //   hunger: 20,
  //   max_hunger: 100,
  //   epoch: 'Prehistoric_Epoch1',
  //   created_at: '2022-01-01T00:00:00',
  //   last_reborn: '2023-01-01T00:00:00',
  //   karma: 50,
  //   last_update_by_time_service: '2023-01-01T00:00:00',
  //   reborn_amount: 2,
  //   isSleeping: false,
  //   isDead: false,
  //   user_id: 1,
  //   multipliers: {
  //     earn_herbi_food_multiplier: 1.2,
  //     earn_carni_food_multiplier: 1.5,
  //     earn_food_multiplier: 1.0,
  //     earn_energy_multiplier: 1.3,
  //     earn_experience_multiplier: 1.0,
  //     max_energy_multiplier: 1.1,
  //     max_food_multiplier: 1.2,
  //   },
  // };

  // const mockActions = {
  //   availableActions: [
  //     { id: 1, name: 'Feed', description: 'Feed your dinosaur' },
  //     { id: 2, name: 'Play', description: 'Play with your dinosaur' },
  //   ],
  // };

  

  // beforeEach(() => {
  //   mockedAxios.get.mockImplementation(async (url: string) => {
  //   if (url.includes('/user')) return { data: mockUser };
  //   throw new Error(`URL non prise en charge : ${url}`);
  // });
  //   });
  it('return test correct value with axios.get', () => {
    (mockedAxios.get as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({data: mockUser})
    );

  
    render(<MemoryRouter><DashboardPage /></MemoryRouter>);
    expect(axios.get).toHaveBeenCalledTimes(0);
  })

});

// MCOKER LA REPONSE DE LA FONCTION FETCHUSERFROMBACKEND DE AUTHSERVICE.TS