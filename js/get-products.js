import { deleteProduct } from './delete-product.js';
import { refreshToken } from "./refresh.js";

getProducts();

export function getProducts() {

    const modal = document.getElementById("deleteModal");
    const closeModal = document.querySelector(".modal .close");
    const confirmDelete = document.getElementById("confirmDelete");
    const cancelDelete = document.getElementById("cancelDelete");
    const tbody = document.querySelector("#tableProduct>tbody");
    const dados = JSON.parse(localStorage.getItem('local'));
    const sortSelect = document.getElementById("sortSelect");
    const serverURL = `http://localhost:8080/api/v1/product?size=6`;
    const btnPrevPage = document.getElementById("prevPage");
    const btnNextPage = document.getElementById("nextPage");
    const pageNumber = document.getElementById("pageNumber");

    let nextPageURL;
    let prevPageURL;
    let action;
    let id;
    let newURL;

    if(sortSelect.value == "#"){
        buscarAPI(serverURL);
    }

    sortSelect.addEventListener('click', () => {
        newURL = serverURL;
        newURL = serverURL + `&orderBy=${sortSelect.value}&direction=asc`;

        buscarAPI(newURL);
    })

    btnNextPage.addEventListener('click', () => {
        if(nextPageURL != null){
            newURL = nextPageURL;
            buscarAPI(newURL);
        }
    });

    btnPrevPage.addEventListener('click', () => {
        if(prevPageURL != null){
            newURL = prevPageURL;
            buscarAPI(newURL);
        }
    });

    function buscarAPI(getURL) {
        fetch(getURL,
            {
                headers: {
                    "Accept": "*/*",
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + dados.accessToken
                },
                method: "GET"
            })
            .then(function (res) {
                tbody.innerHTML = "";
                console.log(res)
                if (res.status == 403) {
                    refreshToken();
                }
    
                res.json().then((produtos) => {
                    produtos._embedded.produtoVOList.map(x => {
                        const newRow = document.createElement("tr");
                        let imageTipo = "";
    
                        if (x.tipo == "BEBIDA") {
                            imageTipo = "./products-img/drink.png";
                        } else if (x.tipo == "LIMPEZA") {
                            imageTipo = "./products-img/clean.png";
                        } else {
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
                                    <button class="image-delete"><img class="excluir" id="delete-${x.id}" src="./products-img/Delete.png" alt="Delete"></img></button>
                                </td>
                                `;
    
                        tbody.appendChild(newRow);

                        let links = produtos._links;
                        
                        if(links.prev != null){
                            prevPageURL = JSON.stringify(links.prev.href).replaceAll('"', '');
                        }

                        if(links.next != null){
                            nextPageURL = JSON.stringify(links.next.href).replaceAll('"', '');
                        }

                        pageNumber.innerHTML = produtos.page.number + 1;
                    });
                })
    
            })
            
            .catch(function (res) { console.log(res) })
    
        tbody.addEventListener('click', (event) => {
            const target = event.target;
            if (target.classList.contains('excluir')) {
                [action, id] = target.id.split("-");
                modal.style.display = "flex";
            }
        });
    
        closeModal.onclick = () => {
            modal.style.display = "none";
        };
    
        cancelDelete.onclick = () => {
            modal.style.display = "none";
        };
    
        confirmDelete.onclick = () => {
            if (action === "delete") {
                deleteProduct(id);
            }
        };
    
        window.onclick = (event) => {
            if (event.target === modal) {
                modal.style.display = "none";
            }
        };
    } 
} 