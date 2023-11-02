//////////////////DOM ELEMENTS//////////////
// const resultSearchContainer = document.querySelector('.result-container');
const formSearchBar = document.querySelector(".form-search-bar");
const formIngTag = document.querySelector(".form-ingredients-tag");
const formAppTag = document.querySelector(".form-appliances-tag");
const formUstTag = document.querySelector(".form-ustensils-tag");

const searchBar = document.querySelector(".nav-search-bar");
const resultSearchContainer = document.querySelector(".result-container");
const numOfResult = document.querySelector(".number-result");
const tagContainer = document.querySelector(".tag-container");

const ingTagList = document.querySelector(".ingredients-tag");
const appTagList = document.querySelector(".appliances-tag");
const ustTagList = document.querySelector(".ustensils-tag");
const ingTagInput = document.querySelector(".ingredients-tag-input");
const ustTagInput = document.querySelector(".ustensils-tag-input");
const appTagInput = document.querySelector(".appliances-tag-input");
const ingFilterList = document.querySelector(".ingredients-tag-filter");
const appFilterList = document.querySelector(".appliances-tag-filter");
const ustFilterList = document.querySelector(".ustensils-tag-filter");

// let arrResult;
let listTagResult = [];
let recipesFoundByTagConcat = [];

////////////////////FUNCTIONS///////////////////////
// normalize character: remove all accents
const normalizeStr = (str) => {
  return str
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
};

const updateNumOfRecipesFound = (dataList) => {
  if (dataList.length > 0) {
     numOfResult.textContent =
    dataList.length.toString().padStart(2, "0") +
    `${dataList.length === 1 ? " recette trouvée" : " recettes trouvées"} `;
  } else if (dataList.length === 0) {
    numOfResult.textContent = "00 recette retrouvée"
  }else {
    numOfResult.textContent = "1500 recettes"
  }
 
};

const addClassList = (el, ...nameOfClass) => {
  el.classList.add(...nameOfClass);
};
const removeClassList = (el, ...nameOfClass) => {
  el.classList.remove(...nameOfClass);
};

const displayCardResult = (recipe) => {
  resultSearchContainer.insertAdjacentHTML(
    "beforeend",
    cardRecipeTemplate(recipe)
  );
};
const removeInnerHTML = (el) => {
  el.innerHTML = "";
}
const displayErrorMessage = (str) => {
  // removeResultContainer();
  removeInnerHTML(resultSearchContainer);
  resultSearchContainer.innerHTML = `<div class='col-12 text-center text-danger fs-4 fw-bold w-100'>Aucune recette ne contient "${str}" vous pouvez chercher "tarte aux pommes", "poisson", etc.</div>`;
};
/////functions for search by Name, description, ingredients, appliances and ustensils
const findByName = (str, data) => {
  const nameRecipe = normalizeStr(data.name);
  const nameFilterCondition = nameRecipe.includes(str);
  if (nameFilterCondition) return nameFilterCondition;
};
const findByDescription = (str, data) => {
  const descriptionsList = normalizeStr(data.description);
  //TODO: return descriptionList.inclides(str)
  const descriptionFilterCondition = descriptionsList.includes(str);
  if (descriptionFilterCondition) return descriptionFilterCondition;
};
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

////////Debounce
const debounce = (cbFunc, delay) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => cbFunc(...args), delay);
  };
};
const searchBarDebounce = debounce((str) => cbSearch(str), 500);
const searchIngDebounce = debounce((str, elList, arrData) => {
  console.log(str);
  // if word found
  return filterByIng(str, elList, arrData);
}, 500);
const searchAppDebounce = debounce((str, elList, arrData) => {
  console.log(str);
  // if word found
  return filterByAppliance(str, elList, arrData);
}, 500);
const searchUstDebounce = debounce((str, elList, arrData) => {
  console.log(str);
  // if word found
  return filterByUstensil(str, elList, arrData);
}, 500);

//array of recipes found
const recipesFoundBySearchBar = (str, dataList) => {
  const result = dataList.filter((data) => {
    if (
      findByName(str, data) ||
      findByIng(str, data) ||
      findByDescription(str, data)
    ) {
      return data;
    }
  });
  if (result.length > 0) {
    return result;
  } else {
    updateNumOfRecipesFound(result)
    displayErrorMessage(str);
  }
};

const styleTagSelected = (btn) => {
  const icon = btn.querySelector("i");
  addClassList(btn, "bg-warning","fw-bolder-hover");
  removeClassList(icon, "hidden");
};

// FIXME: create a general add eventHandler to select option from every tag List
const eHandlerSelectTagItem = (listOfItems, funcFindByTagName, recipesList) => {
  const options = listOfItems.querySelectorAll("li");
  options.forEach((li) => {
    const btnOption = li.querySelector(".dropdown-item");
    btnOption.addEventListener("click", () => {
      // 3.1. desactivate if tag name has been selected
      if (listTagResult.includes(btnOption.textContent)) {
        // console.log("ings déjà sélectionné");
        return;
        // 3.2.
      } else {
        // update list of tags result
        listTagResult.push(btnOption.textContent);
        // console.log("list tag", listTagResult);

        //display selected tag name
        tagContainer.insertAdjacentHTML(
          "beforeend",
          tagName(btnOption.textContent)
        );
        styleTagSelected(btnOption);

        //Add ehandler to remove tag name
        
        const tagEl = tagContainer.querySelectorAll(".card-tag");
          console.log(tagEl);
        tagEl.forEach((tag) => {
          const target = tag.querySelector("span i");
          target.addEventListener("click", (e) => {
            console.log("click");
            //remove from listTagResult,

            // update interface with new listTagResult
            ///change style tag name from list options
          }, {once:true});
        });

        //filter array of recipes found from ingsFound
        console.log("before concat", recipesFoundByTagConcat);
        const result = recipesList.filter((recipe) => {
          const condition = funcFindByTagName(
            normalizeStr(btnOption.textContent),
            recipe
          );
          if (condition) return recipe;
        });
        console.log("result", result);

        recipesFoundByTagConcat = recipesFoundByTagConcat.concat(result);
        const recipesFoundByTagUnique = [...new Set(recipesFoundByTagConcat)];
        console.log("after concat", recipesFoundByTagUnique);
        //remove result container
        removeInnerHTML(resultSearchContainer);

        //4.display new results filter 
        recipesFoundByTagUnique.forEach((recipe) => displayCardResult(recipe));
        // 5.update number of recipe
        updateNumOfRecipesFound(recipesFoundByTagUnique);
      }
    });
  });
};
const addEHandlerToOptionFilter = (
  listOfItems,
  listOfFilterItems,
  formOfList,
  funcFindByTagName,
  recipesList
) => {
  const optionsTaglist = listOfItems.querySelectorAll("li");
  const optionsFilter = listOfFilterItems.querySelectorAll("li");
  optionsFilter.forEach((li) => {
    li.addEventListener("click", () => {
      const btnFilter = li.querySelector(".dropdown-item");

      // 3.1. desactivate if tag name has been selected
      if (listTagResult.includes(btnFilter.textContent)) {
        // console.log("ings déjà sélectionné");
        return;
        // 3.2.
      } else {
        // update list of tags result
        listTagResult.push(btnFilter.textContent);
        // console.log("list tag", listTagResult);

        //display selected tag name
        tagContainer.insertAdjacentHTML(
          "beforeend",
          tagName(btnFilter.textContent)
        );
        optionsTaglist.forEach((option) => {
          const btnIng = option.querySelector(".dropdown-item");
          if (btnFilter.textContent === btnIng.textContent) {
            styleTagSelected(btnIng);
          }
        });
        //filter array of recipes found from ingsFound
        // console.log("before concat", recipesFoundByTagConcat);
        const result = recipesList.filter((recipe) => {
          const condition = funcFindByTagName(
            normalizeStr(btnFilter.textContent),
            recipe
          );
          if (condition) return recipe;
        });
        // console.log("result", result);

        recipesFoundByTagConcat = recipesFoundByTagConcat.concat(result);
        const recipesFoundByTagUnique = [...new Set(recipesFoundByTagConcat)];
        console.log("after concat", recipesFoundByTagUnique);
        //remove result container
        removeInnerHTML(resultSearchContainer);

        //4.display new results filter
        recipesFoundByTagUnique.forEach((recipe) => displayCardResult(recipe));
        // 5.update number of recipe
        updateNumOfRecipesFound(recipesFoundByTagUnique);
      }
      formOfList.reset();
      removeClassList(listOfItems, "hidden");
      addClassList(listOfFilterItems, "hidden");
    });
  });
};

const displayOptionsSuggestion = (str, elList, elTagList, elTagFilter) => {
  const elFound = elList.filter((data) => {
    const newStr = normalizeStr(str);
    const newData = normalizeStr(data);

    if (newData.includes(newStr)) return data;
  });

  //2.update la liste des suggestions
  addClassList(elTagList, "hidden");
  removeClassList(elTagFilter, "hidden");
  // elTagFilter.textContent = "";
  removeInnerHTML(elTagFilter);
  elTagFilter.insertAdjacentHTML("beforeend", ingredientsOptions(elFound));
};

const filterByIng = (str, ingList, recipesList) => {
  displayOptionsSuggestion(str, ingList, ingTagList, ingFilterList);
  addEHandlerToOptionFilter(
    ingTagList,
    ingFilterList,
    formIngTag,
    findByIng,
    recipesList
  );
};

const filterByAppliance = (str, appList, recipesList) => {
  displayOptionsSuggestion(str, appList, appTagList, appFilterList);
  addEHandlerToOptionFilter(
    appTagList,
    appFilterList,
    formAppTag,
    findByAppliance,
    recipesList
  );
};

const filterByUstensil = (str, ustList, recipesList) => {
  displayOptionsSuggestion(str, ustList, ustTagList, ustFilterList);
  addEHandlerToOptionFilter(
    ustTagList,
    ustFilterList,
    formUstTag,
    findByUstensil,
    recipesList
  );
};

///events handler tag input
const addEHandlerIngTagInput = (uniqueIngList, recipesList) => {
  ingTagInput.addEventListener("input", (e) => {
    const input = e.target.value;
    searchIngDebounce(input, uniqueIngList, recipesList);
  });
};

const addEHandlerAppTagInput = (uniqueAppList, recipesList) => {
  appTagInput.addEventListener("input", (e) => {
    const input = e.target.value;
    searchAppDebounce(input, uniqueAppList, recipesList);
  });
};
const addEHandlerUstTagInput = (uniqueUstList, recipesList) => {
  ustTagInput.addEventListener("input", (e) => {
    const input = e.target.value;
    searchUstDebounce(input, uniqueUstList, recipesList);
  });
};

//display tag list items
const displayOptionsTag = (ingredients, appliances, ustensils) => {
  const x = [ingTagList, appTagList, ustTagList];
  x.forEach((ul) => (removeInnerHTML(ul)));
  ingTagList.insertAdjacentHTML("beforeend", ingredientsOptions(ingredients));
  appTagList.insertAdjacentHTML("beforeend", appliancesOptions(appliances));
  ustTagList.insertAdjacentHTML("beforeend", ustensilsOptions(ustensils));
};

const removeTagName = () => {};
// function general search bar
const cbSearch = (str) => {
  if (str.length > 2) {
    const arrResult = recipesFoundBySearchBar(normalizeStr(str), recipes);
    //if recipe not found
    if (!arrResult) {
      displayErrorMessage(str);
      return;
    }
    //if recipes found
    //1.create tag lists
    const ingredientsList = arrResult
      .map((res) => res.ingredients)
      .map((ing) => {
        return ing.map((el) => el.ingredient);
      });
    const uniqueIngredientsList = [
      ...new Set(ingredientsList.reduce((acc, cur) => acc.concat(cur))),
    ].sort();

    const appliancesList = arrResult.map((res) => res.appliance);
    const uniqueApplianceList = [...new Set(appliancesList)].sort();

    const ustensilsList = arrResult.map((res) => res.ustensils);
    const uniqueUstensilsList = [
      ...new Set(ustensilsList.reduce((acc, cur) => acc.concat(cur))),
    ].sort();
    //2.display tag items
    displayOptionsTag(
      uniqueIngredientsList,
      uniqueApplianceList,
      uniqueUstensilsList
    );

    //3.display recipe card
    removeInnerHTML(resultSearchContainer);
    arrResult.forEach((recipe) => displayCardResult(recipe));

    //4.display number of results
    updateNumOfRecipesFound(arrResult);

    // 5.event handler search by tags
    addEHandlerIngTagInput(uniqueIngredientsList, arrResult);
    addEHandlerAppTagInput(uniqueApplianceList, arrResult);
    addEHandlerUstTagInput(uniqueUstensilsList, arrResult);
    eHandlerSelectTagItem(ingTagList, findByIng, arrResult);
    eHandlerSelectTagItem(appTagList, findByAppliance, arrResult);
    eHandlerSelectTagItem(ustTagList, findByUstensil, arrResult);

    const allBtnTagName = document.querySelectorAll("li button");
    allBtnTagName.forEach((btn) => {
      const target = btn.querySelector("i");
      target.addEventListener("click", (e) => {

        e.stopPropagation();
        // console.log(e.target);
        if (target) {
          //re-style from tag list
          removeClassList(btn, "bg-warning", "fw-bolder-hover");
          // removeClassList(btn, "fw-bolder-hover");
          addClassList(target, "hidden");
          //remove card tag
          const index = listTagResult.findIndex(
            (tag) => tag === btn.textContent
          );
          //update listTagResult
          listTagResult.splice(index, 1);
          if (listTagResult.length > 0) {
            removeInnerHTML(tagContainer);
            listTagResult.forEach((tag) => {
              tagContainer.insertAdjacentHTML("beforeend", tagName(tag));
            });
            //update interface from listTagResult
            const result = listTagResult.map((tag) => {
              return arrResult.filter((recipe) => {
                const condition =
                  findByIng(normalizeStr(tag), recipe) ||
                  findByAppliance(normalizeStr(tag), recipe) ||
                  findByUstensil(normalizeStr(tag), recipe);
                if (condition) return recipe;
              });
            });
            recipesFoundByTagConcat = result.flat();
            console.log(recipesFoundByTagConcat.filter((recipe) => recipe.id));
            const recipesFoundByTagUnique = [
              ...new Set(recipesFoundByTagConcat),
            ];
            removeInnerHTML(resultSearchContainer);
            recipesFoundByTagUnique.forEach((recipe) =>
              displayCardResult(recipe)
            );
            updateNumOfRecipesFound(recipesFoundByTagUnique);
          } else {
            
            recipesFoundByTagConcat = [];
            updateNumOfRecipesFound(recipesFoundByTagConcat);
            removeInnerHTML(tagContainer);
            removeInnerHTML(resultSearchContainer);
          }
        }
        // if (!target) console.log("return");
      });
    });

    //6. initialize ecipesFoundByTagConcat and all cards tag
    removeInnerHTML(tagContainer);
    recipesFoundByTagConcat = [];
    return arrResult;
  } else {
    //if length's value not valid
    resultSearchContainer.innerHTML =
      '<div class="col-12 text-center text-danger fs-4 fw-bold w-100">Veuillez insérer au moins 3 caractères !</div>';
  }
};

////Event handler
const addEventHandlerSearchBar = () => {
  searchBar.addEventListener("input", (e) => {
    const input = e.target.value;
    searchBarDebounce(input);
  });
};

// TODO: besoin ou pas ?
const addEventHandlerFormSearchBar = () => {
  formSearchBar.addEventListener("submit", (e) => {
    e.preventDefault();
    console.log(e.target.querySelector("input").value);
    // console.log(.value);
    searchBarDebounce(e.target.querySelector("input").value);
  });
};
const init = () => {
  // event handler
  addEventHandlerFormSearchBar();
  addEventHandlerSearchBar();
};

init();
