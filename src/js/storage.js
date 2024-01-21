
// Сохранение контакта в Local Storage
export function saveContact(addContactModal) {
  const contactForm = document.querySelector("#addContactModal form");
  const fioInput = contactForm.querySelector('input[placeholder="ФИО"]');
  const phoneNumberInput = contactForm.querySelector(
    'input[placeholder="Номер телефона"]'
  );
  const groupSelect = contactForm.querySelector("select");

  if (
    !fioInput.value.trim() ||
    !phoneNumberInput.value.trim() ||
    !groupSelect.value.trim()
  ) {
    alert("Пожалуйста, заполните все поля контакта.");
    return;
  }

  const newContact = {
    fio: fioInput.value,
    phoneNumber: phoneNumberInput.value,
    group: groupSelect.value,
    id: generateUniqueId(),
  };

  const contacts = JSON.parse(localStorage.getItem("contacts")) || [];
  const existingContactIndex = contacts.findIndex(
    (contact) =>
      contact.fio === newContact.fio &&
      contact.phoneNumber === newContact.phoneNumber
  );

  if (existingContactIndex !== -1) {
    const existingContact = contacts[existingContactIndex];

    if (existingContact.group !== newContact.group) {
      const currentGroupContacts =
        JSON.parse(localStorage.getItem(existingContact.group)) || [];
      const updatedCurrentGroupContacts = currentGroupContacts.filter(
        (contact) => contact.id !== existingContact.id
      );
      localStorage.setItem(
        existingContact.group,
        JSON.stringify(updatedCurrentGroupContacts)
      );
    }
    contacts[existingContactIndex] = {
      ...existingContact,
      group: newContact.group,
    };
  } else {
    contacts.push(newContact);
  }
  localStorage.setItem("contacts", JSON.stringify(contacts));
  function clearContactInputs() {
    const contactForm = document.querySelector("#addContactModal form");
    contactForm.reset();
  }
  clearContactInputs();
  addContactModal.hide();
}
// Получение массива групп из Local Storage
export function getGroups() {
  const groups = JSON.parse(localStorage.getItem("groups")) || [];
  return groups;
}

// Сохранение группы в Local Storage
export function saveGroup() {
  const groupInputsContainer = document.getElementById("groupInputsContainer");
  const groupInputs = groupInputsContainer.querySelectorAll(".editable-input");
  const updatedGroups = [];

  groupInputs.forEach((input) => {
    const groupName = input.value.trim(); // Используем trim() для удаления лишних пробелов
    if (groupName) {
      updatedGroups.push(groupName);
    }
  });

  localStorage.setItem("groups", JSON.stringify(updatedGroups));
}

// Добавление нового инпута для группы
export function addGroupInput() {
  const groupInputsContainer = document.getElementById("groupInputsContainer");
  const newInputContainer = document.createElement("div");
  newInputContainer.classList.add("editable-input-container");

  const newInput = document.createElement("input");
  newInput.type = "text";
  newInput.classList.add("editable-input");
  newInput.setAttribute("placeholder", "Редактируемое название");

  const deleteIcon = document.createElement("div");
  deleteIcon.classList.add("editable-input-icon");
  deleteIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" id="svgDelete" width="36" height="36" viewBox="0 0 26 26" fill="none">
      <g clip-path="url(#clip0_1894_240)">
        <path opacity="0.3" d="M6.66664 20.3889C6.66664 21.55 7.61664 22.5 8.77775 22.5H17.2222C18.3833 22.5 19.3333 21.55 19.3333 20.3889V7.72222H6.66664V20.3889ZM9.26331 12.8733L10.7516 11.385L13 13.6228L15.2378 11.385L16.7261 12.8733L14.4883 15.1111L16.7261 17.3489L15.2378 18.8372L13 16.5994L10.7622 18.8372L9.27386 17.3489L11.5116 15.1111L9.26331 12.8733ZM16.6944 4.55556L15.6389 3.5H10.3611L9.30553 4.55556H5.61108V6.66667H20.3889V4.55556H16.6944Z" fill="black"/>
      </g>
      <defs>
        <clipPath id="clip0_1894_240">
          <rect width="25.3333" height="25.3333" fill="white" transform="translate(0.333252 0.333313)"/>
        </clipPath>
      </defs>
    </svg>`;

  newInputContainer.appendChild(newInput);
  newInputContainer.appendChild(deleteIcon);

  groupInputsContainer.appendChild(newInputContainer);

  deleteIcon.addEventListener("click", function () {
    groupInputsContainer.removeChild(newInputContainer);
    const groupName = newInput.getAttribute("placeholder");
    const updatedGroups = getGroups().filter((group) => group !== groupName);
    localStorage.setItem("groups", JSON.stringify(updatedGroups));
  });
}
function generateUniqueId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}
