const { response } = require('express');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/Usuario');
const { generarJWT } = require('../helpers/jwt');


const crearUsuario = async(req, res = response ) => {

    const { email, password } = req.body;

    try {
        
        let usuario = await Usuario.findOne({ email });

        if ( usuario ) {
            return res.status(400).json({
                ok: false,
                msg: 'Un usuario existe con ese correo',
            });
        }

        const user = Usuario( req.body );

        //ENCRIPTAR CONTRASEÑA
        const salt = bcrypt.genSaltSync(); // 10 por defecto
        user.password = bcrypt.hashSync( password, salt );

        await user.save();

        res.status(201).json({
            ok: true,
            uid: user.id,
            name: user.name,
        });
        
    } catch (error) {

        console.log(error);

        res.status(500).json({
            ok: false,
            msg: 'Comunicate con el administrador'
        });
    }

}


const loginUsuario = async( req, res = express.response ) => {

    const { email, password } = req.body;

    try {

        let user = await Usuario.findOne({ email });

        if ( !user ) {
            return res.status(400).json({
                ok: false,
                msg: 'No existe un usuario con ese email',
            });
        }

        // CONFIRMAR PASSWORD
        const validPassword = bcrypt.compareSync( password, user.password );

        if ( !validPassword ){
            return res.status(400).json({
                ok: false,
                msg: 'Password incorrecto'
            });
        }

        // Generar nuestro JWT
        const token = await generarJWT( user.id, user.name );

        res.json({
            ok: true,
            uid: user.id,
            name: user.name,
            token
        });

        
    } catch (error) {

        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Comunicate con el administrador'
        });

    }
}


const revalidarToken = async( req, res = express.response ) => {

    const { uid, name } = req;

    // Generar nuevo token
    const newToken = await generarJWT( uid, name );
    

    res.json({
        ok: true,
        newToken
    });
}

module.exports = {
    crearUsuario,
    loginUsuario,
    revalidarToken
}