const cardRecipeTemplate = (recipe) => {
  const description = recipe.description.slice(0, 150);
  
  return html = `<div class="col  ">
  <div class="card rounded-5 shadow pb-5">
    <div class="thumbnail-box">
      <span>${recipe.time} min</span>
      <img src="assets/image_recipes/${recipe.image}" class="card-img-top rounded-top-5 " alt="photo de la ${recipe.name}">
    </div>
    <div class="card-body p-4">
      <h4 class="card-title">${recipe.name}</h4>
      <p class="text-secondary fw-bolder mt-4">RECETTE</p>
      <p class="card-text">${recipe.description.length > 200 ? description + "..." : recipe.description}</p>
      <p class="text-secondary fw-bolder ">INGREDIENTS</p>
    <div class="row g-3">
      ${recipe.ingredients.map(ing => {
        let quantity = ing.quantity ? ing.quantity : "";
        let unit = ing.unit ? ing.unit : "";
        return `
        <div class="col-6">
          <div class="row">
          <span>${ing.ingredient}</span>
          <span class="text-body-tertiary">${quantity}${unit}</span>
          </div>
        </div>
        `
      }).join('')}
    </div>
  </div>
</div>
`
}
const optionTemplate = (listOfOptions) => {
  return `${listOfOptions.map(option =>{
    return `<li data-name="${option}">
    <button class="dropdown-item d-flex justify-content-between align-items-center " type="button"><span>${option}</span><i class=" button-close fa-solid fa-circle-xmark hidden"></i></button>
  </li>`}).join('')}                      
  `;
}


const tagName = (el) => {
  return `
  <button data-name="${el}" type="button" class="card-tag btn btn-warning p-3 me-3">
  ${el} <span class="ms-5"><i class=" button-close fa-solid fa-xmark"></i></span>
  </button>`
}