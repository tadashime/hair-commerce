import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import IconButton from "@material-ui/core/IconButton";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import PlusIcon from "mdi-material-ui/Plus";

/**
 * Get url for product, variant or option
 * @param {Object} item Product, variant or option
 * @returns {String} URL
 */
function getURL(item) {
  // Top level product
  if (item.type === "simple") {
    return `/operator/products/${item._id}`;
  }

  // Variant
  if (item.ancestors.length === 1) {
    return `/operator/products/${item.ancestors[0]}/${item._id}`;
  }

  // Option
  return `/operator/products/${item.ancestors[0]}/${item.ancestors[1]}/${item._id}`;
}

/**
 * Product list
 * @param {Object} props Component props
 * @returns {Node} Component representing a list of products, variants, or options
 */
function ProductList({ items, title, onCreate }) {
  if (!Array.isArray(items)) {
    return null;
  }

  return (
    <Card>
      <CardHeader
        action={
          <IconButton onClick={onCreate}>
            <PlusIcon />
          </IconButton>
        }
        title={title}
      />
      <List>
        {items.map((item) => (
          <Link key={item._id} to={getURL(item)}>
            <ListItem button>
              {(Array.isArray(item.media) && item.media.length) &&
                <img
                  alt=""
                  src={item.media[0].url({ store: "thumbnail" })}
                  width={36}
                />
              }
              <ListItemText primary={item.title || item.optionTitle || item.name} />
            </ListItem>
          </Link>
        ))}
      </List>
    </Card>
  );
}

ProductList.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object),
  onCreate: PropTypes.func,
  title: PropTypes.string
};

export default ProductList;
