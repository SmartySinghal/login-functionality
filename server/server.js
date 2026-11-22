// 1. Import the packages
const express = require('express');      // web server
const jwt = require('jsonwebtoken');     // create and verify JWT tokens
const cors = require('cors');            // allow Angular (port 4200) to call this API (port 3000)
const bcrypt = require('bcrypt');        // hash and compare passwords          

// 2. Create the app and set it up
const app = express();
app.use(cors());
app.use(express.json());                 // read JSON from request bodies

// 3. Secret key used to sign tokens (keep it private; use an environment variable in real apps)
const SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';

// 4. Fake user list (a real app would use a database)
const users = [
  { id: 1, email: 'test@test.com', passwordHash: bcrypt.hashSync('test123', 10), name: 'Test User' }
];

// 5. LOGIN API: check the credentials, then create the token
app.post('/api/login', async(req, res) => {
  const { email, password } = req.body;

  const user = users.find(u => u.email === email);
  const isMatch = user && await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  // jwt.sign(payload, secret, options) creates the token
  const token = jwt.sign(
    { sub: user.id, email: user.email, name: user.name },  // data stored in the token
    SECRET,
    { expiresIn: '1h' }                                    // token expires after 1 hour
  );

  res.json({ token });                                     // send the token to Angular
});

// 6. MIDDLEWARE: check the token before allowing access
function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;            // "Bearer eyJhbGci..."
  const token = authHeader && authHeader.split(' ')[1];    // take the part after "Bearer"

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    req.user = jwt.verify(token, SECRET);                  // throws an error if invalid or expired
    next();                                                // token is OK, continue to the route
  } catch {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

// 7. PROTECTED API: only works with a valid token
app.get('/api/profile', verifyToken, (req, res) => {
  res.json(req.user);                                      // the decoded token data
});

// 8. Start the server
app.get('/', (req, res) => res.send('JWT Auth API is running'));
app.listen(3001, () => console.log('API running on http://localhost:3001'));