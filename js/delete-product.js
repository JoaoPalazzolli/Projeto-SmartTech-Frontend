import { refreshToken } from "./refresh.js";

const dados = JSON.parse(localStorage.getItem('local'));

const serverURL = 'http://localhost:8080/api/v1/product';

export function deleteProduct(id) {
    fetch(serverURL + `/${id}`,
        {
            headers: {
                "Authorization": "Bearer " + dados.accessToken
            },
            method: "DELETE",
        })
        .then(function (res) {
            console.log(res)
            if (res.status >= 200 && res.status <= 299) {
                window.location.href = 'index.html'
            }
            if (res.status == 403) {
                refreshToken();
            }
        })
        .catch(function (res) { console.log(res) })
}