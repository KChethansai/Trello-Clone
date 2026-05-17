// OAuthAPI routes: Express endpoints for this backend resource.
import express from 'express'
import { OAuth2Client } from 'google-auth-library'
import jwt from 'jsonwebtoken'
import { UserModel } from '../models/usermodel.js'
import { env, getCookieOptions } from '../config/env.js'

export const oauthApp = express.Router()

const googleClient = new OAuth2Client(env.googleClientId)

//Google OAuth - verify credential and issue session cookie
oauthApp.post('/google', async (req, res) => {
  try {
    const { credential } = req.body
    if (!env.googleClientId) {
      return res.status(503).json({ message: 'Google OAuth is not configured' })
    }
    if (!credential) {
      return res.status(400).json({ message: 'credential is required' })
    }

    //verify google id token
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: env.googleClientId
    })

    const { email, name, picture, sub } = ticket.getPayload()

    //find or create user
    let user = await UserModel.findOne({ email })

    if (!user) {
      user = new UserModel({
        name: name || email.split('@')[0],
        email,
        password: `google_oauth_${sub}`,
        profilePic: picture || '',
        role: 'VIEWER'
      })
      await user.save()
    }

    //sign jwt
    const token = jwt.sign(
      { email: user.email, id: user._id, role: user.role },
      env.secretKey,
      { expiresIn: '7d' }
    )

    //set http-only cookie
    res.cookie('token', token, {
      ...getCookieOptions()
    })

    const safeUser = user.toObject()
    delete safeUser.password

    res.status(200).json({ message: 'Google login success', payload: safeUser })
  } catch (err) {
    res.status(401).json({ message: 'Google auth failed', reason: err.message })
  }
})

//Apple OAuth placeholder - implement with apple-signin-auth package
oauthApp.post('/apple', async (req, res) => {
  res.status(501).json({ message: 'Apple OAuth not configured' })
})


