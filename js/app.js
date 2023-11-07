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
const displayOptionsList = (selectedList, ulContainer) => {
  removeInnerHTML(ulContainer);
  ulContainer.insertAdjacentHTML("beforeend", optionTemplate(selectedList));
  const selectedOptions = ulContainer.querySelectorAll("li");
  // console.log(selectedOption);
  // debounce input advanced search
  selectedOptions.forEach((option) => {
    option.addEventListener("click", (e) => {
      selectElement(e);
    });
  });
  //event handler select an option

  //filter by selected list

  // update style of
};
const updateListOfOptions = (
  elName,
  ulContainer,
  selectedList,
  listOfOrignialOptions
) => {
  removeInnerHTML(ulContainer);
  ulContainer.insertAdjacentHTML("beforeend", optionTemplate(selectedList));
  const selectedLi = ulContainer.querySelectorAll("li");
  selectedLi.forEach((li) => styleSelectedOption(li));
  ulContainer.insertAdjacentHTML(
    "beforeend",
    optionTemplate(listOfOrignialOptions)
  );
  const originalLi = ulContainer.querySelectorAll("li:not(.bg-warning)");
  originalLi.forEach((li) => {
    if (normalizeStr(li.dataset.name) === normalizeStr(elName))
      addClassList(li, "hidden");
    li.addEventListener("click", (e) => {
      selectElement(e);
    });
  });
};

const selectElement = (event) => {
  //  target = li or button
  const target = event.target.closest("[data-name]");
  console.log(target.dataset.name);
  const elName = target.dataset.name;

  // update data
  // list of selected Options
  //TODO: check if elName has been already selected ?
  if (listOfIngOptions.includes(elName)) {
    selectedIngredients.push(elName);
    updateListOfOptions(
      elName,
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
      elName,
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
      elName,
      ulContainerUstensils,
      selectedUstensils,
      listOfUstOptions
    );
    recipesAdvancedSearch = filterByUstensil(
      normalizeStr(elName),
      recipesAdvancedSearch
    );
  }

  // list of tag name
  listOfTagItems = selectedIngredients
    .concat(selectedAppliances)
    .concat(selectedUstensils);
  console.log(recipesAdvancedSearch);
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
  console.log(tagNodeList);
  tagNodeList.forEach((tag) => {
    //   //TODO: à revoir pour tag name
    const iconClose = tag.querySelector(".button-close");
    iconClose.addEventListener("click", () => {
      console.log("click on tag");
      addEHandlerToBtnCloseOfOption(
        ulContainer,
        liEl,
        listOfOriginalOptions,
        collapseMenu,
        filterListOptions
      );

      //     addEHandlerToBtnCloseOfOption(tag,
      //       liOriginal,
      //       collapseMenu,
      //       filterListToDisplay)
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

// event handler
const addEHandlerToBtnCloseOfOption = (
  ulContainer,
  liEl,
  listOfOriginalOptions,
  collapseMenu,
  filterListOptions
) => {
  console.log("list tag result, ", listTagResult);
  // update list of tag name and display tag name
  const index1 = listTagResult.findIndex((el) => el === liEl.dataset.name);
  listTagResult.splice(index1, 1);
  console.log("list tag result after removing el:", listTagResult);
  const index2 = filterListOptions.findIndex((el) => el === liEl.dataset.name);
  filterListOptions.splice(index2, 1);
  console.log("list of filter element after removing el:", filterListOptions);

  // hidden li filter and display li orginial
  // addClassList(liEl, "hidden");
  // liOriginal.forEach((li2) => {
  //   if (normalizeStr(liEl.dataset.name) === normalizeStr(li2.dataset.name))
  //     removeClassList(li2, "hidden");
  // });
  listTagResult;
  // TODO: revoir avec bootstrap JS
  removeClassList(collapseMenu, "show");

  updateOptionsList(
    ulContainer,
    filterListOptions,
    listOfOriginalOptions,
    collapseMenu
  );

  // update card tag name
  displayTagName(
    listTagResult,
    ulContainer,
    liEl,
    listOfOriginalOptions,
    collapseMenu,
    filterListOptions
  );
  // const a = filterListIng.map(ing => filterByIngredients(normalizeStr(ing), currentRecipes));
  // const b = filterListAppliance.map(appliance  => filterByAppliance(appliance, currentRecipes));
  // const c = filterListUstensils.map(ustensilList => filterByUstensil(ustensilList, currentRecipes) );
  // console.log(filterListIng, a);
  // console.log(filterListAppliance,b);
  // console.log(filterListUstensils,c);

  if (listTagResult.length > 1) {
    const filteredRecipesFromTagResult = listTagResult.map((tag) => {
      return currentRecipes.filter((recipe) => {
        const condition =
          findByIng(normalizeStr(tag), recipe) ||
          findByAppliance(normalizeStr(tag), recipe) ||
          findByUstensil(normalizeStr(tag), recipe);
        if (condition) return recipe;
      });
    });

    const recipeConcat = filteredRecipesFromTagResult.reduce((acc, curr) =>
      acc.concat(curr)
    );
    console.log("duplicate", toFindDuplicates(recipeConcat));
    recipesAdvancedSearch = toFindDuplicates(recipeConcat);
  } else if (listTagResult.length === 1) {
    console.log("list of tag", listTagResult);
    [recipesAdvancedSearch] = [
      ...listTagResult.map((tag) => {
        return currentRecipes.filter((recipe) => {
          const condition =
            findByIng(normalizeStr(tag), recipe) ||
            findByAppliance(normalizeStr(tag), recipe) ||
            findByUstensil(normalizeStr(tag), recipe);
          if (condition) return recipe;
        });
      }),
    ];
  } else {
    recipesAdvancedSearch = [];
  }

  console.log("recipesAdvancedSearch", recipesAdvancedSearch);

  // if recipesAdvancedSearch.length > 0
  if (recipesAdvancedSearch.length > 0 || listTagResult.length > 0) {
    //  update number of result
    updateNumberOfFoundRecipes(recipesAdvancedSearch);
    // update cards recipes
    displayCardRecipes(recipesAdvancedSearch);
  } else {
    recipesAdvancedSearch = [...currentRecipes];
    updateNumberOfFoundRecipes(recipesAdvancedSearch);
    displayCardRecipes(recipesAdvancedSearch);
  }
};

// FIXME:render list of options with selected options and original options
const updateOptionsList = (
  ulContainer,
  filterListToDisplay,
  listOfOriginalOptions,
  collapseMenu
) => {
  removeInnerHTML(ulContainer);
  ulContainer.insertAdjacentHTML(
    "beforeend",
    optionTemplate(filterListToDisplay)
  );
  ulContainer.querySelectorAll("li").forEach((li) => styleSelectedOption(li));
  ulContainer.insertAdjacentHTML(
    "beforeend",
    optionTemplate(listOfOriginalOptions)
  );

  const liFilter = ulContainer.querySelectorAll("li.bg-warning");
  const liOriginal = ulContainer.querySelectorAll("li:not(.bg-warning)");
  //hide selected option from original list
  liFilter.forEach((li1) =>
    liOriginal.forEach((li2) => {
      if (normalizeStr(li1.dataset.name) === normalizeStr(li2.dataset.name))
        addClassList(li2, "hidden");
    })
  );
  liFilter.forEach((li) => {
    const iconClose = li.querySelector(".button-close");
    iconClose.addEventListener("click", () => {
      addEHandlerToBtnCloseOfOption(
        ulContainer,
        li,
        listOfOriginalOptions,
        collapseMenu,
        filterListToDisplay
      );
    });
  });
};
// const addEHandlerToSelectedOption = (
//   e,
//   ulContainer,
//   filterListToDisplay,
//   listOfOriginalOptions,
//   collapseMenu
// ) => {
//   // console.log("filter list", filterListToDisplay);
//   const el = e.target.textContent;
//   if (filterListToDisplay.includes(el)) return;

//   // update new list option = selected options + original options
//   filterListToDisplay.push(el);
//   updateListOfTagName();
//   // removeInnerHTML(ulContainer);
//   // ulContainer.insertAdjacentHTML("beforeend", optionTemplate(filterListToDisplay));
//   // ulContainer.querySelectorAll("li").forEach((li) => styleSelectedOption(li));
//   // ulContainer.insertAdjacentHTML("beforeend", optionTemplate(listOfOriginalOptions));

//   // console.log("ul container:", ulContainer);
//   // console.log("filter list to display:", filterListToDisplay);

//   // const liFilter = ulContainer.querySelectorAll("li.bg-warning");
//   // const liOriginal = ulContainer.querySelectorAll("li:not(.bg-warning)");
//   //   //hide selected option from original list
//   // liFilter.forEach((li1) =>
//   //   liOriginal.forEach((li2) => {
//   //     if (normalizeStr(li1.dataset.name) === normalizeStr(li2.dataset.name))
//   //       addClassList(li2, "hidden");
//   //   })
//   // );
//   // console.log("lenght: ", recipesAdvancedSearch.length);
//   // if (recipesAdvancedSearch.length > 0) {
//   recipesAdvancedSearch = recipesAdvancedSearch.filter((recipe) => {
//     const condition =
//       findByIng(normalizeStr(el), recipe) ||
//       findByAppliance(normalizeStr(el), recipe) ||
//       findByUstensil(normalizeStr(el), recipe);
//     if (condition) return recipe;
//   });
//   // console.log(filterListIng);
//   // TODO: à revoir avec JS bootstrap vs button collapse
//   removeClassList(collapseMenuIng, "show");
//   removeClassList(collapseMenuApp, "show");
//   removeClassList(collapseMenuUst, "show");

//   //add card tag name
//   displayTagName(
//     listTagResult,
//     ulContainer,
//     e.target,
//     listOfOriginalOptions,
//     collapseMenu,
//     filterListToDisplay
//   );

//   // update number of results
//   updateNumberOfFoundRecipes(recipesAdvancedSearch);

//   //update cards recipes
//   displayCardRecipes(recipesAdvancedSearch);

//   // clear input
//   inputIngredient.value = inputAppliance.value = inputUstensil.value = "";

//   // event hander to remove selected option
//   // liFilter.forEach((li) => {
//   //   const iconClose = li.querySelector(".button-close");
//   //   iconClose.addEventListener("click", () => {
//   //     addEHandlerToBtnCloseOfOption(
//   //       li,
//   //       liOriginal,
//   //       collapseMenu,
//   //       filterListToDisplay
//   //     );
//   //   });
//   // });
//   updateOptionsList(
//     ulContainer,
//     filterListToDisplay,
//     listOfOriginalOptions,
//     collapseMenu
//   );
// };
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

// TODO: à remettre en fonction générale
const styleSelectedOption = (btn) => {
  // const icon = btn.querySelector("i");
  addClassList(btn, "bg-warning", "fw-bolder-hover");
  // removeClassList(icon, "hidden");
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
        selectElement(e)
       
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
        selectElement(e)
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
