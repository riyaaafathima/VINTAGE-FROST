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

document.querySelectorAll(".quantity-input").forEach((input) => {
  input.addEventListener("change", async (e) => {
    const productId = e.target.closest("tr").querySelector(".btn-remove")
      .dataset.id;
    const newQuantity = parseInt(e.target.value);
    const kg = e.target.closest("tr").querySelector(".kg-col").textContent;
    console.log(kg);
    console.log(e.target.closest("tr").querySelector(".kg-col"));

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

    const parentRow = e.target.closest("tr"); 
    
    const kg = parentRow.querySelector(".kg-col").textContent.trim();
    const quantity = parentRow.querySelector(".quantity-input").value;


      try {
        const response = await fetch("/remove-cart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId ,kg,quantity }),
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
  // Add your save logic here
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

    textarea.innerHTML = el.getAttribute("data-instruction");
    
    openModal("instruction");
  });
});

mssg_el.forEach((el) => {
  el.addEventListener("click", (e) => {
    textarea.innerHTML = el.getAttribute("data-mssg");

    openModal("message");
  });
});

// save_btn_el.addEventListener('click',(e)=>{

// })

// checkout_btn_el.addEventListener('click',(e)=>{
//   e.preventDefault
// })
