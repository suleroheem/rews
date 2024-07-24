
const express = require('express');
const routes = express.Router();
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const Usermodel = require('../user');
const Product = require('../product');
const Cart = require('../cart');
const jwt = require('jsonwebtoken');
const SECRET_KEY = 'your_secret_key';
const saltRounds = 10;












 const Login =    async (req, res) => {
    const { username, password,  } = req.body;

    if (!username || !password ) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    try {
      // Check if the user already exists
      const existingUser = await Usermodel.findOne({username });

      if (existingUser) {
        // Compare the password with the hashed password
        const isPasswordValid = await bcrypt.compare(password, existingUser.password);
        if (isPasswordValid) {
          // Generate a JWT
          const token = jwt.sign({ id: existingUser._id, email: existingUser.email }, SECRET_KEY, { expiresIn: '1h' });
          return res.status(200).json({ message: 'Login successful', token });
        } else {
          return res.status(400).json({ message: 'Invalid password' });
        }
      } else {
        // Encrypt the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Save the new user
        const newUser = new Usermodel({
          username,
          password: hashedPassword,
          email,
        });

        await newUser.save();
        return res.status(201).json({ message: 'User registered successfully' });
      }
    } catch (error) {
      return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
}



const Register =  async (req, res) => {
    const { username, password, email } = req.body;

    console.log('here')
  
    if (!username || !password || !email) {
      return res.status(400).json({ message: 'All fields are required' });
    }
  
    const emailExist = await Usermodel.findOne({ email: email });
    if (emailExist) {
      return res.status(409).json({ message: 'Email already exists.' });
    }
    
    
    
  
    // Encrypt the password
    
try {
    const hashedPassword = await bcrypt.hash(password , saltRounds);
  
    // Create the user
    const user_created = await Usermodel.create({
      username,
      password: hashedPassword,
      email,
    });
  
    console.log(user_created);
  
    return res.status(201).json({ message: 'User registered successfully.' });
} catch (err) { 
    console.error(err);
    return res.status(500).json({ message: 'Internal Server Error.' });
  }
};




const Create_product =  async (req, res) => {
  const { name, price, category, brand, description, image } = req.body;

  if (!name || !price || !category || !brand || !description || !image) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Create a new product
    const newProduct = new Product({
      name,
      price,
      category,
      brand,
      description,
      image,
    });

    // Save the product to the database
    const savedProduct = await newProduct.save();

    return res
      .status(201)
      .json({ message: "Product created successfully", product: savedProduct });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};



const  Get_product = async (req, res) => {
  const { productId } = req.body;

  if (!productId) {
    return res.status(400).json({ message: "Product ID is required" });
  }

  try {
    // Fetch the product from the database based on the ID
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res
      .status(200)
      .json({ message: "Product retrieved successfully", product });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};



const Update_product = async (req, res) => {
  const { id } = req.params; // Assuming the product ID is in the URL parameters
  const { name, price, category, brand, description, image } = req.body;

  if (!name || !price || !category || !brand || !description || !image) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Find the product by ID and update it
    const updateProduct = await Product.findByIdAndUpdate(
      id,
      {
        name,
        price,
        category,
        brand,
        description,
        image,
      },
      { new: true } // This option returns the updated document
    );

    if (!updateProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res
      .status(200)
      .json({ message: "Product updated successfully", product: updateProduct });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};






const Delete_product = async (req, res) => {
  const { productId } = req.body;

  if (!productId) {
    return res.status(400).json({ message: "Product ID is required" });
  }

  try {
    const product = await Product.findByIdAndDelete(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res
      .status(200)
      .json({ message: "Product deleted successfully", product });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
}





const Add_to_cart = async (req, res) => {
  const { userId, productId, quantity } = req.body;

  try {
    // Check if the item already exists in the cart
    let cartItem = await Cart.findOne({ userId, productId });

    if (cartItem) {
      // If the item exists, update the quantity
      cartItem.quantity += quantity;
    } else {
      // If the item does not exist, create a new cart item
      cartItem = new Cart({ userId, productId, quantity });
    }

    // Save the cart item to the database
    await cartItem.save();

    // Return success response
    return res
      .status(201)
      .json({ message: "Item added to cart successfully", cartItem });
  } catch (error) {
    console.error("Error adding item to cart:", error.message);
    return res
      .status(500)
      .json({ message: "Failed to add item to cart", error: error.message });
  }
};


const UpdateCart =  async (req, res) => {
  const { userId, productId, quantity } = req.body;

  try {
    // Find the cart item to update
    let cartItem = await Cart.findOne({ userId, productId });

    if (!cartItem) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    // Update the quantity
    cartItem.quantity = quantity;

    // Save the updated cart item
    await cartItem.save();

    // Return success response
    return res
      .status(200)
      .json({ message: "Cart item updated successfully", cartItem });
  } catch (error) {
    console.error("Error updating cart item:", error.message);
    return res
      .status(500)
      .json({ message: "Failed to update cart item", error: error.message });
  }
};




const Getcart = async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ message: "User ID is required" });
  }

  try {
    // Fetch the cart items from the database based on the user ID
    const cartItems = await Cart.find({ userId: userId });

    if (!cartItems || cartItems.length === 0) {
      return res.status(404).json({ message: "Cart items not found for this user" });
    }

    return res.status(200).json({ message: "Cart items retrieved successfully", cartItems });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};




const Delete_cart =  async (req, res) => {
  const { id } = req.params;

  try {
    // Find the cart item by ID and delete it
    const cartItem = await Cart.findByIdAndDelete(id);

    if (!cartItem) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    return res
      .status(200)
      .json({ message: "Cart item deleted successfully", cartItem });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
}

// Define the route to get products










module.exports = {
    Login, 
    Register,
    Create_product,
    Get_product,
    Update_product,
    Delete_product,
    Add_to_cart,
    UpdateCart,
    Getcart,
    Delete_cart,
}