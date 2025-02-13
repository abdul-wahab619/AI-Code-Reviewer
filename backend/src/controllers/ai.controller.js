const aiService = require("../services/ai.service");
const { PrismaClient } = require("@prisma/client");
const axios = require("axios");

const prisma = new PrismaClient();

module.exports.getReview = async (req, res) => {
  const { code } = req.body;
  console.log("code:", code);

  if (!code) return res.status(400).send("Code is required");

  const review = await aiService(code);
  console.log("review:", review);

  const prompt = await prisma.prompt.create({
    data: { code, review },
  });

  res.json(prompt);
};
module.exports.getPastPrompts = async (req, res) => {
  try {
    const prompts = await prisma.prompt.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.json(prompts);
  } catch (error) {
    console.error("Error fetching prompts:", error);
    res.status(500).send("Failed to fetch prompts");
  }
};

module.exports.updateReview = async (req, res) => {
  const { id } = req.params;
  console.log("id:", id);

  const { code, review } = req.body;
  console.log("code , review", code, "=== ", review);

  try {
    // Ensure the ID is passed as a string and is valid
    if (!id) {
      return res.status(400).send("Invalid ID");
    }

    // Call the AI API to generate a new review
    const aiResponse = await axios.post("http://localhost:3000/ai/get-review", {
      code,
    });
    const newReview = aiResponse.data.review;

    if (!code || !newReview) {
      return res.status(400).send("Code and review are required");
    }

    const updatedPrompt = await prisma.prompt.update({
      where: { id },
      data: { code, review: newReview },
    });

    res.json(updatedPrompt);
  } catch (error) {
    console.error("Error updating review:", error);
    res.status(500).send("Failed to update review");
  }
};
module.exports.deleteReview = async (req, res) => {
  const { id } = req.params;

  try {
    // Ensure the ID is passed as a string and is valid
    if (!id) {
      return res.status(400).send("Invalid ID");
    }

    // Proceed with the deletion
    await prisma.prompt.delete({
      where: { id: id },
    });

    res.json({ message: "Review deleted successfully" });
  } catch (error) {
    console.error("Error deleting review:", error);
    res.status(500).send("Failed to delete review");
  }
};
