/**
 * 
 * @param {object} объект формата {title: "", first: "", last: ""}
 * @description получает объект, формирует строку (имя пользователя), возвращает элемент <td> таблицы с данными о имени пользователя
 * @returns {object} 
 */
const createNameTd = (nameObject) => {
    const newNameObject = {...nameObject}
    delete newNameObject.title;
    const newTd = document.createElement("td");
    newTd.textContent = Object.keys(newNameObject)
        .map((key) => newNameObject[key])
        .join(" ");
    return newTd;
}

/**
 * 
 * @param {object} объект формата {large: "", medium: "", thumbnail: ""}
 * @description получает объект в полях которого ссылки на изображения разных размеров,
 * @description возвращает элемент <td> таблицы с вложенным элементом <img> с ссылкой на маленькое изображение
 * @description на элементе <img> два Event Listener - при наведении открывается tooltip с изображением максимального рамзера, 
 * @description при выводе указателя с элемента <img> tooltip скрывается
 * @returns {object} 
 */
const createPictureTd = (pictureObject) => {
    const newTd = document.createElement("td");
    const img = document.createElement("img");
    img.src = pictureObject["thumbnail"];
    newTd.appendChild(img);

    const tooltip = document.createElement("div");
    tooltip.classList.add("tooltip")
    const largeImg = document.createElement("img")
    largeImg.src = pictureObject["large"]
    tooltip.appendChild(largeImg)

    img.addEventListener("mouseover", (event) => {
        event.preventDefault();
        const boundBox = event.target.getBoundingClientRect();
        newTd.appendChild(tooltip);
        tooltip.style.left = `${((boundBox.width * 4 + window.pageXOffset)).toString()}px`;
        tooltip.style.top = `${(boundBox.y + (boundBox.width / 2) + window.pageYOffset).toString()}px`;
    });
    img.addEventListener("mouseout", () => {
        newTd.removeChild(tooltip);
    })

    return newTd;
}

/**
 * 
 * @param {object} объект 
 * @description получает объект, формирует строку (адрес пользователя) из полей объекта state и city, 
 * @description возвращает элемент <td> таблицы с данными о адресе пользователя
 * @returns {object} 
 */
const createLocationTd = (location) => {
    const newTd = document.createElement("td");
    newTd.textContent = `${location['state']} ${location['city']}`;

    return newTd;
}

/**
 * 
 * @param {string} строка 
 * @description возвращает элемент <td> таблицы с данными переданными в паарметре функции
 * @returns {object} 
 */
const createPhoneOrEmailTd = (content) => {
    const newTd = document.createElement("td");
    newTd.textContent = content;

    return newTd;
}

/**
 * 
 * @param {object} объект  
 * @description возвращает элемент <td> таблицы с строкой даты
 * @description строка даты формируется из поля object.date с помощью преобразования строки формата date: "2009-03-20T02:36:16.909Z"
 * @returns {object} 
 */
const createRegisteredDateTd = (registered) => {
    const newTd = document.createElement("td");
    newTd.textContent = new Date(registered.date).toJSON().slice(0, 10).split('-').reverse().join('.')

    return newTd;
}

/**
 * 
 * @param {object} объект содержащий поля { name, picture, location, email, phone, registered }
 * @description возвращает элемент <tr> который содержит элементы <td> полученные последовательным вызовом функций:
 * @description createNameTd, createPictureTd, createLocationTd, createPhoneOrEmailTd, createRegisteredDateTd
 * @returns {object} 
 */
export const createTr = ({ name, picture, location, email, phone, registered }) => {
    const newTr = document.createElement("tr");
    newTr.appendChild(createNameTd(name));
    newTr.appendChild(createPictureTd(picture));
    newTr.appendChild(createLocationTd(location));
    newTr.appendChild(createPhoneOrEmailTd(email));
    newTr.appendChild(createPhoneOrEmailTd(phone));
    newTr.appendChild(createRegisteredDateTd(registered))

    return newTr;
};

/**
 * 
 * @param {array} массив объектов, где каждый объект содержит поля { name, picture, location, email, phone, registered }
 * @description удаляет старые поля таблицы,
 * @description добавляет поля таблицы, созданные последовательным вызовом функции createTr, при прохождении массива объетов
 * @returns {undefined} 
 */
export const addTable = (data) => {
    const tbody = document.querySelector("tbody");
    while (tbody.hasChildNodes()) {
        tbody.removeChild(tbody.lastChild);
    }
    data.forEach(element => {
        tbody.appendChild(createTr(element))
    });
}