import { Migrations } from "/imports/plugins/core/versions";
import { Shops } from "/lib/collections";

Migrations.add({
  version: 9,
  up() {
    Shops.find().forEach(
      function(shop) {
        if(!shop.baseUOM) {
          shop.baseUOM = "oz";
        } else {
          shop.baseUOM = shop.baseUOM.toLowerCase();
        }
        shop.unitsOfMeasure = [{
          "uom": "oz",
          "label": "Ounces",
          "default": true
        }, {
          "uom": "lb",
          "label": "Pounds"
        }, {
          "uom": "g",
          "label": "Grams"
        }, {
          "uom": "kg",
          "label": "Kilograms"
        }];

        if (shop.baseUOM === "gr") {
          shop.baseUOM = "g";
        }

        Shops.update({ _id: shop._id }, {
          $set: {
            baseUOM: shop.baseUOM,
            unitsOfMeasure: shop.unitsOfMeasure
          }
        });
      }
    );
  }
});
