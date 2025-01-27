const blockBtns = document.querySelectorAll(".delete-btn");

blockBtns.forEach((blockBtn) => {
  blockBtn.addEventListener("click", async (e) => {
    e.preventDefault();

    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, update it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const response = await fetch(`/admin/block-user/${blockBtn.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const responseData = await response.json();

          // Extract the dynamic class name
          const isActiveClass = [...blockBtn.classList].find((cls) =>
            cls.startsWith("isActive-")
          );

          if (isActiveClass) {
            const badge = document.querySelector(`.${isActiveClass}`);
            if (badge) {
              badge.classList.remove("alert-success", "alert-danger");
              badge.classList.add(
                responseData.isActive ? "alert-success" : "alert-danger"
              );
              badge.textContent = responseData.isActive ? "Active" : "Inactive";
            }
          }

          // Update button text and class
          blockBtn.textContent = responseData.isActive ? "Block" : "Unblock";
          blockBtn.classList.toggle("btn-danger", responseData.isActive);
          blockBtn.classList.toggle("btn-success", !responseData.isActive);

          Swal.fire(
            "Successful",
            `The user has been ${responseData.isActive ? "activated" : "blocked"}.`,
            "success"
          );
        } else {
          Swal.fire("Error", "Failed to update user status. Try again.", "error");
        }
      }
    });
  });
});
