Template.checkoutShipping.helpers
  rates: () ->
    rates = []
    shop = Shops.findOne()
    for carrier,value in shop?.shipping
      for method,index in carrier.methods
        if method?.rate?
          method.rate = "Free" if method.rate is '0'
          rates.push carrier: value, method: index, label:method.label, value:method.rate
          CartWorkflow.shipmentMethod()
        #else #fetch rates
    return rates

   isSelected: (carrier,method)->
    currentShipping = Cart.findOne()?.shipping?.shipmentMethod
    if (currentShipping?.carrier is this.carrier) and (currentShipping?.method is this.method)
      Session.set "shipmentMethod",this
      CartWorkflow.shipmentMethod()
      return "active"

Template.checkoutShipping.events
  'click .list-group-item': (event) ->
    $('.checkout-shipping .active').removeClass('active')
    $(event.currentTarget).addClass('active')
    CartWorkflow.shipmentMethod(@)
    Session.set "shipmentMethod",@
