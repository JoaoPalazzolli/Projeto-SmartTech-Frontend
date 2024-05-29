const form = document.querySelector('form');
const fullName = document.getElementById('allname');
const cpf = document.getElementById('cpf');
const email = document.getElementById('email');
const password = document.getElementById('password');
const confirmPassword = document.getElementById('confirmPassword');
const phone = document.getElementById('number');
const genderInputs = document.querySelectorAll('input[name="gender"]');
const submitButton = document.querySelector('button[type="submit"]');

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^\d{10}$/;
const serverURL = 'http://localhost:8080/auth/register';

form.addEventListener("submit", function (e) {
  e.preventDefault();
  if (checkRequired([fullName, email, phone, password, confirmPassword]) &&
    checkLength(fullName, 2, 30) &&
    checkLength(email, 5, 50) &&
    checkEmail(email) &&
    checkLength(phone, 10, 10) &&
    checkPhone(phone) &&
    checkLength(password, 8, 20) &&
    checkPasswordsMatch(password, confirmPassword)) {

    const formData = new FormData(form);
    let gender = '';
    genderInputs.forEach(function (input) {
      if (input.checked) {
        gender = input.value;
      }
    });
    formData.append('gender', gender);
  }
  cadastrar(form);
  limpar();
});

function cadastrar(form) {
  fetch(serverURL,
    {
      headers: {
        "Accept": "*/*",
        "Content-Type": "application/json"
      },
      method: "POST",
      body: JSON.stringify({
        fullName: fullName.value,
        cpf: cpf.value,
        email: email.value,
        password: password.value,
        phoneNumber: phone.value,
        gender: form.gender.value
      })
    })
    .then(function (res) {
      console.log(res)
      if (res.status >= 200 && res.status <= 299) {
        res.json().then((email, authenticated, created, expiration, accessToken, refreshToken) => {
          console.log(email, authenticated, created, expiration, accessToken, refreshToken);
          localStorage.local = JSON.stringify(email, authenticated, created, expiration, accessToken, refreshToken);
        })
        window.location.href = 'index.html';
      }
    })
    .catch(function (res) { console.log(res) })
};

function limpar() {
  fullName.value = "";
  cpf.value = "";
  email.value = "";
  password.value = "";
  confirmPassword.value = "";
  phone.value = "";
  genderInputs.value = "";
};

function showError(input, message) {
  const formControl = input.parentElement;
  const errorElement = formControl.querySelector('small');
  errorElement.innerText = message;
  formControl.classList.add('error');
}

function showSuccess(input) {
  const formControl = input.parentElement;
  formControl.classList.remove('error');
}

function checkRequired(inputArray) {
  let isRequired = false;
  inputArray.forEach(function (input) {
    if (input.value.trim() === '') {
      showError(input, `${getFieldName(input)} é obrigatório.`);
      isRequired = true;
    } else {
      showSuccess(input);
    }
  });
  if (isRequired) {
    return false;
  } else {
    return true;
  }
}

function checkLength(input, min, max) {
  if (input.value.length < min) {
    showError(input, `${getFieldName(input)} deve ter pelo menos ${min} caracteres.`);
  } else if (input.value.length > max) {
    showError(input, `${getFieldName(input)} deve ter no máximo ${max} caracteres.`);
  } else {
    showSuccess(input);
  }
}

function checkEmail(input) {
  if (emailRegex.test(input.value.trim())) {
    showSuccess(input);
  } else {
    showError(input, 'E-mail inválido');
  }
}

function checkPhone(input) {
  if (phoneRegex.test(input.value.trim())) {
    showSuccess(input);
  } else {
    showError(input, 'Número de telefone inválido');
  }
}

function checkPasswordsMatch(password, confirmPassword) {
  if (password.value !== confirmPassword.value) {
    showError(confirmPassword, 'As senhas não coincidem');
  } else {
    showSuccess(confirmPassword);
  }
}

function getFieldName(input) {
  return input.previousElementSibling.innerText;
}
