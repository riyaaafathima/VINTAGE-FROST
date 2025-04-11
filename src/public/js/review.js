const description_el = document.querySelector(".description-el");
const spn_el = document.querySelector(".view-btns");
const submit_btn_el = document.querySelector(".sbt-btn");
const rating_inputs_el = document.querySelectorAll(".star-rating input");
const ratingDisplay = document.getElementById("selected-rating");
// const edit_review_el = document.querySelector(".editReview");

let selected_star = 0;
let reviewModal; // Declare globally

document.addEventListener("DOMContentLoaded", function () {
  const reviewButtons = document.querySelectorAll(".review-btn");

  reviewButtons.forEach((button) => {
    button.addEventListener("click", function () {
      reviewModal = new bootstrap.Modal(document.getElementById("reviewModal"));

      const productId = button.getAttribute("data-product-id");
      const orderId = button.getAttribute("data-order-id");             

      const modal = document.getElementById("reviewModal");
      modal.setAttribute("data-product-id", productId);
      modal.setAttribute("data-order-id", orderId);

      description_el.value = ""; 
            selected_star = 0;
      ratingDisplay.textContent = "0"; 

     
      rating_inputs_el.forEach((input) => {
        input.checked = false;
      });

      reviewModal.show();
    });
  });

  rating_inputs_el.forEach((input) => {
    input.addEventListener("change", (e) => {
      selected_star = e.target.value;
      ratingDisplay.textContent = selected_star;
    });
  });
});

submit_btn_el.addEventListener("click", async (e) => {
  e.preventDefault();

  const modal = document.getElementById("reviewModal");
  const productId = modal.getAttribute("data-product-id");
  const orderId = modal.getAttribute("data-order-id");

  const data = {
    Description: description_el.value,
    product: productId,
    order: orderId,
    rating: selected_star,
  };

  try {
    const response = await fetch("/review", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      Swal.fire({
            position: "center",
            icon: "success",
            title: 'review added',
            showConfirmButton: false,
            timer: 1500,
          }).then(() => {
            window.location.reload();
            reviewModal.hide();
          });
    } else {
      const resData = await response.json();
      alert(resData.message);
    }
  } catch (error) {
    console.error("Error submitting review:", error);
  }
});



