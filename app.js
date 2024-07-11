const express = require('express');
const app = express();
const port = 3000;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Middleware to parse JSON bodies
app.use(express.json());

async function hashpass(password) {
    const res = await bcrypt.hash(password,10);
    return res;
}

// Define a simple route
app.get('/', (req, res) => {
  res.send('Hello, World!');
});


app.post('/login', async (req,res) => {
    const { username, password, email } = req.body;

    if (!username || !password || !email) {
      return res.status(400).json({ message: 'All fields are required' });
    }
  
    try {
      // Check if the user already exists
      const existingUser = await Usermodel.findOne({ email });
  
      if (existingUser) {
        // Compare the password with the hashed password
        const isPasswordValid = await bcrypt.compare(password, existingUser.password);
        if (isPasswordValid) {
          return res.status(200).json({ message: 'Login successful' });
        } else {
          return res.status(400).json({ message: 'Invalid password' });
        }
      } else {
        // Encrypt the password
        const hashedPassword = await bcrypt.hash(password, 10);
  
        // Save the new user
        const newUser = new User({
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
})
// Corrected POST route for registration
app.post('/register',async (req, res) => {
  const { username, password, email } = req.body;
  console.log(req.body)
  const username_body = req.body.username;
  const password_body = req.body.password;
  const email_body = req.body.email;

  if (!username || !password) {
    return res.status(404).json({ message: 'Username and password are required.' });
  }

  const emailExist = await Usermodel.findOne({ email: email});
  if (emailExist) {
    return res.status(409).json({ message: 'Email already exists.' });
  }

  // Check if username already exists
  const hashedPassword = await hashpass( password);

  const user_created = await Usermodel.create ({
    username: username_body,
    password: hashedPassword,
    email: email_body,
  });

  console.log(user_created);
  
  const data = {
     password : hashedPassword
  };
  console.log(data);

  return res.status(200).json({ message: 'User registered successfully.' });
});




// Define the User schema
const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String
});

const Usermodel = mongoose.model('User', UserSchema)

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

// MongoDB connection URL
const CONNECTION_URL = 'mongodb+srv://suleroheem88:temitope1@cluster1.rqlg4vs.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1';

// Connect to MongoDB
mongoose.connect(CONNECTION_URL)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB', error);
  });