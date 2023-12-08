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

let listOfIngOptions = [];
let listOfAppOptions = [];
let listOfUstOptions = [];

/////////////// FUNCTIONS //////////////////
// filter by Search Bar

//general functions
const closeCollapseMenu = () => {
  for (let btn of btnsCollapse) {
    btn.setAttribute("aria-expanded", "false");
    addClassList(btn, "collapsed");
  }
  for (let menu of collapseMenus) {
    removeClassList(menu, "show");
  }
};
const normalizeStr = (str) => {
  return str
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
};

// filter recipes result
const filterByName = (normalizedStr, arrRecipes) => {
  let filteredRecipesByName = [];
  // const normalizedStr = normalizeStr(str);
  for (let recipe of arrRecipes) {
    const normalizedNameRecipe = normalizeStr(recipe.name);
    if (normalizedNameRecipe.includes(normalizedStr))
      filteredRecipesByName.push(recipe);
  }
  // console.log( filteredRecipesByName);
  return filteredRecipesByName;
};
const filterByDescription = (normalizedStr, arrRecipes) => {
  let filteredRecipesByDes = [];
  // const normalizedStr = normalizeStr(str);
  for (let recipe of arrRecipes) {
    
    const normalizedDescription = normalizeStr(recipe.description);
    if (normalizedDescription.includes(normalizedStr))
      filteredRecipesByDes.push(recipe);
  }
  // console.log(filteredRecipesByDes);
  return filteredRecipesByDes;
};

const filterByIngredients = (normalizedStr, arrRecipes) => {
  let filteredRecipesByIng = [];
  // const normalizedStr = normalizeStr(str);

  for (let recipe of arrRecipes) {
    for (let el of recipe.ingredients) {
      // if ingredient include string
      if (normalizeStr(el.ingredient).includes(normalizedStr)) {
        filteredRecipesByIng.push(recipe);
        break;
      }
    }
  }
  // console.log(filteredRecipesByIng);
  return filteredRecipesByIng;
};

const filterByAppliance = (normalizedStr, arrRecipes) => {
  let filteredRecipesByApp = [];
  for (let recipe of arrRecipes) {
    if (normalizeStr(recipe.appliance).includes(normalizedStr)) {
      filteredRecipesByApp.push(recipe);
    }
  }
  console.log(filteredRecipesByApp);
  return filteredRecipesByApp;
};
const filterByUstensil = (normalizedStr, arrRecipes) => {
  let filteredRecipesByUst = [];
  for (let recipe of arrRecipes) {
    for (let ustensil of recipe.ustensils) {
      if (normalizeStr(ustensil).includes(normalizedStr)) {
        filteredRecipesByUst.push(recipe);
        break;
      }
    }
  }
  // console.log("filtered recipe from ustensils list", filteredRecipesByUst);
  return filteredRecipesByUst;
};

// filter options list from recipe result
const filterAllIngOptions = (arrRecipes) => {
  listOfIngOptions = [];
  for (let recipe of arrRecipes) {
    for (let el of recipe.ingredients) {
      listOfIngOptions.push(el.ingredient);
    }
  }
  listOfIngOptions = [...new Set(listOfIngOptions)].sort();
  // checkIsRepeated(listOfIngOptions);
  console.log("liste des ingrédients", listOfIngOptions);
  return listOfIngOptions;
};

const filterAllAppOptions = (arrRecipes) => {
  listOfAppOptions = [];
  for (let recipe of arrRecipes) {
    listOfAppOptions.push(recipe.appliance);
  }
  listOfAppOptions = [...new Set(listOfAppOptions)].sort();
  console.log("liste des appareils",listOfAppOptions);
  return listOfAppOptions;
};
const filterAllUstOptions = (arrRecipes) => {
  listOfUstOptions = [];
  for (let recipe of arrRecipes) {
    for (let ustensil of recipe.ustensils) {
      listOfUstOptions.push(ustensil);
    }
  }
  listOfUstOptions = [...new Set(listOfUstOptions)].sort();
  console.log("liste des ustensiles",listOfUstOptions);
  return listOfUstOptions;
};

// // functions for classList
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
  for (let accordionBody of accordionBodyDoms) {
    accordionBody.style.height = "250px";
  }
  removeInnerHTML(ulContainer);
  ulContainer.insertAdjacentHTML("beforeend", optionTemplate(originalListEl));
  const optionsNodeList = ulContainer.querySelectorAll("li");
  for (let option of optionsNodeList) {
    option.addEventListener("click", (e) => {
      selectElement(e);
    });
  }
};

const displayNewListOptions = (
  ulContainer,
  selectedList,
  listOfOrignialOptions
) => {
  removeInnerHTML(ulContainer);
  if (selectedList.length > 0) {
    ulContainer.insertAdjacentHTML("beforeend", optionTemplate(selectedList));
    const selectedLi = ulContainer.querySelectorAll("li");
    for (let li of selectedLi) {
      styleSelectedOption(li);

      //   // event handler to remove
      const btnClose = li.querySelector(".button-close");
      btnClose.addEventListener("click", (e) => {
        removeElement(e);
      });
    }
    ulContainer.insertAdjacentHTML(
      "beforeend",
      optionTemplate(listOfOrignialOptions)
    );
    const originalLi = ulContainer.querySelectorAll("li:not(.bg-warning)");
    for (let li of originalLi) {
      for (let li2 of selectedLi) {
        if (normalizeStr(li.dataset.name) === normalizeStr(li2.dataset.name))
          addClassList(li, "hidden");
        li.addEventListener("click", (e) => {
          selectElement(e);
        });
      }
    }
  }
  if (selectedList.length === 0) {
    displayOptionsList(listOfOrignialOptions, ulContainer);
  }
};

const displayCardRecipes = (arrRecipes) => {
  removeInnerHTML(cardsRecipesContainer);
  for (let recipe of arrRecipes) {
    cardsRecipesContainer.insertAdjacentHTML(
      "beforeend",
      cardRecipeTemplate(recipe)
    );
  }
};

const displayTagName = (listOfTag) => {
  removeInnerHTML(tagContainer);
  // display tag name on interface
  for (let tag of listOfTag) {
    tagContainer.insertAdjacentHTML("beforeend", tagName(tag));
  }
  // Event handler to remove tag name
  const tagNodeList = tagContainer.querySelectorAll("button");
  for (let tag of tagNodeList) {
    const iconClose = tag.querySelector(".button-close");
    iconClose.addEventListener("click", (e) => {
      removeElement(e);
    });
  }
};

// re-update list of options after filtering by advanced search
const updatefilteredListOfOptions = (arrRecipes) => {
  filterAllIngOptions(arrRecipes);
  filterAllAppOptions(arrRecipes);
  filterAllUstOptions(arrRecipes);
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
    } else if (ul === ulContainerAppliances) {
      const index1 = selectedAppliances.indexOf(target.dataset.name);
      selectedAppliances.splice(index1, 1);

      inputAppliance.value = "";
    } else if (ul === ulContainerUstensils) {
      const index1 = selectedUstensils.indexOf(target.dataset.name);
      selectedUstensils.splice(index1, 1);

      inputAppliance.value = "";
    }
      // if remove a tag name
  } else {
    // update new list of options
    // find removed element and removed this option from selected lists
    for (let optionList of allSelectedOptions) {
      // console.log("option list", optionList);
      const index1 = optionList.indexOf(elName);
      if (index1 > -1) {
        optionList.splice(index1, 1);
      }
    }
   }

  // update listOfTagItems and display new result to interface
  const index2 = listOfTagItems.findIndex((el) => el === target.dataset.name);
  listOfTagItems.splice(index2, 1);
  displayTagName(listOfTagItems);

  // update recipesAdvancedSearch
  recipesAdvancedSearch = [...currentRecipes];
  for (let selectedList of allSelectedOptions) {
    if (selectedList.length > 0) {
      if (selectedList === selectedIngredients) {
        for (let el of selectedList) {
          const normalizedEl = normalizeStr(el);
          recipesAdvancedSearch = filterByIngredients(
            normalizedEl,
            recipesAdvancedSearch
          );
        }
      } else if (selectedList === selectedAppliances) {
        for (let el of selectedList) {
          const normalizedEl = normalizeStr(el);
          recipesAdvancedSearch = filterByAppliance(
            normalizedEl,
            recipesAdvancedSearch
          );
        }
      } else if (selectedList === selectedUstensils) {
        for (let el of selectedList) {
          const normalizedEl = normalizeStr(el);
          recipesAdvancedSearch = filterByUstensil(
            normalizedEl,
            recipesAdvancedSearch
          );
        }
      }
    }
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

  // recipesAdvancedSearch
  closeCollapseMenu();
  // update number of found recipe
  updateNumberOfFoundRecipes(recipesAdvancedSearch);
  // update cards results
  displayCardRecipes(recipesAdvancedSearch);
};

const selectElement = (e) => {
  //  target = li or button
  const target = e.target.closest("[data-name]");
  const elName = target.dataset.name;
  const normalizedEl = normalizeStr(elName)

  //1. update data
  ////1.1 list of selected Options
  //TODO: check if elName has been already selected ?
  if (listOfIngOptions.includes(elName)) {
    selectedIngredients.push(elName);
    recipesAdvancedSearch = filterByIngredients(
      normalizedEl,
      recipesAdvancedSearch
    );
    inputIngredient.value = "";
  } else if (listOfAppOptions.includes(elName)) {
    selectedAppliances.push(elName);
    recipesAdvancedSearch = filterByAppliance(
      normalizedEl,
      recipesAdvancedSearch
    );
    inputAppliance.value = "";
  } else if (listOfUstOptions.includes(elName)) {
    selectedUstensils.push(elName);
    recipesAdvancedSearch = filterByUstensil(
      normalizedEl,
      recipesAdvancedSearch
    );
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
    // init data from DOM and filter lists
    const input = elInput.value;
    const normalizedInput = normalizeStr(input)

    const domToRemove = [
      ulContainerIngredients,
      ulContainerAppliances,
      ulContainerUstensils,
      tagContainer,
      cardsRecipesContainer,
      numOfFoundRecipes,
    ];
    for (let dom of domToRemove) {
      removeInnerHTML(dom);
    }
    selectedIngredients = [];
    selectedAppliances = [];
    selectedUstensils = [];
    listOfTagItems = [];

    closeCollapseMenu();
    // return concat list of all filtered recipe list
    currentRecipes = [
      ...new Set(
        filterByName(normalizedInput, currentRecipes)
          .concat(filterByDescription(normalizedInput, currentRecipes))
          .concat(filterByIngredients(normalizedInput, currentRecipes))
      ),
    ];
    console.log(currentRecipes);

    // filter list of options
    if (currentRecipes.length > 0) {
      filterAllIngOptions(currentRecipes);
      filterAllAppOptions(currentRecipes);
      filterAllUstOptions(currentRecipes);
      // display interface
      /// 1.list of options for:
      ////1.1. Ingredients options
      displayOptionsList(listOfIngOptions, ulContainerIngredients);
      ////1.2. Appliances options
      displayOptionsList(listOfAppOptions, ulContainerAppliances);
      ////1.3. Ustensils options
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
// advanced Search
const cbAdvancedSearch = (val, elInput, ulContainer) => {
  if (val === elInput.value) {
    const input = elInput.value;
    let suggestionList = [];

    // 0. normaliseStr
    const normalizeInput = normalizeStr(input);

    //update filter option
    if (ulContainer === ulContainerIngredients) {
      for (let option of listOfIngOptions) {
        if (normalizeStr(option).includes(normalizeInput)) {
          suggestionList.push(option);
        }
      }
    }else if (ulContainer === ulContainerAppliances) {
      for (let option of listOfAppOptions) {
        if (normalizeStr(option).includes(normalizeInput)) {
          suggestionList.push(option);
        }
      }
    }else if (ulContainer === ulContainerUstensils) {
      for (let option of listOfUstOptions) {
        if (normalizeStr(option).includes(normalizeInput)) {
          suggestionList.push(option);
        }
      }
    }

    removeInnerHTML(ulContainer);
    ulContainer.insertAdjacentHTML("beforeend", optionTemplate(suggestionList));

    //event handler option button
    const optionsNodeList = ulContainer.querySelectorAll("li");

    // add event handler for each option
    for (let optionNode of optionsNodeList) {
      optionNode.addEventListener("click", (e) => {
        selectElement(e);
      });
    }
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
// //add event handler
// ////search bar
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
