const express = require('express')
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

// const validateSignup = [
//   check('email')
//     .exists({ checkFalsy: true })
//     .isEmail()
//     .withMessage('Please provide a valid email.'),
//   check('username')
//     .exists({ checkFalsy: true })
//     .isLength({ min: 4 })
//     .withMessage('Please provide a username with at least 4 characters.'),
//   check('username')
//     .not()
//     .isEmail()
//     .withMessage('Username cannot be an email.'),
//   check('password')
//     .exists({ checkFalsy: true })
//     .isLength({ min: 6 })
//     .withMessage('Password must be 6 characters or more.'),
//   handleValidationErrors
// ];

// Sign up
router.post('/', handleValidationErrors, async (req, res, next) => {
    const { firstName, lastName, email, username, password } = req.body;
    // const user = await User.create({ email, username, hashedPassword });
    let hashedPassword;
    if(password){
      hashedPassword = bcrypt.hashSync(password);
    }

    if(email){
      const checkUserEmail = await User.findAll({
        where: {
          email
        }
      })
      if(checkUserEmail.length > 0){
        return res.status(500).json({
          message: "User already exists",
          errors: {
            email: "User with that email already exists"
          }
        })
      }
    }

    if(username){
      const checkUserName = await User.findAll({
        where: {
          username
        }
      })
      if(checkUserName.length > 0){
        return res.status(500).json({
          message: "User already exists",
          errors: {
            username: "User with that username already exists"
          }
        })

        // const err = new Error();
        // err.status = 500;
        // err.message = "User already exists";
        // err.errors = {username: "User with that username already exists"};
        // return next(err)
      }
    }


    const safeUser = await User.create({
      firstName,
      lastName,
      username,      
      hashedPassword,
      email
    });
 
    await setTokenCookie(res, safeUser);
  
    const userInfo = await User.scope('defaultScope').findByPk(safeUser.id);

    return res.json({
      user: userInfo
    });
  }
);

module.exports = router;