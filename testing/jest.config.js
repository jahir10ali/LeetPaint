module.exports = {
    testEnvironment: 'jsdom',
    moduleFileExtensions: ['js', 'json', 'jsx', 'node'],
    testPathIgnorePatterns: ['/node_modules/', '/dist/'],
    transform: {
        '^.+\\.jsx?$': 'babel-jest',
    },
    moduleDirectories: ['node_modules', 'js'],
    setupFiles: ['<rootDir>/jest.setup.js'],
};
