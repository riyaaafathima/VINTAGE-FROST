const productName = document.querySelector("#name");
const expirydate_el = document.querySelector("#expiryDate");
const offerpercentge_el = document.querySelector("#offerAmount");
const edit_addcoupon_btn_el = document.querySelector("#add-btn");
const offerId = edit_addcoupon_btn_el.getAttribute("data-id");

edit_addcoupon_btn_el.addEventListener("click", async (e) => {
  e.preventDefault();
console.log("s,dmfnadm.sfn");

  const editedoffer = {
    product_id: productName.value,
    offerPercentage: offerpercentge_el.value,
    expiryDate: expirydate_el.value,
  };

  console.log(editedoffer);

  try {
    const response = await fetch(
      `/admin/update-productOffer/${offerId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editedoffer),
      }
    );

    const data = await response.json();
    console.log(data);

    if (response.ok) {
      swal.fire("successfully edited").then(() => {
        window.location.href = "/admin/productOffer-page";
      });
    }
  } catch (error) {
    console.log(error);
  }
});
