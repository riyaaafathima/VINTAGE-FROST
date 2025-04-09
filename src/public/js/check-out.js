const remove_btns_el = document.querySelectorAll(".btnRemove");

const placeorder_btn_el = document.querySelector("#placeorder-btn");

const total_amount = document.querySelector(".totalAmount");

const wallet_el=document.querySelector('.wallet-btn')

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
      Swal.fire("Error", "Address ID not found!","error");
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
  console.log("clickkkkk");
  
  const walletBalance=wallet_el.getAttribute('data-balance')
  let totalAmount_val = total_amount.innerHTML;
  let totalAmount = totalAmount_val.replace("₹", "");

  console.log(walletBalance);
  
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
console.log(selectedPaymentMethod.value,"===========");

  if (
    selectedPaymentMethod.value == "COD" ||
    selectedPaymentMethod.value == "Wallet"
  ) {
    createOrder(
      selectedPaymentMethod.value,
      selectedDeliveryAddress.value,
      null,
      walletBalance,
      totalAmount
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

//for create order//
const createOrder = async (paymentMethod, addressId,isPaymentFailed=false,walletBalance,totalAmount) => {

if(paymentMethod=='Wallet'){
  if(Number(walletBalance)<Number(totalAmount)){
showErrorToast('Insufficient Balance Go For Another Payment Method')   
return
  }

}
if(totalAmount>1000 && paymentMethod=='COD'){
  showErrorToast('Order Above 1000 Are Not Allowed In COD')
  return 
}
  try {
    const response = await fetch("/place-order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        paymentMethod,
        addressId,
        walletBalance,
        totalAmount,
        isPaymentFailed
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
      }).then(() => {

      });
    }
  } catch (error) {
    console.log(error);
    
  };
    
  }

//for razor pay//
const InitializeRazorPayment = async (paymentMethod, addressId, totalAmount) => {
  try {
    const keyResponse = await fetch("/razor-key", { method: "GET", headers: { "Content-Type": "application/json" } });
    const keyData = await keyResponse.json();
    const razorpayKey = keyData.key;
    console.log("Fetched Razorpay key:", razorpayKey);

    const razorOrderResponse = await fetch("/razor-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: parseInt(totalAmount) }),
    });
    const razorOrder = await razorOrderResponse.json();

    let options = {
      key: razorpayKey,
      amount: parseInt(totalAmount) * 100,
      currency: "INR",
      name: "Vintage Frost",
      description: "Test Transaction",
      image: "/img/fav.png",
      order_id: razorOrder.id,
      handler: function (response) {
        saveOrderRazor(response, paymentMethod, addressId); 
      },
      prefill: { name: "riya", email: "riya@example.com", contact: "9061881978" },
      notes: { address: "Razorpay Corporate Office" },
      theme: { color: "#1818c4" },
    };

    const razor = new window.Razorpay(options);
    razor.open();

    razor.on("payment.failed", async function (response) { 
      // console.log("Payment failed:", response.error);
      // // await createOrder(paymentMethod, addressId, true, null, totalAmount);
      // const orderResponse = await fetch("/place-order", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({
      //   paymentMethod :paymentMethod, 
      //   addressId: addressId,
      //   isPaymentFailed: true,
      //   }),
      // });
  
      // const data = await orderResponse.json();
      // console.log(data.order._id, data.order.products[0]._id);
      
      //  Swal.fire({ title: "created faild order!", icon: "success" }).then(() => {
      //     window.location.href = `/view-orderDetails/${data.order._id}/${data.order.products[0]._id}`;
      //   });

    });
  } catch (error) {
    console.error("Razorpay initialization error:", error);
    showErrorToast(error.message || "Failed to initialize payment");
  }
};

const saveOrderRazor = async (razorResponse, selectedPayment, selectedAddress) => {
  try {
    console.log("Payment success, verifying with orderId:");
    const verifyData = await fetch("/razor-verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        razorpay_order_id: razorResponse.razorpay_order_id,
        razorpay_payment_id: razorResponse.razorpay_payment_id,
        razorpay_signature: razorResponse.razorpay_signature,
      }),
    });

    if (verifyData.ok) {
    console.log("verifyData ok");

    const orderResponse = await fetch("/place-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
      paymentMethod :selectedPayment, 
      addressId: selectedAddress,
      isPaymentFailed: false,
      }),
    });

    const data = await orderResponse.json();
    console.log(data.order._id, data.order.products[0]._id);
    
     Swal.fire({ title: "Payment successful!", icon: "success" }).then(() => {
        window.location.href = `/view-orderDetails/${data.order._id}/${data.order.products[0]._id}`;
      });
    } else {
      const errorData = await verifyData.json();
      throw new Error(errorData.error || "Payment verification failed");
    }
  } catch (error) {
    console.error("Verification error:", error);
    showErrorToast(error.message || "Something went wrong during payment verification");
  }
};