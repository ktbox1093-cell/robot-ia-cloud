const express = require('express');
const fetch = require('node-fetch');
const app = express();
app.use(express.json());

// Lee la clave de forma segura desde las variables privadas de la nube
const MASTER_API_KEY = process.env.GROQ_API_KEY; 

app.post('/api/chat', async (req, res) => {
    try {
        const { model, messages, system } = req.body;
        const allMessages = [{ role: "system", content: system }, ...messages];
        
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${MASTER_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: model || "llama-3.3-70b-versatile",
                messages: allMessages,
                max_tokens: 600
            })
        });
        
        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(process.env.PORT || 3000, () => console.log("Nube privada activa"));
