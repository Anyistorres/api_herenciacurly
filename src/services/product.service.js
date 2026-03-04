const Product = require ('../models/product.model');
const productRepository = require('../repositories/product.repository');


//Registrar un nuevo producto

const registerProduct = async ({name, description, price, stock, is_active, category_id}) => {
    
    const existing = await productRepository.findProductByName(name);       
    if (existing.length > 0) { 
        const error = new Error("El producto ya existe");
        error.statusCode = 409; // Conflict: El recurso ya existe
        throw error;
    }   
    const newProduct = await productRepository.crateProduct({name, description, price, stock, is_active, category_id});
    return new Product(newProduct);
};

//actualizar un producto existente

const updateProduct = async ({id, name, description, price, stock, is_active, category_id}) => {
    
    const existing = await productRepository.findProductById(id);   
    if (!existing) {
        const error = new Error("El producto no existe");
        error.statusCode = 404; // Not Found: El recurso no existe
        throw error;
    }
    const updatedProduct = await productRepository.updateProduct({id, name, description, price, stock, is_active, category_id});
    return new Product(updatedProduct);
};      
//obtener un producto por id

const findProductById = async (id) => {
    const product = await productRepository.findProductById(id);
    if (!product) return null;
    return new Product(product);
};  

//obtener un producto por nombre

const findProductByName = async (name) => {
    const product = await productRepository.findProductByName(name);
    if (!product) return null;
    return new Product(product);
};

//obtener productos por categoria

const findProductsByCategory = async (category_id) => {   
    const products = await productRepository.findProductsByCategoryId(category_id);
    return products.map(product => new Product(product));
};  

//listar todos los productos

const allProducts = async () => {
    const products = await productRepository.allProducts();
    return products.map(product => new Product(product));
};

module.exports = {
    registerProduct,
    updateProduct,
    findProductById,
    findProductByName,
    findProductsByCategory,
    allProducts
};  
