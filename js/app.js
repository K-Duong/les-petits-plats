//////////////// DOM ELEMENTS//////////////////
//Doms els
const inputSearchBar = document.querySelector(".nav-search-bar");
const inputIngredient = document.querySelector(".ingredient-input");
const inputAppliance = document.querySelector(".appliance-input");
const inputUstensil = document.querySelector(".ustensil-input");
const ulContainerIngredients = document.querySelector(".ingredients-options");
const ulContainerAppliances = document.querySelector(".appliances-options");
const ulContainerUstensils = document.querySelector(".ustensils-options");
const numOfFoundRecipes = document.querySelector(".number-result");
const cardsRecipesContainer = document.querySelector(".result-container");
const tagContainer = document.querySelector(".tag-container");

const btnsCollapse = document.querySelectorAll("button.accordion-button");
const collapseMenus = document.querySelectorAll("div.accordion-collapse");

const collapseMenuIng = document.querySelector("#collapseMenuIngredients");
const collapseMenuApp = document.querySelector("#collapseMenuAppliances");
const collapseMenuUst = document.querySelector("#collapseMenuUstensils");

//variables
let currentRecipes, currentListOfTagName, recipesAdvancedSearch;
let selectedIngredients = [];
let selectedAppliances = [];
let selectedUstensils = [];
let listOfTagItems = [];
let filterListIng = [];
let filterListAppliance = [];
let filterListUstensils = [];
let listOfIngOptions, listOfAppOptions, listOfUstOptions;

/////////////// FUNCTIONS //////////////////
// filter by Search Bar

//general functions
const closeCollapseMenu = () => {
  btnsCollapse.forEach((btn) => {
    btn.setAttribute("aria-expanded", "false");
    addClassList(btn, "collapsed");
  });
  collapseMenus.forEach((menu) => {
    removeClassList(menu, "show");
  });
};
const normalizeStr = (str) => {
  return str
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
};
// Filter result :
const filterByName = (str, arrRecipes) =>
  arrRecipes.filter((recipe) => normalizeStr(recipe.name).includes(str));
const filterByDescription = (str, arrRecipes) =>
  arrRecipes.filter((recipe) => normalizeStr(recipe.description).includes(str));
const filterByIngredients = (str, arrRecipes) => {
  return arrRecipes.filter((recipe) => {
    const ingsList = recipe.ingredients.map((ing) =>
      normalizeStr(ing.ingredient)
    );
    if (ingsList.some((ing) => ing.includes(str))) return recipe;
  });
};
const filterByAppliance = (str, arrRecipes) =>
  arrRecipes.filter((recipe) =>
    normalizeStr(recipe.appliance).includes(normalizeStr(str))
  );
const filterByUstensil = (str, arrRecipes) => {
  return arrRecipes.filter((recipe) => {
    const ustensilsList = recipe.ustensils.map((el) => normalizeStr(el));
    const ustensilFilterCondition = ustensilsList.some((el) =>
      el.includes(str)
    );
    if (ustensilFilterCondition) return recipe;
  });
};
// TODO: recreate function
const findByIng = (str, data) => {
  const ingredientsList = data.ingredients.map((ing) =>
    normalizeStr(ing.ingredient)
  );
  // console.log(ingredientsList);
  const ingFilterConditon = ingredientsList.some((ing) => ing.includes(str));
  if (ingFilterConditon) return ingFilterConditon;
};
const findByAppliance = (str, data) => {
  const applianceRecipe = normalizeStr(data.appliance);
  const applianceFilterCondition = applianceRecipe.includes(str);
  // console.log(applianceFilterCondition);
  if (applianceFilterCondition) return applianceFilterCondition;
};
const findByUstensil = (str, data) => {
  const ustensilsList = data.ustensils.map((el) => normalizeStr(el));
  const ustensilFilterCondition = ustensilsList.some((el) => el.includes(str));
  if (ustensilFilterCondition) return ustensilFilterCondition;
};
//filter list of options
const filterAllIngOptions = (currentRecipes) => [
  ...new Set(
    currentRecipes
      .map((recipe) =>
        recipe.ingredients.map((ingredients) => ingredients.ingredient)
      )
      .reduce((acc, curr) => acc.concat(curr))
      .sort()
  ),
];
const filterAllAppOptions = (currentRecipes) => [
  ...new Set(currentRecipes.map((recipe) => recipe.appliance)),
];
const filterAllUstOptions = (currentRecipes) => [
  ...new Set(
    currentRecipes
      .map((recipe) => recipe.ustensils)
      .reduce((acc, cur) => acc.concat(cur))
      .sort()
  ),
];
// functions for classList
const addClassList = (el, ...nameOfClass) => {
  el.classList.add(...nameOfClass);
};
const removeClassList = (el, ...nameOfClass) => {
  el.classList.remove(...nameOfClass);
};
// function to display data to interface
const styleSelectedOption = (option) => {
  // const icon = btn.querySelector("i");
  addClassList(option, "bg-warning", "fw-bolder-hover");
};
const removeInnerHTML = (el) => {
  el.innerHTML = "";
};
const displayErrorMessage = (str) => {
  removeInnerHTML(cardsRecipesContainer);
  cardsRecipesContainer.innerHTML = `<div class='col-12 text-center text-danger fs-4 fw-bold w-100'>Aucune recette ne contient "${str}" vous pouvez chercher "tarte aux pommes", "poisson", etc.</div>`;
};
const updateNumberOfFoundRecipes = (arrRecipes) => {
  if (arrRecipes.length > 0) {
    numOfFoundRecipes.textContent =
      arrRecipes.length.toString().padStart(2, "0") +
      `${arrRecipes.length === 1 ? " recette trouvée" : " recettes trouvées"} `;
  } else if (arrRecipes.length === 0) {
    numOfFoundRecipes.textContent = "00 recette retrouvée";
  } else {
    numOfFoundRecipes.textContent = "1500 recettes";
  }
};
const displayOptionsList = (originalListEl, ulContainer) => {
  removeInnerHTML(ulContainer);
  ulContainer.insertAdjacentHTML("beforeend", optionTemplate(originalListEl));
  const optionsNodeList = ulContainer.querySelectorAll("li");
  optionsNodeList.forEach((option) => {
    option.addEventListener("click", (e) => {
      selectElement(e);
    });
  });
};
const updateListOfOptions = (
  ulContainer,
  selectedList,
  listOfOrignialOptions
) => {
  removeInnerHTML(ulContainer);
  // console.log(selectedList.length);

  if (selectedList.length > 0) {
    ulContainer.insertAdjacentHTML("beforeend", optionTemplate(selectedList));
    const selectedLi = ulContainer.querySelectorAll("li");
    selectedLi.forEach((li) => {
      styleSelectedOption(li);

      // event handler to remove
      const btnClose = li.querySelector(".button-close");
      btnClose.addEventListener("click", (e) => {
        removeElement(e);
      });
    });
    ulContainer.insertAdjacentHTML(
      "beforeend",
      optionTemplate(listOfOrignialOptions)
    );
    const originalLi = ulContainer.querySelectorAll("li:not(.bg-warning)");
    originalLi.forEach((li) => {
      selectedLi.forEach((li2) => {
        if (normalizeStr(li.dataset.name) === normalizeStr(li2.dataset.name))
          addClassList(li, "hidden");
        li.addEventListener("click", (e) => {
          selectElement(e);
        });
      });
    });
  }
  if (selectedList.length === 0) {
    displayOptionsList(listOfOrignialOptions, ulContainer);
  }
};

const removeElement = (e) => {
  const target = e.target.closest("[data-name]");
  const elName = target.dataset.name;
  const ul = e.target.closest("ul");
  const allSelectedOptions = [
    selectedIngredients,
    selectedAppliances,
    selectedUstensils,
  ];

  if (ul) {
    if (ul.classList.contains("ingredients-options")) {
      const index1 = selectedIngredients.indexOf(target.dataset.name);
      selectedIngredients.splice(index1, 1);
      console.log("new list of selected ing:", selectedIngredients);

      // display on interface new list of options
      updateListOfOptions(
        ulContainerIngredients,
        selectedIngredients,
        listOfIngOptions
      );
      inputIngredient.value = "";
    }
    if (ul.classList.contains("appliances-options")) {
      const index1 = selectedAppliances.indexOf(target.dataset.name);
      selectedAppliances.splice(index1, 1);
      console.log("new list of selected ing:", selectedAppliances);

      // display on interface new list of options
      updateListOfOptions(
        ulContainerAppliances,
        selectedAppliances,
        listOfAppOptions
      );
      inputAppliance.value = "";
    }
    if (ul.classList.contains("ustensils-options")) {
      const index1 = selectedUstensils.indexOf(target.dataset.name);
      selectedUstensils.splice(index1, 1);
      console.log("new list of selected ing:", selectedUstensils);

      // display on interface new list of options
      updateListOfOptions(
        ulContainerUstensils,
        selectedUstensils,
        listOfUstOptions
      );
      inputAppliance.value = "";
    }
  }
  if (!ul) {
    // update new list of options
    // find removed element and removed this option from select lists
    allSelectedOptions.forEach((arrOptions) => {
      const index1 = arrOptions.indexOf(elName);
      if (index1 === -1) {
        return;
      }
      if (index1 !== -1) {
        arrOptions.splice(index1, 1);
        if (arrOptions === selectedIngredients) {
          updateListOfOptions(
            ulContainerIngredients,
            selectedIngredients,
            listOfIngOptions
          );
        }
        if (arrOptions === selectedAppliances) {
          updateListOfOptions(
            ulContainerAppliances,
            selectedAppliances,
            listOfAppOptions
          );
        }
        if (arrOptions === selectedUstensils) {
          updateListOfOptions(
            ulContainerUstensils,
            selectedUstensils,
            listOfUstOptions
          );
        }
        console.log(arrOptions);
      }
    });
  }

  // update listOfTagItems and display new result to interface
  const index2 = listOfTagItems.findIndex((el) => el === target.dataset.name);
  listOfTagItems.splice(index2, 1);
  displayTagName(listOfTagItems);

  // update recipesAdvancedSearch
  recipesAdvancedSearch = [...currentRecipes];
  console.log(allSelectedOptions);
  allSelectedOptions.forEach((selectedList) => {
    if (selectedList.length > 0) {
      if (selectedList === selectedIngredients) {
        selectedList.forEach((el) => {
          recipesAdvancedSearch = filterByIngredients(
            normalizeStr(el),
            recipesAdvancedSearch
          );
        });
      }
      if (selectedList === selectedAppliances) {
        selectedList.forEach((el) => {
          recipesAdvancedSearch = filterByAppliance(
            normalizeStr(el),
            recipesAdvancedSearch
          );
        });
      }
      if (selectedList === selectedUstensils) {
        selectedList.forEach((el) => {
          recipesAdvancedSearch = filterByUstensil(
            normalizeStr(el),
            recipesAdvancedSearch
          );
        });
      }
    }
    if (selectedList.length === 0) {
      recipesAdvancedSearch = recipesAdvancedSearch;
    }
  });
  // recipesAdvancedSearch
      // console.log(recipesAdvancedSearch);
  closeCollapseMenu();
  // update number of found recipe
  updateNumberOfFoundRecipes(recipesAdvancedSearch);
  // update cards results
  displayCardRecipes(recipesAdvancedSearch);
};

const selectElement = (e) => {
  //  target = li or button
  const target = e.target.closest("[data-name]");
  // console.log(target.dataset.name);
  const elName = target.dataset.name;

  // update data
  // list of selected Options
  //TODO: check if elName has been already selected ?
  if (listOfIngOptions.includes(elName)) {
    selectedIngredients.push(elName);
    updateListOfOptions(
      ulContainerIngredients,
      selectedIngredients,
      listOfIngOptions
    );
    recipesAdvancedSearch = filterByIngredients(
      normalizeStr(elName),
      recipesAdvancedSearch
    );
    console.log;
  }
  // console.log(selectedIngredients);
  if (listOfAppOptions.includes(elName)) {
    selectedAppliances.push(elName);
    updateListOfOptions(
      ulContainerAppliances,
      selectedAppliances,
      listOfAppOptions
    );
    recipesAdvancedSearch = filterByAppliance(
      normalizeStr(elName),
      recipesAdvancedSearch
    );
  }
  if (listOfUstOptions.includes(elName)) {
    selectedUstensils.push(elName);
    updateListOfOptions(
      ulContainerUstensils,
      selectedUstensils,
      listOfUstOptions
    );
    recipesAdvancedSearch = filterByUstensil(
      normalizeStr(elName),
      recipesAdvancedSearch
    );
  }
  // close all collapse menu
  closeCollapseMenu();
  // list of tag name
  listOfTagItems = selectedIngredients
    .concat(selectedAppliances)
    .concat(selectedUstensils);
  // console.log(recipesAdvancedSearch);
  // update interface
  //// display tag card
  displayTagName(listOfTagItems);
  //// display number of found recipe
  updateNumberOfFoundRecipes(recipesAdvancedSearch);
  //// display found recipe
  displayCardRecipes(recipesAdvancedSearch);
};

const displayCardRecipes = (arrRecipes) => {
  removeInnerHTML(cardsRecipesContainer);
  arrRecipes.forEach((recipe) => {
    cardsRecipesContainer.insertAdjacentHTML(
      "beforeend",
      cardRecipeTemplate(recipe)
    );
  });
};

const displayTagName = (
  listOfTag,
  ulContainer,
  liEl,
  listOfOriginalOptions,
  collapseMenu,
  filterListOptions
) => {
  // remove tag container
  removeInnerHTML(tagContainer);
  // display tag name on interface
  listOfTag.forEach((tag) => {
    tagContainer.insertAdjacentHTML("beforeend", tagName(tag));
  });
  // Event handler to remove tag name
  const tagNodeList = tagContainer.querySelectorAll("button");
  // console.log(tagNodeList);
  tagNodeList.forEach((tag) => {
    //   //TODO: à revoir pour tag name
    const iconClose = tag.querySelector(".button-close");
    iconClose.addEventListener("click", (e) => {
      // console.log("click on tag");
      removeElement(e);
    });
  });
};
const updateListOfTagName = () => {
  listTagResult = [
    ...new Set(
      filterListIng.concat(filterListAppliance).concat(filterListUstensils)
    ),
  ];
  console.log("list tag result,", listTagResult);
};
// filter by Searchbar
const cbSearchRecipes = (val, elInput) => {
  if (val === elInput.value) {
    // init data from DOM and filter lists
    const domToRemove = [
      ulContainerIngredients,
      ulContainerAppliances,
      ulContainerUstensils,
      tagContainer,
      cardsRecipesContainer,
      numOfFoundRecipes,
    ];
    domToRemove.forEach((dom) => removeInnerHTML(dom));
    filterListIng = [];
    filterListAppliance = [];
    filterListUstensils = [];
    const input = elInput.value;
    // console.log(input);

    // 0. normaliseStr
    const normalizeInput = normalizeStr(input);

    currentRecipes = [
      ...new Set(
        filterByName(normalizeInput, currentRecipes)
          .concat(filterByDescription(normalizeInput, currentRecipes))
          .concat(filterByIngredients(normalizeInput, currentRecipes))
      ),
    ];

    if (currentRecipes.length > 0) {
      listOfIngOptions = filterAllIngOptions(currentRecipes);
      listOfAppOptions = filterAllAppOptions(currentRecipes);
      listOfUstOptions = filterAllUstOptions(currentRecipes);
      // display interface
      /// 1.list of options for:
      ////1.1. Ingredients options
      console.log(listOfIngOptions);
      displayOptionsList(listOfIngOptions, ulContainerIngredients);
      ////1.2. Appliances options
      console.log(listOfAppOptions);
      displayOptionsList(listOfAppOptions, ulContainerAppliances);
      ////1.3. Ustensils options
      console.log(listOfUstOptions);
      displayOptionsList(listOfUstOptions, ulContainerUstensils);

      /// 2. update number of found recipes
      updateNumberOfFoundRecipes(currentRecipes);

      /// 3. update card recipes
      displayCardRecipes(currentRecipes);

      recipesAdvancedSearch = [...currentRecipes];

      // addEventHandler to advanced search
      addEventHandlerSearchByIngredient();
      addEventHandlerSearchByAppliance();
      addEventHandlerSearchByUstensil();
    } else {
      // display error
      updateNumberOfFoundRecipes(currentRecipes);
      displayErrorMessage(input);
    }
  }
};

const addEventHandlerSearchByIngredient = () => {
  inputIngredient.addEventListener("input", (e) => {
    const value = e.target.value;
    // console.log(recipesAdvancedSearch);
    const listContainer = inputIngredient.nextElementSibling;
    // console.log(recipesAdvancedSearch);
    debounceAdvancedSearchByIngredient(value, e.target, listContainer);
  });
};
const addEventHandlerSearchByAppliance = () => {
  inputAppliance.addEventListener("input", (e) => {
    const value = e.target.value;
    // console.log(recipesAdvancedSearch);
    const listContainer = inputAppliance.nextElementSibling;
    // console.log(recipesAdvancedSearch);
    debounceAdvancedSearchByAppliance(value, e.target, listContainer);
  });
};
const addEventHandlerSearchByUstensil = () => {
  inputUstensil.addEventListener("input", (e) => {
    const value = e.target.value;
    // console.log(recipesAdvancedSearch);
    const listContainer = inputUstensil.nextElementSibling;
    // console.log(recipesAdvancedSearch);
    debounceAdvancedSearchByUstensil(value, e.target, listContainer);
  });
};


// advanced Search
const cbAdvancedSearchByUstensil = (val, elInput, ulContainer) => {
  if (val === elInput.value) {
    const input = elInput.value;

    // 0. normaliseStr
    const normalizeInput = normalizeStr(input);

    //update filter option
    const suggestionList = listOfUstOptions.filter((option) =>
      normalizeStr(option).includes(normalizeInput)
    );

    removeInnerHTML(ulContainer);
    ulContainer.insertAdjacentHTML("beforeend", optionTemplate(suggestionList));

    //event handler option button
    const optionsNodeList = ulContainer.querySelectorAll("li");

    // add event handler for each option
    optionsNodeList.forEach((option) => {
      option.addEventListener("click", (e) => {
        selectElement(e);
      });
    });
  }
};

const cbAdvancedSearchByAppliance = (val, elInput, ulContainer) => {
  if (val === elInput.value) {
    const input = elInput.value;

    // 0. normaliseStr
    const normalizeInput = normalizeStr(input);

    //update filter option
    const suggestionList = listOfAppOptions.filter((option) =>
      normalizeStr(option).includes(normalizeInput)
    );

    removeInnerHTML(ulContainer);
    ulContainer.insertAdjacentHTML("beforeend", optionTemplate(suggestionList));

    //event handler option button
    const optionsNodeList = ulContainer.querySelectorAll("li");

    // add event handler for each option
    optionsNodeList.forEach((option) => {
      option.addEventListener("click", (e) => {
        selectElement(e);
      });
    });
  }
};
const cbAdvancedSearchByIngredients = (val, elInput, ulContainer) => {
  if (val === elInput.value) {
    const input = elInput.value;

    //normaliseStr
    const normalizeInput = normalizeStr(input);

    //create suggestion list
    const suggestionList = listOfIngOptions.filter((option) =>
      normalizeStr(option).includes(normalizeInput)
    );

    removeInnerHTML(ulContainer);
    ulContainer.insertAdjacentHTML("beforeend", optionTemplate(suggestionList));

    //event handler option button
    const optionsNodeList = ulContainer.querySelectorAll("li");

    // add event handler for each option
    optionsNodeList.forEach((option) => {
      option.addEventListener("click", (e) => {
        selectElement(e);
      });
    });
  }
};

//Debounce
const debounce = (val, elInput) => {
  setTimeout(() => {
    cbSearchRecipes(val, elInput);
  }, 300);
};
const debounceAdvancedSearchByIngredient = (val, elInput, ulContainer) => {
  setTimeout(() => {
    cbAdvancedSearchByIngredients(val, elInput, ulContainer);
  }, 300);
};
const debounceAdvancedSearchByAppliance = (val, elInput, ulContainer) => {
  setTimeout(() => {
    cbAdvancedSearchByAppliance(val, elInput, ulContainer);
  }, 300);
};
const debounceAdvancedSearchByUstensil = (val, elInput, ulContainer) => {
  setTimeout(() => {
    cbAdvancedSearchByUstensil(val, elInput, ulContainer);
  }, 300);
};
//add event handler by Search bar
const addEHandlerSearchBar = () => {
  inputSearchBar.addEventListener("input", (e) => {
    currentRecipes = recipes;
    const value = e.target.value;
    // if input < 3 characters is not valid
    if (value.length < 3) return;
    // if input is valid
    // debounce(value, e.target, currentRecipes);
    debounce(value, e.target);
  });
};

// filter by advanced Search
//1. filter by Ingredients
//2. filter by Appliances
//3. filter by Ustensils

////////////////// APP //////////////////
const init = () => {
  addEHandlerSearchBar();
  //remove all content
};

init();

// const arr = [1, 2, 1, 3, 4, 3, 5];

const toFindDuplicates = (arry) =>
  arry.filter((recipe, index) => arry.indexOf(recipe) !== index);
// const duplicateElements = toFindDuplicates(arr);
// console.log(duplicateElements);
