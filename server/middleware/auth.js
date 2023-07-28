import jwt from "jsonwebtoken";

export const verifyToken = async (req, res, next) => {
  try {
    let token = req.header("Authorisatioin");
    if(!token){
        return res.status(403).send("Access Denied"); // thhis handles the case if token does not exist
    }
    if(token.startswith("Bearer ")){
        token = token.slice(7, token.length).trimLeft();
    }

    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;

    next();

  } catch (err) {
    res.status(500).json({ err: err.message });
  }
};
