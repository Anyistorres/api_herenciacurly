const categoryService = require("../services/category.service");


const registerCategory = async (req, res) => {
    try {

        const { name, description } = req.body;
        const newCategory = await categoryService.registerCategory({ name, description });
        return res.status(201).json(newCategory);   

    } catch (error) {
        return res.status(error.statusCode || 500).json({ message: error.message || "Error del servidor" });
    }
};


const allCategories = async (req, res) => {
    try {
        const categories = await categoryService.allCategories();
        return res.status(200).json(categories);
    } catch (error) {
        return res.status(error.statusCode || 500).json({ message: error.message || "Error del servidor" });
    }
};

const updateCategory = async (req, res) => {
    try {
        const {id, name, description} = req.body;
        const updatedCategory = await categoryService.updateCategory({id, name, description});
        return res.status(200).json(updatedCategory);
    } catch (error) {
        return res.status(error.statusCode || 500).json({ message: error.message || "Error del servidor" });
    }
};

const findCategoryById = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await categoryService.findCategoryById(id);
        if (!category) {
            return res.status(404).json({ message: "Categoría no encontrada" });
        }
        return res.status(200).json(category);
    } catch (error) {
        return res.status(error.statusCode || 500).json({ message: error.message || "Error del servidor" });
    }
};

module.exports = {
    registerCategory,
    allCategories,
    updateCategory,
    findCategoryById,
};  