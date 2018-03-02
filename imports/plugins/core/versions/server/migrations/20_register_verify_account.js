import { Migrations } from "meteor/percolate:migrations";
import { Packages } from "/lib/collections";


// Migration file created for removing the admin role from shop manager group, and users in the group
Migrations.add({
  version: 20,
  up() {
    const pkg = Packages.findOne({ name: "reaction-accounts" });
    for (const route of pkg.registry) {
      if (route.route === "/account/profile/verify:email?") {
        route.route = "/account/profile/verify";
        route.template = "VerifyAccount";
        Packages.update(
          { _id: pkg._id },
          { $set: { registry: pkg.registry } }
        );
        break;
      }
    }
  },
  down() {
    const pkg = Packages.findOne({ name: "reaction-accounts" });
    for (const route of pkg.registry) {
      if (route.route === "/account/profile/verify") {
        route.route = "/account/profile/verify:email?";
        route.template = "verifyAccount";
        Packages.update(
          { _id: pkg._id },
          { $set: { registry: pkg.registry } }
        );
        break;
      }
    }
  }
});
