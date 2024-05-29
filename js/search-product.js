import { getProducts } from "./get-products.js";

const productName = document.getElementById("searchProduct");
const serverURL = `http://localhost:8080/api/v1/product/findProductByName`;
const dados = JSON.parse(localStorage.getItem('local'));
const tbody = document.querySelector("#tableProduct>tbody");

// um pouco de delay, precisa melhorar

productName.addEventListener('keypress', () => {

    if(productName.value == ""){
        tbody.innerHTML = "";
        getProducts();
    } else{
        fetch(serverURL + `/${productName.value}?size=10`,
        {
            headers: {
                "Accept": "*/*",
                "Content-Type": "application/json",
                "Authorization": "Bearer " + dados.accessToken
            },
            method: "GET"
        })
        .then(function (res) {
            console.log(res)
    
            res.json().then((produtos) => {
                tbody.innerHTML = "";
                if(produtos._embedded == null){
                    tbody.innerHTML = '<p class="product_not_found">Nenhum Produto Encontrado...</p>';
                }

                produtos._embedded.produtoVOList.map(x => {
                    

                    const newRow = document.createElement("tr");
                    let imageTipo = "";
                    
                    if(x.tipo == "BEBIDA"){
                        imageTipo = "./products-img/drink.png";
                    } else if(x.tipo == "LIMPEZA"){
                        imageTipo = "./products-img/clean.png";
                    } else{
                        imageTipo = "./products-img/food.png";
                    }
    
                    newRow.innerHTML = `
                        <td><img src="${imageTipo}" class="image-edit"></td>
                        <td>${x.id}</td>
                        <td>${x.nomeProduto}</td>
                        <td>${x.descricao}</td>
                        <td>${x.quantidade}</td>
                        <td>${x.dataValidadeFormatter}</td>
                        <td>${x.lembreteFormatter}</td>
                        <td>
                            <a href="./edit-produto.html?id=${x.id}" class="image-edit"><img src="./products-img/Edit.png" alt="Edit"></a>
                            <button class="image-delete"><img id="delete-${x.id}" src="./products-img/Delete.png" alt="Delete"></img></button>
                        </td>
                        `;
    
                        tbody.appendChild(newRow);
                });
            })
    
        })
        .catch(function (res) { console.log(res) })
    }
    
})