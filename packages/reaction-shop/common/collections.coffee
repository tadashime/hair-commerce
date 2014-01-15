ShopMemberSchema = new SimpleSchema
  userId:
    type: String
  isAdmin:
    type: Boolean
    optional: true
  permissions:
    type: [String]
    optional: true

CustomEmailSettings = new SimpleSchema
  username:
    type: String
    optional: true
  password:
    type: String
    optional: true
  host:
    type: String
    optional: true
  port:
    type: Number
    allowedValues: [25, 587, 465, 475, 2525]
    optional: true

MetafieldSchema = new SimpleSchema
  key:
    type: String
    max: 30
  namespace:
    type: String
    max: 20
    optional: true
  scope:
    type: String
    optional: true
  value:
    type: String
    optional: true
  valueType:
    type: String
    optional: true
  description:
    type: String
    optional: true


VariantMediaSchema = new SimpleSchema
  src:
    type: String
  mimeType:
    type: String
    optional: true
  metafields:
    type: [MetafieldSchema]
    optional: true
  updatedAt:
    type: Date
    optional: true
  createdAt:
    type: Date


ProductVariantSchema = new SimpleSchema
  _id:
    type: String
  index:
    type: String
    optional: true
  barcode:
    label: "Barcode"
    type: String
    optional: true
  compareAtPrice:
    label: "Compare at price"
    type: Number
    optional: true
    decimal: true
    min: 0
  fulfillmentService:
    label: "Fulfillment service"
    type: String
    optional: true
  weight:
    label: "Weight"
    type: Number
    min: 0
  inventoryManagement:
    label: "Inventory policy" # really so
    type: String
    allowedValues: ["manual", "reaction"]
  inventoryPolicy:
    label: "Allow users to purchase this item, even if it is no longer in stock"
    type: String
    allowedValues: ["deny", "continue"]
  inventoryQuantity:
    label: "Quantity"
    type: Number
    min: 0
    optional: true
  price:
    label: "Price"
    type: Number
    decimal: true
    min: 0
  requiresShipping:
    label: "Require a shipping address"
    type: Boolean
    optional: true
  sku:
    label: "SKU"
    type: String
    optional: true
  taxable:
    label: "Charge taxes on this product"
    type: Boolean
    optional: true
  title:
    label: "Title"
    type: String
  metafields:
    type: [MetafieldSchema]
    optional: true
  medias:
    type: [VariantMediaSchema]
    optional: true
  createdAt:
    label: "Created at"
    type: Date
  updatedAt:
    label: "Updated at"
    type: Date


AddressSchema = new SimpleSchema
  _id:
    type: String
    optional: true
  fullName:
    type: String
  address1:
    label: "Address 1"
    type: String
  address2:
    label: "Address 2"
    type: String
    optional: true
  city:
    type: String
  company:
    type: String
    optional: true
  phone:
    type: String
  region:
    label: "State/Province/Region"
    type: String
  postal:
    label: "ZIP/Postal Code"
    type: String
  country:
    type: String
  isCommercial:
    label: "Is this a commercial address?"
    type: Boolean
    optional: true
  isDefault:
    label: "Is this your default address?"
    type: Boolean
    optional: true
  metafields:
    type: [MetafieldSchema]
    optional: true

CountrySchema = new SimpleSchema
  name:
    type: String
  code:
    type: String

TaxSchema = new SimpleSchema
  taxShipping:
    type: String
    optional: true
  taxesIncluded:
    type: Boolean
    optional: true
  countyTaxes:
    type: Boolean
    optional: true
  metafields:
    type: [MetafieldSchema]
    optional: true

@Shops = new Meteor.Collection 'Shops',
  schema:
    _id:
      type: String
      optional: true
    name:
      type: String
    addressBook:
      type: [AddressSchema]
    domains:
      type: [String]
    currency:
      type: String
    email:
      type: String
    moneyFormat:
      type: String
    moneyWithCurrencyFormat:
      type: String
    moneyInEmailsFormat:
      type: String
    moneyWithCurrencyInEmailsFormat:
      type: String
    taxes:
      type: [TaxSchema]
      optional: true
    public:
      type: String
      optional: true
    timezone:
      type: String
    ownerId:
      type: String
    members:
      type: [ShopMemberSchema]
    useCustomEmailSettings:
      type: Boolean
      optional: true
    customEmailSettings:
      type: CustomEmailSettings
    createdAt:
      type: Date
    updatedAt:
      type: Date
      optional: true
  transform: (shop) ->
    _.each shop.members, (member, index) ->
      member.index = index
      member.user = Meteor.users.findOne member.userId
    shop

Shops = @Shops # package exports


@Products = new Meteor.Collection 'Products',
  schema:
    _id:
      type: String
      optional: true
    shopId:
      type: String
    title:
      type: String
    pageTitle:
      type: String
      optional: true
    description:
      type: String
      optional: true
    productType:
      type: String
    vendor:
      type: String
      optional: true
    metafields:
      type: [MetafieldSchema]
      optional: true
    variants:
      type: [ProductVariantSchema]
    tagIds:
      type: [String]
      optional: true
    twitterMsg:
      type: String
      optional: true
      max: 140
    facebookMsg:
      type: String
      optional: true
      max: 255
    instagramMsg:
      type: String
      optional: true
      max: 255
    pinterestMsg:
      type: String
      optional: true
      max: 255
    metaDescription:
      type: String
      optional: true
    handle:
      type: String
    isVisible:
      type: Boolean
    publishedAt:
      type: Date
      optional: true
    publishedScope:
      type: String
      optional: true
    templateSuffix:
      type: String
      optional: true
    createdAt:
      type: Date
    updatedAt:
      type: Date

@Products.before.update (userId, doc, fieldNames, modifier, options) ->
  unless _.indexOf(fieldNames, 'medias') is -1
    addToSet = modifier.$addToSet?.medias
    if addToSet
      createdAt = new Date()
      if addToSet.$each
        _.each addToSet.$each, (image) ->
          image.createdAt = createdAt
      else
        addToSet.createdAt = createdAt

Products = @Products # package exports

@Customers = new Meteor.Collection 'Customers',
  schema:
    shopId:
      type: String
    email:
      type: String
    fullName:
      type: String
    imageUrl:
      type: String

    acceptsMarketing:
      type: Boolean

    ordersCount:
      type: Number
    totalSpent:
      type: Number
      decimal: true
    state:
      type: String

    lastOrderId:
      type: String
      optional: true
    lastOrderName:
      type: String
      optional: true

    note:
      type: String
      optional: true
    tagIds:
      type: [String]
      optional: true

    multipassIdentifier:
      type: String
      optional: true
    verifiedEmail:
      type: Boolean

    metafields:
      type: [MetafieldSchema]
      optional: true

    createdAt:
      type: Date
    updatedAt:
      type: Date

Customers = @Customers # package exports

@Orders = new Meteor.Collection 'Orders',
  schema:
    shopId:
      type: String

Orders = @Orders # package exports

CartItemSchema = new SimpleSchema
  _id:
    type: String
  quantity:
    label: "Quantity"
    type: Number
    min: 0
  variants:
    type: ProductVariantSchema

@Cart = new Meteor.Collection 'Cart',
  schema:
    shopId:
      type: String
    sessionId:
      type: String
    userId:
      type: String
      optional: true
    items:
      type: [CartItemSchema]
      optional: true
    requiresShipping:
      label: "Require a shipping address"
      type: Boolean
      optional: true
    totalPrice:
      label: "Total Price"
      type: Number
      optional: true
      decimal: true
      min: 0
    createdAt:
      type: Date
    updatedAt:
      type: Date

Cart = @Cart # package exports

@Tags = new Meteor.Collection 'Tags',
  schema:
    name:
      type: String
    slug:
      type: String
    position:
      type: Number
      optional: true
    relatedTagIds:
      type: [String]
      optional: true
    isTopLevel:
      type: Boolean
    shopId:
      type: String
    createdAt:
      type: Date
    updatedAt:
      type: Date

Tags = @Tags
