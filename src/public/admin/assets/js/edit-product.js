const productName_el = document.querySelector("#productName");
const category_el = document.querySelector("#category");
const stock_el = document.querySelector("#stock");
const preperationHour_el = document.querySelector("#preperation-hour");
const weight_el = document.querySelector("#Weight");
const price_el = document.querySelector("#price");
const description_el = document.querySelector("#description");
const cropbtn_el = document.querySelector("#crop-btn");
const savebtn_el = document.querySelector("#save-btn");
const img1_input = document.querySelector("#img-1");
const img2_input = document.querySelector("#img-2");
const img3_input = document.querySelector("#img-3");
const img_preview1 = document.querySelector("#img-1preview");
const img_preview2 = document.querySelector("#img-2preview");
const img_preview3 = document.querySelector("#img-3preview");
const addpriceBtn_el = document.querySelector("#add-pricebtn");
const addbtn_el = document.querySelector("#add-btn");
const productId = document.querySelector("._id");
const removeBtn_el = document.querySelector("#remove-btn");
const inputs = document.querySelectorAll("input");
const varient_cnt_el = document.querySelector(".price-variant");

console.log(addbtn_el, "asdfghjk");

let selectedImage = null;

let cropper = null;

let croppedImages = [];

let editedImage = {};

(async function () {
  const [image1Blob, image2Blob, image3Blob] = await Promise.all([
    getImageFile(img_preview1.src),
    getImageFile(img_preview2.src),
    getImageFile(img_preview3.src),
  ]);

  editedImage = {
    [img_preview1.id]: image1Blob,
    [img_preview2.id]: image2Blob,
    [img_preview3.id]: image3Blob,
  };
})();

async function getImageFile(imgUrl) {
  const img = new Image();
  img.crossOrigin = "anonymous";
  img.src = imgUrl;

  await new Promise((resolve) => (img.onload = resolve));

  const canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;
  canvas.getContext("2d").drawImage(img, 0, 0);

  const blob = await new Promise((resolve) =>
    canvas.toBlob(resolve, "image/png")
  );
  return new File([blob], "cropped-image.png", {
    type: "image/png",
    lastModified: Date.now(),
  });
}

addbtn_el.addEventListener("click", async (e) => {
  e.preventDefault();
  let isValid = true;

  const createErrElAfter = (element, err) => {
    if (element?.nextElementSibling?.id == "erro_el") {
      element.nextElementSibling.remove();
    }
    const new_el = document.createElement("p");
    new_el.setAttribute("id", "erro_el");
    new_el.style.color = "red";
    new_el.innerHTML = err;
    element.after(new_el);
  };

  if (productName_el?.value == "") {
    createErrElAfter(productName_el, "product name can not be empty");
    isValid = false;
  }

  if (productName_el?.value.length >= 50) {
    createErrElAfter(productName_el, "product name can not be longer than 20");
    isValid = false;
  }
  if (category_el?.value == "") {
    createErrElAfter(category_el, "product name can not be empty");
    isValid = false;
  }

  if (preperationHour_el?.value == "") {
    createErrElAfter(preperationHour_el, "this field cannot be empty");
    isValid = false;
  }

  if (preperationHour_el?.value.length < 1) {
    createErrElAfter(preperationHour_el, "product name can not be longer than 20");
    isValid = false;
  }

  if (description_el?.value == "") {
    createErrElAfter(description_el, " please add description");
    isValid = false;
  }

  if (/\d/.test(productName_el.value)) {
    //d4 digit
    createErrElAfter(productName_el, "product name cannot be numbers");
    isValid = false;
  }

  if (/[!@#$%^&*(),.?":{}|<>]/.test(productName_el.value)) {
    createErrElAfter(productName_el, "product name cannot be special char");
    isValid = false;
  }
  if (/^\s*$/.test(productName_el.value)) {
    createErrElAfter(productName_el, "product name cannot be numbers");
    isValid = false;
  }
  if (/^\s*$/.test(description_el.value)) {
    createErrElAfter(description_el, "add description name ");
    isValid = false;
  }

  //varents validation
  //arra input fe
  document.querySelectorAll(".weight-inputs").forEach((inputs, index) => {
    if (inputs?.value == "") {
      createErrElAfter(inputs, "please fill the field");
      isValid = false;
    }

    if (inputs?.value == "") {
      createErrElAfter(inputs, "please fill the field");
      isValid = false;
    }
    if (/[!@#$%^&*(),.?":{}|<>]/.test(inputs.value)) {
      createErrElAfter(inputs, " this field cannot be special char ");
      isValid = false;
    }
    if (/^\s*$/.test(inputs.value)) {
      createErrElAfter(inputs, "this field cannot be empty");
      isValid = false;
    }

    if (inputs?.value < 1) {
      createErrElAfter(inputs, "this field can't be less than 0");
      isValid = false;
    }
  });

  // price inputs validation

  document.querySelectorAll(".price-inputs").forEach((inputs) => {
    if (inputs?.value == "") {
      createErrElAfter(inputs, "please add a price");
      isValid = false;
    }

    if (/[!@#$%^&*(),.?":{}|<>]/.test(inputs.value)) {
      createErrElAfter(inputs, " this field cannot be special char ");
      isValid = false;
    }
    if (/^\s*$/.test(inputs.value)) {
      createErrElAfter(inputs, "this price field cannot be empty");
      isValid = false;
    }

    if (inputs?.value < 1) {
      createErrElAfter(inputs, "price can't be less than 0");
      isValid = false;
    }
  });
  document.querySelectorAll(".stock-inputs").forEach((inputs) => {
    if (inputs?.value == "") {
      createErrElAfter(inputs, "please add stock ");
      isValid = false;
    }

    if (/[!@#$%^&*(),.?":{}|<>]/.test(inputs.value)) {
      createErrElAfter(inputs, " this field cannot be special char ");
      isValid = false;
    }
    if (/^\s*$/.test(inputs.value)) {
      createErrElAfter(inputs, "this field cannot be empty");
      isValid = false;
    }

    if (inputs?.value < 0) {
      createErrElAfter(inputs, "stock cannot be lessthan 0");
      isValid = false;
    }
  });

  if (!isValid) {
    return;
  }

  let Varient = [];

  document.querySelectorAll(".price-inputs").forEach((price) => {
    Varient.push({ price: price.value });
  });
  document.querySelectorAll(".weight-inputs").forEach((weight, index) => {
    Varient[index].kg = weight.value;
  });
  document.querySelectorAll(".stock-inputs").forEach((stock, index) => {
    Varient[index].stock = stock.value;
  });
  console.log("kjjhj",Varient);

  const formData = new FormData();

  formData.append("productName", productName_el.value);
  formData.append("varients", JSON.stringify(Varient));
  formData.append("preperationHour", preperationHour_el.value);
  formData.append("category", category_el.value);
  formData.append("description", description_el.value);

  // formData.append('quantity',quantity_el.value);

  //   formData.append('croppedImages',croppedImages[0],'croppedImages.png');

  // for (let i = 0; i < croppedImages.length; i++) {
  //   if (croppedImages[0] instanceof Blob) {
  //     // Add file extension if it's a blob
  //     const fileExtension = croppedImages[0].type.split('/')[1];
  //     formData.append('images', croppedImages[i],`${productName_el.value}${i+1}.png`);
  //     }

  // }
  let i = 0;
  for (let key in editedImage) {
    formData.append(
      "images",
      editedImage[key],
      `${productName_el.value}${i + 1}.png`
    );

    i++;
  }

  const response = await fetch(`/admin/edit-product/${productId.id}`, {
    method: "PUT",
    // headers:{
    //     'Content-Type':'application/json'
    // },
    body: formData,
  });
  if (response.ok) {
    console.log("sucess");
    
    swal.fire("product edited successfully").then(() => {
      window.location.href = "/admin/getAllproducts";
    });
  }else{
    console.log("error");

    const mssg=await response.json()

    swal.fire(mssg)
  }
});

img1_input.addEventListener("change", (e) => {
  const file = event.target.files[0];
  const imgUrl = URL.createObjectURL(file);
  img_preview1.src = imgUrl;

  img1_input.style.display = "none";
});
img2_input.addEventListener("change", (e) => {
  const file = event.target.files[0];
  const imgUrl = URL.createObjectURL(file);
  console.log("this is input2");
  img_preview2.src = imgUrl;

  img2_input.style.display = "none";
});
img3_input.addEventListener("change", (e) => {
  const file = event.target.files[0];
  const imgUrl = URL.createObjectURL(file);

  img_preview3.src = imgUrl;

  img3_input.style.display = "none";
});

img_preview1.addEventListener("click", () => {
  if (selectedImage) {
    selectedImage = null;
  }
  if (cropper) {
    cropper = null;
    cropper.destroy();
  }
  selectedImage = img_preview1;

  selectedImage.parentElement.style.border = "1px dashed green";
});
img_preview2.addEventListener("click", () => {
  if (selectedImage) {
    selectedImage.parentElement.style.border = "none"; // we want to remove the selected img border
    selectedImage = null;
  }

  if (cropper) {
    cropper = null;
    cropper.destroy();
  }

  selectedImage = img_preview2;

  selectedImage.parentElement.style.border = "1px dashed green";
});
img_preview3.addEventListener("click", () => {
  if (selectedImage) {
    selectedImage.parentElement.style.border = "none";

    selectedImage = null;
  }

  if (cropper) {
    cropper = null;
    cropper.destroy();
  }

  selectedImage = img_preview3;

  selectedImage.parentElement.style.border = "1px dashed green";
});

cropbtn_el.addEventListener("click", (e) => {
  if (!selectedImage) {
    //if selected image is not there crop btn diable
    return;
  }
  //     if (cropper) {
  //     cropper.destroy();
  //   }
  cropper = new Cropper(selectedImage, {
    aspectRatio: 1,
    viewMode: 1,
    preview: ".preview",
  });
});

savebtn_el.addEventListener("click", (e) => {
  if (!selectedImage || !cropper) {
    return;
  }

  const canvas = cropper.getCroppedCanvas(); // we can add any element in  canvas
  canvas.toBlob((blob) => {
    //blob is a file type
    console.log(blob);

    const blobUrl = URL.createObjectURL(blob); // we transform into image form

    selectedImage.src = blobUrl; // and we put the blobed image into selectredimage

    croppedImages.push(blob);

    editedImage[selectedImage.id] = blob;

    cropper.destroy();
    cropper = null;

    setTimeout(() => URL.revokeObjectURL(blobUrl), 3000); // remove the url that created for obj
  });
});

inputs.forEach((input) => {
  input.addEventListener("focus", (e) => {
    if (input?.nextElementSibling?.id == "erro_el") {
      input.nextElementSibling.remove();
    }
  });
});

description_el.addEventListener("focus", (e) => {
  if (description_el?.nextElementSibling?.id == "erro_el") {
    description_el.nextElementSibling.remove();
  }
});

addpriceBtn_el.addEventListener("click", (e) => {
  const veriant_el = document.querySelector(".price-variant"); // Select the original price-variant div
  const priceCnt_el = document.querySelector("#price-cnt"); // Parent container

  // Clone the original price-variant div
  const new_input = veriant_el.cloneNode(true);

  // Generate unique IDs for the cloned inputs
  const uniqueId = Date.now(); // Use timestamp to ensure uniqueness
  new_input
    .querySelector('input[id="Weight"]')
    .setAttribute("id", `Weight-${uniqueId}`);
  new_input
    .querySelector('input[id="price"]')
    .setAttribute("id", `price-${uniqueId}`);
  new_input
    .querySelector('input[id="stock"]')
    .setAttribute("id", `stock-${uniqueId}`);

  // Clear input values for the cloned inputs
  new_input.querySelector('input[id^="Weight"]').value = "";
  new_input.querySelector('input[id^="price"]').value = "";
  new_input.querySelector('input[id^="stock"]').value = "";

  // Add a remove button to the cloned input
  const removeBtn = new_input.querySelector("#remove-btn");
  removeBtn.addEventListener("click", () => {
    // Clear the input values of the parent before removing
    new_input.querySelector('input[id^="Weight"]').value = "";
    new_input.querySelector('input[id^="price"]').value = "";
    new_input.querySelector('input[id^="stock"]').value = "";
    // Remove the cloned div
    new_input.remove();
  });



  // Append the new input to the parent container
  priceCnt_el.appendChild(new_input);

  const weight_input = new_input.querySelector(`#Weight-${uniqueId}`);
  weight_input.addEventListener("focus", (e) => {
    if (weight_input?.nextElementSibling?.id == "erro_el") {
      weight_input.nextElementSibling.remove();
    }
  });
  const price_input = new_input.querySelector(`#price-${uniqueId}`);
  price_input.addEventListener("focus", (e) => {
    if (price_input?.nextElementSibling?.id == "erro_el") {
      price_input.nextElementSibling.remove();
    }
  });
  const stock_input = new_input.querySelector(`#stock-${uniqueId}`);
  stock_input.addEventListener("focus", (e) => {
    if (stock_input?.nextElementSibling?.id == "erro_el") {
     stock_input.nextElementSibling.remove();
    }
  });
});

document.querySelectorAll(".remove-btn").forEach((button) => {
  button.addEventListener("click", () => {
    const priceCnt = document.getElementById("price-cnt");
    const priceVariants = priceCnt.querySelectorAll(".price-variant");

    // Ensure at least one price variant remains
    if (priceVariants.length > 1) {
      const parentVariant = button.closest(".price-variant"); // Get the parent price-variant div
      priceCnt.removeChild(parentVariant); // Remove the selected price-variant
    } else {
      alert("At least one price variant must remain."); // Show an alert if trying to remove the last one
    }
  });
});

inputs.forEach((input) => {
  input.addEventListener("focus", (e) => {
    if (input?.nextElementSibling?.id == "erro_el") {
      input.nextElementSibling.remove();
    }
  });
});
