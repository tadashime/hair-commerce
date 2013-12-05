# *****************************************************
#  PackageConfigs contains user specific configuration
#  settings, package access rights
# *****************************************************
Meteor.publish "PackageConfigs", ->
  PackageConfigs.find
    shopId: Meteor.app.getCurrentShop(this)._id
  ,
    sort:
      priority: 1



# *****************************************************
# Client access rights for reaction_packages
# *****************************************************
PackageConfigs.allow
  insert: (userId, doc) ->
    doc.shopId = Meteor.app.getCurrentShop()._id
    true

  update: (userId, doc, fields, modifier) ->
    return false  if modifier.$set and modifier.$set.shopId
    true

  remove: (userId, doc) ->
    doc.shopId is Meteor.app.getCurrentShop()._id


#fetch: ['owner']
