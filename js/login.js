const form = document.querySelector('form');
const email = document.getElementById('email');
const password = document.getElementById('password');
const submitButton = document.querySelector('button[type="submit"]');

const serverURL = 'http://localhost:8080/auth/login';


form.addEventListener('submit', function (e) {
    e.preventDefault();

    fetch(serverURL,
        {
            headers: {
                "Accept": "*/*",
                "Content-Type": "application/json"
            },
            method: "POST",
            body: JSON.stringify({
                email: email.value,
                password: password.value
            })
        })
        .then(function (res) {
            console.log(res);
            if (res.status >= 200 && res.status <= 299) {
                res.json().then((email, authenticated, created, expiration, accessToken, refreshToken) => {
                  console.log(email, authenticated, created, expiration, accessToken, refreshToken);
                  localStorage.local = JSON.stringify(email, authenticated, created, expiration, accessToken, refreshToken);
                })
                window.location.href = 'index.html'
              }
        })
        .catch(function (res) { console.log(res) })
});

