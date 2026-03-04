
const {query} = require("../config/database");


const mapRow = (Row) => ({
    id: Row.id,
    name: Row.name,    
    description: Row.description,
    price: Row.price,
    stock: Row.stock,
    is_active: Row.is_active,
    category_id: Row.category_id,
    created_at: Row.created_at,
    updated_at: Row.updated_at,
});


//Registrar un nuevo producto

const crateProduct = async ({name, description, price, stock, is_active, category_id}) => {
    
    const result = await query(
        "INSERT INTO products (name, description, price, stock, is_active, category_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, name, description, price, stock, is_active, category_id, created_at, updated_at",
        [name, description, price, stock, is_active, category_id]
    );
    return mapRow(result.rows[0]);
};  

//actualizar un producto

const updateProduct = async ({name, description, price, stock, is_active, category_id}) => {
    
    const result = await query(
        "UPDATE products SET name = $1, description = $2, price = $3, stock = $4, is_active = $5, category_id = $6, updated_at = NOW() WHERE id = $7 RETURNING id, name, description, price, stock, is_active, category_id, created_at, updated_at",
        [name, description, price, stock, is_active, category_id]
    )

    return mapRow(result.rows[0]);

};
//obtener un producto por id

const findProductById = async (id) => {
    const result = await query(
        "SELECT id, name, description, price, stock, is_active, category_id, created_at, updated_at FROM products WHERE id = $1",
        [id]
    );
    return mapRow(result.rows[0]);
};

//obtener un producto por nombre

const findProductByName = async (name) => {
    const result = await query(
        "SELECT id, name, description, price, stock, is_active, category_id, created_at, updated_at FROM products WHERE name = $1",
        [name]
    );
    return result.rows.map(mapRow);
};

//obtener productos por categoria

const findProductsByCategoryId = async (category_id) => {

    const result = await query(
        "SELECT id, name, description, price, stock, is_active, category_id, created_at, updated_at FROM products WHERE category_id = $1",          
        [category_id]
    );

    return result.rows.map(mapRow);
};
//obtener todos los productos   

const allProducts = async () => {

    const result = await query(
        "SELECT id, name, description, price, stock, is_active, category_id, created_at, updated_at FROM products"
    );

    return result.rows.map(mapRow);
};

module.exports = {
    crateProduct,
    updateProduct,
    findProductById,
    findProductByName,
    findProductsByCategoryId,
    allProducts
};
 


