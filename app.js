const express = require("express");
const app = express();
const port = 3001;
const mongoose = require("mongoose");
const Usermodel = require("../myapp/user");
const Product = require("../myapp/product");
const authRoutes = require("./routes/auth/index"); // Only keep this line if you want to use auth routes from index.js
const productRoutes = require("./routes/products/products"); // Use a different variable for product routes
const cartRoutes = require("./routes/cart/cart"); // Use a different variable for product routes
const saltRounds = 10;
const Cart = require("../myapp/cart");
const cors = require("cors");

app.use(express.json());

app.use(cors({
  origin: "http://localhost:3000", // this can be your frontend URL
  credentials: true,
}));

app.use("/auth", authRoutes); // Routes for authentication
app.use("/products", productRoutes);
app.use("/cart", cartRoutes);
// app.use("/auth", a);

// Define a simple route
app.get("/", (req, res) => {
  // This here is to tell us our frontend has connected to our backend
  console.log("Back-End Connected");
  res.send("Back-End Connected");
});



// app.post('/create-order', async (req, res) => {
//   const { customerId, products, totalAmount, shippingAddress } = req.body;

//   if (!customerId || !Array.isArray(products) || products.length === 0 || !totalAmount || !shippingAddress) {
//     return res.status(400).json({ message: 'All fields are required' });
//   }

//   try {
//     // Validate products
//     products.forEach(product => {
//       if (!product.name || !product.price || !product.category || !product.brand) {
//         throw new Error('Each product must have a name, price, category, and brand');
//       }
//     });

//     // Calculate total amount
//     const calculatedTotalAmount = products.reduce((total, product) => total + (parseFloat(product.price) * (product.quantity || 1)), 0);

//      // Validate shipping addresses
//      shippingAddress.forEach(address => {
//       if (!address.postalCode || !address.city || !address.state || !address.country || !address.street) {
//         throw new Error('Each shipping address must have postalCode, city, state, country, and street');
//       }
//     });
//     // Create a new order
//     const newOrder = new Order({
//       customerId,
//       products,
//       totalAmount: calculatedTotalAmount,
//       shippingAddress
//     });

//     await newOrder.save();
//     return res.status(201).json({ message: 'Order created successfully', order: newOrder });
//   } catch (error) {
//     return res.status(500).json({ message: 'Internal server error', error: error.message });
//   }
// });

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

// MongoDB connection URL
const CONNECTION_URL =
  "mongodb+srv://suleroheem88:temitope1@cluster1.rqlg4vs.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1";

// Connect to MongoDB
mongoose
  .connect(CONNECTION_URL)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB", error);
  });
