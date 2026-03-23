# Инструкция по развертыванию Masha Clicker

## Шаг 1: Создание репозитория на GitHub

1. Перейдите на [GitHub](https://github.com)
2. Нажмите "New repository"
3. Название: `masha-clicker`
4. Сделайте репозиторий публичным
5. Нажмите "Create repository"

## Шаг 2: Загрузка файлов

### Через веб-интерфейс GitHub:

1. На странице репозитория нажмите "Add file" → "Upload files"
2. Перетащите все файлы проекта:
   - index.html
   - style.css
   - script.js
   - telegram.js
   - 1.bmp (ваше изображение)
   - README.md
   - .gitignore
   - vercel.json
   - папку api/ с файлами
3. Нажмите "Commit changes"

### Через Git (если установлен):

```bash
# Инициализация репозитория
git init
git add .
git commit -m "Initial commit"

# Подключение к GitHub
git remote add origin https://github.com/ваш-username/masha-clicker.git
git branch -M main
git push -u origin main
```

## Шаг 3: Настройка GitHub Pages

1. Перейдите в Settings репозитория
2. В меню слева выберите "Pages"
3. В разделе "Source" выберите:
   - Branch: `main`
   - Folder: `/ (root)`
4. Нажмите "Save"
5. Подождите 1-2 минуты
6. Ваш сайт будет доступен по адресу: `https://ваш-username.github.io/masha-clicker/`

## Шаг 4: Развертывание API на Vercel (бесплатно)

### Вариант 1: Через веб-интерфейс

1. Перейдите на [Vercel](https://vercel.com)
2. Зарегистрируйтесь через GitHub
3. Нажмите "Add New" → "Project"
4. Выберите репозиторий `masha-clicker`
5. Нажмите "Deploy"
6. После деплоя получите URL типа: `https://masha-clicker.vercel.app`

### Вариант 2: Через Vercel CLI

```bash
# Установка Vercel CLI
npm install -g vercel

# Деплой
cd путь/к/проекту
vercel

# Следуйте инструкциям в терминале
```

## Шаг 5: Обновление URL в коде

1. Откройте файл `telegram.js` на GitHub
2. Нажмите на иконку карандаша (Edit)
3. Найдите строку:
   ```javascript
   const response = await fetch('https://your-github-pages-url.github.io/api/submit-score', {
   ```
4. Замените на ваш Vercel URL:
   ```javascript
   const response = await fetch('https://masha-clicker.vercel.app/api/submit-score', {
   ```
5. Сделайте то же самое для строки с `/api/leaderboard`
6. Нажмите "Commit changes"

## Шаг 6: Создание Telegram бота

1. Откройте [@BotFather](https://t.me/BotFather) в Telegram
2. Отправьте `/newbot`
3. Введите название: `Masha Clicker Bot`
4. Введите username: `masha_clicker_bot` (или другой доступный)
5. Сохраните токен бота (выглядит как `1234567890:ABCdefGHIjklMNOpqrsTUVwxyz`)

## Шаг 7: Обновление токена в API

1. Откройте файл `api/server.js` на GitHub
2. Найдите строку:
   ```javascript
   const BOT_TOKEN = 'YOUR_BOT_TOKEN_HERE';
   ```
3. Замените на ваш токен:
   ```javascript
   const BOT_TOKEN = '1234567890:ABCdefGHIjklMNOpqrsTUVwxyz';
   ```
4. Сохраните изменения

**ВАЖНО:** Для продакшена храните токен в переменных окружения Vercel!

## Шаг 8: Создание Web App в боте

1. Вернитесь к @BotFather
2. Отправьте `/newapp`
3. Выберите вашего бота
4. Введите название: `Masha Clicker`
5. Введите описание: `Увлекательная игра-кликер!`
6. Загрузите фото 640x360 (можно сделать скриншот игры)
7. Отправьте URL: `https://ваш-username.github.io/masha-clicker/`
8. Загрузите GIF (опционально)
9. Выберите "Inline mode" → No

## Шаг 9: Тестирование

1. Откройте вашего бота в Telegram
2. Нажмите на кнопку меню (☰)
3. Выберите "Masha Clicker"
4. Игра должна открыться и работать!

## Альтернативные варианты для API

### Netlify Functions (бесплатно)

1. Зарегистрируйтесь на [Netlify](https://netlify.com)
2. Подключите GitHub репозиторий
3. Создайте папку `netlify/functions/`
4. Переместите туда код API

### Cloudflare Workers (бесплатно)

1. Зарегистрируйтесь на [Cloudflare](https://workers.cloudflare.com)
2. Создайте новый Worker
3. Скопируйте код API
4. Опубликуйте

### Railway (бесплатно с лимитами)

1. Зарегистрируйтесь на [Railway](https://railway.app)
2. Создайте новый проект из GitHub
3. Railway автоматически развернет API

## Использование базы данных (опционально)

Для сохранения данных между перезапусками используйте:

### MongoDB Atlas (бесплатно)

```javascript
const mongoose = require('mongoose');

const LeaderboardSchema = new mongoose.Schema({
    userId: String,
    userName: String,
    score: Number,
    timestamp: Number
});

const Leaderboard = mongoose.model('Leaderboard', LeaderboardSchema);

// Подключение
mongoose.connect(process.env.MONGODB_URI);
```

### Supabase (бесплатно)

```javascript
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY
);

// Сохранение
await supabase.from('leaderboard').upsert({ userId, userName, score });
```

## Проверка работы

1. Откройте игру в Telegram
2. Сделайте несколько кликов
3. Перейдите на вкладку "Топ"
4. Вы должны увидеть себя в таблице лидеров

## Устранение проблем

### Игра не открывается
- Проверьте, что GitHub Pages активирован
- Убедитесь, что URL правильный
- Проверьте консоль браузера (F12)

### Не сохраняется прогресс
- Проверьте, что Telegram Web App SDK загружен
- Откройте консоль и проверьте ошибки

### Не работает таблица лидеров
- Проверьте, что API развернут на Vercel
- Убедитесь, что URL в telegram.js правильный
- Проверьте логи Vercel

## Безопасность

1. Не храните токен бота в коде - используйте переменные окружения
2. Добавьте rate limiting для защиты от спама
3. Валидируйте все входящие данные
4. Используйте HTTPS для всех запросов

## Дополнительные улучшения

- Добавьте базу данных для постоянного хранения
- Реализуйте систему достижений
- Добавьте ежедневные награды
- Создайте реферальную систему
- Интегрируйте Telegram Stars для покупок

Готово! Ваша игра развернута и работает! 🎮
