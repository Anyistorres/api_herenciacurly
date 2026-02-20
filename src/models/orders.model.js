class Orders {
    constructor({ id, userId, total, status, createdAt }) {
        this.id = id;
        this.userId = userId;
        this.total = total;
        this.status = status;
        this.createdAt = createdAt;     
    }
}

module.exports = Orders;        