import { Meteor } from "meteor/meteor";
import { check, Match } from "meteor/check";
import { Roles } from "meteor/alanning:roles";
import { Counts } from "meteor/tmeasday:publish-counts";
import { Orders } from "/lib/collections";
import { Reaction } from "/server/api";

const OrderHelper =  {
  makeQuery(filter, shopId = Reaction.getShopId()) {
    let query = {};

    switch (filter) {
      // New orders
      case "new":
        query = {
          "shopId": shopId,
          "workflow.status": "new"
        };
        break;

      // Orders that have yet to be captured & shipped
      case "processing":
        query = {
          "shopId": shopId,
          "workflow.status": "coreOrderWorkflow/processing"
        };
        break;

      // Orders that have been shipped, based on if the items have been shipped
      case "shipped":
        query = {
          "shopId": shopId,
          "items.workflow.status": "coreOrderItemWorkflow/shipped"
        };
        break;

      // Orders that are complete, including all items with complete status
      case "completed":
        query = {
          "shopId": shopId,
          "workflow.status": {
            $in: ["coreOrderWorkflow/completed", "coreOrderWorkflow/canceled"]
          },
          "items.workflow.status": {
            $in: ["coreOrderItemWorkflow/completed", "coreOrderItemWorkflow/canceled"]
          }
        };
        break;

      // Orders that have been captured, but not yet shipped
      case "captured":
        query = {
          "shopId": shopId,
          "billing.paymentMethod.status": "completed",
          "shipping.shipped": false
        };
        break;

      case "canceled":
        query = {
          "shopId": shopId,
          "workflow.status": "canceled"
        };
        break;

      // Orders that have been refunded partially or fully
      case "refunded":
        query = {
          "shopId": shopId,
          "billing.paymentMethod.status": "captured",
          "shipping.shipped": true
        };
        break;
      default:
    }

    return query;
  }
};

/**
 * orders
 */

Meteor.publish("Orders", function () {
  if (this.userId === null) {
    return this.ready();
  }
  const shopId = Reaction.getShopId();
  if (!shopId) {
    return this.ready();
  }
  if (Roles.userIsInRole(this.userId, ["admin", "owner", "orders"], shopId)) {
    return Orders.find({
      shopId: shopId
    });
  }
  return Orders.find({
    shopId: shopId,
    userId: this.userId
  });
});

/**
 * paginated orders
 */

Meteor.publish("PaginatedOrders", function (filter, limit) {
  check(filter, Match.OptionalOrNull(String));
  check(limit, Number);

  if (this.userId === null) {
    return this.ready();
  }
  const shopId = Reaction.getShopId(this.userId);
  if (!shopId) {
    return this.ready();
  }
  if (Roles.userIsInRole(this.userId, ["admin", "owner", "orders"], shopId)) {
    Counts.publish(this, "newOrder-count", Orders.find(OrderHelper.makeQuery("new", shopId)), { noReady: true });
    Counts.publish(this, "processingOrder-count", Orders.find(OrderHelper.makeQuery("processing", shopId)), { noReady: true });
    Counts.publish(this, "completedOrder-count", Orders.find(OrderHelper.makeQuery("completed", shopId)), { noReady: true });
    return Orders.find(OrderHelper.makeQuery(filter, shopId), { limit: limit });
  }
  return Orders.find({
    shopId: shopId,
    userId: this.userId
  });
});

/**
 * account orders
 */
Meteor.publish("AccountOrders", function (userId, currentShopId) {
  check(userId, Match.OptionalOrNull(String));
  check(currentShopId, Match.OptionalOrNull(String));
  if (this.userId === null) {
    return this.ready();
  }
  if (typeof userId === "string" && this.userId !== userId) {
    return this.ready();
  }
  const shopId = currentShopId || Reaction.getShopId();
  if (!shopId) {
    return this.ready();
  }
  return Orders.find({
    shopId: shopId,
    userId: this.userId
  });
});

/**
 * completed cart order
 */
Meteor.publish("CompletedCartOrder", function (userId, cartId) {
  check(userId, Match.OneOf(String, null));
  check(cartId, String);
  if (this.userId === null) {
    return this.ready();
  }
  if (typeof userId === "string" && userId !== this.userId) {
    return this.ready();
  }

  return Orders.find({
    cartId: cartId,
    userId: userId
  });
});
