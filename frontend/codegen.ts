import type { CodegenConfig } from '@graphql-codegen/cli';
import dotenv from 'dotenv'
dotenv.config()

const config: CodegenConfig = {
  overwrite: true,
  schema: process.env.NEXT_PUBLIC_BACKEND_URL,
  documents: "src/Graphql/**/*.{ts,tsx}",
  generates: {
    "src/gql/": {
      preset: "client",
      plugins: []
    },
    "./graphql.schema.json": {
      plugins: ["introspection"]
    }
  }
};

export default config;
