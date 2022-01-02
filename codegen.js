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
  documents: ['./src/**/*.ts', './src/**/*.gql'],
  overwrite: true,
  generates: {
    './src/schema/generated.ts': {
      plugins: [
        'typescript',
        'typescript-operations',
        'typescript-react-apollo',
      ],
    },
    './src/schema/graphql.schema.json': {
      plugins: ['introspection'],
    },
  },
};
