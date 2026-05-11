export const addToCart = async (req, res) => {
  try {
    res.json({ message: "Add to cart" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getCart = async (req, res) => {
  try {
    res.json({ cart: [] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    res.json({ message: "Removed from cart" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
