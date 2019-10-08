import { decodeCartOpaqueId } from "@reactioncommerce/reaction-graphql-xforms/cart";
import { decodePaymentOpaqueId } from "@reactioncommerce/reaction-graphql-xforms/payment";
import { decodeShopOpaqueId } from "@reactioncommerce/reaction-graphql-xforms/shop";

/**
 * @name Mutation/removeDiscountCodeFromCart
 * @method
 * @memberof Fulfillment/GraphQL
 * @summary resolver for the removeDiscountCodeFromCart GraphQL mutation
 * @param {Object} parentResult - unused
 * @param {Object} args.input - an object of all mutation arguments that were sent by the client
 * @param {Object} args.input.cartId - Cart to remove discount from
 * @param {Object} args.input.discountCodeId - Discount code Id to remove from cart
 * @param {String} args.input.shopId - Shop cart belongs to
 * @param {String} [args.input.token] - Cart token, if anonymous
 * @param {String} [args.input.clientMutationId] - An optional string identifying the mutation call
 * @param {Object} context - an object containing the per-request state
 * @returns {Promise<Object>} removeDiscountCodeFromCartPayload
 */
export default async function removeDiscountCodeFromCart(parentResult, { input }, context) {
  const {
    clientMutationId = null,
    cartId,
    discountCodeId,
    shopId,
    token
  } = input;

  const updatedCartWithRemovedDiscountCode = await context.mutations.removeDiscountCodeFromCart(context, {
    cartId: decodeCartOpaqueId(cartId),
    discountCodeId: decodePaymentOpaqueId(discountCodeId),
    shopId: decodeShopOpaqueId(shopId),
    token
  });

  return {
    clientMutationId,
    cart: updatedCartWithRemovedDiscountCode
  };
}
