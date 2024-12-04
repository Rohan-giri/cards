const fs = require("fs");
const path = require("path");

exports.handler = async (event) => {
  const filePath = path.resolve(__dirname, "../data/data.json");

  try {
    // Handle GET requests (Fetch all data)
    if (event.httpMethod === "GET") {
      const data = fs.readFileSync(filePath, "utf8");
      return {
        statusCode: 200,
        body: data,
      };
    }

    // Handle POST requests (Add new gift card)
    if (event.httpMethod === "POST") {
      const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
      const newCard = JSON.parse(event.body);

      data.push(newCard);

      fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
      return {
        statusCode: 200,
        body: JSON.stringify({ message: "Gift card added successfully!" }),
      };
    }

    // Handle PUT requests (Update an existing gift card)
    if (event.httpMethod === "PUT") {
      const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
      const { cardId, update } = JSON.parse(event.body);

      const cardIndex = data.findIndex((card) => card.cardId === cardId);
      if (cardIndex === -1) {
        return {
          statusCode: 404,
          body: JSON.stringify({ message: "Card not found" }),
        };
      }

      data[cardIndex] = { ...data[cardIndex], ...update };
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

      return {
        statusCode: 200,
        body: JSON.stringify({ message: "Gift card updated successfully!" }),
      };
    }

    return {
      statusCode: 405,
      body: JSON.stringify({ message: "Method not allowed" }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
