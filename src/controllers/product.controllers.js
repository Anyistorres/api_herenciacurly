const productService = require('../services/product.service');

const registerProduct = async (req, res) => {
    try {
        const { name, description, price, stock, is_active, category_id } = req.body;
        const newProduct = await productService.registerProduct({ name, description, price, stock, is_active, category_id });
        return res.status(201).json(newProduct);
    } catch (error) {
        if (error.statusCode) {
            return res.status(error.statusCode).json({ message: error.message });
        }   
        return res.status(500).json({ message: "Error del servidor" });
    }   
};  

const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;      
        const { name, description, price, stock, is_active, category_id } = req.body;   
        const updatedProduct = await productService.updateProduct({ id, name, description, price, stock, is_active, category_id });
        return res.status(200).json(updatedProduct);
    }   
    catch (error) {
        if (error.statusCode) {
            return res.status(error.statusCode).json({ message: error.message });
        }   
        return res.status(500).json({ message: "Error del servidor" });
    }   
};

const findProductById = async (req, res) => {   
    try {
        const { id } = req.params;
        const product = await productService.findProductById(id);       
        if (!product) {
            return res.status(404).json({ message: "Producto no encontrado" }); 
        }
        return res.status(200).json(product);
    }
    catch (error) {
        return res.status(500).json({ message: "Error del servidor" });
    }   
};  

const findProductByName = async (req, res) => {
    try {
        const { name } = req.params;
        const product = await productService.findProductByName(name);   
        if (!product) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }   
        return res.status(200).json(product);   
    } catch (error) {   
        return res.status(500).json({ message: "Error del servidor" });
    }
};  

const findProductsByCategory = async (req, res) => {
    try {
        const { category_id } = req.params;         
        const products = await productService.findProductsByCategory(category_id);
        return res.status(200).json(products);
    }   
    catch (error) {
        return res.status(500).json({ message: "Error del servidor" });
    }
};  

const allProducts = async (req, res) => {
    try {
        const products = await productService.allProducts();
        return res.status(200).json(products);
    }
    catch (error) { 
        return res.status(500).json({ message: "Error del servidor" }); 
    }   
};  
            

module.exports = {
    registerProduct,
    updateProduct,
    findProductById,
    findProductByName,
    findProductsByCategory,
    allProducts
};