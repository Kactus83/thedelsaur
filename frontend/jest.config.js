module.exports = {
  preset: 'ts-jest',  // Utilise ts-jest pour transformer les fichiers TypeScript
  testEnvironment: 'node',
  transformIgnorePatterns: [
    "/node_modules/(?!axios)/"
  ],
};

