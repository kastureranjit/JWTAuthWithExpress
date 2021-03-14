const axios = require('axios');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

exports.validate = validations => {
    return async (req, res, next) => {
        await Promise.all(validations.map(validation => validation.run(req)));
        const errors = validationResult(req);
        if (errors.isEmpty()) {
            return next();
        }
        res.status(422).json({ errors: errors.array() });
    };
}

exports.invokeUrl = async (configData)=>{
    
    return new Promise((resolve,reject)=>{
        axios(configData)
        .then(function (response) {
        console.log(JSON.stringify(response.data));
        resolve(JSON.stringify(response.data));
        })
        .catch(function (error) {
        console.log(error);
        reject(error);
        });
    });

    
}

const users = [
    {
        username: 'john',
        password: 'password123admin',
        role: 'admin'
    }, {
        username: 'anna',
        password: 'password123member',
        role: 'member'
    }
  ];

  exports.generateJWT = (req,res)=>{
// Read username and password from request body
  const { username, password } = req.body;

  // Filter user from the users array by username and password
  const user = users.find(u => { return u.username === username && u.password === password });

  if (user) {
      // Generate an access token
      const accessToken = jwt.sign({ username: user.username,  role: user.role }, process.env.TOKEN,{ expiresIn: '20m' });

      res.json({
          accessToken
      });
  } else {
      res.status(401).send('Username or password incorrect');
  }
}

exports.authenticateJWT = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (authHeader) {
            const token = authHeader.split(' ')[1];

            jwt.verify(token, process.env.TOKEN, (err, user) => {
                if (err) {
                    return res.sendStatus(403);
                }

                req.user = user;
                next();
            });
        } else {
            res.sendStatus(401);
        }    
    } catch (error) {
        console.log("JWT error is: ",error);
    }
    
};









