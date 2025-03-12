const category_name_el = document.querySelector("#name");
const expirydate_el = document.querySelector("#expiryDate");
const offerpercentge_el = document.querySelector("#offerAmount");
const addcoupon_btn_el = document.querySelector("#add-btn");

addcoupon_btn_el.addEventListener("click", async (e) => {
  e.preventDefault();

  const offer = {
    product_id: category_name_el.value,
    offerPercentage: offerpercentge_el.value,
    expiryDate: expirydate_el.value,
  };
  
  console.log(offer);

  try {
    const response = await fetch("/admin/prodctOffer-page", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(offer),
    });
    const data = await response.json();
    console.log(data);

    if (response.ok) {
      swal.fire("successfully added").then(() => {
        window.location.href = "/admin/productOffer-page";
      });
    }
  } catch (error) {
    console.log(error);
  }
});
