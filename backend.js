const fname = document.querySelector("#fname");
const lname = document.querySelector("#lname");
const email = document.querySelector("#email");
const pass1 = document.querySelector("#pass");
const pass2 = document.querySelector("#pass2");
const error = document.querySelector("#error");
const registerBtn = document.querySelector("#registerButton");

if (localStorage.myAccount !== undefined) {
  const myAccount = JSON.parse(localStorage.myAccount);
  fname.value = myAccount.first_name;
  lname.value = myAccount.last_name;
  email.value = myAccount.email;
}

const emailRegex =
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const errorMsg = {
  fnameEmpty: "First name is required",
  lnameEmpty: "Last name is required",
  invalidEmail: "Invalid e-mail address.",
  emailEmpty: "Password must be at least 8 characters",
  noMatchPass: "Password do not match",
  genericError: "Whoops. Something went wrong",
};

function handlerError(msg) {
  error.innerText = msg;
  error.style.color = "red";
  setTimeout(() => {
    error.innerText = "";
  }, 3000);
}

registerBtn.addEventListener("click", () => {
  if (fname.value === "") {
    error.innerText = errorMsg.fnameEmpty;
    return;
  }
  if (lname.value === "") {
    handlerError(errorMsg.lnameEmpty);
    return;
  }
  if (email.value === "") {
    handlerError(errorMsg.emailEmpty);
    return;
  }
  if (pass1.value < 8 || pass2 < 8) {
    handlerError(errorMsg.shortPass);
    return;
  }
  if (pass1.value !== pass2.value) {
    handlerError(errorMsg.noMatchPass);
    return;
  }
  if (emailRegex.test(email.value) === false) {
    handlerError(errorMsg.invalidEmail);
    return;
  }

  const requestBody = {
    first_name: fname.value.trim(),
    last_name: lname.value.trim(),
    email: email.value.trim(),
    password: pass1.value.trim(),
  };

  fetch("https://backend-curs.herokuapp.com/users/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
  })
    .then((res) => res.json())
    .then((json) => {
      if (json.message !== undefined) {
        handlerError(json.message);
      } else {
        console.log(JSON.stringify(json));
        //
        localStorage.setItem("myAccount", JSON.stringify(json));
        // dam refresh la pagina
        window.location.reload();
      }
    });
});
