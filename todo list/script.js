//массивы для хранения данных
var itemsArr = [];
var filteredItemsArr = [];

//cчетчик для генерации уникального id
var idcounter = makeCounter();

//обертка to do листа
var divToDo = document.createElement("div");
divToDo.className = "to-do-list";

//блок создания новой задачи
var date = new Date();
var currentDate = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();

var divNewTask = document.createElement("div");
divToDo.appendChild(divNewTask);

var spanTaskText = document.createElement("span");
var inputTask = document.createElement("input");
var spanTaskText2 = document.createElement("span");
var inputDate = document.createElement("input");
var addTask = document.createElement("button");

divNewTask.className = "new-task";
spanTaskText.className = "new-task__text";
spanTaskText2.className = "new-task__text";
inputTask.className = "new-task__name new-task__options";
inputDate.className = "new-task__options";
addTask.className = "new-task__options";
inputDate.id = "date";

spanTaskText.innerHTML = "Task name:";
spanTaskText2.innerHTML = "Task deadline:";
addTask.innerHTML = "Add task";
inputTask.type = "text";
inputDate.type = "date";
addTask.type = "button";
inputTask.placeholder = "Title...";
inputTask.maxLength = 35;
inputDate.min = currentDate;
inputDate.value = currentDate;
addTask.addEventListener("click", newItem);

divNewTask.appendChild(spanTaskText);
divNewTask.appendChild(inputTask);
divNewTask.appendChild(spanTaskText2);
divNewTask.appendChild(inputDate);
divNewTask.appendChild(addTask);

//блок с опциями отображения задач
var divTaskOptions = document.createElement("div");
divToDo.appendChild(divTaskOptions);
divTaskOptions.className = "tasks-options";
var selectTasks = document.createElement("select");
var selectDeadline = document.createElement("select");
selectTasks.id = "tasks";
selectDeadline.id = "deadlines";
selectTasks.className = "task-option";
selectDeadline.className = "task-option";

var optionT1 = document.createElement("option");
var optionT2 = document.createElement("option");
var optionT3 = document.createElement("option");
var optionD1 = document.createElement("option");
var optionD2 = document.createElement("option");
var optionD3 = document.createElement("option");

optionT1.innerHTML = "All tasks";
optionT2.innerHTML = "Finished";
optionT3.innerHTML = "Unfinished";
optionD1.innerHTML = "All deadlines";
optionD2.innerHTML = "Tomorrow";
optionD3.innerHTML = "Next 7 days";

divTaskOptions.appendChild(selectTasks);
divTaskOptions.appendChild(selectDeadline);
selectTasks.appendChild(optionT1);
selectTasks.appendChild(optionT2);
selectTasks.appendChild(optionT3);
selectDeadline.appendChild(optionD1);
selectDeadline.appendChild(optionD2);
selectDeadline.appendChild(optionD3);

//блок со списком задач
var divTasks = document.createElement("div");
divToDo.appendChild(divTasks);
divTasks.className = "tasks";

selectTasks.addEventListener("change", drawItems);
selectDeadline.addEventListener("change", drawItems);

//рисуем todo list на странице
document.body.appendChild(divToDo);

//добавление новой задачи
function newItem() {
  var inputValue = document.querySelector(".new-task__name").value;
  if (inputValue === '') {
    alert("Введите какую-нибудь задачу");
  } else {
    itemsArr.push({
      checkboxID: "id" + idcounter(),
      closeID: "id" + idcounter(),
      status: false,
      text: inputValue,
      date: convertToDotsdate(document.getElementById("date").value)
    });
  }
  drawItems();
}

//удалить задачу
function deleteItem() {
  for (var i = 0; i < itemsArr.length; i++) {
    for (var key in itemsArr[i]) {
      if (itemsArr[i][key] == event.target.id) {
        itemsArr.splice(i, 1);
        break;
      }
    }
  }
  drawItems();
}

//флаг выполнено/не выполнено
function changeItemStatus() {
  for (var i = 0; i < itemsArr.length; i++) {
    for (var key in itemsArr[i]) {
      if (itemsArr[i][key] == event.target.id) {
        if (itemsArr[i]["status"] == false) {
          itemsArr[i]["status"] = true;
        } else {
          itemsArr[i]["status"] = false;
        }
      }
    }
  }
  drawItems();
}

//перерисовываем список задач
function drawItems() {
  filteredItemsArr = selectItemsByDeadline(selectItemsByStatus());
  if (!document.getElementById("tasksList")) {
    var list = document.createElement("ul");
    list.className = "list";
    list.id = "tasksList";
  } else {
    document.getElementById("tasksList").remove();
    var list = document.createElement("ul");
    list.className = "list";
    list.id = "tasksList";
  }

  for (var i = 0; i < filteredItemsArr.length; i++) {
    var li = document.createElement("li");
    var checkbox = document.createElement("input");
    var spanClose = document.createElement("span");
    var spanDeadline = document.createElement("span");
    var spanDate = document.createElement("span");

    checkbox.type = "checkbox";
    checkbox.checked = filteredItemsArr[i]["status"];
    spanClose.innerHTML = "×";
    spanDeadline.innerHTML = "Deadline: ";
    spanDate.innerHTML = filteredItemsArr[i]["date"];
    li.innerHTML = filteredItemsArr[i]["text"] + "<br>";

    spanClose.className = "close";
    spanDeadline.className = "deadline deadline--padding";
    spanDate.className = "deadline";
    if (filteredItemsArr[i]["status"] == true) {
      li.className = "list__item list__item--line";
    } else {
      li.className = "list__item";
    }
    checkbox.id = filteredItemsArr[i]["checkboxID"];
    spanClose.id = filteredItemsArr[i]["closeID"];

    spanClose.addEventListener("click", deleteItem);
    checkbox.addEventListener("click", changeItemStatus);

    li.insertBefore(checkbox, li.firstChild)
    li.appendChild(spanClose);
    li.appendChild(spanDeadline);
    li.appendChild(spanDate);
    list.appendChild(li);

    divTasks.appendChild(list);
    document.querySelector(".new-task__name").value = "";
  }
}

//выборка по статусу выполнения
function selectItemsByStatus() {
  var sel = document.getElementById("tasks").options[document.getElementById("tasks").selectedIndex].value;
  var tmpArr = [];
  switch (sel) {
    case "All tasks":
      tmpArr = itemsArr.slice();
      break;
    case "Finished":
      for (var i = 0; i < itemsArr.length; i++) {
        if (itemsArr[i]["status"] == true) {
          tmpArr.push(itemsArr[i]);
        }
      }
      break;
    case "Unfinished":
      for (var i = 0; i < itemsArr.length; i++) {
        if (itemsArr[i]["status"] == false) {
          tmpArr.push(itemsArr[i]);
        }
      }
      break;
  }
  return tmpArr;
}

//выюорка по дэдлайну
function selectItemsByDeadline(sortedArr) {
  var tmpArr = [];
  var sel = document.getElementById("deadlines").options[document.getElementById("deadlines").selectedIndex].value;
  switch (sel) {
    case "All deadlines":
      return sortedArr;
      break;
    case "Tomorrow":
      var tomorrowDate = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + (date.getDate() + 1);
      for (var i = 0; i < sortedArr.length; i++) {
        if (Date.parse(convertToLinesdate(sortedArr[i]["date"])) == Date.parse(tomorrowDate)) {
          tmpArr.push(sortedArr[i]);
        }
      }
      break;
    case "Next 7 days":
      var nextDate = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + (date.getDate() + 7);
      for (var i = 0; i < sortedArr.length; i++) {
        if (Date.parse(convertToLinesdate(itemsArr[i]["date"])) <= Date.parse(nextDate)) {
          tmpArr.push(sortedArr[i]);
        }
      }
      break;
  }
  return tmpArr;
}

//преобразование даты из календаря в формат для вывода на форму
function convertToDotsdate(date) {
  var arr = date.split("-");
  arr.reverse();
  return arr.join(".");
}

//преобразование даты для сравнения
function convertToLinesdate(date) {
  var arr = date.split(".");
  arr.reverse();
  return arr.join("-");
}

//счетчик формирования уникального id
function makeCounter() {
  var currentCount = 1;
  return function() {
    return currentCount++;
  }
}
