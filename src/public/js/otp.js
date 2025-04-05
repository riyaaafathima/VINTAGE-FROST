const otp_el = document.querySelectorAll(".otp-input");
const btn_el = document.getElementById("otp-btn");
const otp_parent_el = document.querySelector(".OTP-inputs");
const resend_otp_el = document.querySelector("#resend-otp");

let resendAttempts = JSON.parse(localStorage.getItem("resendAttempts")) || 3;
//Keeps track of how many times the user can resend the OTP. It’s stored in the browser using localStorage so it’s remembered even if the page is refreshed.
let timerEndTime = JSON.parse(localStorage.getItem("timerEndTime")) || null;   
// Stores the time when the "Resend OTP" button can be clicked again. Also saved in localStorage.

const RESEND_TIMEOUT = 30; //  it wait for 30 seconds to resend


// Initialize on page load
window.onload = () => {
  otp_parent_el.firstElementChild.focus();

  if (!timerEndTime || timerEndTime <= Date.now()) { //Checks if there's no active timer or the timer has ended. 
    // Start a fresh timer if not already running
    timerEndTime = Date.now() + RESEND_TIMEOUT * 1000;
    localStorage.setItem("timerEndTime", JSON.stringify(timerEndTime));
  }
  
  handleResendButtonState(); //Updates the "Resend OTP" button based on the timer and attempts left.
  startTimer();
};

// OTP Input Navigation Logic
for (const [index, el] of Object.entries(otp_parent_el.children)) {
  el.addEventListener("input", (e) => {
    el.value = el.value.slice(0, 1);
    if (el.value.length === 1) {
      Number(index) !== otp_parent_el.children.length - 1 &&
        el.nextElementSibling.focus();
    }
  });

  el.addEventListener("keydown", (e) => {
    setTimeout(() => {
      if (e.key === "Backspace") {
        Number(index) !== 0 && el.previousElementSibling.focus();
      }
    }, 0);
  });
}

// Verify OTP Button Logic
btn_el.addEventListener("click", async (e) => {
  e.preventDefault();
  let inputData = "";

  otp_el.forEach((el) => {
    inputData += el.value;
  });

  const response = await fetch("/otp-page", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ inputData }),
  });

  if (response.ok) {
    window.location.href = "/";
  } else {
    const mssg = await response.json();
    console.log("mess",mssg);
    
    swal.fire(mssg);
  }
});


// Resend OTP Button Logic
resend_otp_el.addEventListener("click", async (e) => {
  e.preventDefault();

  if (resendAttempts > 0) {
    resendAttempts--;
    localStorage.setItem("resendAttempts", JSON.stringify(resendAttempts));
    timerEndTime = Date.now() + RESEND_TIMEOUT * 1000;
    localStorage.setItem("timerEndTime", JSON.stringify(timerEndTime));

    handleResendButtonState();
    startTimer();

    const response = await fetch("/resendotp", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    });

    if (response.ok) {
      swal.fire("OTP sent successfully!");
    } else {
      let mess = response.json()
      console.log("ree",mess);
      
      swal.fire("Error sending OTP.");
    }
  } else {
    swal.fire("No more attempts left.").then(()=>{
      window.location.href="/signup"
    })
  }
});

// Timer Functionality
function startTimer() {
  const timerInterval = setInterval(() => {
    const remainingTime = Math.ceil((timerEndTime - Date.now()) / 1000);

    if (remainingTime > 0) {
      resend_otp_el.textContent = `Resend OTP in ${remainingTime}s`;
      resend_otp_el.style.pointerEvents = "none";
    } else {
      clearInterval(timerInterval);
      resend_otp_el.textContent = "Resend Again";
      resend_otp_el.style.pointerEvents = "auto";
      localStorage.removeItem("timerEndTime");
    }
  }, 500);
}

// Resend Button State Management
function handleResendButtonState() {
  if (resendAttempts <= 0) {
    resend_otp_el.textContent = "No more attempts left";
    resend_otp_el.style.pointerEvents = "none";
  } else if (timerEndTime && timerEndTime > Date.now()) {
    startTimer();
  } else {
    resend_otp_el.textContent = "Resend Again";
    resend_otp_el.style.pointerEvents = "auto";
  }
}

