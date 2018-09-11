import React from "react";
import PropTypes from "prop-types";
import { Query } from "react-apollo";
import { ITEMS_INCREMENT } from "/client/config/defaults";
import { loadMore } from "/imports/plugins/core/graphql/lib/helpers/pagination";
import getCatalogItems from "../queries/getCatalogItems";

export default (Component) => (
  class CatalogItems extends React.Component {
    static propTypes = {
      currencyCode: PropTypes.string,
      shopId: PropTypes.string,
      shouldSkipGraphql: PropTypes.bool, // Whether to skip this HOC's GraphQL query & data
      tagId: PropTypes.string
    };

    render() {
      const { currencyCode = "", shouldSkipGraphql, shopId, tagId } = this.props;

      if (shouldSkipGraphql || !shopId) {
        return (
          <Component {...this.props} />
        );
      }

      const variables = { shopId, currencyCode };

      if (tagId) {
        variables.tagIds = [tagId];
      }

      return (
        <Query query={getCatalogItems} variables={variables}>
          {({ loading, data, fetchMore }) => {
            const { catalogItems = {} } = data;
            const props = {
              ...this.props,
              isLoadingCatalogItems: loading,
              catalogItems: [],
              hasMoreCatalogItems: false
            };

            if (loading === false && catalogItems) {
              props.catalogItems = (catalogItems.edges || []).map((edge) => edge.node.product);

              // Use prices in selected currency if available
              props.catalogItems.forEach((catalogItem) => {
                catalogItem.pricing.forEach((pricing) => {
                  if (pricing.currencyExchangePricing) {
                    catalogItem.pricing = pricing.currencyExchangePricing;
                    console.log("pricing", pricing);
                  }
                });
              });

              const { pageInfo } = catalogItems;
              if (pageInfo) {
                const { hasNextPage } = pageInfo;
                props.hasMoreCatalogItems = hasNextPage;
                props.loadMoreCatalogItems = (callback) => {
                  loadMore({
                    queryName: "catalogItems",
                    fetchMore,
                    pageInfo,
                    limit: ITEMS_INCREMENT
                  }, callback);
                };
              }
            }

            return (
              <Component {...props} />
            );
          }}
        </Query>
      );
    }
  }
);
