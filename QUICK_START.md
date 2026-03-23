# Быстрый старт - 5 минут

## 1. Загрузка на GitHub (2 минуты)

1. Зайдите на https://github.com/new
2. Название: `masha-clicker`
3. Public → Create repository
4. Нажмите "uploading an existing file"
5. Перетащите ВСЕ файлы из папки проекта
6. Commit changes

## 2. Включение GitHub Pages (1 минута)

1. Settings → Pages (слева)
2. Source: Deploy from a branch
3. Branch: `main` → `/ (root)` → Save
4. Скопируйте URL: `https://ваш-username.github.io/masha-clicker/`

## 3. Деплой API на Vercel (1 минута)

1. Зайдите на https://vercel.com
2. Sign Up через GitHub
3. New Project → Import `masha-clicker`
4. Deploy (просто нажмите, ничего не меняйте)
5. Скопируйте URL: `https://masha-clicker-xxx.vercel.app`

## 4. Обновление URL (30 секунд)

1. В GitHub откройте файл `telegram.js`
2. Нажмите карандаш (Edit)
3. Найдите `https://your-vercel-app.vercel.app`
4. Замените на ваш Vercel URL (2 раза в файле)
5. Commit changes

## 5. Создание бота (1 минута)

1. Откройте @BotFather в Telegram
2. Отправьте: `/newbot`
3. Название: `Masha Clicker Bot`
4. Username: `masha_clicker_bot` (или другой)
5. Скопируйте токен

## 6. Добавление Web App (30 секунд)

1. В @BotFather отправьте: `/newapp`
2. Выберите вашего бота
3. Название: `Masha Clicker`
4. Описание: `Игра-кликер`
5. Фото: загрузите любое 640x360
6. URL: вставьте ваш GitHub Pages URL
7. Готово!

## 7. Запуск! 🎮

1. Откройте вашего бота в Telegram
2. Нажмите кнопку меню (☰)
3. Выберите "Masha Clicker"
4. Играйте!

---

## Если что-то не работает:

### Игра не открывается
- Подождите 2-3 минуты после включения GitHub Pages
- Проверьте URL в настройках бота

### Не работает таблица лидеров
- Убедитесь, что обновили URL в `telegram.js`
- Проверьте, что Vercel проект задеплоен

### Нужна помощь?
Откройте Issues в вашем GitHub репозитории

---

**Всё готово за 5 минут!** 🚀
