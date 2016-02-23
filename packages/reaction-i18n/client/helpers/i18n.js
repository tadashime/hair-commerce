//
// Reaction i18n Translations, RTL and Currency Exchange Support
//

/**
 * getLabelsFor
 * get Labels for simple.schema keys
 * @param  {Object} schema - schema
 * @param  {String} name - name
 * @return {Object} return schema label object
 */
function getLabelsFor(schema, name) {
  let labels = {};
  // loop through all the rendered form fields and generate i18n keys
  for (let fieldName of schema._schemaKeys) {
    let i18nKey = name.charAt(0).toLowerCase() + name.slice(1) + "." +
      fieldName
      .split(".$").join("");
    // translate autoform label
    let translation = i18next.t(i18nKey);
    if (new RegExp("string").test(translation) !== true && translation !==
      i18nKey) {
      if (translation) labels[fieldName] = translation;
    }
  }
  return labels;
}

/**
 * getMessagesFor
 * get i18n messages for autoform messages
 * currently using a globalMessage namespace only*
 * (1) Use schema-specific message for specific key
 * (2) Use schema-specific message for generic key
 * (3) Use schema-specific message for type
 * @todo implement messaging hierarchy from simple-schema
 * @return {Object} returns i18n translated message for schema labels
 */
function getMessagesFor() {
  let messages = {};
  for (let message in SimpleSchema._globalMessages) {
    if ({}.hasOwnProperty.call(SimpleSchema._globalMessages, message)) {
      let i18nKey = `globalMessages.${message}`;
      let translation = i18next.t(i18nKey);
      if (new RegExp("string").test(translation) !== true && translation !==
        i18nKey) {
        messages[message] = translation;
      }
    }
  }
  return messages;
}

/**
 *  set language and autorun on change of language
 *  initialize i18n and load data resources for the current language and fallback "EN"
 *
 */
this.localeDep = new Tracker.Dependency();
Meteor.startup(function () {
  if (ReactionCore.Subscriptions.Shops.ready()) {
    const shopLanguage = ReactionCore.Collections.Shops.findOne(ReactionCore.getShopId()).language;
    const defaultLanguage = shopLanguage;
    // TODO: i18nextBrowserLanguageDetector
    // const defaultLanguage = lng.detect() || shopLanguage;

    // set default session language
    Session.setDefault("language", defaultLanguage);

    // every package gets a namespace, fetch them
    const packageNamespaces = [];
    const packages = ReactionCore.Collections.Packages.find({}, {
      fields: {
        name: 1
      }
    }).fetch();
    for (const pkg of packages) {
      packageNamespaces.push(pkg.name);
    }

    // use i18n detected language to getLocale info
    Meteor.call("shop/getLocale", function (error, result) {
      if (result) {
        ReactionCore.Locale = result;
        ReactionCore.Locale.language = Session.get("language");
        moment.locale(ReactionCore.Locale.language);
        localeDep.changed();
      }
    });

    // use tracker autorun to detect language changes
    Tracker.autorun(function () {
      let userLanguage = Session.get("language");
      return Meteor.subscribe("Translations", userLanguage, () => {
        // fetch reaction translations
        let translations = ReactionCore.Collections.Translations
          .find({}, {
            fields: {
              _id: 0
            }
          }).fetch();
        // map reduce translations into i18next formatting
        const resources = translations.reduce(function (x, y) {
          x[y.i18n] = y.translation;
          return x;
        }, {});
        //
        // initialize i18next
        //
        i18next
          .use(i18nextBrowserLanguageDetector)
          .use(i18nextLocalStorageCache)
          .use(i18nextSprintfPostProcessor)
          .use(i18nextJquery)
          .init({
            debug: false,
            ns: packageNamespaces, // translation namespace for every package
            defaultNS: "core", // reaction "core" is the default namespace
            lng: Session.get("language"), // user session language
            fallbackLng: shopLanguage, // Shop language
            resources: resources
              // saveMissing: true,
              // missingKeyHandler: function (lng, ns, key, fallbackValue) {
              //   Meteor.call("i18n/addTranslation", lng, ns, key, fallbackValue);
              // }
          }, (err, t) => {
            // someday this should work
            // see: https://github.com/aldeed/meteor-simple-schema/issues/494
            for (let schema in ReactionCore.Schemas) {
              if ({}.hasOwnProperty.call(ReactionCore.Schemas, schema)) {
                let ss = ReactionCore.Schemas[schema];
                ss.labels(getLabelsFor(ss, schema));
                ss.messages(getMessagesFor(ss, schema));
              }
            }
            // global first time init event finds and replaces
            // data-i18n attributes in html/template source.
            $elements = $("[data-i18n]").localize();

            // apply language direction to html
            if (t("languageDirection") === "rtl") {
              return $("html").addClass("rtl");
            }
            return $("html").removeClass("rtl");
          });
      });
    });
  } // end subscribe check

  // global onRendered event finds and replaces
  // data-i18n attributes in html/template source.
  // uses methods from i18nextJquery
  Template.onRendered(function () {
    this.autorun((function () {
      return function () {
        $elements = $("[data-i18n]").localize();
      };
    })(this));
  });
}); // end tracker

//
// init i18nextJquery
//
i18nextJquery.init(i18next, $, {
  tName: "t", // --> appends $.t = i18next.t
  i18nName: "i18n", // --> appends $.i18n = i18next
  handleName: "localize", // --> appends $(selector).localize(opts);
  selectorAttr: "data-i18n", // selector for translating elements
  targetAttr: "data-i18n-target", // element attribute to grab target element to translate (if diffrent then itself)
  parseDefaultValueFromContent: true // parses default values from content ele.val or ele.text
});
