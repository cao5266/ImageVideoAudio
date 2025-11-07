const jwt = require('jsonwebtoken');
const { User, RefreshToken } = require('../models');
const { validationResult } = require('express-validator');

// 生成 JWT token
const generateTokens = (userId) => {
  const accessToken = jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );

  const refreshToken = jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d' }
  );

  return { accessToken, refreshToken };
};

// 注册
exports.register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, name } = req.body;

    // 检查用户是否已存在
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // 加密密码
    const passwordHash = await User.hashPassword(password);

    // 创建用户
    const user = await User.create({
      email,
      password_hash: passwordHash,
      name
    });

    // 生成 tokens
    const { accessToken, refreshToken } = generateTokens(user.id);

    // 保存 refresh token
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);
    await RefreshToken.create({
      user_id: user.id,
      token: refreshToken,
      expires_at: expiresAt
    });

    res.status(201).json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      },
      accessToken,
      refreshToken
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
};

// 登录
exports.login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // 查找用户
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // 验证密码
    const isValidPassword = await user.validatePassword(password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // 生成 tokens
    const { accessToken, refreshToken } = generateTokens(user.id);

    // 保存 refresh token
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);
    await RefreshToken.create({
      user_id: user.id,
      token: refreshToken,
      expires_at: expiresAt
    });

    res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar
      },
      accessToken,
      refreshToken
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
};

// 刷新 token
exports.refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ error: 'Refresh token required' });
    }

    // 验证 refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);

    // 检查 token 是否在数据库中
    const tokenRecord = await RefreshToken.findOne({
      where: { token: refreshToken, user_id: decoded.userId }
    });

    if (!tokenRecord) {
      return res.status(403).json({ error: 'Invalid refresh token' });
    }

    // 检查是否过期
    if (new Date() > tokenRecord.expires_at) {
      await tokenRecord.destroy();
      return res.status(403).json({ error: 'Refresh token expired' });
    }

    // 生成新的 tokens
    const { accessToken, refreshToken: newRefreshToken } = generateTokens(decoded.userId);

    // 删除旧的 refresh token，保存新的
    await tokenRecord.destroy();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);
    await RefreshToken.create({
      user_id: decoded.userId,
      token: newRefreshToken,
      expires_at: expiresAt
    });

    res.json({
      accessToken,
      refreshToken: newRefreshToken
    });
  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(403).json({ error: 'Invalid refresh token' });
  }
};

// 获取当前用户信息
exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.userId, {
      attributes: ['id', 'email', 'name', 'avatar', 'created_at']
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({ error: 'Failed to get user information' });
  }
};

// Google OAuth 回调处理
exports.googleCallback = async (req, res) => {
  try {
    // Passport 已经在 req.user 中设置了用户信息
    const user = req.user;

    // 生成 tokens
    const { accessToken, refreshToken } = generateTokens(user.id);

    // 保存 refresh token
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);
    await RefreshToken.create({
      user_id: user.id,
      token: refreshToken,
      expires_at: expiresAt
    });

    // 重定向到前端，携带 token
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    res.redirect(`${frontendUrl}/auth/callback?token=${accessToken}&refreshToken=${refreshToken}`);
  } catch (error) {
    console.error('Google callback error:', error);
    res.redirect(`${process.env.FRONTEND_URL}/login?error=auth_failed`);
  }
};

