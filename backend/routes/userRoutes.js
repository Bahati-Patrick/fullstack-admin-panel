import express from 'express';
import UserController from '../controllers/userController.js';

const router = express.Router();

// User routes
router.get('/', UserController.getAllUsers); // GET /api/users
router.get('/export', UserController.exportUsers); // GET /api/users/export (protobuf)
router.get('/stats', UserController.getUserStats); // GET /api/users/stats
router.get('/public-key', UserController.getPublicKey); // GET /api/users/public-key
router.get('/:id', UserController.getUserById); // GET /api/users/:id (MUST be last)
router.post('/', UserController.createUser); // POST /api/users
router.put('/:id', UserController.updateUser); // PUT /api/users/:id
router.delete('/:id', UserController.deleteUser); // DELETE /api/users/:id

export default router;