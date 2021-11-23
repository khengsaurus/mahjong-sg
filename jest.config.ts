const config = {
  testMatch: [
    // '**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[jt]s?(x)',
    // '**/__tests__/**useHand_handValue.test.tsx',
    '**/__tests__/**useHand_handValue_chi.test.tsx',
    '**/__tests__/**useHand_handValue_others.test.tsx',
  ],
  clearMocks: true,
  collectCoverage: false,
  coverageDirectory: 'coverage',
  moduleDirectories: ['node_modules', 'src'],
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx'],
  moduleNameMapper: {
    '\\.(csslessscss)$': '<rootDir>/__mocks__/styleMock.js'
  },
  setupFiles: ['<rootDir>/jest.init.js'],
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setupTests.js'],
  testPathIgnorePatterns: ['node_modules'],
  transform: {
    "^.+\\.tsx?$": "ts-jest",
    '^.+\\.(ts|tsx)$': 'babel-jest',
    '^.+\\.(js|jsx|mjs)': 'babel-jest',
    '^.+\\.(jpg|jpeg|png|gif|eot|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga|)': '<rootDir>/__mocks__/imageMock.js',
    '^.+\\.(css|less|scss)': '<rootDir>/__mocks__/styleMock.js'
  }
};

export default config