const { getStoredItems, storeItems } = require("../../data/items");

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  try {
    if (req.method === "GET") {
      const storedItems = await getStoredItems();
      res.status(200).json({ items: storedItems });
    } else if (req.method === "POST") {
      const existingItems = await getStoredItems();
      const itemData = req.body;
      const newItem = {
        ...itemData,
        id: Math.random().toString(),
      };
      const updatedItems = [newItem, ...existingItems];
      await storeItems(updatedItems);
      res.status(201).json({ message: "Stored new item.", item: newItem });
    } else {
      res.status(405).json({ error: "Method not allowed" });
    }
  } catch (error) {
    console.error("API Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
