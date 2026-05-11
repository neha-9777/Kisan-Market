export const createOrder = async (req, res) => {
  try {
    res.json({
      message: "Order created successfully",
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

export const getOrders = async (req, res) => {
  try {
    res.json({
      orders: [],
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

export const getOrderById = async (req, res) => {
  try {
    res.json({
      order: {},
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};
