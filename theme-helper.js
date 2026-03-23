// Хелпер для конвертации hex в RGB
function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

// Устанавливаем RGB переменную для использования в rgba()
function setThemeColorRgb(color) {
    const rgb = hexToRgb(color);
    if (rgb) {
        document.documentElement.style.setProperty('--theme-color-rgb', `${rgb.r}, ${rgb.g}, ${rgb.b}`);
    }
}

// Экспортируем функцию
window.setThemeColorRgb = setThemeColorRgb;
