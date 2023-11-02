//////////////// DOM ELEMENTS//////////////////

/////////////// FUNCTIONS //////////////////
  // filter by Search Bar
    //Doms els
    const inputSearchBar = document.querySelector('.nav-search-bar');
    const listOfIngOptions = document.querySelector('.ingredients-options');
    const listOfAppliancesOptions = document.querySelector('.appliances-options');
    const listOfUstensilsOptions = document.querySelector('.ustensils-options');
    const numOfFoundRecipes = document.querySelector(".number-result");
    const cardsRecipesContainer = document.querySelector(".result-container");

    //variables
    let currentRecipes = recipes;
    let currentStr;
    const selectedIngredients = new Set();
    const selectedAppliances = new Set();
    const selectedUstensils = new Set();
    

    //general functions
    const normalizeStr = (str) => {
      return str
        .trim()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();
    };

    const searchRecipes = () => {
      console.log("search from searhBar");
    }

    //Debounce
    const debounce = (value, elInput) => {
      if (value === elInput.target.value) {
        searchRecipes();
      }
    };
    //filter by Search bar
    inputSearchBar.addEventListener("input", (e) => {
      const value = e.target.value;
      console.log(value.length);
      // input < 3 characters is not valid
      if (value.length < 3) return;
      
      debounce(value, inputSearchBar);

    })

      // filter recipes by Name
      const filterByName = (currentStr, currentRecipes) => {};
      // filter recipes by Description
      const filterByDescription = (currentStr, currentRecipes) => {};

      // filter recipes by Ingredients
      const filterByIngredients = (currentStr, currentRecipes) => {};

    // display interface
      // 1.list of options for:
        //1.1. Ingredients options
        const filterListOfOptionsIngredients = () => {};
        //1.2. Appliances options
        const filterListOfOptionsAppliances = () => {};
        //1.3. Ustensils options
        const filterListOfOptionsUstensils = () => {};


      // 2. number of found recipes
      const updateNumberOfFoundRecipes = () => {};
      // 3. card recipes
      const displayCardRecipes = () => {};


    

  // filter by advanced Search
    //1. filter by Ingredients
    //2. filter by Appliances
    //3. filter by Ustensils

////////////////// APP //////////////////