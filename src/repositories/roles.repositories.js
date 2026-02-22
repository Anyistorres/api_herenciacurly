const { query} = require('../config/database');

const mapRow = (row) => ({
    id: row.id,
    name: row.name,
    created_at: row.created_at,

});

const AllRoles = async () => {
    const result = await query(
        "SELECT id, name, created_at FROM roles"
    );
    return result.rows.map(mapRow);
};

module.exports = {
    findAllRoles
};
