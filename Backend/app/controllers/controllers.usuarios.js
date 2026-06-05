import UsuarioService from '../services/services.usuarios.js';

class UsuarioController {
    static async getAll(req, res, next) {
        try {
            const data = await UsuarioService.getAllUsuarios(req.query);
            res.status(200).json({ success: true, message: 'Usuarios obtenidos', data });
        } catch (error) { next(error); }
    }

    static async getById(req, res, next) {
        try {
            const data = await UsuarioService.getUsuarioById(req.params.id);
            res.status(200).json({ success: true, message: 'Usuario encontrado', data });
        } catch (error) { next(error); }
    }

    static async create(req, res, next) {
        try {
            const data = await UsuarioService.createUsuario(req.body);
            res.status(201).json({ success: true, message: 'Usuario creado exitosamente', data });
        } catch (error) { next(error); }
    }

    static async update(req, res, next) {
        try {
            const data = await UsuarioService.updateUsuario(req.params.id, req.body);
            res.status(200).json({ success: true, message: 'Usuario actualizado', data });
        } catch (error) { next(error); }
    }

    static async delete(req, res, next) {
        try {
            const data = await UsuarioService.deleteUsuario(req.params.id);
            res.status(200).json({ success: true, message: 'Usuario suspendido correctamente', data });
        } catch (error) { next(error); }
    }
}

export default UsuarioController;
