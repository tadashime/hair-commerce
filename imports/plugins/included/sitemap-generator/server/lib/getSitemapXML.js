import { Meteor } from "meteor/meteor";
import { Sitemaps } from "../../lib/collections/Sitemaps";

/**
 * @name getSitemapXML
 * @summary Loads and returns the XML for one of a shop's sitemaps
 * @param {String} shopId - _id of shop sitemap belongs to
 * @param {String} handle - Sitemap's handle, as set in Sitemaps collection
 * @returns {String} - XML, with placeholders replaced (BASE_URL, LAST_MOD), or "" if not found
 */
export default function getSitemapXML(shopId, handle) {
  const sitemap = Sitemaps.findOne({
    shopId,
    handle
  });

  if (!sitemap) {
    return "";
  }

  let { xml } = sitemap;

  // Replace BASE_URL with actual URL
  const urlNoTrailingSlash = Meteor.absoluteUrl().slice(0, -1);
  xml = xml.replace(/BASE_URL/g, urlNoTrailingSlash);

  // Replace LAST_MOD with today's date
  const now = new Date();
  const lastMod = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
  xml = xml.replace(/LAST_MOD/g, lastMod);

  return xml;
}
