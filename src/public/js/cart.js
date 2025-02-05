const remove_btn_el = document.querySelector(".btn-remove");

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
  toastr.warning(message);
};

function showLoadingScreen() {
  const loadingOverlay = document.querySelector(".loading-overlay");
  loadingOverlay.style.display = "flex";
}

function hideLoadingScreen() {
  const loadingOverlay = document.querySelector(".loading-overlay");
  loadingOverlay.style.display = "none";
}

document.querySelectorAll(".quantity-input").forEach((input) => {
  input.addEventListener("change", async (e) => {
    const productId = e.target.closest("tr").querySelector(".btn-remove")
      .dataset.id;
    const newQuantity = parseInt(e.target.value);
    const kg = e.target.closest("tr").querySelector(".kg-col").textContent;
    console.log(kg);
    console.log(e.target.closest("tr").querySelector(".kg-col"));

    // const newKg=parseInt(kg);

    if (newQuantity < 1) {
      e.target.value = 1;
      //alert
      return;
    }

    try {
      input.disabled = true;
      const response = await fetch("/update-cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity: newQuantity, kg }),
      });
      input.disabled = false;

      const data = await response.json();

      if (response.ok) {
        window.location.reload();
      } else {
        e.target.value--;
        showWarningToast(data.message);
      }
    } catch (error) {
      console.log(error);
    }
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const remove_btn_el = document.querySelectorAll(".btn-remove");

  remove_btn_el.forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      const productId = e.target.dataset.id;

      try {
        const response = await fetch("/remove-cart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId }),
        });

        const data = await response.json();

        if (data.success) {
          window.location.reload();
        } else {
          showWarningToast("Failed to remove product");
        }
      } catch (error) {
        alert("Something went wrong");
        console.error(error);
      }
    });
  });
});
  
