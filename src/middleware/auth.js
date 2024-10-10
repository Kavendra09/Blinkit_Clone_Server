import jwt from "jsonwebtoken";

export const verifyToken = async (request, reply) => {
  try {
    const authHeader = request.headers['authorization'];

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      reply.code(401).send({ message: "Access Token required" });
      return false; // Token is missing
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    request.user = decoded; // Attach user info to the request object

    return true; // Token is valid
  } catch (error) {
    reply.code(403).send({ message: "Invalid or expired token" });
    return false; // Token is invalid or expired
  }
};
