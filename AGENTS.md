# Agent Guidelines

## Project structure
- Written in TypeScript and React using the PatternFly React Seed layout.
- Source lives in `src/`; tests reside next to components using Jest and Testing Library.

## Preferred libraries
- Use existing dependencies from `package.json` (PatternFly React, Jest, Testing Library, ESLint, Prettier, etc.).
- Avoid adding new dependencies unless absolutely necessary and no existing library covers the use case.

## Development workflow
- Install dependencies with `npm install` if needed.
- Start the development server with `npm run start:dev`.
- Build for production using `npm run build`.

## Code quality and formatting
- Lint with `npm run lint`.
- Format with `npm run format`.
- Type-check with `npm run type-check`.

## Testing
- Run unit tests via `npm test`.
- For coverage and CI-style checks use `npm run ci-checks`.

## Pull requests
- Ensure lint, tests, and type checks pass before committing.
- Prefer using built-in PatternFly components and utilities to minimize extra libraries.
