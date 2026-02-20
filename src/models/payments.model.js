class Payments {
    constructor({ id, orderId, paymentMethod, paymentStatus, transactionReference, paidAt }) {
        this.id = id;
        this.orderId = orderId;
        this.paymentMethod = paymentMethod;
        this.paymentStatus = paymentStatus;
        this.transactionReference = transactionReference;
        this.paidAt = paidAt;
    }
}

module.exports = Payments;
