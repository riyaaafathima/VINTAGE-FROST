const remove_btns_el = document.querySelectorAll(".btnRemove");

const placeorder_btn_el = document.querySelector("#placeorder-btn");

remove_btns_el.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.preventDefault();

    let id = e.target.closest(".address-items")?.getAttribute("data-id");

    console.log(id);

    if (!id) {
      Swal.fire("Error", "Address ID not found!", "error");
      return;
    }

    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to delete the address?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch(`/delete-address/${id}`, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
          });

          if (response.ok) {
            Swal.fire({
              title: "Successfully deleted address",
              icon: "success",
              confirmButtonColor: "#3085d6",
              confirmButtonText: "OK",
            }).then(() => {
              removeAddressFromDOM(id);
            });
          } else {
            Swal.fire({
              title: "Something went wrong",
              icon: "error",
              confirmButtonColor: "#3085d6",
            });
          }
        } catch (error) {
          console.error("Fetch error:", error);
          Swal.fire("Error", "Failed to delete address", "error");
        }
      }
    });
  });
});

function removeAddressFromDOM(id) {
  const addressItem = document.querySelector(`.address-items[data-id="${id}"]`);
  console.log(addressItem);

  if (addressItem) {
    addressItem.remove();
    if (document.querySelectorAll(".address-items").length === 0) {
      document.querySelector("#address-container").innerHTML = `
          <div id="no-address-alert" class="alert alert-warning text-center" role="alert">
            No address found!
          </div>
        `;
    }
  }
}
placeorder_btn_el.addEventListener("click", async (e) => {
 const selectedDeliveryAddress = document.querySelector(
    'input[name="deliveryAddress"]:checked'
  );

  if (selectedDeliveryAddress) {
    alert(`Selected delivery Address: ${selectedDeliveryAddress.value}`);
  } else {
    alert("Please select a payment method before placing the order.");
  }

const selectedPaymentMethod = document.querySelector(
    'input[name="paymentMethod"]:checked'
  );

  if (!selectedPaymentMethod) {
    alert(`Selected Payment Method`);
  }
  if (!selectedDeliveryAddress) {
    alert(`Selected address `);
  }

  const response = await fetch("/place-order", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      paymentMethod: selectedPaymentMethod.value,
      addressId: selectedDeliveryAddress.value,
    }),
  });


if (response.ok) {
  Swal.fire({
    title: "order placed!",
    icon: "success",
    draggable: true
  }).then(()=>{
    localStorage.setItem('cart-count',0)
    window.location.href='/view-orderDetails'
  })    
}else{
    const data= await response.json()
    console.log(data.error);
    
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: `${data.error}`,      
    }).then(()=>{
      
    })
}

});
