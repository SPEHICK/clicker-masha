// Telegram Web App API
let tg = window.Telegram?.WebApp;
let userId = null;
let userName = 'Игрок';
let userPhoto = null;
let userIp = null;

// ID разработчика в Telegram
const DEVELOPER_TELEGRAM_ID = 'YOUR_TELEGRAM_ID'; // Замените на ваш реальный Telegram ID
const DEVELOPER_USERNAME = '@shakall1488';
const DEVELOPER_IP = '95.152.63.204'; // IP разработчика для доступа без Telegram

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
    
    // Проверка на разработчика по IP (доступ без Telegram)
    if (userIp === DEVELOPER_IP) {
        userId = 'developer_shakall';
        userName = DEVELOPER_USERNAME + ' (Разработчик)';
        console.log('Доступ разработчика по IP:', userIp);
        return; // Разрешаем доступ
    }
    
    if (tg) {
        tg.ready();
        tg.expand();
        
        // Получаем данные пользователя из Telegram
        if (tg.initDataUnsafe?.user) {
            userId = tg.initDataUnsafe.user.id;
            
            // Формируем имя пользователя
            if (tg.initDataUnsafe.user.username) {
                userName = '@' + tg.initDataUnsafe.user.username;
            } else if (tg.initDataUnsafe.user.first_name) {
                userName = tg.initDataUnsafe.user.first_name;
                if (tg.initDataUnsafe.user.last_name) {
                    userName += ' ' + tg.initDataUnsafe.user.last_name;
                }
            } else {
                userName = 'Игрок';
            }
            
            // Получаем фото профиля
            userPhoto = tg.initDataUnsafe.user.photo_url || null;
            
            // Проверка на разработчика по Telegram ID
            if (userId.toString() === DEVELOPER_TELEGRAM_ID) {
                userName = DEVELOPER_USERNAME + ' (Разработчик)';
                console.log('Добро пожаловать, разработчик!');
            }
            
            console.log('Пользователь:', userName, 'ID:', userId);
        } else {
            // Если нет данных Telegram - блокируем
            showAccessDenied();
            return;
        }
        
        // Применяем тему Telegram
        document.body.style.backgroundColor = tg.backgroundColor || '#0a0a0a';
    } else {
        // Если не в Telegram - блокируем
        showAccessDenied();
        return;
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

// Отправка счета в общую таблицу лидеров
async function submitScore(score) {
    if (!userId) return;
    
    try {
        // Валидация данных
        if (typeof score !== 'number' || score < 0 || !isFinite(score)) {
            console.error('Некорректный счет:', score);
            return;
        }
        
        console.log('Отправка счета:', score, 'для пользователя:', userName);
        
        // Сохраняем в localStorage как общую базу
        const storageKey = 'masha_global_leaderboard';
        let leaderboard = [];
        
        try {
            const stored = localStorage.getItem(storageKey);
            if (stored) {
                leaderboard = JSON.parse(stored);
            }
        } catch (e) {
            console.error('Ошибка чтения leaderboard:', e);
            leaderboard = [];
        }
        
        // Обновляем или добавляем игрока
        const existingIndex = leaderboard.findIndex(entry => entry.userId === userId);
        const newEntry = {
            userId: userId,
            userName: userName,
            score: Math.floor(score),
            timestamp: Date.now()
        };
        
        if (existingIndex !== -1) {
            // Обновляем только если новый счет больше
            if (score > leaderboard[existingIndex].score) {
                leaderboard[existingIndex] = newEntry;
                console.log('Обновлен счет в топе');
            }
        } else {
            leaderboard.push(newEntry);
            console.log('Добавлен новый игрок в топ');
        }
        
        // Сортируем и оставляем топ-100
        leaderboard.sort((a, b) => b.score - a.score);
        leaderboard = leaderboard.slice(0, 100);
        
        // Сохраняем
        localStorage.setItem(storageKey, JSON.stringify(leaderboard));
        console.log('Топ сохранен, всего игроков:', leaderboard.length);
        
        // Также пробуем сохранить в Cloud Storage
        if (tg && tg.CloudStorage) {
            try {
                await new Promise((resolve, reject) => {
                    tg.CloudStorage.setItem(`user_score_${userId}`, JSON.stringify(newEntry), (error) => {
                        if (error) reject(error);
                        else resolve();
                    });
                });
                console.log('Счет сохранен в Cloud Storage');
            } catch (e) {
                console.warn('Cloud Storage недоступен:', e);
            }
        }
    } catch (error) {
        console.error('Ошибка отправки счета:', error);
    }
}

// Локальное сохранение счета с защитой от перезаписи
function saveScoreLocally(score) {
    if (!userId) return;
    
    // Валидация данных
    if (typeof score !== 'number' || score < 0 || !isFinite(score)) {
        console.error('Некорректный счет:', score);
        return;
    }
    
    const scores = JSON.parse(localStorage.getItem('pendingScores') || '[]');
    
    // Проверяем, есть ли уже запись для этого пользователя
    const existingIndex = scores.findIndex(s => s.userId === userId);
    
    const newScore = {
        userId: userId,
        userName: userName,
        score: Math.floor(score), // Округляем для защиты
        timestamp: Date.now()
    };
    
    if (existingIndex !== -1) {
        // Обновляем только если новый счет больше (защита от перезаписи)
        if (score > scores[existingIndex].score) {
            scores[existingIndex] = newScore;
        }
    } else {
        scores.push(newScore);
    }
    
    // Ограничиваем размер хранилища
    if (scores.length > 100) {
        scores.sort((a, b) => b.score - a.score);
        scores.splice(100);
    }
    
    localStorage.setItem('pendingScores', JSON.stringify(scores));
}

// Получение таблицы лидеров
async function getLeaderboard() {
    console.log('Загрузка таблицы лидеров...');
    
    try {
        const storageKey = 'masha_global_leaderboard';
        const stored = localStorage.getItem(storageKey);
        
        if (stored) {
            const leaderboard = JSON.parse(stored);
            console.log('Загружено из localStorage:', leaderboard.length, 'игроков');
            
            // Убираем дубликаты по userId
            const uniqueScores = {};
            leaderboard.forEach(score => {
                if (!uniqueScores[score.userId] || uniqueScores[score.userId].score < score.score) {
                    uniqueScores[score.userId] = score;
                }
            });
            
            const result = Object.values(uniqueScores)
                .sort((a, b) => b.score - a.score)
                .slice(0, 10);
            
            console.log('Топ-10:', result);
            return result;
        }
        
        // Если пусто, добавляем текущего пользователя
        if (userId) {
            console.log('Создаем новый топ с текущим игроком');
            const initialEntry = {
                userId: userId,
                userName: userName,
                score: 0,
                timestamp: Date.now()
            };
            
            localStorage.setItem(storageKey, JSON.stringify([initialEntry]));
            return [initialEntry];
        }
        
        console.log('Топ пуст');
        return [];
    } catch (error) {
        console.error('Ошибка загрузки таблицы лидеров:', error);
        return [];
    }
}

// Локальная таблица лидеров
function getLocalLeaderboard() {
    const scores = JSON.parse(localStorage.getItem('pendingScores') || '[]');
    
    // Убираем дубликаты по userId
    const uniqueScores = {};
    scores.forEach(score => {
        if (!uniqueScores[score.userId] || uniqueScores[score.userId].score < score.score) {
            uniqueScores[score.userId] = score;
        }
    });
    
    // Добавляем текущего пользователя если его нет
    if (userId && !uniqueScores[userId]) {
        uniqueScores[userId] = {
            userId: userId,
            userName: userName,
            score: 0,
            timestamp: Date.now()
        };
    }
    
    return Object.values(uniqueScores)
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
    getUserPhoto: () => userPhoto,
    isDeveloper: () => {
        // Проверка по IP или Telegram ID
        return (userIp === DEVELOPER_IP) || (userId && userId.toString() === DEVELOPER_TELEGRAM_ID);
    }
};
