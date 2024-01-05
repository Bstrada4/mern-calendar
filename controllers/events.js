const { response } = require('express');
const Evento = require('../models/Evento');

const getEventos = async( req, res = response ) => {


    try {

        const eventos = await Evento.find()
                                    .populate('user', 'name password');

        return res.json({
            ok: true,
            eventos
        });
        
    } catch (error) {
        console.log( error );
        res.status(500).json({
            ok: false,
            msg: 'No se pudo obtener los eventos.'
        });
    }
    
    
}


const crearEventos = async( req, res = response ) => {

    const event = new Evento( req.body );
    try {

        event.user = req.uid;

        const eventSave = await event.save();

        return res.json({
            ok: true,
            evento: eventSave
        });
        
    } catch (error) {
        console.log( error );
        res.status(500).json({
            ok: false,
            msg: 'No se pudo crear el nuevo evento.'
        });
    }
    
    
}


const actualizarEventos = async( req, res = response ) => {

    const eventoId = req.params.id;
    const uid = req.uid;

    try {

        const evento = await Evento.findById( eventoId );

        if( !evento ){
            return res.status(404).json({
                ok: false,
                msg: 'El evento no existe'
            });
        }

        // VALIDAR SOLO ACTUALIZA EL QUE CREÓ EL EVENTO
        if ( evento.user.toString() !== uid ) {
            return res.status(401).json({
                ok: false,
                msg: 'No tiene privilegio para editar este evento'
            });
        }

        const nuevoEvento = {
            ...req.body,
            user: uid
        }

        const eventoActualizado = await Evento.findByIdAndUpdate( eventoId, nuevoEvento, { new: true } );

        res.json({
            ok: true,
            evento: eventoActualizado
        });
       
        
    } catch (error) {
        console.log( error );
        res.status(500).json({
            ok: false,
            msg: 'No se pudo actualizar el evento'
        });
    }
    
}


const eliminarEventos = async( req, res = response ) => {

    const eventoId = req.params.id;
    const uid = req.uid;

    try {

        const evento = await Evento.findById( eventoId );
        if( !evento ){
            return res.status(404).json({
                ok: false,
                msg: 'El evento no existe'
            });
        }

        // VALIDAR SOLO ELIMINA EL QUE CREÓ EL EVENTO
        if ( evento.user.toString() !== uid ) {
            return res.status(401).json({
                ok: false,
                msg: 'No tiene privilegio para eliminar este evento'
            });
        }

        await Evento.findByIdAndDelete( eventoId );

        res.json({ ok: true });        
    } catch (error) {
        console.log( error );
        res.status(500).json({
            ok: false,
            msg: 'No se pudo eliminar el evento.'
        });
    }
}

module.exports = {
    getEventos,
    crearEventos,
    actualizarEventos,
    eliminarEventos
}