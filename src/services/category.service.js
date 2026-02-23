const Category = require('../models/category.model');

const categoryRepository = require('../repositories/category.repository');

// Descripción: Servicio para manejar la lógica de negocio relacionada con categorías

const registerCategory = async ({name, description}) => {
    
    const existing = await categoryRepository.findCategoryByName(name);
    if (existing) {
        const error = new Error("La categoría ya existe");
        error.statusCode = 409; // Conflict: El recurso ya existe
        throw error;
    }
    
    const newCategory = await categoryRepository.registerCategory({name, description});
    return new Category(newCategory);

};  

//listar todas las categorías

const allCategories = async () => { 
    const categories = await categoryRepository.allCategories();
    return categories.map(category => new Category(category));
};

//Actualizar una categoria existnte.

const updateCategory =async ({id, name, description}) => {
    const existing = await categoryRepository.findCategoryById(id);

    if (!existing) {
        const error = new Error("La categoría no existe");
        error.statusCode = 404; // Not Found: El recurso no existe
        throw error;
    }

    const updatedCategory = await categoryRepository.updateCategory({id, name, description});
    return new Category(updatedCategory);
};

//Buscar una categoría por su ID

const findCategoryById = async (id) => {
    const category = await categoryRepository.findCategoryById(id);
    if (!category) return null;
    return new Category(category);
};



module.exports = { 
    registerCategory,
    allCategories,
    updateCategory,
    findCategoryById,
};  