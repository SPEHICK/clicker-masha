let score = 0;
let clickPower = 1;
let clickUpgradeCost = 10;
let lastSaveTime = Date.now();
let lastScoreSubmit = 0;
let currentSkin = '1.bmp';
let ownedSkins = ['1.bmp'];

const skins = [
    { id: '1.bmp', name: 'Маша', cost: 0, owned: true, color: '#e94560' },
    { id: '2.jpg', name: 'Маша Премиум', cost: 1000, color: '#9b59b6' },
    { id: '3.jpg', name: 'Маша Золотая', cost: 5000, color: '#f39c12' },
    { id: '4.jpg', name: 'Маша Алмазная', cost: 15000, color: '#3498db' },
    { id: '5.jpg', name: 'Маша Легендарная', cost: 50000, color: '#e74c3c' },
    { id: '6.png', name: 'Маша Мифическая', cost: 150000, color: '#8e44ad' }
];

const scoreElement = document.getElementById('score');
const perClickElement = document.getElementById('perClick');
const clickButton = document.getElementById('clickButton');
const upgradeButtons = document.querySelectorAll('.upgrade-button');

// Инициализация при загрузке
window.addEventListener('DOMContentLoaded', async () => {
    if (window.TelegramGame) {
        await window.TelegramGame.init();
        await loadGameData();
        
        // Автоматически добавляем игрока в топ при первом запуске
        if (score === 0) {
            await window.TelegramGame.submitScore(0);
        }
    }
    initTabs();
    renderSkins();
});

clickButton.addEventListener('click', () => {
    score += clickPower;
    updateDisplay();
    animateClick();
    autoSave();
});

upgradeButtons.forEach(button => {
    button.addEventListener('click', () => {
        const upgradeType = button.dataset.upgrade;
        const cost = parseInt(button.dataset.cost);
        
        if (score >= cost) {
            score -= cost;
            
            if (upgradeType === 'click') {
                clickPower++;
                clickUpgradeCost = Math.floor(clickUpgradeCost * 1.8);
                button.dataset.cost = clickUpgradeCost;
                button.textContent = `Купить (${clickUpgradeCost})`;
            }
            
            updateDisplay();
            autoSave();
        }
    });
});

function updateDisplay() {
    scoreElement.textContent = score;
    perClickElement.textContent = clickPower;
    
    upgradeButtons.forEach(button => {
        const cost = parseInt(button.dataset.cost);
        button.disabled = score < cost;
    });
}

function animateClick() {
    clickButton.classList.add('clicked');
    setTimeout(() => {
        clickButton.classList.remove('clicked');
    }, 600);
}

setInterval(() => {
    // Автокликер удален
}, 1000);

updateDisplay();


// Автосохранение
function autoSave() {
    const now = Date.now();
    if (now - lastSaveTime > 3000) { // Сохраняем каждые 3 секунды
        lastSaveTime = now;
        saveGameData();
    }
    
    // Отправляем счет в таблицу лидеров каждые 50 очков
    if (score - lastScoreSubmit >= 50) {
        lastScoreSubmit = score;
        if (window.TelegramGame) {
            window.TelegramGame.submitScore(score);
        }
    }
}

// Сохранение данных игры
async function saveGameData() {
    if (!window.TelegramGame) return;
    
    const data = {
        score,
        clickPower,
        autoClickerCount,
        clickUpgradeCost,
        autoClickerCost
    };
    
    await window.TelegramGame.saveToCloud(data);
}

// Загрузка данных игры
async function loadGameData() {
    if (!window.TelegramGame) return;
    
    const data = await window.TelegramGame.loadFromCloud();
    if (data) {
        score = data.score || 0;
        clickPower = data.clickPower || 1;
        currentSkin = data.currentSkin || '1.bmp';
        
        if (data.ownedSkins) {
            ownedSkins = data.ownedSkins.split(',').filter(s => s);
        }
        
        // Пересчитываем стоимость улучшений
        clickUpgradeCost = Math.floor(10 * Math.pow(1.8, clickPower - 1));
        
        updateClickButtonImage();
        updateDisplay();
        updateUpgradeButtons();
        renderSkins();
        
        // Применяем цвет текущего скина
        const currentSkinData = skins.find(s => s.id === currentSkin);
        if (currentSkinData) {
            changeThemeColor(currentSkinData.color);
        }
    }
}

// Обновление кнопок улучшений
function updateUpgradeButtons() {
    upgradeButtons.forEach(button => {
        const upgradeType = button.dataset.upgrade;
        if (upgradeType === 'click') {
            button.dataset.cost = clickUpgradeCost;
            button.textContent = `Купить (${clickUpgradeCost})`;
        }
    });
}

// Инициализация вкладок
function initTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabName = button.dataset.tab;
            
            // Убираем активный класс со всех вкладок
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Добавляем активный класс к выбранной вкладке
            button.classList.add('active');
            document.getElementById(`${tabName}-tab`).classList.add('active');
            
            // Загружаем таблицу лидеров при переключении
            if (tabName === 'leaderboard') {
                loadLeaderboard();
            }
            
            // Обновляем скины при переключении
            if (tabName === 'skins') {
                renderSkins();
            }
            
            // Обновляем профиль при переключении
            if (tabName === 'profile') {
                updateProfile();
            }
        });
    });
}

// Загрузка таблицы лидеров
async function loadLeaderboard() {
    const leaderboardElement = document.getElementById('leaderboard');
    leaderboardElement.innerHTML = '<div class="loading">Загрузка...</div>';
    
    if (!window.TelegramGame) {
        // Показываем тестовые данные если нет Telegram
        const testLeaders = [
            { userId: 'dev', userName: '@shakall1488 (Разработчик)', score: 999999 },
            { userId: 'test1', userName: 'Игрок 1', score: 5000 },
            { userId: 'test2', userName: 'Игрок 2', score: 3500 },
            { userId: 'test3', userName: 'Игрок 3', score: 2000 },
            { userId: 'test4', userName: 'Игрок 4', score: 1500 }
        ];
        displayLeaderboard(testLeaders);
        return;
    }
    
    try {
        const leaders = await window.TelegramGame.getLeaderboard();
        
        // Если список пустой, добавляем текущего игрока
        if (!leaders || leaders.length === 0) {
            const currentUser = {
                userId: window.TelegramGame.getUserId(),
                userName: window.TelegramGame.getUserName(),
                score: score,
                timestamp: Date.now()
            };
            displayLeaderboard([currentUser]);
        } else {
            displayLeaderboard(leaders);
        }
    } catch (error) {
        console.error('Ошибка загрузки топа:', error);
        leaderboardElement.innerHTML = '<div class="error">Ошибка загрузки</div>';
    }
}

// Отображение таблицы лидеров
function displayLeaderboard(leaders) {
    const leaderboardElement = document.getElementById('leaderboard');
    
    if (!leaders || leaders.length === 0) {
        leaderboardElement.innerHTML = '<div class="empty">Пока нет результатов</div>';
        return;
    }
    
    const currentUserId = window.TelegramGame ? window.TelegramGame.getUserId() : null;
    
    // Убираем дубликаты по userId
    const uniqueLeaders = [];
    const seenIds = new Set();
    
    for (const leader of leaders) {
        if (!seenIds.has(leader.userId)) {
            seenIds.add(leader.userId);
            uniqueLeaders.push(leader);
        }
    }
    
    let html = '<div class="leaderboard-list">';
    uniqueLeaders.forEach((leader, index) => {
        const isCurrentUser = leader.userId === currentUserId;
        const isDeveloper = leader.userName.includes('@shakall1488') || leader.userId === 'developer_shakall' || leader.userId === 'dev';
        const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '';
        const devBadge = isDeveloper ? ' 👑' : '';
        
        html += `
            <div class="leaderboard-item ${isCurrentUser ? 'current-user' : ''} ${isDeveloper ? 'developer' : ''}">
                <div class="rank">${medal || (index + 1)}</div>
                <div class="player-name">${leader.userName}${devBadge}</div>
                <div class="player-score">${leader.score.toLocaleString()}</div>
            </div>
        `;
    });
    html += '</div>';
    
    leaderboardElement.innerHTML = html;
}

// Сохранение при закрытии
window.addEventListener('beforeunload', () => {
    saveGameData();
});


// Отрисовка скинов
function renderSkins() {
    const container = document.getElementById('skinsContainer');
    if (!container) return;
    
    container.innerHTML = '';
    
    skins.forEach(skin => {
        const isOwned = ownedSkins.includes(skin.id);
        const isCurrent = currentSkin === skin.id;
        const canBuy = score >= skin.cost && !isOwned;
        
        const skinCard = document.createElement('div');
        skinCard.className = `skin-card ${isCurrent ? 'active' : ''} ${isOwned ? 'owned' : ''} ${canBuy ? 'can-buy' : ''}`;
        
        skinCard.innerHTML = `
            <div class="skin-preview">
                <img src="${skin.id}" alt="${skin.name}" onerror="this.src='1.bmp'">
                ${isCurrent ? '<div class="current-badge">Активен</div>' : ''}
                ${isOwned && !isCurrent ? '<div class="owned-badge">Куплен</div>' : ''}
                ${canBuy ? '<div class="can-buy-badge">Доступен!</div>' : ''}
            </div>
            <div class="skin-info">
                <h3>${skin.name}</h3>
                <div class="skin-cost">
                    ${skin.cost === 0 ? 'Бесплатно' : `${skin.cost} 💎`}
                </div>
            </div>
            <button class="skin-button ${isOwned ? 'select' : 'buy'} ${canBuy ? 'pulse' : ''}" 
                    data-skin="${skin.id}" 
                    ${!canBuy && !isOwned ? 'disabled' : ''}>
                ${isCurrent ? '✓ Выбран' : isOwned ? 'Выбрать' : canBuy ? '🎉 Купить!' : 'Недостаточно'}
            </button>
        `;
        
        const button = skinCard.querySelector('.skin-button');
        button.addEventListener('click', () => handleSkinAction(skin));
        
        container.appendChild(skinCard);
    });
    
    // Проверяем доступность новых скинов
    checkNewSkinsAvailable();
}

// Обработка действий со скинами
function handleSkinAction(skin) {
    const isOwned = ownedSkins.includes(skin.id);
    
    if (!isOwned) {
        // Покупка скина
        if (score >= skin.cost) {
            score -= skin.cost;
            ownedSkins.push(skin.id);
            currentSkin = skin.id;
            updateClickButtonImage();
            updateDisplay();
            renderSkins();
            saveGameData();
            
            // Салют при покупке
            createFireworks();
            showNotification(`🎉 Куплен скин: ${skin.name}!`);
            
            // Меняем цвет интерфейса
            changeThemeColor(skin.color);
        }
    } else if (currentSkin !== skin.id) {
        // Выбор скина
        currentSkin = skin.id;
        updateClickButtonImage();
        renderSkins();
        saveGameData();
        showNotification(`Выбран скин: ${skin.name}`);
        
        // Меняем цвет интерфейса
        changeThemeColor(skin.color);
    }
}

// Обновление изображения кнопки
function updateClickButtonImage() {
    const img = clickButton.querySelector('img');
    if (img) {
        img.src = currentSkin;
    }
}

// Уведомления
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 2000);
}

// Обновление сохранения данных
async function saveGameData() {
    if (!window.TelegramGame) return;
    
    const data = {
        score,
        clickPower,
        clickUpgradeCost,
        currentSkin,
        ownedSkins: ownedSkins.join(',')
    };
    
    await window.TelegramGame.saveToCloud(data);
}

// Проверка доступности новых скинов
let lastNotifiedSkin = null;

function checkNewSkinsAvailable() {
    const availableSkins = skins.filter(skin => 
        !ownedSkins.includes(skin.id) && score >= skin.cost
    );
    
    if (availableSkins.length > 0) {
        const firstAvailable = availableSkins[0];
        
        // Показываем уведомление только если это новый доступный скин
        if (lastNotifiedSkin !== firstAvailable.id) {
            lastNotifiedSkin = firstAvailable.id;
            showNotification(`🎉 Доступен новый скин: ${firstAvailable.name}!`);
        }
    }
}

// Обновляем проверку при изменении счета
const originalUpdateDisplay = updateDisplay;
updateDisplay = function() {
    originalUpdateDisplay();
    checkNewSkinsAvailable();
};


// Обновление профиля
function updateProfile() {
    const userName = window.TelegramGame ? window.TelegramGame.getUserName() : 'Игрок';
    const userId = window.TelegramGame ? window.TelegramGame.getUserId() : 'test';
    const isDev = window.TelegramGame ? window.TelegramGame.isDeveloper() : false;
    
    document.getElementById('profileName').textContent = userName;
    document.getElementById('profileId').textContent = `ID: ${userId}`;
    document.getElementById('profileAvatar').src = currentSkin;
    document.getElementById('profileScore').textContent = score.toLocaleString();
    document.getElementById('profileClickPower').textContent = clickPower;
    document.getElementById('profileSkins').textContent = ownedSkins.length;
    
    // Показываем кнопку сброса только для разработчика
    const resetButton = document.getElementById('resetButton');
    if (resetButton) {
        resetButton.style.display = isDev ? 'block' : 'none';
    }
    
    renderAchievements();
}

// Достижения
const achievements = [
    { id: 'first_click', name: 'Первый клик', desc: 'Сделай клик', icon: '👆', condition: () => score >= 1 },
    { id: 'hundred', name: 'Сотня', desc: '100 очков', icon: '💯', condition: () => score >= 100 },
    { id: 'thousand', name: 'Тысяча', desc: '1000 очков', icon: '🎯', condition: () => score >= 1000 },
    { id: 'ten_thousand', name: '10К', desc: '10000 очков', icon: '🔥', condition: () => score >= 10000 },
    { id: 'first_upgrade', name: 'Улучшение', desc: 'Купи клик', icon: '⬆️', condition: () => clickPower > 1 },
    { id: 'skin_collector', name: 'Коллекционер', desc: '3 скина', icon: '🎨', condition: () => ownedSkins.length >= 3 },
    { id: 'all_skins', name: 'Все скины', desc: 'Купи все', icon: '👑', condition: () => ownedSkins.length >= skins.length }
];

// Отрисовка достижений
function renderAchievements() {
    const container = document.getElementById('achievementsGrid');
    if (!container) return;
    
    container.innerHTML = '';
    
    achievements.forEach(achievement => {
        const unlocked = achievement.condition();
        
        const achievementCard = document.createElement('div');
        achievementCard.className = `achievement-card ${unlocked ? 'unlocked' : 'locked'}`;
        
        achievementCard.innerHTML = `
            <div class="achievement-icon">${achievement.icon}</div>
            <div class="achievement-info">
                <div class="achievement-name">${achievement.name}</div>
                <div class="achievement-desc">${achievement.desc}</div>
            </div>
            ${unlocked ? '<div class="achievement-check">✓</div>' : ''}
        `;
        
        container.appendChild(achievementCard);
    });
}


// Смена цвета темы
function changeThemeColor(color) {
    document.documentElement.style.setProperty('--theme-color', color);
    
    // Конвертируем hex в RGB для использования в rgba()
    const rgb = hexToRgb(color);
    if (rgb) {
        document.documentElement.style.setProperty('--theme-color-rgb', `${rgb.r}, ${rgb.g}, ${rgb.b}`);
    }
    
    // Меняем фон
    const bgGradient = `radial-gradient(circle at 50% 50%, rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.15) 0%, rgba(10, 10, 10, 0.8) 100%)`;
    document.querySelector('.background-gradient').style.background = bgGradient;
    
    // Плавная анимация смены цвета
    document.body.style.transition = 'all 0.5s ease';
}

// Хелпер для конвертации hex в RGB
function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

// Салют при покупке скина
function createFireworks() {
    const fireworksContainer = document.createElement('div');
    fireworksContainer.className = 'fireworks-container';
    document.body.appendChild(fireworksContainer);
    
    // Создаем 30 частиц салюта
    for (let i = 0; i < 30; i++) {
        setTimeout(() => {
            createFireworkParticle(fireworksContainer);
        }, i * 50);
    }
    
    // Удаляем контейнер через 3 секунды
    setTimeout(() => {
        fireworksContainer.remove();
    }, 3000);
}

function createFireworkParticle(container) {
    const particle = document.createElement('div');
    particle.className = 'firework-particle';
    
    // Случайная позиция
    const startX = Math.random() * window.innerWidth;
    const startY = window.innerHeight;
    
    particle.style.left = startX + 'px';
    particle.style.top = startY + 'px';
    
    // Случайный цвет
    const colors = ['#e94560', '#f39c12', '#3498db', '#9b59b6', '#e74c3c', '#2ecc71'];
    particle.style.background = colors[Math.floor(Math.random() * colors.length)];
    
    container.appendChild(particle);
    
    // Анимация взлета
    const targetY = Math.random() * (window.innerHeight * 0.3) + 50;
    const targetX = startX + (Math.random() - 0.5) * 200;
    
    particle.animate([
        { transform: 'translate(0, 0) scale(1)', opacity: 1 },
        { transform: `translate(${targetX - startX}px, ${targetY - startY}px) scale(1.5)`, opacity: 1, offset: 0.5 },
        { transform: `translate(${targetX - startX}px, ${targetY - startY - 100}px) scale(0)`, opacity: 0 }
    ], {
        duration: 1500,
        easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
    });
    
    // Создаем искры при взрыве
    setTimeout(() => {
        createSparkles(targetX, targetY);
        particle.remove();
    }, 750);
}

function createSparkles(x, y) {
    const sparkleCount = 12;
    
    for (let i = 0; i < sparkleCount; i++) {
        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle';
        sparkle.style.left = x + 'px';
        sparkle.style.top = y + 'px';
        
        const colors = ['#e94560', '#f39c12', '#3498db', '#9b59b6', '#e74c3c', '#2ecc71', '#f1c40f'];
        sparkle.style.background = colors[Math.floor(Math.random() * colors.length)];
        
        document.body.appendChild(sparkle);
        
        const angle = (Math.PI * 2 * i) / sparkleCount;
        const distance = 100 + Math.random() * 50;
        const targetX = x + Math.cos(angle) * distance;
        const targetY = y + Math.sin(angle) * distance;
        
        sparkle.animate([
            { transform: 'translate(0, 0) scale(1)', opacity: 1 },
            { transform: `translate(${targetX - x}px, ${targetY - y}px) scale(0)`, opacity: 0 }
        ], {
            duration: 800 + Math.random() * 400,
            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
        });
        
        setTimeout(() => sparkle.remove(), 1200);
    }
}

// Применяем цвет при загрузке
window.addEventListener('DOMContentLoaded', () => {
    const currentSkinData = skins.find(s => s.id === currentSkin);
    if (currentSkinData) {
        changeThemeColor(currentSkinData.color);
    }
});


// Сброс прогресса (только для разработчика)
function resetProgress() {
    if (!window.TelegramGame || !window.TelegramGame.isDeveloper()) {
        showNotification('❌ Доступ запрещен');
        return;
    }
    
    const confirmed = confirm('Вы уверены что хотите сбросить весь прогресс? Это действие нельзя отменить!');
    
    if (confirmed) {
        // Сбрасываем все данные
        score = 0;
        clickPower = 1;
        clickUpgradeCost = 10;
        currentSkin = '1.bmp';
        ownedSkins = ['1.bmp'];
        
        // Очищаем localStorage
        localStorage.clear();
        
        // Очищаем Telegram Cloud Storage
        if (window.TelegramGame) {
            const emptyData = {
                score: 0,
                clickPower: 1,
                clickUpgradeCost: 10,
                currentSkin: '1.bmp',
                ownedSkins: '1.bmp'
            };
            window.TelegramGame.saveToCloud(emptyData);
        }
        
        // Обновляем интерфейс
        updateDisplay();
        updateUpgradeButtons();
        renderSkins();
        updateProfile();
        changeThemeColor('#e94560');
        updateClickButtonImage();
        
        showNotification('✅ Прогресс сброшен');
    }
}

// Инициализация кнопки сброса
window.addEventListener('DOMContentLoaded', () => {
    const resetButton = document.getElementById('resetButton');
    if (resetButton) {
        resetButton.addEventListener('click', resetProgress);
    }
});
