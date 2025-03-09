const category_name_el = document.querySelector("#name");
const expirydate_el = document.querySelector("#expiryDate");
const  offerpercentge_el= document.querySelector("#offerAmount");
const edit_addcoupon_btn_el = document.querySelector("#add-btn");
const offerId=edit_addcoupon_btn_el.getAttribute('data-id')
console.log(offerId);

edit_addcoupon_btn_el.addEventListener("click", async (e) => {
  e.preventDefault();

  const editedoffer = {

    category_id: category_name_el.value,
    offerPercentage: offerpercentge_el.value,
    expiryDate: expirydate_el.value,
  };
  console.log(editedoffer);

  try {
    const response = await fetch(`/admin/update-categoryOffer-page/${offerId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(editedoffer),
    });

    const data = await response.json();
    console.log(data);

    if (response.ok) {
        swal.fire("successfully edited").then(() => {
            window.location.href = "/admin/categoryOffer-page";
        });
    }
  } catch (error) {
    console.log(error);
  }
});
