
(() => {

     /**
     * Funcao abre o IndexedDB e cria a tabela para usuario e produto para salvar os dados
     */
    var db;
    function openDb() {
        console.log("openDb ... Products");
        var req = indexedDB.open("petShop", 1);
        req.onsuccess = (evt) => {
            // Better use "this" than "req" to get the result to avoid problems with
            // garbage collection.
            // db = req.result;
            db = req.result;
            console.log("openDb DONE Products");
        };
        req.onerror = (evt) => {
            console.error("openDb:", evt.target.errorCode);
        };

        req.onupgradeneeded = (evt) => {
            console.log("openDb.onupgradeneeded");
            let db = evt.target.result;

            //create ObjectStore to products in the charts
            let objecStoreProducts = db.createObjectStore("items", { keyPath: "productId", autoIncrement: true});

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
     * Funcao recebe as informacoes do produto clicado e adiciona no banco de dados para items, se o item ja tiver no banco de dados
     * aumenta a quantidade de items
     * @param {nome do produto} produtoID 
     * @param {email do comprador} idComprador 
     * @param {quantidade de items} quantidade 
     * @param {preço do produto} precoProduto 
     */
    function addProduct(produtoID, idComprador, quantidade, precoProduto) {
        console.log("addProduct arguments:", arguments);

        let obj = { "productId": (produtoID+" "+idComprador), "productName":produtoID, "userBuying": idComprador, "qnt": quantidade, "preco": precoProduto };
        let store = db.transaction("items", 'readwrite').objectStore("items");

        var request;

        //se o produto ja tiver adicionado pega as informacoes dele do banco 
        request = store.get(produtoID + " " + idComprador);

        request.onsuccess = (evt) => {
            console.log(request.result);
            if (request.result != undefined){
                //pegando as informacoes do produto incrementa a qnt do produto em 1
                let data = request.result
                data.qnt = request.result.qnt + 1;

                let requestUpdate = store.put(data);
                requestUpdate.onsuccess = (evt) => {
                    console.log("Produto atualizado");
                }
            
        
            }else{
                try {//adiciona o novo produto no carrinho 
                    request = store.add(obj);
                } catch (e) {
                    if (e.name == 'DataCloneError')
                        displayActionFailure("This engine doesn't know how to clone a Blob, " +
                            "use Firefox");
                    throw e;
                }
                request.onsuccess = (evt) => {//no sucesso adicionado o produto
                    console.log("Insertion of product in DB successful");

                };
                request.onerror = (evt) => {//se tiver erro para adicionar o novo produto 
                    if (request.error = "DOMException: Key already exists in the object store.") {// verifica se o erro eh porque o produto ja foi adicionado 
                        console.error("produto ja adicionado");


                    }
                };
            }
        }
        request.onerror = (evt) => {
            console.error(requestUpdate.error);            
        }
    }
          
  
    /**
     * Funcao para chamar as chamadas de evento para acontecer na pagina.
     */
    function addEventListeners() {
        console.log("addEventListeners, Products");
        
        $("#orderRacao1").click((evet) => {
            let nomeRacao = document.getElementById("nomeRacao1").innerText;
            let preco = document.getElementById("precoRacao1").innerText;
            let emailUser = document.getElementById("userEmailText").innerText;

            addProduct(nomeRacao, emailUser, 1, preco);

        });

        $("#orderRacao2").click((evet) => {
            let nomeRacao = document.getElementById("nomeRacao2").innerText;
            let preco = document.getElementById("precoRacao2").innerText;
            let emailUser = document.getElementById("userEmailText").innerText;

            addProduct(nomeRacao, emailUser, 1, preco);

        });
        $("#orderRacao3").click((evet) => {
            let nomeRacao = document.getElementById("nomeRacao3").innerText;
            let preco = document.getElementById("precoRacao3").innerText;
            let emailUser = document.getElementById("userEmailText").innerText;

            addProduct(nomeRacao, emailUser, 1, preco);

        });
        $("#orderRacao4").click((evet) => {
            let nomeRacao = document.getElementById("nomeRacao4").innerText;
            let preco = document.getElementById("precoRacao4").innerText;
            let emailUser = document.getElementById("userEmailText").innerText;

            addProduct(nomeRacao, emailUser, 1, preco);

        });
        $("#orderRacao5").click((evet) => {
            let nomeRacao = document.getElementById("nomeRacao5").innerText;
            let preco = document.getElementById("precoRacao5").innerText;
            let emailUser = document.getElementById("userEmailText").innerText;

            addProduct(nomeRacao, emailUser, 1, preco);

        });
        $("#orderRacao6").click((evet) => {
            let nomeRacao = document.getElementById("nomeRacao6").innerText;
            let preco = document.getElementById("precoRacao6").innerText;
            let emailUser = document.getElementById("userEmailText").innerText;

            addProduct(nomeRacao, emailUser, 1, preco);

        });
        $("#orderRacao7").click((evet) => {
            let nomeRacao = document.getElementById("nomeRacao7").innerText;
            let preco = document.getElementById("precoRacao7").innerText;
            let emailUser = document.getElementById("userEmailText").innerText;

            addProduct(nomeRacao, emailUser, 1, preco);

        });
        $("#orderRacao8").click((evet) => {
            let nomeRacao = document.getElementById("nomeRacao8").innerText;
            let preco = document.getElementById("precoRacao8").innerText;
            let emailUser = document.getElementById("userEmailText").innerText;

            addProduct(nomeRacao, emailUser, 1, preco);

        });

    }

    openDb();
    addEventListeners();

})();