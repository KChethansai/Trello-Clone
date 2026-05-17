// UserAPI routes: Express endpoints for this backend resource.
import exp from 'express'
import {
  registerUser,
  login,
  changepassword,
  updateProfile,
  logout,
  checkAuth
} from '../controllers/usercontroller.js'
import { verifyRolesToken } from '../middlewares/verifyRolesToekn.js'

export const Userapp = exp.Router()

const auth = verifyRolesToken('MEMBER', 'ADMIN', 'MANAGER', 'VIEWER')

//register
Userapp.post('/register', registerUser)

//login
Userapp.post('/login', login)

//change password
Userapp.put('/change-password', auth, changepassword)

//update profile
Userapp.put('/profile', auth, updateProfile)

//logout
Userapp.get('/logout', auth, logout)

//check auth status
Userapp.get('/check-auth', auth, checkAuth)


