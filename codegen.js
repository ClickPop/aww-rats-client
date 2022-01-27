const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.join(__dirname, '.env.local') });

let hasuraEndoint = `${process.env.NEXT_PUBLIC_HASURA_BASE_URL}/v1/graphql`;

module.exports = {
  schema: [
    {
      [hasuraEndoint]: {
        headers: {
          'x-hasura-admin-secret': process.env.HASURA_ADMIN_SECRET,
        },
      },
    },
  ],
  overwrite: true,
  generates: {
    './src/schema/generated.ts': {
      documents: ['./src/**/*.ts', './src/**/*.gql'],
      plugins: ['typescript', 'typescript-operations'],
    },
    './src/schema/apollo.ts': {
      documents: ['./src/**/*.gql', '!./src/**/admin/**/*.gql'],
      plugins: [
        {
          add: {
            content: "import * as Types from './generated';",
          },
        },
        {
          'typescript-react-apollo': {
            importOperationTypesFrom: 'Types',
          },
        },
      ],
    },
    './src/schema/requests.ts': {
      add: {
        content: "import * as Types from './generated';",
      },
      documents: ['./src/**/admin/**/*.gql'],
      plugins: [
        'typescript',
        'typescript-operations',
        // {
        //   add: {
        //     content: "import * as Types from './generated';",
        //   },
        // },
        {
          'typescript-graphql-request': {
            importOperationTypesFrom: 'Types',
          },
        },
      ],
    },
  },
};
