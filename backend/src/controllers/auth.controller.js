// controllers/auth.controller.js
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

module.exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  // Check if the user already exists
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) return res.status(400).send("User already exists.");

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create new user
  const newUser = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  res.status(201).send({ id: newUser.id, email: newUser.email });
};

module.exports.login = async (req, res) => {
  const { email, password } = req.body;

  // Find user by email
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(400).send("Invalid credentials.");

  // Check password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).send("Invalid credentials.");

  // Create and send JWT
  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
  res.json({ token });
};

module.exports.authMiddleware = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1]; // Extract token from header

  if (!token) return res.status(401).send("Access denied. No token provided.");

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.error("JWT verification failed:", err); // Log the error
      return res.status(401).send("Invalid token.");
    }

    console.log("Decoded JWT payload:", decoded); // Log the decoded user information
    req.user = decoded; // Attach decoded user info to the request object
    next();
  });
};
