let tableData = null;
const debouncer = (func, timeout) => {
    let timer;
    return (...args) => {
        clearTimeout(timer)
        timer = setTimeout(() => { func.apply(this, args); }, timeout);
    }

}
const createNameTd = (nameObject) => {
    const newTd = document.createElement("td");
    newTd.textContent = Object.keys(nameObject)
        .slice(1)
        .map((key) => nameObject[key])
        .join(" ");
    return newTd;
}
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
        newTd.appendChild(tooltip)
        tooltip.style.left = `${(event.target.x + boundBox.width).toString()}px`;
        tooltip.style.top = `${(boundBox.bottom).toString()}px`;
    });
    img.addEventListener("mouseout", () => {
        newTd.removeChild(tooltip);
    })

    return newTd;
}
const createLocationTd = (location) => {
    const newTd = document.createElement("td");
    newTd.textContent = `${location['state']} ${location['city']}`;

    return newTd;
}
const createPhoneOrEmailTd = (content) => {
    const newTd = document.createElement("td");
    newTd.textContent = content;

    return newTd;
}
const createRegisteredDateTd = (registered) => {
    const newTd = document.createElement("td");
    newTd.textContent = new Date(registered.date).toJSON().slice(0, 10).split('-').reverse().join('.')

    return newTd;
}
const createTr = ({ name, picture, location, email, phone, registered }) => {
    const newTr = document.createElement("tr");
    newTr.appendChild(createNameTd(name));
    newTr.appendChild(createPictureTd(picture));
    newTr.appendChild(createLocationTd(location));
    newTr.appendChild(createPhoneOrEmailTd(email));
    newTr.appendChild(createPhoneOrEmailTd(phone));
    newTr.appendChild(createRegisteredDateTd(registered))

    return newTr;
};
const toggleNothingFound = () => {

    const table = document.querySelector(".table__body");
    const message = document.querySelector(".noData");
    table.classList.contains('none') ? table.classList.remove("none") : table.classList.add("none");
    message.classList.contains('none') ? message.classList.remove("none") : message.classList.add("none");

}
addTable = (data) => {
    const tbody = document.querySelector("tbody");
    while (tbody.hasChildNodes()) {
        tbody.removeChild(tbody.lastChild);
    }
    data.forEach(element => {
        tbody.appendChild(createTr(element))
    });
}

handleInputChange = (event) => {
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
handleClear = () => {
    const isNoDataShow = !document.querySelector(".noData").classList.contains('none');
    if (isNoDataShow) {
        toggleNothingFound();
    }
    addTable(tableData);
    document.querySelector("#input").value = '';
}


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

