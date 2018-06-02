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
    /**
     * Funcao recebe dois paramentos de login e ve se o usuario esta cadastrado no banco de dados 
     * @param {email do usuario} email 
     * @param {senha do usuario } senha 
     */
    function login (email, senha){//funcao para fazer login no banco de dados
        console.log("addProduct arguments:", arguments);
        
        let objectStore = db.transaction("users", 'readwrite').objectStore("users");
        let request = objectStore.get(email);

        request.onsuccess = (evt) =>{
            if (request.result != undefined){//se tiver um usuario com o email cadastrado  
                if(request.result.senha == senha){//se tiver a mesma senha
                
                    document.getElementById("minhaConta").style.display = "inline";
                    document.getElementById("entrar").style.display = "none";
                    document.getElementById("cadastrar").style.display = "none";
                    document.getElementById("userName").style.display = "inline";
                    document.getElementById("compras").style.display = "inline";

                    document.getElementById("userEmailText").innerHTML = email;

                    let userNameHTML = document.getElementById("userNameText");
                    userNameHTML.innerText = "Hi, " + request.result.name;
                    changePage("home");
                
                }else{

                    alert("Senha Errado");
                    changePage("login");                    
                }
            }else{
                alert("Email Errado");
                changePage("login");               
            }
        }
    }
    /**
     * Funcao para chamar as chamadas de evento para acontecer na pagina.
     */
    function addEventListeners() {
        console.log("addEventListeners");
        $("#login").click((evt) => {
            let email = document.getElementById("emailLogin").value;
            let senha = document.getElementById("senhaLogin").value;
           
            login(email, senha);          
            changePage("home");
        });

        $("#minhaConta").click((evt) => {

            let userEmail = document.getElementById("userEmailText").innerText;
            getData("users", userEmail);
        });

        $("#orderRacao1").click((evet) => {
            alert("AA")
            let nomeRacao = document.getElementById("nomeRacao1").innerText;
            let preco = document.getElementById("precoRacao1").innerText;
            let emailUser = document.getElementById("userEmailText").innerText;

            addProduct(nomeRacao, nomeUser, 1, preco);

        });

    }

    openDb();
    addEventListeners();

})();