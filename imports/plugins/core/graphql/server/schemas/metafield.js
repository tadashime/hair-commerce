export const typeDefs = `
  # User defined attributes. You can include only \`key\` and use these like tags,
  # or also include a \`value\`.
  input MetafieldInput {
    description: String
    key: String!
    namespace: String
    scope: String
    value: String
    valueType: String
  }

  # User defined attributes
  type Metafield {
    description: String
    key: String
    namespace: String
    scope: String
    value: String
    valueType: String
  }
`;
