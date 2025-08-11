export const getAllProducts = async (req, res) => {
    res.status(200).json({ message: "Products fetched successfully", products: [] });
};

export const createProduct = async (req, res) => {
    const { name, price } = req.body;
    if (!name || !price) {
        return res.status(400).json({ message: "Please provide name and price" });
    }
    const newProduct = { id: Date.now(), name, price };
    res.status(201).json({ message: "Product created successfully", product: newProduct });
};