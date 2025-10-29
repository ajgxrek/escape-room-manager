const nextJest = require('next/jest')

const createJestConfig = nextJest({
    dir: './',
})


/** @type {import('jest').Config} */
const customJestConfig = {
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
    testEnvironment: 'jest-environment-jsdom',
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/$1',
    },

    transformIgnorePatterns: [
        '/node_modules/(?!(@babel|jest-runtime|next-auth|@auth/core|@nextui-org|@react-aria|@react-stately)/)'
    ],
}


module.exports = createJestConfig(customJestConfig)

