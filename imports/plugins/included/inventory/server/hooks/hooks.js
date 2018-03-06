import { Meteor } from "meteor/meteor";
import { Cart, Products, Orders } from "/lib/collections";
import { Logger, Hooks } from "/server/api";
import { registerInventory } from "../methods/inventory";

/**
* @method
* @method afterAddItemsToCart
* @summary reserves inventory when item is added to cart
* @param {String} cartId - current cartId
* @param {Object} options - product document
* @return {undefined}
*/
Hooks.Events.add("afterAddItemsToCart", (cartId, options) => {
  // Adding a new product or variant to the cart
  Logger.debug("after cart update, call inventory/addReserve");
  // Look up cart to get items added to it
  const { items } = Cart.findOne({ _id: cartId }) || {};
  // Reserve item
  Meteor.call("inventory/addReserve", items.filter((item) => item._id === options.newItemId));
});

/**
* @method
* @method afterModifyQuantityInCart
* @summary reserves inventory when cart quantity is updated
* @param {String} cartId - current cartId
* @param {Object} options - product document
* @return {undefined}
*/
Hooks.Events.add("afterModifyQuantityInCart", (cartId, options) => {
  // Modifying item quantity in cart.
  Logger.debug("after variant increment, call inventory/addReserve");

  // Look up cart to get items that have been added to it
  const { items } = Cart.findOne({ _id: cartId }) || {};

  // Item to increment quantity
  const item = items.filter((i) => (i.product._id === options.productId && i.variants._id === options.variantId));
  Meteor.call("inventory/addReserve", item);
});


/**
* @method
* @method afterRemoveCatalogProduct
* @summary updates product inventory after variant is removed
* @param {String} userId - userId of user making the call
* @param {Object} doc - product document
* @return {undefined}
*/
Hooks.Events.add("afterRemoveCatalogProduct", (userId, doc) => {
  if (doc.type === "variant") {
    const variantItem = {
      productId: doc.ancestors[0],
      variantId: doc._id,
      shopId: doc.shopId
    };
    Logger.debug(`remove inventory variants for variant: ${doc._id
    }, call inventory/remove`);
    Meteor.call("inventory/remove", variantItem);
  }
});

//
// after product update
//
Products.after.update((userId, doc, fieldNames, modifier) => {
  // product update can't affect on inventory, so we don't manage this cases
  // we should keep in mind that returning false within hook prevents other
  // hooks to be run
  if (doc.type !== "variant") return false;

  // check if modifier is set and $pull and $push are undefined. This need
  // because anyway on every create or delete operation we have additionally
  // $set modifier because of auto-updating of `shopId` and `updateAt` schema
  // properties
  if ((modifier.$set || modifier.$inc) && !modifier.$pull && !modifier.$push) {
    if (!modifier.$set) {
      modifier.$set = {};
    }
    modifier.$set.updatedAt = new Date();
    // triggers inventory adjustment
    Meteor.call("inventory/adjust", doc);
  }
});

/**
* @method
* @method afterInsertCatalogProduct
* @summary adds product inventory when new product is created
* @param {String} userId - userId of user making the call
* @param {Object} doc - product document
* @return {undefined}
*/
Hooks.Events.add("afterInsertCatalogProduct", (doc) => {
  if (doc.type !== "variant") {
    return false;
  }
  registerInventory(doc);
});


/**
 * markInventoryShipped
 * @summary check a product and update Inventory collection with inventory documents.
 * @param {Object} product - valid Schemas.Product object
 * @return {Number} - returns the total amount of new inventory created
 */
function markInventoryShipped(doc) {
  const order = Orders.findOne(doc._id);
  const orderItems = order.items;
  const cartItems = [];
  for (const orderItem of orderItems) {
    const cartItem = {
      _id: orderItem.cartItemId || orderItem._id,
      shopId: orderItem.shopId,
      quantity: orderItem.quantity,
      productId: orderItem.productId,
      product: orderItem.product,
      variants: orderItem.variants,
      title: orderItem.title
    };
    cartItems.push(cartItem);
  }
  Meteor.call("inventory/shipped", cartItems);
}

/**
 * markInventorySold
 * @summary check a product and update Inventory collection with inventory documents.
 * @param {Object} doc - valid Schemas.Product object
 * @return {Number} - returns the total amount of new inventory created
 */
function markInventorySold(doc) {
  const orderItems = doc.items;
  const cartItems = [];
  // If a cartItemId exists it's a legacy order and we use that
  for (const orderItem of orderItems) {
    const cartItem = {
      _id: orderItem.cartItemId || orderItem._id,
      shopId: orderItem.shopId,
      quantity: orderItem.quantity,
      productId: orderItem.productId,
      product: orderItem.product,
      variants: orderItem.variants,
      title: orderItem.title
    };
    cartItems.push(cartItem);
  }
  Meteor.call("inventory/sold", cartItems);
}

/**
* @method
* @method afterOrderInsert
* @summary marks inventory as sold when order is created
* @param {Object} order - order document
* @return {Object} order - order document
*/
Hooks.Events.add("afterOrderInsert", (order) => {
  Logger.debug("Inventory module handling Order insert");
  markInventorySold(order);

  return order;
});

/**
* @method
* @method onOrderShipmentShipped
* @summary marks inventory as shipped when order workflow is completed
* @param {Object} doc - order document
* @return {undefined}
*/
Hooks.Events.add("onOrderShipmentShipped", (doc) => {
  Logger.debug("Inventory module handling Order update");
  markInventoryShipped(doc);
});
