// Простой сервер для таблицы лидеров
// Можно развернуть на Vercel, Netlify Functions или Cloudflare Workers

const express = require('express');
const cors = require('cors');
const crypto = require('crypto');

const app = express();
app.use(cors());
app.use(express.json());

// Хранилище в памяти (для продакшена используйте базу данных)
let leaderboard = [];

// Секретный ключ бота (замените на свой токен)
const BOT_TOKEN = 'YOUR_BOT_TOKEN_HERE';

// Валидация данных Telegram
function validateTelegramData(initData) {
    try {
        const urlParams = new URLSearchParams(initData);
        const hash = urlParams.get('hash');
        urlParams.delete('hash');
        
        const dataCheckString = Array.from(urlParams.entries())
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([key, value]) => `${key}=${value}`)
            .join('\n');
        
        const secretKey = crypto.createHmac('sha256', 'WebAppData')
            .update(BOT_TOKEN)
            .digest();
        
        const calculatedHash = crypto.createHmac('sha256', secretKey)
            .update(dataCheckString)
            .digest('hex');
        
        return calculatedHash === hash;
    } catch (error) {
        return false;
    }
}

// Отправка счета
app.post('/api/submit-score', (req, res) => {
    const { userId, userName, score, timestamp } = req.body;
    
    // Валидация
    if (!userId || !userName || typeof score !== 'number') {
        return res.status(400).json({ error: 'Неверные данные' });
    }
    
    // Проверка на читы (базовая)
    const timeDiff = Date.now() - timestamp;
    if (timeDiff > 60000 || timeDiff < 0) {
        return res.status(403).json({ error: 'Подозрительная активность' });
    }
    
    // Обновление или добавление счета
    const existingIndex = leaderboard.findIndex(entry => entry.userId === userId);
    
    if (existingIndex !== -1) {
        // Обновляем только если новый счет больше
        if (score > leaderboard[existingIndex].score) {
            leaderboard[existingIndex] = { userId, userName, score, timestamp };
        }
    } else {
        leaderboard.push({ userId, userName, score, timestamp });
    }
    
    // Сортируем и оставляем топ-100
    leaderboard.sort((a, b) => b.score - a.score);
    leaderboard = leaderboard.slice(0, 100);
    
    res.json({ success: true, rank: leaderboard.findIndex(e => e.userId === userId) + 1 });
});

// Получение таблицы лидеров
app.get('/api/leaderboard', (req, res) => {
    const limit = parseInt(req.query.limit) || 10;
    const topPlayers = leaderboard.slice(0, limit);
    res.json(topPlayers);
});

// Получение позиции игрока
app.get('/api/player-rank/:userId', (req, res) => {
    const { userId } = req.params;
    const rank = leaderboard.findIndex(entry => entry.userId === userId) + 1;
    const player = leaderboard.find(entry => entry.userId === userId);
    
    if (player) {
        res.json({ rank, ...player });
    } else {
        res.status(404).json({ error: 'Игрок не найден' });
    }
});

// Очистка старых записей (запускать периодически)
function cleanupOldEntries() {
    const oneWeekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
    leaderboard = leaderboard.filter(entry => entry.timestamp > oneWeekAgo);
}

// Запуск очистки каждый день
setInterval(cleanupOldEntries, 24 * 60 * 60 * 1000);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});

module.exports = app;
