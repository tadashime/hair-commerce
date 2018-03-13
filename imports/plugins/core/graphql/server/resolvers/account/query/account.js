import { transformIdFromBase64 } from "@reactioncommerce/reaction-graphql-utils";
import { userAccountQuery } from "/imports/plugins/core/accounts/server/methods/userAccountQuery";

/**
 * @name account
 * @method
 * @summary query the Accounts collection and return user account data
 * @param {Object} _ - an object containing the result returned from the resolver
 * @param {Object} args - an object of arguments to pass to the function
 * @param {String} args.id - id of user to query
 * @param {Object} context - an object containing the per-request state
 * @return {Object} user account object
 */
export default function account(_, { id }, context) {
  // Trasform ID from base64
  // Returns an object. Use `.id` to get ID
  const idFromBase64 = transformIdFromBase64(id);

  // Pass decoded id (idFromBase64.id) and context into userAccountQuery function
  const userAccount = userAccountQuery(context, idFromBase64.id);

  return userAccount;
}
