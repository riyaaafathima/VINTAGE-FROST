const username_el = getElement("name");

const email_el = getElement("email");

const password_el = getElement("password");

const err_username_el = document.getElementById("err-username");

const err_email_el = document.getElementById("err-email");

const err_password_el = document.getElementById("err-password");

const btn_el = getElement("btn");

console.log(err_email_el, err_password_el, err_username_el);

function getElement(id) {
  return document.getElementById(`${id}`);
}

btn_el.addEventListener("click", async (e) => {
  e.preventDefault();
  const userCredential = {
    username: username_el.value,
    email: email_el.value,
    password: password_el.value,
  };

  let isValid = true;

  if (username_el.value.trim().length == 0) {
    err_username_el.innerHTML = "please fill your  username";
    isValid = false;
  }

  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email_el.value)) {
    err_email_el.innerHTML = "please enter a valid  email";
    isValid = false;
  }

  if (!/[a-z]/.test(password_el.value)) {
    err_password_el.innerHTML='Include at least one lowercase letter.'
    isValid=false
  }

  if (!/[A-Z]/.test(password_el.value)) {
   err_password_el.innerHTML='Include at least one uppercase letter.'
   isValid=false
  }
  
  // Check for at least one digit
  if (!/\d/.test(password_el.value)) {
    err_password_el.innerHTML='Include at least one number.'
    isValid=false
  }
  
  // Check for at least one special character
  if (!/[@$!%*?&]/.test(password_el.value)) {
    err_password_el.innerHTML='Include at least one special character (@, $, !, %, *, ?, &).'
    isValid=false
  }
  
  // Check for minimum length of 6 characters
  if (password_el.value.length < 6) {
    err_password_el.innerHTML='Password must be at least 6 characters long.'
    isValid=false
  }


  if (!isValid) return;

  const response = await fetch("/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userCredential),
  });

  if (response.ok) {
    window.location.href = "/otp-page";
  } else {
    const mssg = await response.json();
    Swal.fire(mssg);

    console.log(mssg);
  }
});

username_el.addEventListener("focus", () => {
  err_username_el.innerHTML = "";
  console.log(err_email_el, "ertyhjukl");
});

email_el.addEventListener("focus", () => {
  err_email_el.innerHTML = "";
});

password_el.addEventListener("focus", () => {
  err_password_el.innerHTML = "";
});
