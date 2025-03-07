const edit_coupon_name_el = document.querySelector("#name");
const edit_coupon_code_el = document.querySelector("#couponCode");
const edit_coupon_maxuses_el = document.querySelector("#maxUses");
const edit_expiry_date_el = document.querySelector("#expiryDate");
const edit_strt_date_el = document.querySelector("#startDate");
const edit_min_purchase_el = document.querySelector("#minPurchase");
const edit_offer_amount_el = document.querySelector("#offerAmount");

const add_btn_el = document.querySelector("#update-btn");
const couponId = add_btn_el.getAttribute('data-id')

console.log(couponId);


// const createErrElAfter = (element, err) => {
//   if (element?.nextElementSibling?.id == "erro_el") {
//     element.nextElementSibling.remove();
//   }
//   const new_el = document.createElement("p");
//   new_el.setAttribute("id", "erro_el");   
//   new_el.style.color = "red";
//   new_el.innerHTML = err;
//   element.after(new_el);
// };


add_btn_el.addEventListener("click", async (e) => {
  const editedCouponEl = {
    couponId: couponId,
    couponCode: edit_coupon_code_el.value,
    name: edit_coupon_name_el.value,
    expiryDate: edit_expiry_date_el.value,
    offerAmount: edit_offer_amount_el.value,
    startDate: edit_strt_date_el.value,
    minimumPurchaseAmount: edit_min_purchase_el.value,
    maximumUses: edit_coupon_maxuses_el.value,
  };
  try {
    const response = await fetch(`/admin/update-coupon/${couponId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(editedCouponEl),
      credentials: 'include'
    });
    if (response.ok) {
      window.location.href = '/admin/coupon-page';
    }
  } catch (error) {
    console.log(error);
  }
});
