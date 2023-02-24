import jwt from "jsonwebtoken";
function Authenticated(iComponent) {
    return (req, res) => {
      const { authorization } = req.headers;
      // console.log("req.headers", req.headers);
      // console.log("authorization", authorization);
      if (!authorization) {
        res
          .status(403)
          .json({ error: "you must be logged in to access this page" });
      }
      try {
        // console.log("process.env.JWT_SECRET", process.env.JWT_SECRET);
        const { userId } = jwt.verify(authorization, process.env.JWT_SECRET);
        // console.log("userId", userId);
        req.userId = userId;
        return iComponent(req, res);
      } catch (err) {
        res.status(403).json({ error: "Token is invalid" });
      }
    };
  }
  export default Authenticated