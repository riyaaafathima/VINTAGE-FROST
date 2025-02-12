
const price_el = document.querySelector(".product-price");
const kg_el = document.querySelector("#kg");
const stock_el = document.querySelector("#stock");
const cart_btn_el = document.querySelector("#addcart-btn");
const productId_el = document.querySelector("#productname");
const instruction_el = document.querySelector("#instruction-el");
const message_el = document.querySelector("#message-el");

// Toast functions
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

const showWarningToast = (message) => {
  toastr.options = {
    positionClass: "toast-top-center",
    timeOut: "3000",
    closeButton: true,
  };
  toastr.warn(message);
};

kg_el.addEventListener("change", (e) => {
  const selectedOption = e.target.options[e.target.selectedIndex];
  console.log(selectedOption);

  const newPrice = selectedOption.getAttribute("data-price");
  const newstock = selectedOption.getAttribute("data-stock");
  if (newstock == 0) {
    stock_el.innerHTML = "Out of stock";
  } else if (newstock <= 10) {
    stock_el.innerHTML = "Limited stock";
  } else {
    stock_el.innerHTML = "In stock";
  }

  if (price_el && newPrice) {
    price_el.textContent = newPrice;
  }
});

cart_btn_el.addEventListener("click", async (e) => {
  e.preventDefault();
  const price = price_el.innerText || price_el.value;

  const selectedOption = kg_el.options[kg_el.selectedIndex];
  const kg = selectedOption.value;

  if (kg === "#") {
    showErrorToast("please select weight");
    return;
  }

  const eggPreference = document.querySelector(
    'input[name="eggPreference"]:checked'
  );
  const eggValue = eggPreference ? eggPreference.value : null;

  if (!eggValue) {
    showErrorToast("please select an egg preference");
    return;
  }

  const productId = productId_el.getAttribute("data-id");
  console.log(productId);

  const productDetails = {
    price: price,
    kg: kg,
    eggPreference: eggValue,
    productId: productId,
    instruction: instruction_el.value,
    message: message_el.value,
  };

  console.log(productDetails);

  try {
    const response = await fetch("/addTo-cart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(productDetails),
    });

    if (response.ok) {
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Added to cart",
        showConfirmButton: false,
        timer: 1500,
      }).then(async() => {
      const data=await response.json()
        localStorage.setItem("cart-count",data.cartCount)
        
        window.location.href = "/cart";
      });
    }
  } catch (error) {
    console.log(error);
  }
});
