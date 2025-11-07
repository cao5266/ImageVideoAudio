const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const { authenticateToken } = require('../middleware/auth');
const passport = require('../config/passport');

// 邮箱密码注册
router.post('/register',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 }),
    body('name').trim().notEmpty()
  ],
  authController.register
);

// 邮箱密码登录
router.post('/login',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty()
  ],
  authController.login
);

// 刷新 token
router.post('/refresh', authController.refreshToken);

// 获取当前用户信息
router.get('/me', authenticateToken, authController.getCurrentUser);

// Google OAuth 登录
router.get('/google',
  passport.authenticate('google', { 
    scope: ['profile', 'email'],
    session: false 
  })
);

// Google OAuth 回调
router.get('/google/callback',
  passport.authenticate('google', { 
    session: false,
    failureRedirect: '/login' 
  }),
  authController.googleCallback
);

module.exports = router;

