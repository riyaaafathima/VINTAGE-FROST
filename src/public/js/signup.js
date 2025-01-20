const username_el = getElement("name");

const email_el = getElement("email");

const password_el = getElement("password");

const err_username_el = document.getElementById("err-username");

const err_email_el = document.getElementById("err-email");

const err_password_el = document.getElementById("err-password");

const btn_el = getElement("btn");

console.log(err_email_el, err_password_el, err_username_el, "fghjklcvbnm,");

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

  if (username_el.value.length == 0) {
    err_username_el.innerHTML = "please fill your  username";
    isValid = false;
  }

  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email_el.value)) {
    err_email_el.innerHTML = "please enter a valid  email";
    isValid = false;
  }

  if (password_el.value.length < 6) {
    err_password_el.innerHTML = "password must be atleast 6 characters";
    isValid = false;
  }
  // const hasNumbers = /\d/.test(input);
  // const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(input);
  // const hasLetters = /[a-zA-Z]/.test(input);
  // const isOnlySpaces = /^\s*$/.test(input); 

  // if (!/[a-zA-Z]/.test(password_el.value)) {
  //   err_password_el.innerHTML = "special character needed";
  //   isValid = false;
  // }

  // if (/^\s*$/.test(password_el.value)) {
  //   err_password_el.innerHTML = "space not allowed";
  //   isValid = false;   
  // }

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
