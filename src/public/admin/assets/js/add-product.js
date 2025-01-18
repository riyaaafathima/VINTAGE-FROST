const productName_el = document.querySelector("#productName");
const category_el = document.querySelector("#category");
const stock_el = document.querySelector("#stock");
const priceVariant_el = document.querySelector(".price-variant");
const weight_el = document.querySelector("#Weight");
const price_el = document.querySelector("#price");
const description_el = document.querySelector("#description");
const removeBtn_el = document.querySelector("#remove-btn");
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

let selectedImage = null;

let cropper = null;

let croppedImages = [];


let editedImage={};


(async function () {
 
        editedImage={
            [img_preview1.id]:'',
            [img_preview2.id]:'',
            [img_preview3.id]:''
        }
})()


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

  if (productName_el?.value.length >= 20) {
    createErrElAfter(productName_el, "product name can not be longer than 20");
    isValid = false;
  }
  if (category_el?.value == "") {
    createErrElAfter(category_el, "product name can not be empty");
    isValid = false;
  }

  if (stock_el?.value == "") {
    createErrElAfter(stock_el, "product name can not be empty");
    isValid = false;
  }

  if (stock_el?.value.length >= 20) {
    createErrElAfter(stock_el, "product name can not be longer than 20");
    isValid = false;
  }
 
  if (weight_el?.value == "") {
    createErrElAfter(weight_el, "weight field can not be empty");
    isValid = false;
  }

  if (price_el?.value == "") {
    createErrElAfter(price_el, "price field can not be empty");
    isValid = false;
  }

  if (description_el?.value == "") {
    createErrElAfter(description_el, " please add description");
    isValid = false;
  }

  if (img1_input?.value == "") {
    createErrElAfter(img1_input, "please Add image");
    isValid = false;
  }

  if (img2_input?.value == "") {
    createErrElAfter(img2_input, "please Add image");
    isValid = false;
  }

  if (img3_input?.value == "") {
    createErrElAfter(img3_input, "please add image");
    isValid = false;
  }

  if (weight_el?.value.length >= 20) {
    createErrElAfter(weight_el, "please Add weight");
    isValid = false;
  }

  if (/\d/.test(productName_el.value)) {
    //d4 digit
    createErrElAfter(productName_el, "product name cannot be numbers");
    isValid = false;
  }

  if (/[!@#$%^&*(),.?":{}|<>]/.test(productName_el.value)) {
    createErrElAfter(productName_el, "product name cannot be numbers");
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


  if (parseInt(weight_el.value)<=0) {
    createErrElAfter(weight_el,'weight cannot be lessthan 0')
     isValid=false;
  }
  if (parseInt(price_el.value)<=0) {
    createErrElAfter,(' price cannot be lessthan 0')
     isValid=false;
  }
  
  if (!isValid) {
    return;
  }


  const formData = new FormData();

  formData.append("productName", productName_el.value);
  formData.append(
    "price",
    JSON.stringify([{ kg: weight_el.value, price: price_el.value }])
  );
  formData.append("stock", stock_el.value);
  formData.append("category", category_el.value);
  formData.append("description", description_el.value);
  // formData.append("quantity", quantity_el.value);
  //   formData.append('croppedImages',croppedImages[0],'croppedImages.png');

  // for (let i = 0; i < croppedImages.length; i++) {
  //   if (croppedImages[0] instanceof Blob) {
  //     // Add file extension if it's a blob
  //     const fileExtension = croppedImages[0].type.split("/")[1];
  //     formData.append(
  //       "images",
  //       croppedImages[i],
  //       `${productName_el.value}${i + 1}.png`
  //     );
  //   }
  // }

  let i=0
for(let key in editedImage ){

    formData.append('images', editedImage[key],`${productName_el.value}${i+1}.png`);  

    i++
}

  const response = await fetch("/admin/add-product", {
    method: "POST",
    body: formData, // bcz we passing  blob in formdata so it not in json
  });

  if (response.ok) {
    console.log("ok");

    swal.fire("product added successfully").then(() => {
      window.location.href = "/admin/getAllproducts";
    });
  } else {
    const mssg = await response.json();
    console.log(mssg);

    swal.fire(mssg);
  }
});

img1_input.addEventListener("change", (e) => {   
  const file = event.target.files[0]; 
  editedImage[img_preview1.id]=file 
  const imgUrl = URL.createObjectURL(file);
  img_preview1.src = imgUrl;

  img1_input.style.display = "none";
});
img2_input.addEventListener("change", (e) => {
  const file = event.target.files[0];
  editedImage[img_preview2.id]=file

  const imgUrl = URL.createObjectURL(file);
  img_preview2.src = imgUrl;

  img2_input.style.display = "none";
});
img3_input.addEventListener("change", (e) => {
  const file = event.target.files[0];
  editedImage[img_preview3.id]=file

  const imgUrl = URL.createObjectURL(file);

  img_preview3.src = imgUrl;

  img3_input.style.display = "none";
});

img_preview1.addEventListener("click", () => {
  if (selectedImage) {      // if we click the img it has img so , making the selected img null for the currnt img
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

     editedImage[selectedImage.id]=blob

    croppedImages.push(blob);

    cropper.destroy();
    cropper = null;

    setTimeout(() => URL.revokeObjectURL(blobUrl), 3000); // remove the url that created for obj
  });
});
