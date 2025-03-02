const save_btn_el = document.querySelector("#save-btn");
const name_el = document.querySelector("#name-inpt");
const img_el = document.querySelector("#profile-photo-input");
const img_preview_el = document.querySelector("#img_preview");


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

  

save_btn_el.addEventListener("click", async (e) => {
    e.preventDefault();
   let isValid=true
    if (name_el?.value == "") {
        createErrElAfter(name_el, "name cannot be empty");
        isValid = false;
      }
    
      if (name_el?.value.length >= 50) {
        createErrElAfter(name_el, " name can not be longer than 20");
        isValid = false;
      }
    
      if (name_el?.value.trim()=='') {
        createErrElAfter(name_el, " name can not be empty");
        isValid = false;
      }
     
    if (/[!@#$%^&*(),.?":{}|<>]/.test(name_el.value)) {
        createErrElAfter(name_el, " this field cannot be special char ");
        isValid = false;
      }
      if (/\d/.test(name_el.value)) {
       
        createErrElAfter(name_el, " name cannot be numbers");
        isValid = false;
      }
      if (!isValid) {
        return
        
      }
    
    const formData = new FormData();
    formData.append("username", name_el.value);
    formData.append("image", img_el.files[0]); 
  
    try {
      const response = await fetch("/edit-profile", {
        method: "POST",
        body: formData, // No need to set Content-Type
      });
  
      if (response.ok) {
        Swal.fire({
            position: "center",
            icon: "success",
            title: "saved changes",
            showConfirmButton: false,
            timer: 1500
          }).then(()=>{
            window.location.reload();

          })
        
      } else {
        console.error("Failed to update profile.");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  });
  

img_el.addEventListener("change", (e) => {
  const file = event.target.files[0];
  // editedImage[img_preview1.id] = file;
  console.log(event.target.file);

  const imgUrl = URL.createObjectURL(file);
  img_preview_el.src = imgUrl;

  img_el.style.display = "none";
});



name_el.addEventListener('focus',(e)=>{
  
    if (name_el?.nextElementSibling?.id == "erro_el") {
      name_el.nextElementSibling.remove();
    }
})


