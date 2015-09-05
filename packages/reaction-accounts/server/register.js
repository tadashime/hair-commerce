ReactionCore.registerPackage({
  label: 'Accounts',
  name: 'reaction-accounts',
  icon: 'fa fa-sign-in',
  autoEnable: true,
  registry: [
    {
      route: 'accounts',
      provides: 'dashboard',
      label: 'Accounts',
      description: 'Manage how members sign into your shop.',
      icon: 'fa fa-sign-in',
      cycle: 3,
      container: 'accounts'
    },
    {
      label: 'Account Settings',
      route: 'accounts',
      provides: 'settings',
      container: 'accounts',
      template: 'accountsSettings'
    },
    {
      route: "accounts",
      provides: 'shortcut',
      label: 'Accounts',
      icon: 'fa fa-users',
      cycle: 1
    },
  ],
  permissions: [
    {
      label: 'Accounts',
      permission: 'dashboard/accounts',
      group: 'Shop Settings'
    }
  ]
});
