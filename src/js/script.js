import { debouncer, toggleNothingFound } from './tools.js';
import { addTable } from './createTableTools.js'

let tableData = null;

/**
 * 
 * @param {*} event объект события
 * @description обработчик события ввод в input текста, при наступлении события фильтрует поля,
 *  создавая массив отфильтрованных объектов, которые формируют новыые поля таблицы
 * если фильтрация возвращает пустой масссив - вызов toggleNothingFound (отображение сообщения - "Ничего не найдено по запросу")
 * @returns {undefined}
 */
const handleInputChange = (event) => {
    const value = event.target.value.toLowerCase();
    const isNoDataShow = !document.querySelector(".noData").classList.contains('none');

    if (value) {
        const newData = tableData.filter(user => {
            const name = user.name;
            return name.first.toLowerCase().includes(value) || name.last.toLowerCase().includes(value);
        })
        if (!newData.length) {
            if (!isNoDataShow) {
                toggleNothingFound();
            }
            return;
        }
        if (isNoDataShow) {
            toggleNothingFound();
        }
        addTable(newData);
        return;
    }
    if (isNoDataShow) {
        toggleNothingFound();
    }
    addTable(tableData);
}

/**
 * 
 * @description  обработчик события - очищает результаты фильтрации по таблице,
 *  если отажается сообщение "Ничего не найдено по запросу" - скрываем,
 *  вызываем addTable для формирования данных таблицы
 * @returns {undefined}
 */
const handleClear = () => {
    const isNoDataShow = !document.querySelector(".noData").classList.contains('none');
    if (isNoDataShow) {
        toggleNothingFound();
    }
    addTable(tableData);
    document.querySelector("#input").value = '';
}

/**
 * 
 * @description  вызов fetch запроса https://randomuser.me/api/?results=15
 * получаем в ответе массив данных, 
 * сохраняем данные в переменную tableData,
 * вызываем addTable для формирования данных таблицы,
 * добавляем обработчики события на input button
 * @returns {undefined}
 */
fetch("https://randomuser.me/api/?results=15")
    .then(response => {
        if (response.ok) {
            return response.json();
        }
        throw new Error(response)
    }).then(response => {
        tableData = response.results;
        addTable(response.results);
        document.querySelector(".preloader").style.display = 'none';
        document.querySelector("#input").addEventListener('input', debouncer(handleInputChange, 500));
        document.querySelector("#drop").addEventListener('click', handleClear);
    }).catch((error) => {
        console.error('Ошибка:', error);
    })

