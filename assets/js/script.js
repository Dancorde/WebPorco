
(() =>{
   
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
            let objecStoreUser = db.createObjectStore("users", { keyPath: "email" });

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

    function addProduct(produtoID, idComprador, quantidade, precoProduto){
        console.log("addProduct arguments:", arguments);

        let obj = {productId: produtoID, userBuying: idComprador, id: quantidade, preco: precoProduto};
        let store = db.transaction("users", 'readwrite').objectStore("users");
        
        var request

        try {
            request = store.add(obj);
        } catch (e) {
            if (e.name == 'DataCloneError')
                displayActionFailure("This engine doesn't know how to clone a Blob, " +
                    "use Firefox");
            throw e;
        }
        request.onsuccess = (evt) => {
            console.log("Insertion of product in DB successful");

        };
        request.onerror = (evt) => {
            console.error("addProduct error", this.error);

        };

    }


    function addUser(nomeU, sobrenomeU, senhaU, emailU) {
        console.log("addUser arguments:", arguments);
        let obj = { "email": emailU, "name": nomeU, "sobrenome": sobrenomeU, "senha": senhaU };
        let store = db.transaction("users", 'readwrite').objectStore("users");

        var request;
        try {
            request = store.add(obj);
        } catch (e) {
            if (e.name == 'DataCloneError')
                displayActionFailure("This engine doesn't know how to clone a Blob, " +
                    "use Firefox");
            throw e;
        }
        request.onsuccess = (evt) => {
            console.log("Insertion of user in DB successful");

        };
        request.onerror = (evt) => {
            console.error("addUser error", this.error);

        };
        

    }
    /**
     * recebe a tabela a e o id do usuario e busca no banco de dados as informacoes e display na tela
     * @param {TABALE PARA PEGAR DADOS} table 
     * @param {IDE PARA BUSCAR NA TABELA} id 
     */
    function getData(table, id){
        let objectStore = db.transaction(table, 'readwrite').objectStore(table);
        let request = objectStore.get(id);
        var ret
        request.onerror = (evt) => {
            console.error(this.error);
            return 0;
        }
        request.onsuccess = (evt) => {
            console.log(request.result);
            console.log(document.getElementById("userNameInfo"));
            
            document.getElementById("userNameInfo").innerText = request.result.nome;
            document.getElementById("userSobrenome").innerText = request.result.sobrenome;
            document.getElementById("email").innerText = request.result.email;
            
            
        }
        return ret;
    }
    /**
     * Funcao para chamar as chamadas de evento para acontecer na pagina.
     */
    function addEventListeners(){
        console.log("addEventListeners");
        $("#novoUsuario").click( (evt) =>{
            let firstName = document.getElementById("first_name").value;
            let lastName = document.getElementById("last_name").value;
            let email = document.getElementById("email").value;
            let password = document.getElementById("password").value;
            let passwordConfirmation = document.getElementById("password_confirmation").value;
            let id = Math.random() * 100 ; 
            console.log(password, passwordConfirmation);


            addUser(firstName, lastName, password, email);
            document.getElementById("minhaConta").style.display = "inline";
            document.getElementById("entrar").style.display = "none";
            document.getElementById("cadastrar").style.display = "none";
            document.getElementById("userName").style.display = "inline";
            document.getElementById("compras").style.display = "inline";
                        
            document.getElementById("userEmailText").innerHTML = email;

            let userNameHTML= document.getElementById("userNameText");
            userNameHTML.innerText = "Hi, " + firstName;
            
            
            changePage("home");        
        });

        $("#minhaConta").click( (evt) => {
            
            let userEmail = document.getElementById("userEmailText").innerText;
            getData("users", userEmail);  
        });
        
        $("#orderRacao1").click( (evet) => {
            alert("AA")
            let nomeRacao = document.getElementById("nomeRacao1").innerText;
            let preco = document.getElementById("precoRacao1").innerText;
            let emailUser = document.getElementById("userEmailText").innerText;
            
            addProduct(nomeRacao ,nomeUser, 1, preco);

        });

    }
    
    openDb();
    addEventListeners();

})();