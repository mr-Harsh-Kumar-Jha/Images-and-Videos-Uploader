const express = require('express');
const router = express.Router();
const user = require('../modules/user');
const { body, validationResult } = require('express-validator');
require('dotenv').config();
const bcrypt = require('bcryptjs/dist/bcrypt');
const jwt = require('jsonwebtoken');
const fetchUser = require('../Middleware/fetchuser');

//  Route 1 : This is a first api request of create user .
router.post('/createuser', [  // these are special fields for validation check .
   body('name', " Enter name with min 2 characters").isLength({ min: 2 }),
   body('email', "Enter a valid Email Id").isEmail(),
   body('password', "ur password must be of min 5 characters").isLength({ min: 5 })
], async (req, res) => {
   const errors = validationResult(req);
   if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array(1)[0].msg });
   }
   try {
      let User = await user.findOne({ email: req.body.email });
      if (User) {
         return res.status(400).json({ success: false, errors: "Sorry,  the user with this email already exist.." })
      }

      //this is used to encrypt our password by hashing therefore it is a hashing algo package
      const salt = await bcrypt.genSalt(10); // salt is nothing but more secured way of storing password where sme sort of apha numerical is been provided so that even after generation of hash our password must be uniuqe as salt is added anyway between our original password.
      const secpass = await bcrypt.hash(req.body.password, salt);  // await  must be used in order to resolve call back as this npm package returns call back and we cannot move forward whithout resolving it as it is the main source through which our data is going to save in database

      // creating a new user
      User = await user.create({
         name: req.body.name,
         email: req.body.email,
         password: secpass,
      })
      const data = {
         users: {
            id: User.id
         }
      }
      const authtoken = jwt.sign(data.users.id, process.env.JWT_SECRET);
      // sending the body part on request to the client
      res.json({ success: true, authtoken });
   } catch (error) {
      res.status(500).send({ error: "internal server error !!!" });
   }

})

// Route 2: Login Request
router.post('/login', [
   body('email', "Enter a valid Email Id").isEmail(),
   body('password', "Password Cannot be Blank").exists()
], async (req, res) => {
   try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
         return res.status(400).json({ success: false, errors: errors.array() });
      }
      const { email, password } = req.body;
      const User = await user.findOne({ email: email });
      if (!User) {
         return res.status(400).json({ error: "user not found" });
      }

      const passwordcompare = await bcrypt.compare(password, User.password);
      if (!passwordcompare) {
         return res.status(400).json({ error: "enter correct credentials" });
      }

      const data = {
         users: {
            id: User.id,
         }
      }
      const authtoken = jwt.sign(data.users.id, process.env.JWT_SECRET);
      res.json({ success: true, authtoken: authtoken, User });

   } catch (error) {
      res.status(500).json({ error: "internal server error !!!" });
   }

})

//Route 3: Getting User
router.get('/getuser', fetchUser, async (req, res) => {
   const userId = req.User.id;
   const User = await user.findById(userId).select("-password");
   res.send(User);
})

module.exports = router;