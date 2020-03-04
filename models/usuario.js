var mongosee = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var Schema = mongosee.Schema;

var rolesValidos = {
    values: ['ADMIN_ROLE','USER_ROLE'],
    message: '{VALUE} no es un rol valido'
};

var usuarioSchema = new Schema({
    nombre: { type: String, required: [true,'El nombre es obligatorio'] },
    email: { type: String,  unique:true, required: [true,'El correo es obligatorio'] },
    password: { type: String, required: [true,'La contrasena es obligatorio'] },
    img: { type: String, required: false },
    role: { type: String, required: true, default: 'USER_ROLE', enum: rolesValidos },
});

usuarioSchema.plugin(uniqueValidator, {message: '{PATH} debe ser unico'})

module.exports = mongosee.model('Usuario',usuarioSchema);