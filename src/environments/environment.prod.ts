export const environment = {
  production: true,
  staging: false,
  useMockData: true, // Gardé à true puisque vous utilisez uniquement les mocks
  apiUrl: 'http://production.example.com/api',
  // Configurations spécifiques à la production
  debugMode: false,
  mockDataPath: '/assets/mocks'
}; 