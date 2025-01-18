const categoryName_el = document.querySelector("#name");
const status_el = document.querySelector("#status");
const createbtn_el = document.querySelector(".create-btn");
const delebtn_el = document.querySelectorAll(".delete-btn");

categoryName_el.addEventListener('focus',(e)=>{

   
        if(categoryName_el?.nextElementSibling?.id == 'erro_el' ){
            categoryName_el.nextElementSibling.remove()
        }

})



createbtn_el.addEventListener("click", async (e) => {
  e.preventDefault();

  let isValid=true

  const createErrElAfter =(element,err)=>{
    if(element?.nextElementSibling?.id == 'erro_el' ){
      element.nextElementSibling.remove()
    }
    const new_el = document.createElement('p')
    new_el.setAttribute("id","erro_el")
    new_el.style.color = "red"
    new_el.innerHTML = err
    element.after(new_el)
  }


  if(categoryName_el?.value == ""){
    createErrElAfter(categoryName_el,"category name can not be empty")
   isValid=false
 }

 if(categoryName_el?.value.length >= 20){
   createErrElAfter(categoryName_el,"category name can not be longer than 20")
   isValid=false
 }

 const hasNumbers = /\d/.test(categoryName_el.value);   // d4 digits
 const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(categoryName_el.value); // Checks for special characters
//  const hasLetters = /[a-zA-Z]/.test(categoryName_el); // Checks for letters
 const isOnlySpaces = /^\s*$/.test(categoryName_el.value); // Checks if only spaces are entered
 if(hasNumbers){
    createErrElAfter(categoryName_el,"category name cannot be numbers")
    isValid=false;
 }

 if (hasSpecialChars) {
    createErrElAfter(categoryName_el,"category name cannot includes special char ")
    isValid=false;
    
 }

 if (isOnlySpaces) {
    createErrElAfter(categoryName_el,"category name can not be empty")

    isValid=false
 }
 if (!isValid) {
    return
 }


  const statusValue = status_el.value === "Active" ? true : false; // Convert string to Boolean
  const categoryDetails = {
    categoryName: categoryName_el.value,
    isActive: statusValue,
  };

  const response = await fetch("/admin/add-category", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(categoryDetails),
  });

  if (response.ok) {
    swal.fire("Successfully created category").then(() => {
      window.location.reload();
    });
  } else {
    swal.fire("Already added");
  }
});



delebtn_el.forEach((deleteBtns) => {
  console.log(delebtn_el);

  deleteBtns.addEventListener("click", async (e) => {
    e.preventDefault();

    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const response = await fetch(
          `/admin/delete-category/${deleteBtns.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        // Check the response status
        if (response.ok) {
          swal.fire("Successfully deleted").then(() => {
            window.location.reload();
          });

          deleteBtns.closest(".itemlist").remove();
        } else {
          console.log("Error occurred while deleting");
        }
      }
    });

    // Fetch request to the backend
  });
});


