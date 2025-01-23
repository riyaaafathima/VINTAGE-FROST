const radioButtons = document.querySelectorAll(".custom-control-input");
const clearAll_el=document.getElementById('clear-btn')

document.querySelectorAll(".page-link").forEach((btn) => {
  btn.addEventListener("click", async (e) => {
    e.preventDefault();

    // Extract current URL parameters
    const params = new URLSearchParams(window.location.search);

    let id = btn.id;
    if (id === "next") {
      params.set("page", parseInt(params.get("page") || 1) + 1);  // parsein using to change the current page no into number which means if it is 1 page it will go to 2nd page
    } else if (id === "prev") {
      params.set("page", Math.max(1, parseInt(params.get("page") || 1) - 1));
    } else {
      params.set("page", id);
    }
    window.location.href = `/all-products?${params.toString()}`;
  });
});
   

radioButtons.forEach((radio) => {
  radio.addEventListener("change", () => {
    const params = new URLSearchParams(window.location.search);

    params.set("category", radio.id); // radio id means category id which is set in frntend

    params.delete("page");  // no need to skip we need to show from the begining

    window.location.href = `/all-products?${params.toString()}`;
  });
});

clearAll_el.addEventListener('click',()=>{
  window.location.href='/all-products'

})


document.addEventListener('DOMContentLoaded', function () {
  // Ensure the slider element exists
  const priceSlider = document.getElementById('price-slider');
  const filterPriceRange = document.getElementById('filter-price-range');

  if (!priceSlider || !filterPriceRange) {
      console.error("Slider or price range element is missing.");
      return;
  }

  // Get initial values from the URL or set defaults
  const urlParams = new URLSearchParams(window.location.search);
  const initialMinPrice = parseInt(urlParams.get('minprice')) || 100; // Default min price if url has no min price it already set as 100
  const initialMaxPrice = parseInt(urlParams.get('maxprice')) || 7000; // Default max price

  // Initialize the price slider     
  noUiSlider.create(priceSlider, {
      start: [initialMinPrice, initialMaxPrice], // here we setting the min and maxprice 
      connect: true,
      range: {
          'min': 100,
          'max': 10000
      },
      step: 1,
      tooltips: true
  });

  // Update the displayed price range immediately on slider movement
  priceSlider.noUiSlider.on('update', function (values, handle) {
      const minPrice = Math.round(values[0]);
      const maxPrice = Math.round(values[1]);
      filterPriceRange.textContent = `$${minPrice} - $${maxPrice}`;
  });

  // Trigger filtering only when the slider handle is released
  priceSlider.noUiSlider.on('change', function (values, handle) {
      const minPrice = Math.round(values[0]);
      const maxPrice = Math.round(values[1]);

      // Update the query parameters in the URL
      const params = new URLSearchParams(window.location.search);
      params.set('minprice', minPrice);
      params.set('maxprice', maxPrice);
      params.delete('page'); // Reset pagination if applicable

      // Reload the page with updated query parameters
      const newUrl = `${window.location.pathname}?${params.toString()}`;
      window.location.href = newUrl;
  });
});






