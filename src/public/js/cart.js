const remove_btn_el=document.querySelector('.btn-remove')
document.querySelectorAll(".quantity-input").forEach((input) => {
    input.addEventListener("change", async (e) => {
      const productId = e.target.closest("tr").querySelector(".btn-remove").dataset.id; // Get product ID
      const newQuantity = parseInt(e.target.value); // Get updated quantity
  
      if (newQuantity < 1) {
        e.target.value = 1; // Prevent values below 1
        return;
      }
  
      // Send update to the backend
      const response = await fetch("/update-cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity: newQuantity }),
      });
  
      const data = await response.json();
      if (data.success) {
        location.reload(); // Refresh page to reflect updated price
      } else {
        alert("Failed to update quantity.");
      }
    });
  });
  

  document.addEventListener("DOMContentLoaded", function () {
    // Select all remove buttons
    const remove_btn_el = document.querySelectorAll(".btn-remove");
  
    remove_btn_el.forEach((btn) => {
      btn.addEventListener("click", async (e) => {
        // Get product ID from the button's data attribute
        const productId = e.target.dataset.id;
  
        try {
          // Send request to remove item from cart
          const response = await fetch("/remove-cart", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ productId }),
          });
  
          const data = await response.json();
  
          if (data.success) {
            window.location.reload(); // Reload page to update cart
          } else {
            alert("Failed to remove product");
          }
        } catch (error) {
          alert("Something went wrong");
          console.error(error);
        }
      });
    });
  });
  