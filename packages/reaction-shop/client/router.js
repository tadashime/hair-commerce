Router.map(function () {
  // home page intro screen for reaction-shop
  this.route('shop', {template: 'shopwelcome'});
  // list page of customer records
  this.route('shop/customers');
  // list page of shop orders
  this.route('shop/orders');
  // list page of products
  this.route('shop/products');
  // edit product page
  this.route('shop/product', {
    path: '/shop/product/:_id',
    data: function () {
      Session.set("currentProductId", this.params._id);
      return { products: Products.findOne({_id: this.params._id}) };
    },
    template: 'productsEdit'
  });
});
