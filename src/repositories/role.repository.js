const { query } = require("../config/database");

const mapRow = (row) => ({
    id: row.id,                     // ID del rol 
    name: row.name,                 // Nombre del rol
    createdAt: row.created_at,      // Fecha de creación (conv. de snake_case)
});

const allRoles = async () => {
    const result = await query(
        "SELECT id, name, created_at FROM roles"
    );

    return result.rows.map(mapRow);
};

module.exports = {
    allRoles,
};
