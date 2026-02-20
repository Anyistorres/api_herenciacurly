class Products {
    constructor({id, name, description, price, stock, isActive, categoryId, createdAt }) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.price = price;
        this.stock = stock;
        this.isActive = isActive;
        this.categoryId = categoryId;
        this.createdAt = createdAt;
    }
}

module.exports = Products;