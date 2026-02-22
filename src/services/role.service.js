const Roles = require('../models/role.model');

const roleRepository = require('../repositories/role.repository');

const listarRoles = async () => {
    const roles = await roleRepository.allRoles(); 
    return roles.map(role => new Roles(role));
};

module.exports = { 
    listarRoles,
};  