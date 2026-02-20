class Cart_items {
    constructor({ id, cartId, productId, quantity }) {
        this.id = id;
        this.cartId = cartId;
        this.productId = productId;
        this.quantity = quantity;
    }   
}

module.exports = Cart_items;