const { Router } = require('express');

const { check } = require('express-validator');
const { isDate } = require('../helpers/isDate');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const router = Router();


const { getEventos, crearEventos, actualizarEventos, eliminarEventos } = require('../controllers/events');

// Cuando las rutas tienen validaciones repetitivas como el middleware validarJWT, se puede mover las rutas, las que esten
// arriba del validarJWT, no son afectados por aquel middleware
router.use( validarJWT );

//Obtener Evento
router.get('/', getEventos );

//Crear un nuevo Evento
router.post(
    '/',
    [
        check( 'title', 'El título es obligatorio').not().isEmpty(),
        check( 'start', 'La fecha de inicio es obligatoria').custom( isDate ),
        check( 'end', 'La fecha fin es obligatoria').custom( isDate ),
        validarCampos
    ],
    crearEventos
);    

//Actualizar Evento
router.put(
    '/:id',
    [
        check( 'title', 'El título es obligatorio').not().isEmpty(),
        check( 'start', 'La fecha de inicio es obligatoria').custom( isDate ),
        check( 'end', 'La fecha fin es obligatoria').custom( isDate ),
        validarCampos
    ],
    actualizarEventos
);

//Eliminar Evento
router.delete('/:id', eliminarEventos );

module.exports = router;