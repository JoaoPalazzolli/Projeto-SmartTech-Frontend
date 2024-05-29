export function refreshToken() {
    const dados = JSON.parse(localStorage.getItem('local'));
    const serverURLRefresh = 'http://localhost:8080/auth/refresh/' + dados.email;

    fetch(serverURLRefresh,
        {
            headers: {
                "Accept": "*/*",
                "Content-Type": "application/json",
                "Authorization": "Bearer " + dados.refreshToken
            },
            method: "PUT"
        })
        .then(function (res) {
            if (res.status == 403 || res.status == 500) {
                window.location.href = 'login.html'
            }
            res.json().then((email, authenticated, created, expiration, accessToken, refreshToken) => {
                console.log(email, authenticated, created, expiration, accessToken, refreshToken);
                localStorage.local = JSON.stringify(email, authenticated, created, expiration, accessToken, refreshToken);
                window.location.reload();
            })
        })
        .catch(function (res) { console.log(res) })
}
