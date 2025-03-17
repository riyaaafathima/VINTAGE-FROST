const remove_btn_el = document.querySelector(".btn-remove");

const checkout_btn_el = document.querySelector("#checkout-btn");

const save_btn_el = document.querySelector(".save-btn");

const instruction_el = document.querySelectorAll("#instruction-Btn");

const mssg_el = document.querySelectorAll("#mssg-btn");

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

// document.querySelectorAll(".quantity-input").forEach((input) => {
//   input.addEventListener("change", async (e) => {
//     const productId = e.target.closest("tr").querySelector(".btn-remove")
//       .dataset.id;
//     const newQuantity = parseInt(e.target.value);
//     const kg = e.target.closest("tr").querySelector(".kg-col").textContent;
//     console.log(kg);
//     console.log(e.target.closest("tr").querySelector(".kg-col"));

//     if (newQuantity < 1) {
//       e.target.value = 1;
//       //alert
//       return;
//     }

//     if (newQuantity > 10) {
//       e.target.value = 9;
//       //alert
//       return;
//     }

//     try {
//       input.disabled = true;
//       console.log(productId,  newQuantity, kg);
      
//       const response = await fetch("/update-cart", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ productId, quantity: newQuantity, kg }),
//       });
//       input.disabled = false;

//       const data = await response.json();

//       if (response.ok) {
//         window.location.reload();
//       } else {
//         e.target.value--;
//         showWarningToast(data.message);
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   });
// });



document.addEventListener("DOMContentLoaded", function () {
  const removeBtnEls = document.querySelectorAll(".btn-remove");
  const quantityInputs = document.querySelectorAll(".quantity-input");

  quantityInputs.forEach((input) => {
    const container = document.createElement("div");
    container.classList.add("quantity-wrapper");
    container.style.display = "flex";
    container.style.alignItems = "center";

    const minusBtn = document.createElement("button");
    minusBtn.textContent = "-";
    minusBtn.classList.add("quantity-btn");
    minusBtn.style.marginRight = "5px";
    minusBtn.style.padding = "5px";
    minusBtn.style.cursor = "pointer";
    minusBtn.style.border = "1px solid #ccc";
    minusBtn.style.background = "#f5f5f5";

    const plusBtn = document.createElement("button");
    plusBtn.textContent = "+";
    plusBtn.classList.add("quantity-btn");
    plusBtn.style.marginLeft = "5px";
    plusBtn.style.padding = "5px";
    plusBtn.style.cursor = "pointer";
    plusBtn.style.border = "1px solid #ccc";
    plusBtn.style.background = "#f5f5f5";

    input.style.textAlign = "center";
    input.style.width = "40px";
    input.style.border = "1px solid #ccc";
    input.style.margin = "0 5px";
    input.style.padding = "5px";

    input.parentNode.insertBefore(container, input);
    container.appendChild(minusBtn);
    container.appendChild(input);
    container.appendChild(plusBtn);

    minusBtn.addEventListener("click", () => updateQuantity(input, -1));
    plusBtn.addEventListener("click", () => updateQuantity(input, 1));
  });

  async function updateQuantity(input, change) {
    const row = input.closest("tr");
    const productId = row.querySelector(".btn-remove").dataset.id;
    let newQuantity = parseInt(input.value) + change;
    const kg = row.querySelector(".kg-col").textContent.trim();
    const maxStock = parseInt(row.dataset.stock) || 10;

    if (newQuantity < 1) {
      showWarningToast("Minimum quantity is 1.");
      return;
    }

    if (newQuantity > maxStock) {
      showWarningToast("Insufficient stock.");
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
        input.value = newQuantity;
        updateTotalPrice(row, newQuantity);
        window.location.reload()
      } else {
        showWarningToast(data.message);
      }
    } catch (error) {
      console.log(error);
    }
  }

  function updateTotalPrice(row, quantity) {
    const pricePerUnit = parseFloat(row.querySelector(".price-col").textContent);
    row.querySelector(".total-col").textContent = (pricePerUnit * quantity).toFixed(2) + " Rs";
  }

  removeBtnEls.forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      e.preventDefault();
      const productId = e.target.dataset.id;
      const kg = e.target.closest("tr").querySelector(".kg-col").textContent.trim();

      try {
        const response = await fetch("/remove-cart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId, kg }),
        });

        const data = await response.json();
        if (data.success) {
          window.location.reload();
        } else {
          showWarningToast("Failed to remove product.");
        }
      } catch (error) {
        alert("Something went wrong.");
        console.error(error);
      }
    });
  });

  function showWarningToast(message) {
    toastr.options = {
      positionClass: "toast-top-center",
      timeOut: "3000",
      closeButton: true,
    };
    toastr.warning(message);
  }
});



const modal = document.getElementById("myModal");
const modalTitle = document.getElementById("modalTitle");
const textarea = document.getElementById("modalTextarea");

function openModal(type) {
  modal.style.display = "block";
  modalTitle.textContent =
    type === "instruction" ? "View Instruction" : "View Message";
}

function closeModal() {
  modal.style.display = "none";
}

function saveChanges() {
  console.log("Saving:", textarea.value);
  closeModal();
}

// Close modal when clicking outside
window.onclick = function (event) {
  if (event.target === modal) {
    closeModal();
  }
};

instruction_el.forEach((el) => {
  el.addEventListener("click", (e) => {
    const row = e.target.closest("tr");

    const kg = row.querySelector(".kg-col").textContent.trim();

    const productId = row.querySelector(".btn-remove").getAttribute("data-id");

    console.log(kg, productId);
    textarea.setAttribute("data-type", "instruction");
    textarea.setAttribute("data-kg", kg);
    textarea.setAttribute("data-productId", productId);
    textarea.innerHTML = el.getAttribute("data-instruction");

    openModal("instruction");
  });
});

mssg_el.forEach((el) => {
  el.addEventListener("click", (e) => {
    const row = e.target.closest("tr");

    const kg = row.querySelector(".kg-col").textContent.trim();

    const productId = row.querySelector(".btn-remove").getAttribute("data-id");

    textarea.setAttribute("data-kg", kg);
    textarea.setAttribute("data-productId", productId);
    textarea.setAttribute("data-type", "message");
    textarea.innerHTML = el.getAttribute("data-mssg");
    openModal("message");
  });
});

save_btn_el.addEventListener("click", async (e) => {
  e.preventDefault();

  const kg = textarea.getAttribute("data-kg");
  const productId = textarea.getAttribute("data-productId");

  /////// message////////////////
  if (textarea.getAttribute("data-type") == "message") {
    console.log(kg, productId, "====", textarea.innerHTML);

    const response = await fetch("/update-message", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ kg, productId, message: textarea.value }),
    });

    if (response.ok) {
      Swal.fire({
        position: "center",
        icon: "success",
        title: "saved your message",
        showConfirmButton: false,
        timer: 1500,
      }).then(() => {
        window.location.reload();
      });
    } else {
      const data = await response.json();
      alert(data.error);
    }
  } else if (textarea.getAttribute("data-type") == "instruction") {
    const response = await fetch("/update-instruction", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ instruction: textarea.value, kg, productId }),
    });

    if (response.ok) {
      Swal.fire({
        position: "center",
        icon: "success",
        title: "saved your instruction",
        showConfirmButton: false,
        timer: 1500,
      }).then(() => {
        window.location.reload();
      });
    } else {
      const data = await response.json();
      alert(data.error);
    }
  }
});

     