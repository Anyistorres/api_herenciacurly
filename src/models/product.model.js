class Product {

    constructor({id, name, description, price, stock, is_active, category_id, create_ad, update_at}) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.price = price;
        this.stock = stock;
        this.is_active = is_active;
        this.category_id = category_id;
        this.create_ad = create_ad;
        this.update_at = update_at;

    }
}

module.exports = Product;


