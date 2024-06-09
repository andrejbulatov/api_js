// Вы разрабатываете веб-страницу для отображения расписания занятий в спортивном клубе. Каждое занятие имеет название, время проведения, максимальное количество участников и текущее количество записанных участников.

// 1. Создайте веб-страницу с заголовком "Расписание занятий" и областью для отображения занятий.

// 2. Загрузите информацию о занятиях из предоставленных JSON-данных. Каждое занятие должно отображаться на странице с указанием его названия, времени проведения, максимального количества участников и текущего количества записанных участников.

// 3. Пользователь может нажать на кнопку "Записаться" для записи на занятие. Если максимальное количество участников уже достигнуто, кнопка "Записаться" становится неактивной.

// 4. После успешной записи пользователя на занятие, обновите количество записанных участников и состояние кнопки "Записаться".

// 5. Запись пользователя на занятие можно отменить путем нажатия на кнопку "Отменить запись". После отмены записи, обновите количество записанных участников и состояние кнопки.

// 6. Все изменения (запись, отмена записи) должны сохраняться и отображаться в реальном времени на странице.

// 7. При разработке используйте Bootstrap для стилизации элементов.

const activitiesJSON = `[
  {
      "id": 1,
      "name": "Йога",
      "time": "10:00 - 11:00",
      "maxParticipants": 15,
      "currentParticipants": 8
  },
  {
      "id": 2,
      "name": "Пилатес",
      "time": "11:30 - 12:30",
      "maxParticipants": 10,
      "currentParticipants": 5
  },
  {
      "id": 3,
      "name": "Кроссфит",
      "time": "13:00 - 14:00",
      "maxParticipants": 20,
      "currentParticipants": 15
  },
  {
      "id": 4,
      "name": "Танцы",
      "time": "14:30 - 15:30",
      "maxParticipants": 12,
      "currentParticipants": 10
  },
  {
      "id": 5,
      "name": "Бокс",
      "time": "16:00 - 17:00",
      "maxParticipants": 8,
      "currentParticipants": 6
  }
]`;

const localStorageKey = "activities";
const data = localStorage.getItem(localStorageKey);

if (!data) {
  localStorage.setItem(localStorageKey, activitiesJSON);
}

const activities = JSON.parse(localStorage.getItem(localStorageKey));

const activitiesHtml = activities
  .map((activity) => getActivityHtml(activity))
  .join("");

const containerEl = document.querySelector(".container");

containerEl.innerHTML = activitiesHtml;


const joinBtnElems = document.querySelectorAll('.join');
//изначально все кнопки отмены неактивны
const cancelBtnElems = document.querySelectorAll('.cancel');
cancelBtnElems.forEach(element => element.disabled = true);

containerEl.addEventListener("click", function (e) {
  const parentEl = e.target.closest(".activity");
  const id = +parentEl.dataset.id;
  const indexActivity = activities.findIndex((activity) => activity.id === id);

  const currentMembersEl = parentEl.querySelector(".current-number");
  const currentMembers = activities[indexActivity].currentParticipants;

  //если достигнуто максимально кол-во участников, кнопка записи неактивна
  const maxMembers = activities[indexActivity].maxParticipants;
  if (currentMembers === maxMembers) {
    joinBtnElems[indexActivity].disabled = true;
  }

  if (e.target.classList.contains("join")) {
    //изменяем кол-во записанных участников в html
    currentMembersEl.textContent = currentMembers + 1;

    //изменяем кол-во участников в массиве и записываем в localStorage
    activities[indexActivity].currentParticipants += 1;
    localStorage.setItem(localStorageKey, JSON.stringify(activities));

    //делаем кнопку записи неактивной, если пользователь уже записался, а кнопку отмены - активной
    joinBtnElems[indexActivity].disabled = true;
    cancelBtnElems[indexActivity].disabled = false;
  }
  if (e.target.classList.contains("cancel")) {
    //уменьшаем кол-во записанных участников в html
    currentMembersEl.textContent = currentMembers - 1;

    //изменяем кол-во участников в массиве и записываем в localStorage
    activities[indexActivity].currentParticipants -= 1;
    localStorage.setItem(localStorageKey, JSON.stringify(activities));

    //делаем кнопку записи неактивной, если пользователь уже записался, а кнопку отмены - активной
    joinBtnElems[indexActivity].disabled = false;
    cancelBtnElems[indexActivity].disabled = true;
  }
});

function getActivityHtml(activity) {
return `<div class="activity" data-id="${activity.id}">
    <div class="name">${activity.name}</div>
    <div class="time">${activity.time}</div>
    <div class="max-members">Количество мест: <span class=""max-number>${activity.maxParticipants}</span></div>
    <div class="current-members">Занято: <span class="current-number">${activity.currentParticipants}</span></div>
    <button class="join">Записаться</button>
    <button class="cancel">Отменить запись</button>
</div>`;
}