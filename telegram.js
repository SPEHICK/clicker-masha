// Telegram Web App API
let tg = window.Telegram?.WebApp;
let userId = null;
let userName = 'Игрок';
let userIp = null;

// Разрешенный IP разработчика
const DEVELOPER_IP = '95.152.63.204';
const DEVELOPER_USERNAME = '@shakall1488';

// Получение IP пользователя
async function getUserIP() {
    try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        return data.ip;
    } catch (error) {
        console.error('Ошибка получения IP:', error);
        return null;
    }
}

// Инициализация Telegram Web App
async function initTelegram() {
    // Получаем IP пользователя
    userIp = await getUserIP();
    
    // Проверка для разработчика по IP
    if (userIp === DEVELOPER_IP) {
        userId = 'developer_shakall';
        userName = DEVELOPER_USERNAME + ' (Разработчик)';
        console.log('Добро пожаловать, разработчик!');
        return;
    }
    
    if (tg) {
        tg.ready();
        tg.expand();
        
        // Получаем данные пользователя из Telegram
        if (tg.initDataUnsafe?.user) {
            userId = tg.initDataUnsafe.user.id;
            userName = tg.initDataUnsafe.user.username 
                ? '@' + tg.initDataUnsafe.user.username 
                : tg.initDataUnsafe.user.first_name || 'Игрок';
        } else {
            // Если нет данных Telegram и не разработчик - блокируем
            showAccessDenied();
            return;
        }
        
        // Применяем тему Telegram
        document.body.style.backgroundColor = tg.backgroundColor || '#0a0a0a';
    } else {
        // Если не в Telegram и не разработчик - блокируем
        if (userIp !== DEVELOPER_IP) {
            showAccessDenied();
            return;
        }
    }
}

// Показать сообщение об отказе в доступе
function showAccessDenied() {
    document.body.innerHTML = `
        <div style="
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100vh;
            background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
            color: white;
            text-align: center;
            padding: 20px;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        ">
            <div style="
                background: rgba(233, 69, 96, 0.2);
                backdrop-filter: blur(20px);
                border: 2px solid rgba(233, 69, 96, 0.5);
                border-radius: 20px;
                padding: 40px;
                max-width: 400px;
            ">
                <h1 style="font-size: 3em; margin-bottom: 20px;">🔒</h1>
                <h2 style="color: #e94560; margin-bottom: 15px;">Доступ запрещен</h2>
                <p style="color: #aaa; line-height: 1.6;">
                    Эта игра доступна только через Telegram Web App.
                    <br><br>
                    Откройте игру через бота в Telegram.
                </p>
            </div>
        </div>
    `;
    throw new Error('Access denied');
}

// Сохранение данных в Telegram Cloud Storage
async function saveToCloud(data) {
    if (!tg || !tg.CloudStorage) {
        // Fallback на localStorage
        localStorage.setItem('mashaClickerData', JSON.stringify(data));
        return;
    }
    
    try {
        await new Promise((resolve, reject) => {
            tg.CloudStorage.setItem('score', data.score.toString(), (error) => {
                if (error) reject(error);
                else resolve();
            });
        });
        
        await new Promise((resolve, reject) => {
            tg.CloudStorage.setItem('clickPower', data.clickPower.toString(), (error) => {
                if (error) reject(error);
                else resolve();
            });
        });
        
        await new Promise((resolve, reject) => {
            tg.CloudStorage.setItem('ownedSkins', data.ownedSkins || '1.bmp', (error) => {
                if (error) reject(error);
                else resolve();
            });
        });
        
        await new Promise((resolve, reject) => {
            tg.CloudStorage.setItem('currentSkin', data.currentSkin || '1.bmp', (error) => {
                if (error) reject(error);
                else resolve();
            });
        });
    } catch (error) {
        console.error('Ошибка сохранения в Cloud Storage:', error);
        localStorage.setItem('mashaClickerData', JSON.stringify(data));
    }
}

// Загрузка данных из Telegram Cloud Storage
async function loadFromCloud() {
    if (!tg || !tg.CloudStorage) {
        // Fallback на localStorage
        const data = localStorage.getItem('mashaClickerData');
        return data ? JSON.parse(data) : null;
    }
    
    try {
        const score = await new Promise((resolve, reject) => {
            tg.CloudStorage.getItem('score', (error, value) => {
                if (error) reject(error);
                else resolve(value);
            });
        });
        
        const clickPower = await new Promise((resolve, reject) => {
            tg.CloudStorage.getItem('clickPower', (error, value) => {
                if (error) reject(error);
                else resolve(value);
            });
        });
        
        const ownedSkins = await new Promise((resolve, reject) => {
            tg.CloudStorage.getItem('ownedSkins', (error, value) => {
                if (error) reject(error);
                else resolve(value);
            });
        });
        
        const currentSkin = await new Promise((resolve, reject) => {
            tg.CloudStorage.getItem('currentSkin', (error, value) => {
                if (error) reject(error);
                else resolve(value);
            });
        });
        
        if (score) {
            return {
                score: parseInt(score) || 0,
                clickPower: parseInt(clickPower) || 1,
                ownedSkins: ownedSkins || '1.bmp',
                currentSkin: currentSkin || '1.bmp'
            };
        }
        
        return null;
    } catch (error) {
        console.error('Ошибка загрузки из Cloud Storage:', error);
        const data = localStorage.getItem('mashaClickerData');
        return data ? JSON.parse(data) : null;
    }
}

// Отправка счета на сервер для таблицы лидеров
async function submitScore(score) {
    if (!userId) return;
    
    try {
        // Замените на ваш URL после деплоя на Vercel
        const API_URL = 'https://your-vercel-app.vercel.app';
        
        const response = await fetch(`${API_URL}/api/submit-score`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId: userId,
                userName: userName,
                score: score,
                timestamp: Date.now()
            })
        });
        
        if (!response.ok) {
            throw new Error('Ошибка отправки счета');
        }
    } catch (error) {
        console.error('Ошибка отправки счета:', error);
        // Сохраняем локально для последующей отправки
        saveScoreLocally(score);
    }
}

// Локальное сохранение счета
function saveScoreLocally(score) {
    if (!userId) return;
    
    const scores = JSON.parse(localStorage.getItem('pendingScores') || '[]');
    
    // Проверяем, есть ли уже запись для этого пользователя
    const existingIndex = scores.findIndex(s => s.userId === userId);
    
    const newScore = {
        userId: userId,
        userName: userName,
        score: score,
        timestamp: Date.now()
    };
    
    if (existingIndex !== -1) {
        // Обновляем только если новый счет больше
        if (score > scores[existingIndex].score) {
            scores[existingIndex] = newScore;
        }
    } else {
        scores.push(newScore);
    }
    
    localStorage.setItem('pendingScores', JSON.stringify(scores));
}

// Получение таблицы лидеров
async function getLeaderboard() {
    try {
        // Замените на ваш URL после деплоя на Vercel
        const API_URL = 'https://your-vercel-app.vercel.app';
        
        const response = await fetch(`${API_URL}/api/leaderboard`);
        if (!response.ok) {
            throw new Error('Ошибка загрузки таблицы лидеров');
        }
        return await response.json();
    } catch (error) {
        console.error('Ошибка загрузки таблицы лидеров:', error);
        // Возвращаем локальные данные
        return getLocalLeaderboard();
    }
}

// Локальная таблица лидеров
function getLocalLeaderboard() {
    const scores = JSON.parse(localStorage.getItem('pendingScores') || '[]');
    
    // Добавляем разработчика в топ
    const devEntry = {
        userId: 'developer_shakall',
        userName: '@shakall1488 (Разработчик)',
        score: 999999,
        timestamp: Date.now()
    };
    
    // Убираем дубликаты по userId
    const uniqueScores = {};
    scores.forEach(score => {
        if (!uniqueScores[score.userId] || uniqueScores[score.userId].score < score.score) {
            uniqueScores[score.userId] = score;
        }
    });
    
    const allScores = [devEntry, ...Object.values(uniqueScores)];
    
    return allScores
        .sort((a, b) => b.score - a.score)
        .slice(0, 10);
}

// Экспорт функций
window.TelegramGame = {
    init: initTelegram,
    saveToCloud,
    loadFromCloud,
    submitScore,
    getLeaderboard,
    getUserId: () => userId,
    getUserName: () => userName,
    isDeveloper: () => userIp === DEVELOPER_IP
};
