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
  