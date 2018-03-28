/* eslint-disable max-len */
export const typeDefs = `
  # Represents a Reaction shop
  type Shop implements Node {
    # The shop ID
    _id: ID!

    # Returns a list of administrators for this shop, as a Relay-compatible connection.
    # "Administrators" means all linked accounts that have the "admin" role for this shop.
    administrators(after: ConnectionCursor, before: ConnectionCursor, first: ConnectionLimitInt, last: ConnectionLimitInt, sortOrder: SortOrder = asc, sortBy: AccountSortByField = createdAt): AccountConnection

    # Returns a list of groups for this shop, as a Relay-compatible connection.
    groups(after: ConnectionCursor, before: ConnectionCursor, first: ConnectionLimitInt, last: ConnectionLimitInt, sortOrder: SortOrder = asc, sortBy: GroupSortByField = createdAt): GroupConnection

    roles(after: ConnectionCursor, before: ConnectionCursor, first: ConnectionLimitInt, last: ConnectionLimitInt, sortOrder: SortOrder = asc, sortBy: RoleSortByField = createdAt): RoleConnection
    # Returns a list of roles for this shop, as a Relay-compatible connection.
  }

  # Input parameters for the inviteShopMember mutation
  input InviteShopMemberInput {
    # The email address of the person to invite
    email: String!

    # The permission group for this person's new account
    groupId: ID!

    # The invitee's full name
    name: String!

    # The ID of the shop to which you want to invite this person
    shopId: ID!
  }

  # The response from the \`inviteShopMember\` mutation
  type InviteShopMemberPayload {
    # The account that was successfully created or found and updated by inviting this shop member
    account: Account

    # The same string you sent with the mutation params, for matching mutation calls with their responses
    clientMutationId: String
  }

  extend type Mutation {
    # Given a person's email address and name, invite them to create an account for a certain shop,
    # and put them in the provided permission group
    inviteShopMember(input: InviteShopMemberInput!): InviteShopMemberPayload
  }

  extend type Query {
    # Returns a shop by ID
    shop(id: ID!): Shop
  }
`;
