const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy
const { User } = require('../models')

// 只有在配置了 Google OAuth 时才启用
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    passport.use(
        new GoogleStrategy(
            {
                clientID: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                callbackURL: process.env.GOOGLE_CALLBACK_URL
            },
            async (accessToken, refreshToken, profile, done) => {
                try {
                    // 查找是否已存在该 Google 用户
                    let user = await User.findOne({ where: { google_id: profile.id } })

                    if (!user) {
                        // 检查邮箱是否已被注册
                        const emailExists = await User.findOne({
                            where: { email: profile.emails[0].value }
                        })

                        if (emailExists) {
                            // 如果邮箱已存在，更新 google_id
                            user = emailExists
                            user.google_id = profile.id
                            if (!user.avatar && profile.photos && profile.photos.length > 0) {
                                user.avatar = profile.photos[0].value
                            }
                            await user.save()
                        } else {
                            // 创建新用户
                            user = await User.create({
                                google_id: profile.id,
                                email: profile.emails[0].value,
                                name: profile.displayName,
                                avatar: profile.photos && profile.photos.length > 0 ? profile.photos[0].value : null
                            })
                        }
                    }

                    return done(null, user)
                } catch (error) {
                    return done(error, null)
                }
            }
        )
    )

    passport.serializeUser((user, done) => {
        done(null, user.id)
    })

    passport.deserializeUser(async (id, done) => {
        try {
            const user = await User.findByPk(id)
            done(null, user)
        } catch (error) {
            done(error, null)
        }
    })
} else {
    console.log('⚠️  Google OAuth not configured. Email/password login only.')
}

module.exports = passport
