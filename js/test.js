const config1 = [
  {
    inpSBar: "coco",
    ingredients : ["carottes"],
    appliances : ["cocotte"],
    ustensils : ["couteau"],
  },
  {
    inpSBar: "",
    ingredients : ["carottes"],
    appliances : ["cocotte"],
    ustensils : ["couteau"],
  },
  {
    inpSBar: "toco",
    ingredients : [],
    appliances : ["cocotte"],
    ustensils : ["couteau"],
  },

];
const times = [];
for (let i=0; i < config1.length; i++) {
  let data = config1[i];
  inputSearchBar.value = data.inpSBar;
  inputIngredient.value = data.ingredients;
  inputAppliance.value = data.appliances;
  inputUstensil.value = data.ustensils;

  const t0 = performance.now();
  cbGeneralSearch(inputSearchBar, recipes);
  const t1 = performance.now();
  const execTimeMs = t1 - t0;
  times.push(execTimeMs)
};
console.log(times, times.reduce((a, c) => a + c, 0/times.length));