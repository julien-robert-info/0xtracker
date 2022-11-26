const nextJest = require('next/jest')

const createJestConfig = nextJest({
    dir: './',
})

const customJestConfig = {
    setupFiles: ["<rootDir>/.env.test"],
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
    moduleDirectories: ['node_modules', '<rootDir>/src'],
    testEnvironment: 'jest-environment-jsdom',
    moduleNameMapper: {
        '^d3$': '<rootDir>/node_modules/d3/dist/d3.min.js',
    }
}

module.exports = createJestConfig(customJestConfig)