const jwt = require('jsonwebtoken');

const fetchUser = (req , res , next) =>{
   try{
      const token = req.header('auth-token');
      if(!token ) {
         res.status(404).send({ error: "Please authenticate using correct credenials" });
      }

      const data =   jwt.verify(token, process.env.JWT_SECRET); // verifying the Token provided during logging .
      // if(!data){
      //    res.status(404).send({ error: "Please authenticate using correct credenials" });
      // }

      req.User=data.user;  // here User variable is been created and will be passed to the defined next source as a request body with User as paramater .

      next();
   }catch(error){
      res.status(500).json({error:"internal server error !!! "});
   }

}
module.exports = fetchUser;
