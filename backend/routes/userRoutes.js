import {
    authUser,
    registerUser,
    logoutUser,
    getUserProfile,
    updateUser,
    updateUserProfile,
    getUserByID,
    getUsers,
    deleteUser
} from "../controllers/userController.js"
import express from 'express'

const router = express.Router()

router.route('/').post(registerUser).get(getUsers)
router.post('/logout', logoutUser)
router.post('/auth', authUser)
router.route('/profile').get(getUserProfile).put(updateUserProfile)
router.route('/:id').delete(deleteUser).get(getUserByID).put(updateUser)

export default router