class Users {

    constructor({ id, name, email, phone, password,role, createdAt }) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.password = password;
        this.role = role;
        this.createdAt = createdAt;
    }
}

module.exports = Users;