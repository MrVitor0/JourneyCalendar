# Journey Calendar

A modern, feature-rich calendar application built with Vue 3, TypeScript, and Tailwind CSS. Create events, track weather forecasts, and organize your schedule with an intuitive interface.

## Quick Start

### Prerequisites

- Node.js 16.x or higher
- npm or yarn

### Installation

```bash
npm install
```

### Development

```bash
npm run serve
```

The application will be available at `http://localhost:8080`

### Build for Production

```bash
npm run build
```

### Testing

```bash
# Run tests
npm run test

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage
```

### Linting

```bash
npm run lint
```

## Features

- **Interactive Calendar**: Month and week views with intuitive navigation
- **Event Management**: Create, edit, and delete events with color coding
- **Weather Integration**: Automatic weather forecasts for event locations using Open-Meteo API
- **City Search**: Smart city autocomplete with timezone support
- **Multiple Calendars**: Organize events across different calendars with visibility controls
- **Responsive Design**: Modern UI with glassmorphism effects and smooth animations
- **State Management**: Centralized state with Pinia
- **Type Safety**: Full TypeScript support

## Tech Stack

- **Vue 3** - Progressive JavaScript framework
- **TypeScript** - Static type checking
- **Pinia** - State management
- **Vue Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client
- **date-fns** - Date manipulation library
- **Lucide Vue Next** - Icon library
- **Vitest** - Unit testing framework

## Project Structure

```
src/
├── api/              # API services and HTTP clients
├── assets/           # Static assets and global styles
├── components/       # Reusable Vue components
│   ├── calendar/     # Calendar-specific components
│   ├── common/       # Shared UI components
│   └── layout/       # Layout components
├── router/           # Vue Router configuration
├── stores/           # Pinia state management
├── types/            # TypeScript type definitions
└── views/            # Page-level components
```

## Architecture Principles

This project follows clean code principles and SOLID design patterns:

- **Component Reusability**: Modular, single-responsibility components
- **Type Safety**: Comprehensive TypeScript interfaces and type definitions
- **State Management**: Centralized state with Pinia stores
- **API Abstraction**: Service layer for external API interactions
- **Separation of Concerns**: Clear boundaries between UI, logic, and data

## API Integration

The application integrates with Open-Meteo API for:

- City geocoding and search
- Weather forecasts based on event location and date

No backend required - fully client-side application.

## License

Open source project available for public use.

## Contributing

Contributions are welcome! Please ensure:

- Code is written in English
- Follow existing code style and conventions
- Include tests for new features
- Update documentation as needed
