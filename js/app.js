//////////////// DOM ELEMENTS//////////////////

/////////////// FUNCTIONS //////////////////
// filter by Search Bar
//Doms els
const inputSearchBar = document.querySelector(".nav-search-bar");
const listOfIngOptions = document.querySelector(".ingredients-options");
const listOfAppliancesOptions = document.querySelector(".appliances-options");
const listOfUstensilsOptions = document.querySelector(".ustensils-options");
const numOfFoundRecipes = document.querySelector(".number-result");
const cardsRecipesContainer = document.querySelector(".result-container");

//variables
let currentStr;
let selectedIngredients, selectedAppliances, selectedUstensils;

//general functions
const normalizeStr = (str) => {
  return str
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
};
// Filter result :
const filterByName = (str, currentRecipes) =>
  currentRecipes.filter((recipe) => normalizeStr(recipe.name).includes(str));
const filterByDescription = (str, currentRecipes) =>
  currentRecipes.filter((recipe) =>
    normalizeStr(recipe.description).includes(str)
  );
const filterByIngredients = (str, currentRecipes) => {
  return currentRecipes.filter((recipe) => {
    const ingsList = recipe.ingredients.map((ing) =>
      normalizeStr(ing.ingredient)
    );
    if (ingsList.some((ing) => ing.includes(str))) return recipe;
  });
};
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
// function to display data to interface
const removeInnerHTML = (el) => {
  el.innerHTML = "";
};
const displayErrorMessage = (str) => {
  // removeResultContainer();
  removeInnerHTML(cardsRecipesContainer);
  cardsRecipesContainer.innerHTML = `<div class='col-12 text-center text-danger fs-4 fw-bold w-100'>Aucune recette ne contient "${str}" vous pouvez chercher "tarte aux pommes", "poisson", etc.</div>`;
};
const updateNumberOfFoundRecipes = (currentRecipes) => {
  if (currentRecipes.length > 0) {
    numOfFoundRecipes.textContent =
      currentRecipes.length.toString().padStart(2, "0") +
      `${
        currentRecipes.length === 1 ? " recette trouvée" : " recettes trouvées"
      } `;
  } else if (currentRecipes.length === 0) {
    numOfFoundRecipes.textContent = "00 recette retrouvée";
  } else {
    numOfFoundRecipes.textContent = "1500 recettes";
  }
};
const displayOptionsList = (selectedList, elDom, card) => {
  removeInnerHTML(elDom);
  elDom.insertAdjacentHTML("beforeend", card(selectedList));
};
const displayCardRecipes = (currentRecipes) => {
  removeInnerHTML(cardsRecipesContainer);
  currentRecipes.forEach((recipe) => {
    cardsRecipesContainer.insertAdjacentHTML(
      "beforeend",
      cardRecipeTemplate(recipe)
    );
  });
};

// filter by Searchbar
const cbSearchRecipes = (val, elInput, currentRecipes) => {
  if (val === elInput.value) {
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
      selectedIngredients = filterListOfOptionsIngredients(currentRecipes);
      selectedAppliances = filterListOfOptionsAppliances(currentRecipes);
      selectedUstensils = filterListOfOptionsUstensils(currentRecipes);
      // display interface
      /// 1.list of options for:
      ////1.1. Ingredients options
      console.log(selectedIngredients);
      displayOptionsList(
        selectedIngredients,
        listOfIngOptions,
        ingredientsOptions
      );
      ////1.2. Appliances options
      console.log(selectedAppliances);
      displayOptionsList(
        selectedAppliances,
        listOfAppliancesOptions,
        appliancesOptions
      );

      ////1.3. Ustensils options
      console.log(selectedUstensils);
      displayOptionsList(
        selectedUstensils,
        listOfUstensilsOptions,
        ustensilsOptions
      );

      /// 2. number of found recipes
      updateNumberOfFoundRecipes(currentRecipes);
      /// 3. card recipes
      displayCardRecipes(currentRecipes);
    } else {
      // display error
      updateNumberOfFoundRecipes(currentRecipes)
      displayErrorMessage(input);
    }
  }
};

//Debounce
const debounce = (val, elInput, currentRecipes) => {
  setTimeout(() => {
    cbSearchRecipes(val, elInput, currentRecipes);
  }, 300);
};
//filter by Search bar
inputSearchBar.addEventListener("input", (e) => {
  let currentRecipes = recipes;
  const value = e.target.value;
  // if input < 3 characters is not valid
  if (value.length < 3) return;
  // if input is valid
  debounce(value, e.target, currentRecipes);
});

// filter by advanced Search
//1. filter by Ingredients
//2. filter by Appliances
//3. filter by Ustensils

////////////////// APP //////////////////
