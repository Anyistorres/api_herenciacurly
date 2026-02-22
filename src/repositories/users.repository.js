const { query } = require('../config/database');

const mapRow = (row) => ({
   id: row.id,
   name: row.name,  
   email: row.email,
   phone: row.phone,
   password: row.password_hash,
   role: row.role,
   createdAt: row.created_at,
});

const findByEmail = async (email) => {
    const result = await query(
        "SELECT id, name, email, phone, password_hash, role, created_at FROM users WHERE email = $1",
        [email]
    );
    if (result.rowCount === 0) return null;

    return mapRow(result.rows[0]);
};

const findById = async (id) => {
    const result = await query(
        "SELECT id, name, email, phone, password_hash, role, created_at FROM users WHERE id = $1",
        [id]
    );
    if (result.rowCount === 0) return null;
    return mapRow(result.rows[0]);      
};

const createUser = async ({ name, email, phone, passwordHash, role }) => {
    const result = await query(
        "INSERT INTO users (name, email, phone, password_hash, role) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, email, phone, password_hash, role, created_at",  
        [name, email, phone, passwordHash, role]
    );
    return mapRow(result.rows[0]);
};  

module.exports = {
    findByEmail,
    findById,
    createUser
};
