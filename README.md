# Aww, Rats! web-client and smart-contract mono repo

This is a mono repo for us to house all of our project in one places and make it easier to manage.

## Setting up the project

### Prerequisites

- [Node](https://nodejs.org/en/)
- [PNPM](https://pnpm.io/)
- Env variables

### Installation

1. Make sure you have a file called `.env.local` in each folder under the `/apps` directory.
2. Run `pnpm i` to install the dependancies.
3. Run `pnpm dev` to start the dev server.
4. Check the console to see which port each app is running on. By default it should be:
   1. Aww Rats: http://localhost:3000
   1. Backtalk: http://localhost:3001
