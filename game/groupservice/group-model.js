const mongoose = require('mongoose');

/*
    CAMPOS:
    - miembros: one to many con users
    - admin: one to one con User (solo 1 admin por grupo)
    - numero maximo de miembros: int
    - descripcion: string
    - isPublic: boolean
    - contraseña?: String (solo si el grupo es privado)
    - fecha de creacion: date

*/
const groupSchema = new mongoose.Schema({
    groupName: {
        type: String,
        required: true,
    },
});

const Group = mongoose.model('Group', groupSchema);

module.exports = Group