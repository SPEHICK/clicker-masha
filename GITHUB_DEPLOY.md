# Как залить на GitHub и получить сайт

## Вариант 1: Через веб-интерфейс GitHub (самый простой)

### Шаг 1: Создать репозиторий
1. Зайдите на https://github.com
2. Нажмите зеленую кнопку "New" или "+" → "New repository"
3. Название: `masha-clicker`
4. Выберите "Public"
5. Нажмите "Create repository"

### Шаг 2: Загрузить файлы
1. На странице нового репозитория нажмите "uploading an existing file"
2. Перетащите ВСЕ файлы из папки проекта:
   ```
   index.html
   style.css
   script.js
   telegram.js
   fluid.js
   theme-helper.js
   1.bmp
   2.jpg
   3.jpg
   4.jpg
   5.jpg
   6.png
   README.md
   .gitignore
   ```
3. Внизу страницы нажмите "Commit changes"

### Шаг 3: Включить GitHub Pages
1. Перейдите в Settings (вкладка вверху)
2. В меню слева найдите "Pages"
3. В разделе "Source":
   - Branch: выберите `main`
   - Folder: выберите `/ (root)`
4. Нажмите "Save"
5. Подождите 1-2 минуты

### Шаг 4: Получить ссылку
1. Обновите страницу Settings → Pages
2. Вверху появится зеленая плашка с ссылкой:
   ```
   Your site is live at https://ваш-username.github.io/masha-clicker/
   ```
3. Скопируйте эту ссылку

---

## Вариант 2: Через Git (если установлен)

### Шаг 1: Установить Git (если нет)
- Windows: https://git-scm.com/download/win
- Или через командную строку: `winget install Git.Git`

### Шаг 2: Создать репозиторий на GitHub
1. Зайдите на https://github.com
2. Нажмите "New repository"
3. Название: `masha-clicker`
4. Public
5. Create repository
6. Скопируйте URL (будет показан на экране)

### Шаг 3: Загрузить через командную строку
Откройте командную строку в папке проекта и выполните:

```bash
# Инициализация Git
git init

# Добавить все файлы
git add .

# Создать коммит
git commit -m "Initial commit - Masha Clicker"

# Подключить к GitHub (замените YOUR-USERNAME на ваш логин)
git remote add origin https://github.com/YOUR-USERNAME/masha-clicker.git

# Отправить на GitHub
git branch -M main
git push -u origin main
```

### Шаг 4: Включить GitHub Pages
1. Settings → Pages
2. Source: `main` → `/ (root)` → Save
3. Подождите 1-2 минуты
4. Ваш сайт: `https://YOUR-USERNAME.github.io/masha-clicker/`

---

## Вариант 3: Через GitHub Desktop (самый удобный)

### Шаг 1: Установить GitHub Desktop
1. Скачайте: https://desktop.github.com/
2. Установите и войдите в аккаунт GitHub

### Шаг 2: Создать репозиторий
1. File → New Repository
2. Name: `masha-clicker`
3. Local Path: выберите папку с проектом
4. Create Repository

### Шаг 3: Опубликовать
1. Нажмите "Publish repository" вверху
2. Уберите галочку "Keep this code private"
3. Нажмите "Publish repository"

### Шаг 4: Включить GitHub Pages
1. Откройте репозиторий на GitHub.com
2. Settings → Pages
3. Source: `main` → `/ (root)` → Save

---

## После загрузки

### Обновить URL в коде
1. Откройте файл `telegram.js` на GitHub
2. Нажмите карандаш (Edit)
3. Найдите строки:
   ```javascript
   const API_URL = 'https://your-vercel-app.vercel.app';
   ```
4. Замените на ваш GitHub Pages URL
5. Commit changes

### Проверить работу
1. Откройте ваш сайт: `https://YOUR-USERNAME.github.io/masha-clicker/`
2. Должна открыться игра
3. Если не работает - подождите еще 2-3 минуты

---

## Создание Telegram бота

### Шаг 1: Создать бота
1. Откройте [@BotFather](https://t.me/BotFather) в Telegram
2. Отправьте: `/newbot`
3. Название: `Masha Clicker Bot`
4. Username: `masha_clicker_bot` (или другой доступный)
5. Сохраните токен

### Шаг 2: Добавить Web App
1. Отправьте: `/newapp`
2. Выберите вашего бота
3. Название: `Masha Clicker`
4. Описание: `Увлекательная игра-кликер!`
5. Загрузите фото 640x360 (можно скриншот игры)
6. URL: вставьте ваш GitHub Pages URL
7. Готово!

### Шаг 3: Запустить
1. Откройте вашего бота в Telegram
2. Нажмите кнопку меню (☰)
3. Выберите "Masha Clicker"
4. Играйте!

---

## Обновление файлов

### Через веб-интерфейс:
1. Откройте файл на GitHub
2. Нажмите карандаш (Edit)
3. Внесите изменения
4. Commit changes

### Через Git:
```bash
git add .
git commit -m "Описание изменений"
git push
```

### Через GitHub Desktop:
1. Внесите изменения в файлы
2. В GitHub Desktop появятся изменения
3. Напишите описание
4. Commit to main
5. Push origin

---

## Проблемы и решения

### Сайт не открывается
- Подождите 5 минут после включения Pages
- Проверьте что выбрана ветка `main`
- Проверьте что файл называется `index.html` (не `Index.html`)

### Изображения не загружаются
- Убедитесь что файлы `1.bmp`, `2.jpg`, `3.jpg`, `4.jpg`, `5.jpg`, `6.png` загружены
- Проверьте регистр букв в названиях

### Telegram Web App не работает
- Проверьте что URL правильный
- Откройте сайт в обычном браузере - должен работать
- Проверьте что добавили `https://` в начале URL

---

## Готово! 🎉

Ваш сайт: `https://YOUR-USERNAME.github.io/masha-clicker/`

Теперь можете:
- Открывать в браузере
- Запускать через Telegram бота
- Делиться ссылкой с друзьями
