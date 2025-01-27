const categoryName_el = document.querySelector("#name");
const status_el = document.querySelector("#status");
const createbtn_el = document.querySelector(".create-btn");
const delebtn_el = document.querySelectorAll(".delete-btn");

categoryName_el.addEventListener("focus", (e) => {
  if (categoryName_el?.nextElementSibling?.id == "erro_el") {
    categoryName_el.nextElementSibling.remove();
  }
});

createbtn_el.addEventListener("click", async (e) => {
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

  if (categoryName_el?.value == "") {
    createErrElAfter(categoryName_el, "category name can not be empty");
    isValid = false;
  }

  if (categoryName_el?.value.length >= 20) {
    createErrElAfter(
      categoryName_el,
      "category name can not be longer than 20"
    );
    isValid = false;
  }

  const hasNumbers = /\d/.test(categoryName_el.value); // d4 digits
  const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(categoryName_el.value); // Checks for special characters
  //  const hasLetters = /[a-zA-Z]/.test(categoryName_el); // Checks for letters
  const isOnlySpaces = /^\s*$/.test(categoryName_el.value); // Checks if only spaces are entered
  if (hasNumbers) {
    createErrElAfter(categoryName_el, "category name cannot be numbers");
    isValid = false;
  }

  if (hasSpecialChars) {
    createErrElAfter(
      categoryName_el,
      "category name cannot includes special char "
    );
    isValid = false;
  }

  if (isOnlySpaces) {
    createErrElAfter(categoryName_el, "category name can not be empty");

    isValid = false;
  }
  if (!isValid) {
    return;
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
    swal.fire("Successfully created category").then(async() => {
     appendToTable(await response.json())
    });
  } else {
    swal.fire("Already added");
  }
});

delebtn_el.forEach((deleteBtns) => {

  deleteBtns.addEventListener("click", async (e) => {
    console.log(deleteBtns);
    
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

        ////////////
        const response = await fetch(
          `/admin/delete-category/${deleteBtns.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

  if (response.ok) {
                const result = await response.json();
    
                // Extract the isActive class dynamically
                const isActiveClass = [...deleteBtns.classList].find((cls) =>
                  cls.startsWith("isActive-")
                );
    
                // Update the badge dynamically
                if (isActiveClass) {
                  const badge = document.querySelector(`.${isActiveClass}`);
                  if (badge) {
                    badge.classList.remove("alert-success", "alert-danger");
                    badge.classList.add(
                      result.isActive ? "alert-success" : "alert-danger"
                    );
                    badge.textContent = result.isActive ? "Active" : "Archive";
                  }  
                }
    
                // Update the button text and class dynamically
                deleteBtns.textContent = result.isActive ? "Delete" : "Activate";
                deleteBtns.classList.toggle("btn-danger", result.isActive);
                deleteBtns.classList.toggle("btn-success", !result.isActive);
    
                Swal.fire("Successful", "The status has been updated.", "success");
        } else {
          console.log("Error occurred while deleting");
        }
      }
///////////////
    });

    // Fetch request to the backend
  });
});

function appendToTable(newCategory) {
  const Tables = document.querySelectorAll('.index');
  const index = Tables.length;

  const table = document.querySelector('.table'); // Your table class

// Attach click event to the newly created button
const deleteBtn = tbody.querySelector('.delete-btn');
deleteBtn.addEventListener('click', async (e) => {
  e.preventDefault();

  Swal.fire({
    title: 'Are you sure?',
    text: "You won't be able to revert this!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, delete it!',
  }).then(async (result) => {
    if (result.isConfirmed) {
      const response = await fetch(`/admin/delete-category/${deleteBtn.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const result = await response.json();

        // Extract the isActive class dynamically
        const isActiveClass = [...deleteBtn.classList].find((cls) =>
          cls.startsWith('isActive-')
        );

        // Update the badge dynamically
        if (isActiveClass) {
          const badge = document.querySelector(`.${isActiveClass}`);
          if (badge) {
            badge.classList.remove('alert-success', 'alert-danger');
            badge.classList.add(
              result.isActive ? 'alert-success' : 'alert-danger'
            );
            badge.textContent = result.isActive ? 'Active' : 'Archive';
          }
        }

        // Update the button text and class dynamically
        deleteBtn.textContent = result.isActive ? 'Delete' : 'Activate';
        deleteBtn.classList.toggle('btn-danger', result.isActive);
        deleteBtn.classList.toggle('btn-success', !result.isActive);

        Swal.fire(
          'Successful',
          'The status has been updated.',
          'success'
        );
      } else {
        console.log('Error occurred while deleting');
      }
    }
    });
  });


  // Create a new tbody
  const tbody = document.createElement('tbody');
  tbody.setAttribute('class', 'index');

  // Create a new row
  const tr = document.createElement('tr');

  // Create columns (cells) and add content
  // Checkbox column
  const tdCheckbox = document.createElement('td');
  tdCheckbox.classList.add('text-center');
  tdCheckbox.innerHTML = `
    <div class="form-check">
      <input class="form-check-input" type="checkbox" value="" />
    </div>
  `;

  // ID column
  const tdID = document.createElement('td');
  tdID.textContent = index + 1;

  // Name column
  const tdName = document.createElement('td');
  tdName.innerHTML = <b>${newCategory.categoryName}</b>;

  // Active status column
  const tdActive = document.createElement('td');
  tdActive.innerHTML = newCategory.isActive
    ? <span class="badge rounded-pill alert-success isActive-${index}">Active</span>
    : <span class="badge rounded-pill alert-danger isActive-${index}">Archive</span>;

  // Edit column
  const tdEdit = document.createElement('td');
  tdEdit.classList.add('text-end');
  tdEdit.innerHTML = `
    <div class="dropdown">
      <a href="/admin/edit-category/${newCategory._id}" class="btn btn-sm font-sm rounded btn-brand">
        <i class="material-icons md-edit"></i> Edit
      </a>
      <button id="${newCategory._id}" class="btn btn-sm font-sm rounded delete-btn isActive-${index}">
        <i class="material-icons md-delete_forever"></i> ${
          newCategory.isActive ? 'Delete' : 'Activate'
        }
      </button>
    </div>
  `;

  // Append all cells to the row
  tr.appendChild(tdCheckbox);
  tr.appendChild(tdID);
  tr.appendChild(tdName);
  tr.appendChild(tdActive);
  tr.appendChild(tdEdit);

  // Append the row to the tbody
  tbody.appendChild(tr);

  // Append the tbody to the table
  table.appendChild(tbody);

  console.log('New row added to the table');

  // Attach click event to the newly created button
  const deleteBtns = tbody.querySelector('.delete-btn');
  deleteBtns.addEventListener('click', async (e) => {
    e.preventDefault();

    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        const response = await fetch(`/admin/delete-category/${deleteBtn.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const result = await response.json();

          // Extract the isActive class dynamically
          const isActiveClass = [...deleteBtn.classList].find((cls) =>
            cls.startsWith('isActive-')
          );

          // Update the badge dynamically
          if (isActiveClass) {
            const badge = document.querySelector(`.${isActiveClass}`);
            if (badge) {
              badge.classList.remove('alert-success', 'alert-danger');
              badge.classList.add(
                result.isActive ? 'alert-success' : 'alert-danger'
              );
              badge.textContent = result.isActive ? 'Active' : 'Archive';
            }
          }

          // Update the button text and class dynamically
          deleteBtn.textContent = result.isActive ? 'Delete' : 'Activate';
          deleteBtn.classList.toggle('btn-danger', result.isActive);
          deleteBtn.classList.toggle('btn-success', !result.isActive);

          Swal.fire(
            'Successful',
            'The status has been updated.',
            'success'
          );
        } else {
          console.log('Error occurred while deleting');
        }
      }
    });
  });
}
