/**
 * 
 * @param {function} func - функция
 * @param {number} timeout - задержка вызова в мс
 * @description возвращает функцию, которая будет перезапускать таймер с переданным значением timeout. Таким образом, оригинальная функция будет вызвана через timeout после последнего вызова func.
 * @returns {function} 
 */
export const debouncer = (func, timeout) => {
    let timer;
    return (...args) => {
        clearTimeout(timer)
        timer = setTimeout(() => { func.apply(this, args); }, timeout);
    }
}

/**
 * 
 * @description переключает видимость сообщения "Ничего не найдено по запросу" при отсутсвии результата в поисковом запросе
 * @returns {undefined} 
 */
export const toggleNothingFound = () => {
    const table = document.querySelector(".table__body");
    const message = document.querySelector(".noData");
    table.classList.contains('none') ? table.classList.remove("none") : table.classList.add("none");
    message.classList.contains('none') ? message.classList.remove("none") : message.classList.add("none");
}