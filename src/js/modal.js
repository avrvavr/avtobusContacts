
import {
  saveContact,
  saveGroup,
  addGroupInput,
  getGroups,
} from "./storage.js";

// Инициализация модальных окон и элементов управления
export function initApp() {
  const addContactModal = new bootstrap.Modal(
    document.getElementById("addContactModal")
  );

  const addGroupModal = new bootstrap.Modal(
    document.getElementById("addGroupsModal")
  );

  const addContactBtn = document.querySelector(".header_button-addContacts");
  const addGroupBtn = document.querySelector(".header_button-addGroups");
  const saveContactBtn = document.querySelector(
    "#addContactModal .btn-success"
  );
  const saveGroupBtn = document.querySelector("#addGroupsModal #saveGroupsBtn");
  const addGroupInputBtn = document.querySelector(
    "#addGroupsModal #addGroupInputBtn"
  );
  const groupSelect = document.querySelector("#addContactModal select");

  // Очистка полей при закрытии модального окна добавления контакта
  addContactModal._element.addEventListener("hidden.bs.modal", function () {
    clearContactInputs();
  });

  // Очистка полей и групп при закрытии модального окна добавления группы
  addGroupModal._element.addEventListener("hidden.bs.modal", function () {
    clearGroupInputs();
  });

  // Отображение модального окна добавления контакта при клике
  addContactBtn.addEventListener("click", function () {
    addContactModal.show();
  });
  // Отображение модального окна добавления группы при клике и рендер существующих групп
  addGroupBtn.addEventListener("click", function () {
    addGroupModal.show();
    renderExistingGroups(); 
  });

  // Сохранение контакта и скрытие модального окна добавления контакта
  saveContactBtn.addEventListener("click", function () {
    saveContact(addContactModal);
    renderAccordion();
  });

  // Сохранение групп и скрытие модального окна добавления группы
  saveGroupBtn.addEventListener("click", function () {
    saveGroup();
    addGroupModal.hide();
    renderAccordion();
  });

  // Добавление нового инпута для группы
  addGroupInputBtn.addEventListener("click", function () {
    addGroupInput();
  });

  // Обновление опций существующих групп при открытии модального окна добавления контакта
  addContactModal._element.addEventListener("show.bs.modal", function () {
    updateGroupSelectOptions();
  });

  // Функция для очистки полей добавления контакта
  function clearContactInputs() {
    const contactForm = document.querySelector("#addContactModal form");
    contactForm.reset();
  }

  //Функция для очистки полей добавления группы
  function clearGroupInputs() {
    const groupForm = document.querySelector("#addGroupForm");
    groupForm.reset();
  }

  // Обновление опций выбора группы при добавлении контакта
  function updateGroupSelectOptions() {
    groupSelect.innerHTML = "";

    const groups = getGroups();

    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.textContent = "Выберите группу";
    groupSelect.appendChild(defaultOption);

    groups.forEach((groupName) => {
      const option = document.createElement("option");
      option.value = groupName;
      option.textContent = groupName;
      groupSelect.appendChild(option);
    });
  }

  // Отображение существующих групп при открытии модального окна добавления группы
  function renderExistingGroups() {
    const groupInputsContainer = document.getElementById(
      "groupInputsContainer"
    );
    groupInputsContainer.innerHTML = "";
    const groups = getGroups();

    groups.forEach((groupName) => {
      const newInputContainer = document.createElement("div");
      newInputContainer.classList.add("editable-input-container");

      const newInput = document.createElement("input");
      newInput.type = "text";
      newInput.classList.add("editable-input");
      newInput.value = groupName;

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
        const updatedGroups = getGroups().filter(
          (group) => group !== groupName
        );
        localStorage.setItem("groups", JSON.stringify(updatedGroups));
      });
    });
  }

  // Функция рендеринга аккордиона
  function renderAccordion() {
    const accordion = document.getElementById("accordion");
    accordion.innerHTML = "";

    const groups = getGroups();

    groups.forEach((groupName, index) => {
      const card = document.createElement("div");
      card.classList.add("accordion-item");

      const header = document.createElement("h2");
      header.classList.add("accordion-header");
      card.appendChild(header);

      const button = document.createElement("button");
      button.classList.add("accordion-button");
      button.setAttribute("type", "button");
      button.setAttribute("data-bs-toggle", "collapse");
      button.setAttribute("data-bs-target", `#collapse-${index}`);
      button.setAttribute("aria-expanded", "false");
      button.setAttribute("aria-controls", `collapse-${index}`);
      button.textContent = groupName;

      header.appendChild(button);

      const collapseDiv = document.createElement("div");
      collapseDiv.id = `collapse-${index}`;
      collapseDiv.classList.add("accordion-collapse", "collapse");
      collapseDiv.setAttribute("aria-labelledby", `heading-${index}`);
      collapseDiv.setAttribute("data-bs-parent", "#accordion");

      const body = document.createElement("div");
      body.classList.add("accordion-body");
      renderContactsInGroup(groupName, body);

      collapseDiv.appendChild(body);
      card.appendChild(collapseDiv);
      accordion.appendChild(card);
    });
  }

  // Функция для отображения контактов внутри группы
  function renderContactsInGroup(groupName, container) {
    const contacts = JSON.parse(localStorage.getItem("contacts")) || [];
    

    const groupContacts = contacts.filter(
      (contact) => contact.group === groupName
    );

    groupContacts.forEach((contact) => {
      const contactDiv = document.createElement("div");
      contactDiv.classList.add("contact");

      const nameDiv = document.createElement("div");
      nameDiv.classList.add("contact-name");
      nameDiv.textContent = contact.fio;
      contactDiv.appendChild(nameDiv);

      const phoneNumberDiv = document.createElement("div");
      phoneNumberDiv.textContent = contact.phoneNumber;
      phoneNumberDiv.classList.add("contact-phoneNumber");
      contactDiv.appendChild(phoneNumberDiv);

      const detailsDiv = document.createElement("div");
      detailsDiv.classList.add("contact-details");

      const editSvg = document.createElement("div");
      editSvg.classList.add("editSvg");
      editSvg.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" id="editSvg" width="36" height="36" viewBox="0 0 24 24" fill="none">
  <g clip-path="url(#clip0_6580_17)">
    <path opacity="0.3" d="M3 17.2501V21.0001H6.75L17.81 9.94006L14.06 6.19006L3 17.2501ZM20.71 7.04006C21.1 6.65006 21.1 6.02006 20.71 5.63006L18.37 3.29006C17.98 2.90006 17.35 2.90006 16.96 3.29006L15.13 5.12006L18.88 8.87006L20.71 7.04006Z" fill="black"/>
  </g>
  <defs>
    <clipPath id="clip0_6580_17">
      <rect width="24" height="24" fill="white"/>
    </clipPath>
  </defs>
</svg>
    `;

      const deleteSvg = document.createElement("div");
      deleteSvg.classList.add("deleteSvg");
      deleteSvg.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" id="svgDelete" width="36" height="36" viewBox="0 0 26 26" fill="none">
      <g clip-path="url(#clip0_1894_240)">
        <path opacity="0.3" d="M6.66664 20.3889C6.66664 21.55 7.61664 22.5 8.77775 22.5H17.2222C18.3833 22.5 19.3333 21.55 19.3333 20.3889V7.72222H6.66664V20.3889ZM9.26331 12.8733L10.7516 11.385L13 13.6228L15.2378 11.385L16.7261 12.8733L14.4883 15.1111L16.7261 17.3489L15.2378 18.8372L13 16.5994L10.7622 18.8372L9.27386 17.3489L11.5116 15.1111L9.26331 12.8733ZM16.6944 4.55556L15.6389 3.5H10.3611L9.30553 4.55556H5.61108V6.66667H20.3889V4.55556H16.6944Z" fill="black"/>
      </g>
      <defs>
        <clipPath id="clip0_1894_240">
          <rect width="25.3333" height="25.3333" fill="white" transform="translate(0.333252 0.333313)"/>
        </clipPath>
      </defs>
    </svg>`;

      detailsDiv.appendChild(editSvg);
      detailsDiv.appendChild(deleteSvg);

      contactDiv.appendChild(detailsDiv);
      container.appendChild(contactDiv);

      deleteSvg.addEventListener("click", function () {
        const updatedContacts = contacts.filter((c) => c !== contact);
        localStorage.setItem("contacts", JSON.stringify(updatedContacts));
        renderAccordion();
      });

      editSvg.addEventListener("click", function () {
        editContactModal(contact);
      });


      function editContactModal(contact) {
        addContactModal.show();      
        const inputName = document.querySelector("#addContactModal #inputName");
        const inputPhoneNumber = document.querySelector(
          "#addContactModal #inputPhoneNumber"
        );
        const inputGroup = document.querySelector("#addContactModal #inputGroup");
      
        inputName.value = contact.fio;
        inputPhoneNumber.value = contact.phoneNumber;
        inputGroup.value = contact.group;
        renderAccordion();
      }     
    });
  }
  renderAccordion();
}
