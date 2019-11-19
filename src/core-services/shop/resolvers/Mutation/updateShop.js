import { decodeShopOpaqueId } from "../../xforms/id.js";

/**
 * @name Mutation/updateShop
 * @method
 * @memberof Shop/GraphQL
 * @summary resolver for the updateShop GraphQL mutation
 * @param {Object} _ - unused
 * @param {Object} args.input - an object of all mutation arguments that were sent by the client
 * @param {String} input.description - The shop's description
 * @param {Array} input.addressBook - The shop's physical address
 * @param {Boolean} input.allowGuestCheckout - Allow user to checkout without creating an account
 * @param {Array} input.emails - The shop's primary email address
 * @param {String} input.keywords - The shop's keywords
 * @param {Object} arts.input.name - The shop's name
 * @param {Object} arts.input.shopLogoUrls - An object containing the shop logo urls to update
 * @param {String} input.slug - The shop's slug
 * @param {Object} args.input.storefrontUrls - An object containing storefront url locations
 * @param {Object} context - an object containing the per-request state
 * @returns {Promise<Object>} UpdateShopPayload
 */
export default async function updateShop(_, { input }, context) {
  const {
    clientMutationId = null,
    shopId: opaqueShopId,
    ...passThroughInput
  } = input;
  const shopId = decodeShopOpaqueId(opaqueShopId);

  const updatedShop = await context.mutations.updateShop(context, {
    ...passThroughInput,
    shopId
  });

  return {
    shop: updatedShop,
    clientMutationId
  };
}


