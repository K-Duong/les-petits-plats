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

const accordionBodyDoms = document.querySelectorAll(".accordion-body");

//variables
let currentRecipes, currentListOfTagName, recipesAdvancedSearch;
let selectedIngredients = [];
let selectedAppliances = [];
let selectedUstensils = [];

let listOfTagItems = [];

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
// TODO: appliquer dans la liste des ingrédient ex: lait de coco - corriger les données si besoin
const normalizeStr = (str) => {
  return str
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
};

// const checkIsDuplicated = (arrData) => {
//   let temp = arrData.map(data => normalizeStr(data));
  
//   temp.findIndex((item, index) => (temp.indexOf(item) !== index));
// }
// const arr = ['Duong', 'huy', 'hello', 'duong','Huy', 'lucie'];
// console.log(checkIsDuplicated(arr));
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
// const findByIng = (str, data) => {
//   const ingredientsList = data.ingredients.map((ing) =>
//     normalizeStr(ing.ingredient)
//   );
//   // console.log(ingredientsList);
//   const ingFilterConditon = ingredientsList.some((ing) => ing.includes(str));
//   if (ingFilterConditon) return ingFilterConditon;
// };
// const findByAppliance = (str, data) => {
//   const applianceRecipe = normalizeStr(data.appliance);
//   const applianceFilterCondition = applianceRecipe.includes(str);
//   // console.log(applianceFilterCondition);
//   if (applianceFilterCondition) return applianceFilterCondition;
// };
// const findByUstensil = (str, data) => {
//   const ustensilsList = data.ustensils.map((el) => normalizeStr(el));
//   const ustensilFilterCondition = ustensilsList.some((el) => el.includes(str));
//   if (ustensilFilterCondition) return ustensilFilterCondition;
// };
//filter list of options
// const filterAllIngOptions = (currentRecipes) => {
//   let tempArr = [
//   ...new Set(
//     currentRecipes
//       .map((recipe) =>
//         recipe.ingredients.map((ingredients) => ingredients.ingredient)
//       )
//       .reduce((acc, curr) => acc.concat(curr))
//       .sort()
//   ),
// ];
//  checkIsDuplicated(tempArr);
//  console.log("temp,", tempArr);
// }

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
  addClassList(option, "bg-warning");
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
  accordionBodyDoms.forEach(
    (accordionBody) => (accordionBody.style.height = "250px")
  );
  removeInnerHTML(ulContainer);
  ulContainer.insertAdjacentHTML("beforeend", optionTemplate(originalListEl));
  const optionsNodeList = ulContainer.querySelectorAll("li");
  optionsNodeList.forEach((option) => {
    option.addEventListener("click", (e) => {
      selectElement(e);
    });
  });
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

const displayTagName = (listOfTag) => {
  removeInnerHTML(tagContainer);
  // display tag name on interface
  listOfTag.forEach((tag) => {
    tagContainer.insertAdjacentHTML("beforeend", tagName(tag));
  });
  // Event handler to remove tag name
  const tagNodeList = tagContainer.querySelectorAll("button");
  tagNodeList.forEach((tag) => {
    const iconClose = tag.querySelector(".button-close");
    iconClose.addEventListener("click", (e) => {
      removeElement(e);
    });
  });
};
// update list of options (ingredients, appliances, ustensils) to display
const displayNewListOptions = (
  ulContainer,
  selectedList,
  listOfOrignialOptions
) => {
  removeInnerHTML(ulContainer);

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
  // if remove an option from list
  if (ul) {
    if (ul === ulContainerIngredients) {
      // remove el from selected list
      const index1 = selectedIngredients.indexOf(target.dataset.name);
      selectedIngredients.splice(index1, 1);
      inputIngredient.value = "";
    }
    if (ul === ulContainerAppliances) {
      const index1 = selectedAppliances.indexOf(target.dataset.name);
      selectedAppliances.splice(index1, 1);
      inputAppliance.value = "";
    }
    if (ul === ulContainerUstensils) {
      const index1 = selectedUstensils.indexOf(target.dataset.name);
      selectedUstensils.splice(index1, 1);
      inputAppliance.value = "";
    }
  }
  // if remove a tag name
  if (!ul) {
    // update new list of options
    // find removed element and removed this option from selected lists
    allSelectedOptions.forEach((arrOptions) => {
      const index1 = arrOptions.indexOf(elName);
      if (index1 === -1) return;
      if (index1 !== -1) arrOptions.splice(index1, 1);
    });
  }

  // update listOfTagItems and display new result to interface
  const index2 = listOfTagItems.findIndex((el) => el === target.dataset.name);
  listOfTagItems.splice(index2, 1);
  displayTagName(listOfTagItems);

  // update recipesAdvancedSearch
  recipesAdvancedSearch = [...currentRecipes];
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

  updatefilteredListOfOptions(recipesAdvancedSearch);

  displayNewListOptions(
    ulContainerIngredients,
    selectedIngredients,
    listOfIngOptions
  );
  displayNewListOptions(
    ulContainerAppliances,
    selectedAppliances,
    listOfAppOptions
  );
  displayNewListOptions(
    ulContainerUstensils,
    selectedUstensils,
    listOfUstOptions
  );
  // recipesAdvancedSearch
  closeCollapseMenu();
  // update number of found recipe
  updateNumberOfFoundRecipes(recipesAdvancedSearch);
  // update cards results
  displayCardRecipes(recipesAdvancedSearch);
};

const updatefilteredListOfOptions = (arrRecipes) => {
  listOfIngOptions = filterAllIngOptions(arrRecipes);
  listOfAppOptions = filterAllAppOptions(arrRecipes);
  listOfUstOptions = filterAllUstOptions(arrRecipes);
};

const selectElement = (e) => {
  //  target = li or button
  const target = e.target.closest("[data-name]");
  const elName = target.dataset.name;

  //1. update data
  ////1.1 list of selected Options
  //TODO: check if elName has been already selected ?
  if (listOfIngOptions.includes(elName)) {
    recipesAdvancedSearch = filterByIngredients(
      normalizeStr(elName),
      recipesAdvancedSearch
    );
    selectedIngredients.push(elName);
    inputIngredient.value = "";
  }
  if (listOfAppOptions.includes(elName)) {
    recipesAdvancedSearch = filterByAppliance(
      normalizeStr(elName),
      recipesAdvancedSearch
    );
    selectedAppliances.push(elName);

    inputAppliance.value = "";
  }
  if (listOfUstOptions.includes(elName)) {
    recipesAdvancedSearch = filterByUstensil(
      normalizeStr(elName),
      recipesAdvancedSearch
    );
    selectedUstensils.push(elName);

    inputUstensil.value = "";
  }
  updatefilteredListOfOptions(recipesAdvancedSearch);
  displayNewListOptions(
    ulContainerIngredients,
    selectedIngredients,
    listOfIngOptions
  );
  displayNewListOptions(
    ulContainerAppliances,
    selectedAppliances,
    listOfAppOptions
  );
  displayNewListOptions(
    ulContainerUstensils,
    selectedUstensils,
    listOfUstOptions
  );

  ////1.2 list of tag name
  listOfTagItems = selectedIngredients
    .concat(selectedAppliances)
    .concat(selectedUstensils);

  //2. update interface
  ////2.1 display tag card
  displayTagName(listOfTagItems);
  ////2.2 display number of found recipe
  updateNumberOfFoundRecipes(recipesAdvancedSearch);
  ////2.3 display found recipe
  displayCardRecipes(recipesAdvancedSearch);
  //3. close all collapse menu and
  closeCollapseMenu();
};

// filter by Searchbar
const cbGeneralSearch = (val, elInput) => {
  if (val === elInput.value) {
    // console.log(currentRecipes);
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
    selectedIngredients = [];
    selectedAppliances = [];
    selectedUstensils = [];
    listOfTagItems = [];
    const input = elInput.value;

    closeCollapseMenu();

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
    console.log(recipesAdvancedSearch);
  }
};

// advanced Search
const cbAdvancedSearch = (val, elInput, ulContainer) => {
  if (val === elInput.value) {
    const input = elInput.value;
    let suggestionList;

    // 0. normaliseStr
    const normalizeInput = normalizeStr(input);

    //update filter option
    if (ulContainer === ulContainerIngredients) {
      suggestionList = listOfIngOptions.filter((option) =>
        normalizeStr(option).includes(normalizeInput)
      );
    }
    if (ulContainer === ulContainerAppliances) {
      suggestionList = listOfAppOptions.filter((option) =>
        normalizeStr(option).includes(normalizeInput)
      );
    }
    if (ulContainer === ulContainerUstensils) {
      suggestionList = listOfUstOptions.filter((option) =>
        normalizeStr(option).includes(normalizeInput)
      );
    }

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
    cbGeneralSearch(val, elInput);
  }, 300);
};
const debounceAdvancedSearchByIngredient = (val, elInput, ulContainer) => {
  setTimeout(() => {
    cbAdvancedSearch(val, elInput, ulContainer);
  }, 300);
};
const debounceAdvancedSearchByAppliance = (val, elInput, ulContainer) => {
  setTimeout(() => {
    cbAdvancedSearch(val, elInput, ulContainer);
  }, 300);
};
const debounceAdvancedSearchByUstensil = (val, elInput, ulContainer) => {
  setTimeout(() => {
    cbAdvancedSearch(val, elInput, ulContainer);
  }, 300);
};
//add event handler
////search bar
const addEHandlerSearchBar = () => {
  inputSearchBar.addEventListener("input", (e) => {
    currentRecipes = recipes;
    const value = e.target.value;
    // if input < 3 characters is not valid
    if (value.length < 3) return;
    // if input is valid
    debounce(value, e.target);
  });
};
////advanced search
const addEventHandlerSearchByIngredient = () => {
  inputIngredient.addEventListener("input", (e) => {
    const value = e.target.value;
    debounceAdvancedSearchByIngredient(value, e.target, ulContainerIngredients);
  });
};
const addEventHandlerSearchByAppliance = () => {
  inputAppliance.addEventListener("input", (e) => {
    const value = e.target.value;
    debounceAdvancedSearchByAppliance(value, e.target, ulContainerAppliances);
  });
};
const addEventHandlerSearchByUstensil = () => {
  inputUstensil.addEventListener("input", (e) => {
    const value = e.target.value;
    debounceAdvancedSearchByUstensil(value, e.target, ulContainerUstensils);
  });
};

////////////////// APP //////////////////
const init = () => {
  currentRecipes = recipes;

  addEHandlerSearchBar();
  displayCardRecipes(currentRecipes);
};

init();
