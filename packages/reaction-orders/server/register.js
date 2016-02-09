ReactionCore.registerPackage({
  label: "Orders",
  name: "reaction-orders",
  icon: "fa fa-sun-o",
  autoEnable: true,
  settings: {
    name: "Orders"
  },
  registry: [{
    route: "dashboard/orders",
    provides: "dashboard",
    label: "Orders",
    description: "Fulfill your orders",
    icon: "fa fa-sun-o",
    cycle: 1,
    container: "orders",
    template: "orders"
  }, {
    route: "dashboard/orders",
    provides: "shortcut",
    label: "Orders",
    description: "Fulfill your orders",
    icon: "fa fa-sun-o",
    cycle: 1
  }],
  layout: [{
    layout: "coreLayout",
    workflow: "coreOrderWorkflow",
    collection: "Orders",
    theme: "default",
    enabled: true,
    structure: {
      template: "orders",
      layoutHeader: "layoutHeader",
      layoutFooter: "layoutFooter",
      notFound: "productNotFound",
      dashboardHeader: "dashboardHeader",
      dashboardHeaderControls: "orderListFilters",
      dashboardControls: "dashboardControls",
      adminControlsFooter: "adminControlsFooter"
    }
  }, {
    layout: "printLayout",
    workflow: "coreOrderWorkflow",
    structure: {
      layoutHeader: "layoutHeader",
      layoutFooter: "layoutFooter"
    }
  }, {
    layout: "coreLayout",
    workflow: "coreOrderShipmentWorkflow",
    collection: "Orders",
    theme: "default",
    enabled: true
  }, {
    label: "Order Processing",
    status: "created",
    workflow: "coreOrderWorkflow",
    audience: ["dashboard/orders"]
  }, {
    template: "coreOrderProcessing",
    label: "Order Processing",
    status: "processing",
    workflow: "coreOrderWorkflow",
    audience: ["dashboard/orders"]
  }, {
    template: "coreOrderCompleted",
    label: "Order Completed",
    status: "completed",
    workflow: "coreOrderWorkflow",
    audience: ["dashboard/orders"]
  }, { // Standard Order Fulfillment with shipping
    template: "coreOrderShippingSummary",
    label: "Summary",
    workflow: "coreOrderShipmentWorkflow",
    audience: ["dashboard/orders"]
  }, {
    template: "coreOrderShippingInvoice",
    label: "Invoice",
    workflow: "coreOrderShipmentWorkflow",
    audience: ["dashboard/orders"]
  }, {
    template: "coreOrderShippingTracking",
    label: "Shipment Tracking",
    workflow: "coreOrderShipmentWorkflow",
    audience: ["dashboard/orders"]
  }, { // Standard Order Item workflow
    label: "Inventory Adjust",
    workflow: "coreOrderItemWorkflow",
    status: "inventoryAdjusted",
    audience: ["dashboard/orders"]
  }, {
    label: "Item Payment Captured",
    workflow: "coreOrderItemWorkflow",
    status: "captured",
    audience: ["dashboard/orders"]
  }, {
    label: "Item Ship",
    workflow: "coreOrderItemWorkflow",
    status: "shipped",
    audience: ["dashboard/orders"]
  }, {
    label: "Item Delivered",
    workflow: "coreOrderItemWorkflow",
    status: "completed",
    audience: ["dashboard/orders"]
  }]
});
