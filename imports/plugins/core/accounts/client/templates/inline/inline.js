import { Template } from "meteor/templating";
import { Components } from "@reactioncommerce/reaction-components";

/**
 * Inline login form for instance where guest login is needed.
 */

Template.loginInline.helpers({
  component() {
    return {
      component: Components.LoginInline
    };
  }
});
