const jwt = require("jsonwebtoken");

const users = [
  {
    id: 123,
    role: "basic",
    name: "Basic Thomas",
    username: "basic-thomas",
    password: "sR-_pcoow-27-6PAwCD8",
  },
  {
    id: 434,
    role: "premium",
    name: "Premium Jim",
    username: "premium-jim",
    password: "GBLtTyq3E_UNjFnpo9m6",
  },
];

class AuthError extends Error {}

const authSign = (secret) => (username, password) => {
  const user = users.find((u) => u.username === username);

  if (!user || user.password !== password) {
    throw new AuthError("Invalid username or password");
  }

  return jwt.sign(
    {
      userId: user.id,
      name: user.name,
      role: user.role,
    },
    secret,
    {
      issuer: "https://www.netguru.com/",
      subject: `${user.id}`,
      expiresIn: 30 * 60, //in sec=> 30min
    }
  );
};


const authVerify = (secret) => (req, res, next) => {
  /*
    Verify auth_header_Bearer_token:
    - if ok => add token_data to "req.decode"
  */

	  let authHeader = req.headers['authorization'] || '';
    let token = "";
    if (authHeader.startsWith("Bearer ")){
     token = authHeader.substring(7, authHeader.length);
    };
	  if (!token) {
  		return res.status(401).json({
        error: "No auth header or not Bearer type"
      });
	  } else {
		  jwt.verify(token, secret, function (err, decode){
  			if (err) {
          return res.status(401).json({ error: "Invalid token" });
  			} else {
          //console.log("decode", decode);
  				req.decode = decode;
  				next();
        }
      })//jwt.verify()
	  }//if-else
};

module.exports = {
  authSign,
  authVerify,
  AuthError,
};
