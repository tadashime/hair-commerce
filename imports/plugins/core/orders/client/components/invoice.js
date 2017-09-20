import React, { Component } from "react";
import PropTypes from "prop-types";
import moment from "moment";
import { formatPriceString } from "/client/api";
import { Components, registerComponent } from "@reactioncommerce/reaction-components";
import LineItems from "./lineItems";
import InvoiceActions from "./invoiceActions";

/**
  * @summary React component for displaying the `invoice` section on the orders sideview
  * @param {Object} props - React PropTypes
  * @property {Object} invoice - An object representing an invoice
  * @property {Object} order - An object representing an order
  * @property {Bool} discounts - A boolean indicating whether discounts are enabled
  * @property {Array} refunds - An array/list of refunds
  * @property {Bool} paymentCaptured - A boolean indicating whether payment has been captured
  * @property {Bool} canMakeAdjustments - A boolean indicating whether adjustments could be made on total payment
  * @property {Bool} hasRefundingEnabled - A boolean indicating whether payment supports refunds
  * @property {Bool} isFetching - A boolean indicating whether refund list is being loaded
  * @return {Node} React node containing component for displaying the `invoice` section on the orders sideview
  */
class Invoice extends Component {
  static propTypes = {
    canMakeAdjustments: PropTypes.bool,
    discounts: PropTypes.bool,
    hasRefundingEnabled: PropTypes.bool,
    invoice: PropTypes.object,
    isFetching: PropTypes.bool,
    order: PropTypes.object,
    paymentCaptured: PropTypes.bool,
    refunds: PropTypes.array
  }

  state = {
    isOpen: false
  }

  /**
    * @summary Formats dates
    * @param {Number} context - the date to be formatted
    * @param {String} block - the preferred format
    * @returns {String} formatted date
    */
  formatDate(context, block) {
    const dateFormat = block || "MMM DD, YYYY hh:mm:ss A";
    return moment(context).format(dateFormat);
  }

  /**
    * @summary Handle clicking the add discount link
    * @param {Event} event - the event that fired
    * @returns {null} null
    */
  handleClick = (event) => {
    event.preventDefault();
    this.setState({
      isOpen: true
    });
  }

  /**
    * @summary Displays the discount form
    * @returns {null} null
    */
  renderDiscountForm() {
    return (
      <div>
        {this.state.isOpen &&
          <div>
            <hr/>
            <Components.DiscountList
              id={this.props.order._id}
              collection="Orders"
              validatedInput={true}
            />
            <hr/>
          </div>
        }
      </div>
    );
  }

  /**
    * @summary Displays the refund information after the order payment breakdown on the invoice
    * @returns {null} null
    */
  renderRefundsInfo() {
    const { hasRefundingEnabled, isFetching, refunds } = this.props;
    return (
      <div>
        {(hasRefundingEnabled && isFetching) &&
          <div className="form-group order-summary-form-group">
            <strong>Loading Refunds</strong>
            <div className="invoice-details">
              <i className="fa fa-spinner fa-spin" />
            </div>
          </div>
        }

        {refunds && refunds.map((refund) => (
          <div className="order-summary-form-group text-danger" key={refund.created} style={{ marginBottom: 15 }}>
            <strong>Refunded on: {this.formatDate(refund.created, "MM/D/YYYY")}</strong>
            <div className="invoice-details"><strong>{formatPriceString(refund.amount)}</strong></div>
          </div>
        ))}
      </div>
    );
  }

  /**
    * @summary Displays the total payment form
    * @returns {null} null
    */
  renderTotal() {
    return (
      <div className="order-summary-form-group">
        <hr/>
        <strong>TOTAL</strong>
        <div className="invoice-details">
          <strong>{formatPriceString(this.props.invoice.total)}</strong>
        </div>
      </div>
    );
  }

  /**
    * @summary Displays either refunds info or the total payment form
    * @returns {null} null
    */
  renderConditionalDisplay() {
    const { canMakeAdjustments, paymentCaptured } = this.props;
    return (
      <div>
        {canMakeAdjustments ?
          <div> {this.renderTotal()} </div> :
          <span>
            {paymentCaptured ?
              <div>
                {this.renderRefundsInfo()}
              </div>
              :
              <div> {this.renderTotal()} </div>
            }
          </span>
        }
      </div>
    );
  }

  /**
    * @summary Displays the invoice form with broken down payment info
    * @returns {null} null
    */
  renderInvoice() {
    const { invoice, discounts } = this.props;

    return (
      <div>
        <div className="order-summary-form-group">
          <strong>Quantity Total</strong>
          <div className="invoice-details">
            {invoice.totalItems}
          </div>
        </div>

        <div className="order-summary-form-group">
          <strong><Components.Translation defaultValue="Subtotal" i18nKey="cartSubTotals.subtotal"/></strong>
          <div className="invoice-details">
            {formatPriceString(invoice.subtotal)}
          </div>
        </div>

        <div className="order-summary-form-group">
          <strong><Components.Translation defaultValue="Shipping" i18nKey="cartSubTotals.shipping"/></strong>
          <div className="invoice-details">
            {formatPriceString(invoice.shipping)}
          </div>
        </div>

        <div className="order-summary-form-group">
          <strong><Components.Translation defaultValue="Tax" i18nKey="cartSubTotals.tax"/></strong>
          <div className="invoice-details">
            {formatPriceString(invoice.taxes)}
          </div>
        </div>

        {discounts &&
          <div>
            <div className="order-summary-form-group">
              <strong><Components.Translation defaultValue="Discount" i18nKey="cartSubTotals.discount"/></strong>
              <div className="invoice-details">
                <i className="fa fa-tag fa-lg" style={{ marginRight: 2 }}/>
                <a className="btn-link" onClick={this.handleClick}>Add Discount</a>
              </div>
            </div>
            {this.renderDiscountForm()}
          </div>
        }
        {this.renderConditionalDisplay()}
      </div>
    );
  }

  render() {
    return (
      <Components.CardGroup>
        <Components.Card
          expanded={true}
        >
          <Components.CardHeader
            actAsExpander={false}
            i18nKeyTitle="admin.orderWorkflow.invoice.cardTitle"
            title="Invoice"
          />
          <Components.CardBody expandable={false}>
            <LineItems {...this.props} />

            <div className="invoice-container">
              {this.renderInvoice()}
            </div>

            <InvoiceActions {...this.props}/>
          </Components.CardBody>
        </Components.Card>
      </Components.CardGroup>
    );
  }
}

registerComponent("Invoice", Invoice);

export default Invoice;
