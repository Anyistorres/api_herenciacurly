const { query } = require("../config/database");

const mapRow = (data) => ({
    id: data.id,                  
    name: data.name,  
    description: data.description,             
    createdAt: data.created_at,  
});

//Registrar una nueva categoría
const registerCategory = async ({name, description}) => {

    const result = await query(
        "INSERT INTO categories (name, description) VALUES ($1, $2) RETURNING *",
        [name, description]
    )

    return mapRow(result.rows[0]);
};


//Listar todas las categorías
const allCategories = async () => {
    const result = await query(
        "SELECT id, name, description, created_at FROM categories"
    );

    return result.rows.map(mapRow);
};

//Actualizar una categoría existente
const updateCategory = async ({id, name, description}) => {
    const result = await query(
        "UPDATE categories SET name = $1, description = $2 WHERE id = $3 RETURNING *",
        [name, description, id]
    );

    return mapRow(result.rows[0]);
};

//Buscar una categoría por su ID
const findCategoryById = async (id) => {
    const result = await query(
        "SELECT id, name, description, created_at FROM categories WHERE id = $1",
        [id]
    );  
    if (result.rowCount === 0) return null;

    return mapRow(result.rows[0]);
};

//Buscar una categoría por su Nombre
const findCategoryByName = async (name) => {
    const result = await query(
        "SELECT id, name, description, created_at FROM categories WHERE name = $1",
        [name]
    ); 
    
    if (result.rowCount === 0) return null;

    return mapRow(result.rows[0]);
};

//

module.exports = {
    registerCategory,
    allCategories,
    updateCategory,
    findCategoryById,
    findCategoryByName,
};


