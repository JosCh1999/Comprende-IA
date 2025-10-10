const bcrypt = require("bcrypt")
    const Usuario = require("../model/usuario")

    const register = async (req, res) => {

        const {nombre, correo , contraseña} = req.body;

        Usuario.findOne({correo}).then((usuario) => {
            if(usuario){
                return res.status(409).json({mensaje : "El correo ya está registrado"});
            }else if(!nombre || !correo || !contraseña){
                return res.status(400).json({mensaje: "Falta el nombre / correo /contraseña"});
            }else {
                bcrypt.hash(contraseña, 10, (error, contraseñaHasheada) => {
                    if (error) res.json({error});
                    else {
                        const nuevoUsuario = new Usuario({
                            nombre,
                            correo,
                            contraseña: contraseñaHasheada,
                        });

                        nuevoUsuario
                        .save()
                        .then((usuario) => {
                            res.status(201).json({mensaje: "Usuario registrado exitosamente", usuario});
                        })
                        .catch((error) => console.error(error));
                    }
                });
            }
        });
    };

module.exports = register;