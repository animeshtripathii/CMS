import jwt, { decode } from "jsonwebtoken";
export const authMiddleware = (req, res, next) => {
try{
    const token = req.cookies.token;
    console.log("Token from auth middleware:", token);
    if(!token){
        return res.status(401).json({
            success: false,
            message: "Authorization token missing"
        });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    console.log("Decoded user from token:", req.user);
    next();

}catch(error){
    return res.status(401).json({
        success: false,
        message: "Authorization token invalid"
    });
}
};