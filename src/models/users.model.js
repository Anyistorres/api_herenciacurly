class Users {

    constructor({ id, name, email, phone, password,rol, createdAt }) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.password = password;
        this.rol = rol;
        this.createdAt = createdAt;
    }
}

module.exports = Users;