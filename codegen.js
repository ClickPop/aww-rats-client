const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.join(__dirname, '.env.local') });

let hasuraEndpoint = `${process.env.NEXT_PUBLIC_HASURA_BASE_URL}/v1/graphql`;
let backtalkEndpoint = `${process.env.NEXT_PUBLIC_BACKTALK_HASURA_BASE_URL}/v1/graphql`;

module.exports = {
  schema: [
    {
      [hasuraEndpoint]: {
        headers: {
          'x-hasura-admin-secret': process.env.HASURA_ADMIN_SECRET,
        },
      },
      [backtalkEndpoint]: {
        headers: {
          'x-hasura-admin-secret': process.env.BACKTALK_HASURA_ADMIN_SECRET,
        },
      },
    },
  ],
  overwrite: true,
  generates: {
    './src/schema/generated.ts': {
      documents: ['./src/**/*.ts', './src/**/*.gql'],
      plugins: [
        {
          typescript: {
            skipTypename: true,
          },
        },
        {
          'typescript-operations': {
            skipTypename: true,
          },
        },
        {
          'typescript-react-apollo': {
            skipTypename: true,
          },
        },
      ],
    },
  },
};
