import { LightningElement, track } from 'lwc';
import getOrder from '@salesforce/apex/OrderController.getOrder';

export default class EditOrder extends LightningElement {
    @track isModalOpen = false;
    @track order;
    recordId;

    connectedCallback() {
        const pathParts = window.location.pathname.split('/');
        this.recordId = pathParts[pathParts.length - 1];
        console.log('RecordId:', this.recordId);

        this.fetchOrder();
    }

    fetchOrder() {
        getOrder({ orderId: this.recordId })
            .then(result => {
                if (result) {
                    this.order = JSON.parse(result);
                    console.log('Full Order object:', this.order);
                    console.log('Full Order result:', result);
                } else {
                    console.warn('No order found or no access' + result );
                }
            })
            .catch(error => {
                console.error('Error fetching order:', error);
            });
    }

    // Expose commonly-used fields to the template
    get orderNumber() {
        return this.order ? this.order.OrderNumber : null;
    }

    get status() {
        return this.order ? this.order.Status : null;
    }

    get effectiveDate() {
        if (!this.order || !this.order.EffectiveDate) return null;
        try {
            return new Date(this.order.EffectiveDate).toLocaleDateString();
        } catch (e) {
            return this.order.EffectiveDate;
        }
    }

    get accountId() {
        return this.order ? this.order.AccountId : null;
    }

    get totalAmount() {
        if (!this.order || this.order.TotalAmount == null) return null;
        const currency = this.order.CurrencyIsoCode || 'USD';
        try {
            return new Intl.NumberFormat(undefined, { style: 'currency', currency }).format(this.order.TotalAmount);
        } catch (e) {
            return this.order.TotalAmount;
        }
    }

    handleEditOrder() {
        this.isModalOpen = true;
    }

    closeModal() {
        this.isModalOpen = false;
    }
}
