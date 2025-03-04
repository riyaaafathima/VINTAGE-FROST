const radioButtons = document.querySelectorAll(".custom-control-input");
const clearAll_el=document.getElementById('clear-btn');
 const sort_input_el=document.querySelector('#sortby');
 const wishlistButtons = document.querySelectorAll('.wishlist-btn');

 const showErrorToast = (message) => {
  toastr.options = {
    positionClass: "toast-top-center",
    timeOut: "3000",
    closeButton: true,
  };
  toastr.error(message);
};

const showSuccessToast = (message) => {
  toastr.options = {
    positionClass: "toast-top-center",
    timeOut: "3000",
    closeButton: true,
  };
  toastr.success(message);
};


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

sort_input_el.addEventListener('change',async(e)=>{
  
  const selectedOption=e.target.options[e.target.selectedIndex]
    
  window.location.href=`/all-products?sort=${selectedOption.value}`  
  

})

wishlistButtons.forEach(button => {
  button.addEventListener('click', async (e) => {
    e.preventDefault();

    const productId = button.dataset.productId;
    const heartIcon = button.querySelector('i');
    const textSpan = button.querySelector('span');

    const isInWishlist = heartIcon.classList.contains('fa-solid');

    if (isInWishlist) {
      try {
        const response = await fetch('/wishlist-remove', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ productId })
        });

        if (response.ok) {
          heartIcon.classList.remove('fa-solid');
          heartIcon.classList.add('fa-regular');
          textSpan.textContent = ' add to wishlist';
          showErrorToast('Removed from wishlist');
        } else {
          showErrorToast('Could not remove from wishlist');
        }
      } catch (error) {
        console.log(error);
      }

    } else {
      try {
        const response = await fetch('/add-wishlist', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ productId })
        });

        if (response.ok) {
          heartIcon.classList.remove('fa-regular');
          heartIcon.classList.add('fa-solid');
          textSpan.textContent = ' remove from wishlist';
          showSuccessToast('Added to wishlist');
        } else {
          showErrorToast('Could not add to wishlist');
        }
      } catch (error) {
        console.log(error);
      }
    }
  });
});

