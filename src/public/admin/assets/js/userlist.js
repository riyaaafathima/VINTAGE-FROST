const block_btn_el=document.querySelectorAll('.delete-btn')


block_btn_el.forEach((blockbtn) => {
    console.log(blockbtn);
  
    blockbtn.addEventListener("click", async (e) => {
      e.preventDefault();
  console.log(blockbtn.id);
  
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
            `/admin/block-user/${blockbtn.id}`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
  
          // Check the response status
          if (response.ok) {
            // let message = await response.json()
            // console.log("hello",message);
            
            swal.fire("Successfull").then(() => {
              window.location.reload();
            });
  
            // blockbtn.closest(".itemlist").remove();
          } else {
            console.log("Error occurred while deleting");
          }
        }
      });
  
      // Fetch request to the backend
    });
  });