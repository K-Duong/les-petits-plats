//////////////// DOM ELEMENTS//////////////////
//Doms els
const inputSearchBar = document.querySelector(".nav-search-bar");
const inputIngredient = document.querySelector(".ingredient-input");
const inputAppliance = document.querySelector(".appliance-input");
const inputUstensil = document.querySelector(".ustensil-input");
const domListOfIngOptions = document.querySelector(".ingredients-options");
const domListOfAppliancesOptions = document.querySelector(
  ".appliances-options"
);
const domListOfUstensilsOptions = document.querySelector(".ustensils-options");
const numOfFoundRecipes = document.querySelector(".number-result");
const cardsRecipesContainer = document.querySelector(".result-container");

const collapseMenuIng = document.querySelector("#collapseMenuIngredients");

const tagContainer = document.querySelector(".tag-container");

//variables
let currentStr, currentRecipes, currentListOfTagName, recipesAdvancedSearch;
let selectedIngredients, selectedAppliances, selectedUstensils;
let filterListIng = [];
let filterListAppliance = [];
let filterListUstensils = [];
let listOfIngOptions, listOftAppOptions, listOfUstOptions;

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
// TODO: recreate function
const findByIng2 = (str, data) => {
  const ingredientsList = data.ingredients.map((ing) =>
    normalizeStr(ing.ingredient)
  );
  // console.log(ingredientsList);
  const ingFilterConditon = ingredientsList.some((ing) => ing.includes(str));
  if (ingFilterConditon) return ingFilterConditon;
};
const filterByAppliance = () => {};
// const filterByAppliance = (str, data) => {
//   const applianceRecipe = normalizeStr(data.appliance);
//   const applianceFilterCondition = applianceRecipe.includes(str);
//   // console.log(applianceFilterCondition);
//   if (applianceFilterCondition) return applianceFilterCondition;
// };
// const filterByUstensil = (str, data) => {
//   const ustensilsList = data.ustensils.map((el) => normalizeStr(el));
//   const ustensilFilterCondition = ustensilsList.some((el) => el.includes(str));
//   if (ustensilFilterCondition) return ustensilFilterCondition;
// };
//filter list of options
const filterListOfOptionsIngredients = (currentRecipes) => [
  ...new Set(
    currentRecipes
      .map((recipe) =>
        recipe.ingredients.map((ingredients) => ingredients.ingredient)
      )
      .reduce((acc, curr) => acc.concat(curr))
      .sort()
  ),
];
const filterListOfOptionsAppliances = (currentRecipes) => [
  ...new Set(currentRecipes.map((recipe) => recipe.appliance)),
];
const filterListOfOptionsUstensils = (currentRecipes) => [
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
const displayOptionsList = (selectedList, elList) => {
  removeInnerHTML(elList);
  elList.insertAdjacentHTML("beforeend", optionTemplate(selectedList));
  const selectedOption = elList.querySelectorAll("li");
  // console.log(selectedOption);
  // debounce input advanced search

  //event handler select an option

  //filter by selected list

  // update style of
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
  listOfTag.forEach((tag) => {
    tagContainer.insertAdjacentHTML("beforeend", tagName(tag));
  });
};
const updateListOfTagName = () => {
  listTagResult = [
    ...new Set(
      filterListIng.concat(filterListAppliance).concat(filterListUstensils)
    ),
  ];
};
// filter by Searchbar
const cbSearchRecipes = (val, elInput) => {
  if (val === elInput.value) {
    // remove old data
    const domToRemove = [
      domListOfIngOptions,
      domListOfAppliancesOptions,
      domListOfUstensilsOptions,
      tagContainer,
      cardsRecipesContainer,
      numOfFoundRecipes,
    ];
    domToRemove.forEach((dom) => removeInnerHTML(dom));
    filterListIng = filterListAppliance = filterListUstensils = [];
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
    // console.log(currentRecipes);

    if (currentRecipes.length > 0) {
      listOfIngOptions = filterListOfOptionsIngredients(currentRecipes);
      listOftAppOptions = filterListOfOptionsAppliances(currentRecipes);
      listOfUstOptions = filterListOfOptionsUstensils(currentRecipes);
      // display interface
      /// 1.list of options for:
      ////1.1. Ingredients options
      console.log(listOfIngOptions);
      displayOptionsList(listOfIngOptions, domListOfIngOptions);
      ////1.2. Appliances options
      console.log(listOftAppOptions);
      displayOptionsList(listOftAppOptions, domListOfAppliancesOptions);

      ////1.3. Ustensils options
      console.log(listOfUstOptions);
      displayOptionsList(listOfUstOptions, domListOfUstensilsOptions);
      /// 2. number of found recipes
      updateNumberOfFoundRecipes(currentRecipes);
      /// 3. card recipes
      displayCardRecipes(currentRecipes);

      recipesAdvancedSearch = [...currentRecipes];

      // addEventHandler to advanced search
      addEventHandlerSearchByIngredient();
    } else {
      // display error
      updateNumberOfFoundRecipes(currentRecipes);
      displayErrorMessage(input);
    }
  }
};

// event handler
const addEventHandlerSearchByIngredient = () => {
  inputIngredient.addEventListener("input", (e) => {
    const value = e.target.value;
    // console.log(recipesAdvancedSearch);
    const listContainer = inputIngredient.nextElementSibling;
    // console.log(recipesAdvancedSearch);
    debounceAdvancedSearchByIngredient(value, e.target, listContainer);
  });
};
// TODO: à remettre en fonction générale
const styleSelectedOption = (btn) => {
  const icon = btn.querySelector("i");
  addClassList(btn, "bg-warning", "fw-bolder-hover");
  // removeClassList(icon, "hidden");
};
// advanced Search
const cbAdvancedSearchByIngredients = (val, elInput, elList) => {
  if (val === elInput.value) {
    const input = elInput.value;

    // 0. normaliseStr
    const normalizeInput = normalizeStr(input);

    //update filter option
    const suggestionList = listOfIngOptions.filter((option) =>
      normalizeStr(option).includes(normalizeInput)
    );

    removeInnerHTML(elList);
    elList.insertAdjacentHTML("beforeend", optionTemplate(suggestionList));

    //event handler option button
    const optionsNodeList = elList.querySelectorAll("li");

    // add event handler for each option
    optionsNodeList.forEach((option) => {
      option.addEventListener("click", (e) => {
        console.log("filter list ing", filterListIng);
        if (filterListIng.includes(e.target.textContent)) return;
        
        // update new list with seleted option bg-warning
        filterListIng.push(e.target.textContent);
        removeInnerHTML(elList);
        elList.insertAdjacentHTML("beforeend", optionTemplate(filterListIng));

        elList.querySelectorAll("li").forEach((li) => styleSelectedOption(li));
        const liFilter = elList.querySelectorAll("li.bg-warning");
        elList.insertAdjacentHTML(
          "beforeend",
          optionTemplate(listOfIngOptions)
        );
        const liOriginal = elList.querySelectorAll("li:not(.bg-warning)");
        // console.log(liOriginal);
        liFilter.forEach((li1) =>
          liOriginal.forEach((li2) => {
            if (
              normalizeStr(li1.dataset.name) === normalizeStr(li2.dataset.name)
            )
              addClassList(li2, "hidden");
          })
        );

        recipesAdvancedSearch = filterByIngredients(
          normalizeStr(e.target.textContent),
          recipesAdvancedSearch
        );
        // console.log(filterListIng);
        removeClassList(collapseMenuIng, "show");
        //add card tag name
        updateListOfTagName();
        displayTagName(listTagResult);
        // update number of results
        updateNumberOfFoundRecipes(recipesAdvancedSearch);
        //update cards recipes
        displayCardRecipes(recipesAdvancedSearch);
        // clear input
        inputIngredient.value = "";

          //event handler to remove seletedOption
          liFilter.forEach(li => {
            const iconClose = li.querySelector(".button-close");
            iconClose.addEventListener("click", (e) => {
              // console.log("click");

              //hidden li filter and display li orginial
              addClassList(li, "hidden");
              liOriginal.forEach((li2) => {
                if (
                  normalizeStr(li.dataset.name) === normalizeStr(li2.dataset.name)
                )
                  removeClassList(li2, "hidden");
              });
              removeClassList(collapseMenuIng, "show");

              // update list of tag name and display tag name
              const index1 = listTagResult.findIndex(el => el === li.dataset.name);
              // console.log(index);
              listTagResult.splice(index1, 1);
              const index2 = filterListIng.findIndex(el => el === li.dataset.name);
              filterListIng.splice(index2, 1);
              // console.log(listTagResult);
              displayTagName(listTagResult);
                // TODO: recipesAdvancedSearch = array of all  filterbyIng, filterByApp, filterByUst
              recipesAdvancedSearch = [...new Set(...listTagResult.map(tag => currentRecipes.filter(recipe => {
                if (findByIng2(normalizeStr(tag),recipe))
                return recipe;
                })))];
                console.log('recipesAdvancedSearch',recipesAdvancedSearch);

              // if recipesAdvancedSearch.length > 0
              if(recipesAdvancedSearch.length > 0) {
                //  update number of result
              updateNumberOfFoundRecipes(recipesAdvancedSearch)
              // update cards recipes
              displayCardRecipes(recipesAdvancedSearch)
              } else {
                recipesAdvancedSearch = [...currentRecipes]
                updateNumberOfFoundRecipes(recipesAdvancedSearch);
                displayCardRecipes(recipesAdvancedSearch);
              }
              

            });
          }); 
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
const debounceAdvancedSearchByIngredient = (val, elInput, elList) => {
  setTimeout(() => {
    cbAdvancedSearchByIngredients(val, elInput, elList);
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
