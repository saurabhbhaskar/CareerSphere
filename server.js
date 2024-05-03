const express = require('express');
const session = require('express-session');
const path = require('path');
const bodyParser = require('body-parser');
const knex = require('knex');

const app = express();

// Use express-session middleware
app.use(
  session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
  })
);

// ... Your existing code
const db = knex({
    client: 'pg',
    connection: {
        host: '127.0.0.1',
        user: 'postgres',
        password: 'saurabh@11',
        database: 'loginform'
    }
})

app.use(bodyParser.json());

let initialPath = path.join(__dirname, "public");

app.use(express.static(initialPath));

// Check user session on homepage request
app.get('/', (req, res) => {
    const user = req.session.user;
    if (user) {
        // User is logged in, render the userhome template with user profile
        res.render('userhome', { user }); // Pass the user information to the template
    } else {
        // User is not logged in, render the regular homepage
        res.sendFile(path.join(initialPath, 'index.html'));
    }
});

// ... More existing code
app.get('/login', (req, res) => {
    res.sendFile(path.join(initialPath, 'login.html'));
})

app.get('/signup', (req, res) => {
    res.sendFile(path.join(initialPath, 'signup.html'));
})

// Logout route
app.get('/logout', (req, res) => {
    // Destroy the session and redirect to the homepage
    req.session.destroy(() => {
      res.redirect('/index.html');
    });
  });
  

app.post('/signup-user', (req, res) => {
    const { name, email, password } = req.body;

    if (!name.length || !email.length || !password.length) {
        res.json("Fill all the fields");
    } else {
        db("users").insert({
            name: name,
            email: email,
            password: password
        })
        .returning(["name", "email"])
        .then(data => {
            res.json(data[0])
        })
        .catch(err => {
            if (err.detail && err.detail.includes("already exists")) {
                res.json('Email already exists');
            }
        })
    }
})

// Your login route
// Your login route
app.post('/login-user', (req, res) => {
    const { username, password } = req.body;

    db.select('name', 'email', 'password') // Include the 'password' column
        .from('users')
        .where({
            email: username
        })
        .then(data => {
            if (data.length > 0) {
                const user = data[0];
                if (user.password === password) {
                    // Password is correct
                    // Store the user information in the session
                    console.log('User data:', user);
                    req.session.user = user;
                    res.json(user);
                } else {
                    // Password is incorrect
                    res.json('Incorrect password');
                }
            } else {
                // User not found
                res.json('User not found');
            }
        })
        .catch(error => {
            console.error('Error during login:', error);
            res.json('An error occurred during login');
        });
});

// ... More existing code
const port = 3000;
app.listen(port, () => {
    console.log(`Listening on port ${port}......`);
})



