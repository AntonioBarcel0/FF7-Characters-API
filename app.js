const express = require('express');
const app = express();

// Configuración
app.set('view engine', 'pug');
app.set('views', './views');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Base de datos simulada
let characters = [
    { id: 1, name: 'Cloud Strife', job: 'Soldier', weapon: 'Buster sword', level: 25 },
    { id: 2, name: 'Tifa Lockhart', job: 'Fighter', weapon: 'Leather gloves', level: 22 },
    { id: 3, name: 'Aerith Gainsborough', job: 'Mage', weapon: 'Magic staff', level: 20 }
];

// ========== API ENDPOINTS ==========

// GET /characters - Devuelve todos los personajes
app.get('/characters', (req, res) => {
    res.json(characters);
});

// GET /characters/:id - Devuelve un personaje por ID
app.get('/characters/:id', (req, res) => {
    const character = characters.find(c => c.id === parseInt(req.params.id));
    if (!character) {
        return res.status(404).json({ error: 'Character not found' });
    }
    res.json(character);
});

// POST /characters - Crea un nuevo personaje
app.post('/characters', (req, res) => {
    // Verificar si el cuerpo está vacío
    if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({ error: 'Request body is empty' });
    }

    const { id, name, job, weapon, level } = req.body;

    // Validar nivel
    if (level < 1 || level > 99) {
        return res.status(400).json({ error: 'Level must be between 1 and 99' });
    }

    // Verificar ID duplicado
    if (characters.find(c => c.id === id)) {
        return res.status(400).json({ error: 'ID already exists' });
    }

    // Verificar nombre duplicado
    if (characters.find(c => c.name === name)) {
        return res.status(400).json({ error: 'Name already exists' });
    }

    const newCharacter = { id, name, job, weapon, level };
    characters.push(newCharacter);
    res.status(201).json(newCharacter);
});

// PUT /characters/:id - Actualiza un personaje
app.put('/characters/:id', (req, res) => {
    const characterIndex = characters.findIndex(c => c.id === parseInt(req.params.id));
    
    // Verificar si existe el personaje
    if (characterIndex === -1) {
        return res.status(404).json({ error: 'Character does not exist' });
    }

    // Verificar si el cuerpo está vacío
    if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({ error: 'Request body is empty' });
    }

    const { id, name, job, weapon, level } = req.body;

    // Validar nivel
    if (level < 1 || level > 99) {
        return res.status(400).json({ error: 'Level must be between 1 and 99' });
    }

    // Verificar ID duplicado (excepto el actual)
    if (id !== parseInt(req.params.id) && characters.find(c => c.id === id)) {
        return res.status(400).json({ error: 'ID already exists' });
    }

    // Verificar nombre duplicado (excepto el actual)
    if (characters.find((c, index) => c.name === name && index !== characterIndex)) {
        return res.status(400).json({ error: 'Name already exists' });
    }

    characters[characterIndex] = { id, name, job, weapon, level };
    res.status(204).send();
});

// DELETE /characters/:id - Elimina un personaje
app.delete('/characters/:id', (req, res) => {
    const characterIndex = characters.findIndex(c => c.id === parseInt(req.params.id));
    
    if (characterIndex === -1) {
        return res.status(404).json({ error: 'Character does not exist' });
    }

    characters.splice(characterIndex, 1);
    res.status(204).send();
});

// ========== VISTAS PUG ==========

// /index - Página de bienvenida
app.get('/index', (req, res) => {
    res.render('index', { title: 'Welcome' });
});

// /list - Lista de personajes
app.get('/list', (req, res) => {
    res.render('list', { title: 'Character list', characters });
});

// /new - Formulario para nuevo personaje
app.get('/new', (req, res) => {
    res.render('new', { title: 'New character' });
});

// POST desde el formulario
app.post('/new', (req, res) => {
    const { id, name, job, weapon, level } = req.body;
    const newCharacter = { 
        id: parseInt(id), 
        name, 
        job, 
        weapon, 
        level: parseInt(level) 
    };
    characters.push(newCharacter);
    res.redirect('/list');
});

// Iniciar servidor
const PORT = 8080;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
