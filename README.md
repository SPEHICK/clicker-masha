# Masha Clicker - Telegram Web App

Браузерная игра-кликер с интеграцией в Telegram и системой таблицы лидеров.

## Возможности

- 🎮 Простой геймплей с кликами
- 💾 Автоматическое сохранение прогресса в Telegram Cloud Storage
- 🏆 Таблица лидеров между игроками
- 📱 Адаптивный дизайн для мобильных устройств
- 🌙 Темная тема оформления

## Установка и запуск

### 1. Загрузка на GitHub Pages

1. Создайте новый репозиторий на GitHub
2. Загрузите все файлы проекта
3. Перейдите в Settings → Pages
4. Выберите ветку `main` и папку `/ (root)`
5. Сохраните настройки

Ваша игра будет доступна по адресу: `https://ваш-username.github.io/название-репозитория/`

### 2. Создание Telegram бота

1. Откройте [@BotFather](https://t.me/BotFather) в Telegram
2. Отправьте команду `/newbot`
3. Следуйте инструкциям для создания бота
4. Получите токен бота

### 3. Настройка Web App

1. Отправьте команду `/newapp` в @BotFather
2. Выберите вашего бота
3. Введите название приложения: `Masha Clicker`
4. Введите описание
5. Загрузите изображение 640x360 (можно использовать скриншот игры)
6. Отправьте URL вашего GitHub Pages: `https://ваш-username.github.io/название-репозитория/`
7. Загрузите GIF демонстрацию (опционально)

### 4. Обновление URL в коде

Откройте файл `telegram.js` и замените `your-github-pages-url.github.io` на ваш реальный URL:

```javascript
const response = await fetch('https://ваш-username.github.io/название-репозитория/api/submit-score', {
```

## Структура проекта

```
masha-clicker/
├── index.html          # Основная HTML страница
├── style.css           # Стили оформления
├── script.js           # Логика игры
├── telegram.js         # Интеграция с Telegram
├── 1.bmp              # Изображение для кнопки клика
└── README.md          # Документация
```

## Безопасность

### Защита от читов

Текущая реализация использует клиентское хранилище. Для защиты от читов рекомендуется:

1. **Серверная валидация**: Создайте backend API для проверки счета
2. **Хеширование данных**: Добавьте HMAC подпись к сохраняемым данным
3. **Rate limiting**: Ограничьте частоту отправки счета
4. **Telegram initData**: Используйте `tg.initData` для аутентификации

### Пример защиты (добавьте в telegram.js):

```javascript
// Генерация подписи для защиты данных
function generateSignature(data, secret) {
    const message = JSON.stringify(data);
    return CryptoJS.HmacSHA256(message, secret).toString();
}

// Проверка подписи
function verifySignature(data, signature, secret) {
    const expectedSignature = generateSignature(data, secret);
    return signature === expectedSignature;
}
```

## API для таблицы лидеров

Для полноценной работы таблицы лидеров создайте backend API:

### Endpoints:

- `POST /api/submit-score` - Отправка счета
- `GET /api/leaderboard` - Получение топ-10 игроков

### Пример на Node.js + Express:

```javascript
app.post('/api/submit-score', async (req, res) => {
    const { userId, userName, score, timestamp } = req.body;
    
    // Валидация Telegram данных
    if (!validateTelegramData(req.headers['x-telegram-init-data'])) {
        return res.status(403).json({ error: 'Invalid data' });
    }
    
    // Сохранение в базу данных
    await db.upsertScore(userId, userName, score, timestamp);
    
    res.json({ success: true });
});

app.get('/api/leaderboard', async (req, res) => {
    const leaders = await db.getTopScores(10);
    res.json(leaders);
});
```

## Локальное тестирование

Для тестирования без Telegram:

1. Откройте `index.html` в браузере
2. Игра будет работать с localStorage вместо Telegram Cloud Storage
3. Таблица лидеров будет локальной

## Запуск в Telegram

1. Откройте вашего бота в Telegram
2. Нажмите на кнопку меню (☰) рядом с полем ввода
3. Выберите "Masha Clicker"
4. Игра откроется в Web App

## Дополнительные возможности

- Добавьте больше улучшений и достижений
- Реализуйте систему ежедневных наград
- Добавьте звуковые эффекты
- Создайте систему рефералов
- Интегрируйте Telegram Stars для покупок

## Лицензия

MIT License - используйте свободно для своих проектов.
