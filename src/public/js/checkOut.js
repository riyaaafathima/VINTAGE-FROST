const remove_btns_el = document.querySelectorAll(".btnRemove");

const placeorder_btn_el = document.querySelector("#placeorder-btn");

const total_amount = document.querySelector(".totalAmount");

const showErrorToast = (message) => {
  toastr.options = {
    positionClass: "toast-top-center",
    timeOut: "3000",
    closeButton: true,
  };
  toastr.error(message);
};

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
  let totalAmount_val = total_amount.innerHTML;
  let totalAmount = totalAmount_val.replace("₹", "");
  const selectedDeliveryAddress = document.querySelector(
    'input[name="deliveryAddress"]:checked'
  );

  const selectedPaymentMethod = document.querySelector(
    'input[name="paymentMethod"]:checked'
  );

  if (!selectedPaymentMethod) {
    showErrorToast("please select a payment Method");
    return;
  }
  if (!selectedDeliveryAddress) {
    showErrorToast("please select a address");
    return;
  }
  console.log("Razorpay", selectedPaymentMethod.value);
  if (
    selectedPaymentMethod.value == "COD" ||
    selectedPaymentMethod.value == "Wallet"
  ) {
    saveOrderOnCashOnDelivery(
      selectedPaymentMethod.value,
      selectedDeliveryAddress.value
    );
  } else if (selectedPaymentMethod.value == "Razorpay") {
    console.log(totalAmount, total_amount.innerHTML);

    InitializeRazorPayment(
      selectedPaymentMethod.value,
      selectedDeliveryAddress.value,
      totalAmount
    );
  }
});

//for cash on delivery and wallet//
const saveOrderOnCashOnDelivery = async (paymentMethod, addressId) => {
  const response = await fetch("/place-order", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      paymentMethod,
      addressId,
    }),
  });

  const data = await response.json();
  console.log(data);

  if (response.ok) {
    Swal.fire({
      title: "order placed!",
      icon: "success",
      draggable: true,
    }).then(() => {
      window.location.href = `/view-orderDetails/${data.order._id}/${data.order.products[0]._id}`;
    });
  } else {
    console.log(data.error);

    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: `${data.error}`,
    }).then(() => {});
  }
};

//for razor pay//
const InitializeRazorPayment = async (
  paymentMethod,
  addressId,
  totalAmount
) => {
  try {
    const response = await fetch("/razor-key", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const key = await response.json();
    console.log(totalAmount, key);

    const razorOrder = await fetch("/razor-order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ amount: parseInt(totalAmount) }),
    });

    const order = await razorOrder.json();

    //razor pay configurations
    let options = {
      key: key,
      amount: parseInt(totalAmount) * 100,
      currency: "INR",
      name: "Vintage Frost",
      description: "Test Transaction",
      image: `img/fav.png`,
      order_id: order.id,

      handler: function (response) {
        console.log("success", response);

        saveOrderRazor(response, order, paymentMethod, addressId);
      },
      prefill: {
        name: "riya",
        email: "riya@example.com",
        contact: "9061881978",
      },
      notes: {
        address: "Razor pay Corporate Office",
      },
      theme: {
        color: "#1818c4",
      },
    };

    const razor = new window.Razorpay(options);
    razor.open();
  } catch (error) {
    console.log(error);
  }
};

const saveOrderRazor = async (
  razorResponse,
  order,
  selectedPayment,
  selectedAddress
) => {
  try {
    //saving the order
    // const response = await fetch("/place-order", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({
    //     addressId: selectedAddress,
    //     paymentMethod: selectedPayment,
    //   }),
    // });

    // const data = await response.json();

    //saving payment
    const verifyData = await fetch("/razor-verify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...razorResponse,
        orderId: order.id,
      }),
    });

    if (verifyData.ok) {
      saveOrderOnCashOnDelivery(selectedPayment, selectedAddress);
    } else {
      showErrorToast("somthing went wrong");
    }
  } catch (error) {
    console.log(error);
  }
};
