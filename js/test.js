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
const config2 = Array(5000).fill({
  inpSBar: "coco",
    ingredients : ["carottes"],
    appliances : ["cocotte"],
    ustensils : ["couteau"],
})
const times = [];
for (let i=0; i < config2.length; i++) {
  let data = config2[i];
  inputSearchBar.value = data.inpSBar;
  inputIngredient.value = data.ingredients;
  inputAppliance.value = data.appliances;
  inputUstensil.value = data.ustensils;

  const t0 = performance.now();
  cbGeneralSearch(inputSearchBar.value, recipes);
  const t1 = performance.now();
  const execTimeMs = t1 - t0;
  times.push(execTimeMs)
};
console.log(times, times.reduce((a, c) => a + c, 0/times.length));