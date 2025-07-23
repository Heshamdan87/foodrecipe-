const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

// Load configuration
const config = require('./webServerApiSettings.json');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from DesignTool directory
const filesDirectory = path.join(__dirname, config.FilesDirectory);
if (!fs.existsSync(filesDirectory)) {
  fs.mkdirSync(filesDirectory, { recursive: true });
}
app.use('/files', express.static(filesDirectory));

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// In-memory storage for recipes (in a real app, you'd use a database)
let recipes = [
  {
    id: 1,
    title: "Classic Chocolate Chip Cookies",
    description: "Delicious homemade chocolate chip cookies",
    ingredients: [
      "2¼ cups all-purpose flour",
      "1 tsp baking soda",
      "1 tsp salt",
      "1 cup butter, softened",
      "¾ cup granulated sugar",
      "¾ cup brown sugar",
      "2 large eggs",
      "2 tsp vanilla extract",
      "2 cups chocolate chips"
    ],
    instructions: [
      "Preheat oven to 375°F (190°C)",
      "Mix flour, baking soda, and salt in a bowl",
      "Cream together butter and sugars",
      "Beat in eggs and vanilla",
      "Gradually blend in flour mixture",
      "Stir in chocolate chips",
      "Drop rounded tablespoons on ungreased cookie sheets",
      "Bake 9-11 minutes until golden brown"
    ],
    cookTime: "25 minutes",
    servings: "48 cookies",
    category: "Dessert"
  },
  {
    id: 2,
    title: "Mediterranean Pasta Salad",
    description: "Fresh and healthy pasta salad with Mediterranean flavors",
    ingredients: [
      "1 lb pasta",
      "2 cups cherry tomatoes, halved",
      "1 cup kalamata olives",
      "1 cup feta cheese, crumbled",
      "½ red onion, thinly sliced",
      "¼ cup olive oil",
      "2 tbsp red wine vinegar",
      "2 tsp oregano",
      "Salt and pepper to taste"
    ],
    instructions: [
      "Cook pasta according to package directions",
      "Drain and rinse with cold water",
      "Combine pasta with tomatoes, olives, feta, and onion",
      "Whisk together olive oil, vinegar, oregano, salt, and pepper",
      "Toss salad with dressing",
      "Chill for at least 1 hour before serving"
    ],
    cookTime: "20 minutes",
    servings: "6-8 people",
    category: "Salad"
  }
];

// API Routes
app.get('/api/recipes', (req, res) => {
  res.json(recipes);
});

app.get('/api/recipes/:id', (req, res) => {
  const recipe = recipes.find(r => r.id === parseInt(req.params.id));
  if (!recipe) {
    return res.status(404).json({ error: 'Recipe not found' });
  }
  res.json(recipe);
});

app.post('/api/recipes', (req, res) => {
  const newRecipe = {
    id: recipes.length + 1,
    ...req.body,
    createdAt: new Date().toISOString()
  };
  recipes.push(newRecipe);
  res.status(201).json(newRecipe);
  
  // Emit to all connected clients
  io.emit('recipeAdded', newRecipe);
});

app.put('/api/recipes/:id', (req, res) => {
  const index = recipes.findIndex(r => r.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ error: 'Recipe not found' });
  }
  
  recipes[index] = { ...recipes[index], ...req.body };
  res.json(recipes[index]);
  
  // Emit to all connected clients
  io.emit('recipeUpdated', recipes[index]);
});

app.delete('/api/recipes/:id', (req, res) => {
  const index = recipes.findIndex(r => r.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ error: 'Recipe not found' });
  }
  
  const deletedRecipe = recipes.splice(index, 1)[0];
  res.json(deletedRecipe);
  
  // Emit to all connected clients
  io.emit('recipeDeleted', deletedRecipe.id);
});

// Search recipes
app.get('/api/search', (req, res) => {
  const query = req.query.q?.toLowerCase() || '';
  const category = req.query.category?.toLowerCase();
  
  let filteredRecipes = recipes.filter(recipe => 
    recipe.title.toLowerCase().includes(query) ||
    recipe.description.toLowerCase().includes(query) ||
    recipe.ingredients.some(ingredient => ingredient.toLowerCase().includes(query))
  );
  
  if (category) {
    filteredRecipes = filteredRecipes.filter(recipe => 
      recipe.category.toLowerCase() === category
    );
  }
  
  res.json(filteredRecipes);
});

// Get recipe categories
app.get('/api/categories', (req, res) => {
  const categories = [...new Set(recipes.map(recipe => recipe.category))];
  res.json(categories);
});

// WebSocket connection handling
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);
  
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
  
  socket.on('requestRecipes', () => {
    socket.emit('recipesList', recipes);
  });
});

// Terminal output capture (if enabled)
if (config.useTerminalOutputCapture) {
  const originalConsoleLog = console.log;
  console.log = (...args) => {
    let output = args.join(' ');
    
    if (config.useTerminalOutputAnsiStrip) {
      // Strip ANSI codes
      output = output.replace(/\x1b\[[0-9;]*m/g, '');
    }
    
    if (config.useTerminalOutputToHtml) {
      // Convert to HTML (basic implementation)
      output = output.replace(/\n/g, '<br>');
    }
    
    // Emit to connected clients
    io.emit('terminalOutput', output);
    
    // Call original console.log
    originalConsoleLog.apply(console, args);
  };
}

// Default route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the web server
server.listen(config.webServerPort, () => {
  console.log(`🍳 Food Recipe Server is running on http://localhost:${config.webServerPort}`);
  console.log(`🔌 WebSocket server is running on port ${config.webSocketPort}`);
  console.log(`📁 Files directory: ${config.FilesDirectory}`);
});

// Start WebSocket on separate port if different from web server
if (config.webSocketPort !== config.webServerPort) {
  const wsServer = http.createServer();
  const wsIo = socketIo(wsServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });
  
  wsIo.on('connection', (socket) => {
    console.log('WebSocket user connected:', socket.id);
    socket.on('disconnect', () => {
      console.log('WebSocket user disconnected:', socket.id);
    });
  });
  
  wsServer.listen(config.webSocketPort, () => {
    console.log(`🔌 Dedicated WebSocket server is running on port ${config.webSocketPort}`);
  });
}
