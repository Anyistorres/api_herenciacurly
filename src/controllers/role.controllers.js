const roleService = require("../services/role.service");

const listarRoles = async (req, res) => {
    try {
        const roles = await roleService.listarRoles();
        return res.status(200).json(roles);

    } catch (error) {
        return res.status(500).json({ message: "Error del servidor" });
    }
};

module.exports = {
    listarRoles,
};  