
  function changePage(page) {
    $("#main").load(page + ".html");
    $("#main").load(page + ".html");
  }    

(() => {

    
    var db;
     /**
     * Funcao abre o IndexedDB e cria a tabela para usuario e produto para salvar os dados
     */
    function openDb() {
        console.log("openDb ...");
        var req = indexedDB.open("petShop", 1);
        req.onsuccess = (evt) => {
            // Better use "this" than "req" to get the result to avoid problems with
            // garbage collection.
            // db = req.result;
            db = req.result;
            console.log("openDb DONE");
        };
        req.onerror = (evt) => {
            console.error("openDb:", evt.target.errorCode);
        };

        req.onupgradeneeded = (evt) => {
            console.log("openDb.onupgradeneeded");
            let db = evt.target.result;

            //create ObjectStore to products in the charts
            let objecStoreProducts = db.createObjectStore("items", { keyPath: "productId", autoIncrement: true });

            objecStoreProducts.createIndex("productName", "productName", { unique: false });
            objecStoreProducts.createIndex("userBuying", "userBuying", { unique: false });
            objecStoreProducts.createIndex("qnt", "qnt", { unique: false });
            objecStoreProducts.createIndex("preco", "preco", { unique: false });


            // Use transaction oncomplete to make sure the objectStore creation is 
            // finished before adding data into it.
            objecStoreProducts.transaction.oncomplete = (event) => {
                //Store values in the newly created objectStore.
                //    var customerObjectStore = db.transaction("customers", "readwrite").objectStore("customers");
                //    customerData.forEach(function (customer) {
                //        customerObjectStore.add(customer);
                //    });
                console.log("banco criado para produtos");
            };

            //create ObjectStore to users
            let objecStoreUser = db.createObjectStore("users", { keyPath: "email", autoIncrement: true });

            objecStoreUser.createIndex("name", "name", { unique: false });
            objecStoreUser.createIndex("sobrenome", "sobrenome", { unique: false });
            objecStoreUser.createIndex("senha", "senha", { unique: false });


            // Use transaction oncomplete to make sure the objectStore creation is 
            // finished before adding data into it.
            objecStoreUser.transaction.oncomplete = (event) => {
                //Store values in the newly created objectStore.
                //    var customerObjectStore = db.transaction("customers", "readwrite").objectStore("customers");
                //    customerData.forEach(function (customer) {
                //        customerObjectStore.add(customer);
                //    });
                console.log("banco criado para usuarios");
            };

        };
    }

    
    /**
     * Funcao pega os dados de items no banco de dados e mostra na tela, para saber se o produto que esta no banco de dados eh do certo usuario utiliza
     * o email e o nome dele
     * @param {email do usuario} emailUser 
     */
    function mostraCarrinho(emailUser) {

        
        let objectStore = db.transaction("items", 'readwrite').objectStore("items");
        let valorTotal = 0;
        let index = objectStore.index("userBuying");
        index.openCursor().onsuccess = (event) => {
            let data = event.target.result;
            if (data) {
                console.log(data.value);
                
                if(data.value.userBuying == emailUser){
                    let productNumber = data.value.productName.split(" ")[1];
                    console.log("")
                    document.getElementById("product" + productNumber).style.display = "inline";
                    document.getElementById("product" + productNumber + "Name").innerHTML = data.value.productName;
                    document.getElementById("priceProduct" + productNumber).innerHTML = data.value.preco;
                    let valor = data.value.preco.split("");
                    document.getElementById("totalPriceProduct" + productNumber).innerHTML = parseInt(valor.slice(2, valor.length).join("")) * parseInt(data.value.qnt);
                    document.getElementById("productQnt" + productNumber).value = data.value.qnt;

                    valorTotal += parseInt(valor.slice(2, valor.length).join("")) * parseInt(data.value.qnt);

                    data.continue();
                }
                
            }
            document.getElementById("precoFinal").interHTML = "<strong> Total" + valorTotal + "</strong>";
        }
        
        
    }

    function addEventListeners() {
        console.log("addEventListeners");
        let emailUser = document.getElementById("userEmailText").innerText;
        console.log("Email USer", emailUser);
        
        setTimeout(() => {
            mostraCarrinho(emailUser);

        }, 100);

        $("#home").click((evt) => {
            changePage("home");
        });
        
    }

    openDb();
    addEventListeners();
    

})();