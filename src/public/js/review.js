const description_el = document.querySelector(".description-el");
const spn_el = document.querySelector(".view-btns");
const submit_btn_el = document.querySelector(".sbt-btn");
const rating_inputs_el = document.querySelectorAll(".star-rating input");
const ratingDisplay = document.getElementById("selected-rating");

let selected_star = 0;

document.addEventListener("DOMContentLoaded", function () {
  const reviewButtons = document.querySelectorAll(".review-btn");

  reviewButtons.forEach((button) => {
    button.addEventListener("click", function () {
      let reviewModal = new bootstrap.Modal(
        document.getElementById("reviewModal")
      );
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

  const productId = spn_el.getAttribute("product-id");
  const orderId = spn_el.getAttribute("data-id");
  

  const data = {
    Description: description_el.value,
    product:productId,
    order:orderId,
    rating: selected_star,
  };
console.log(data);

  try {
    const response = await fetch("/review", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      alert("Review submitted successfully!");
    }
  } catch (error) {
    console.error("Error submitting review:", error);
  }
});
