class DataBase{

   
    
    constructor(name, version){
        if (!window.indexedDB) {
            window.alert("Your browser doesn't support a stable version of IndexedDB. Such and such feature will not be available.");
        }
        this.dataBaseName = name;
        this.dataBaseVersion = version;
        this.request = window.indexedDB.open(this.dataBaseName, this.dataBaseVersion);

        this.request.onerror = (e) =>{
            console.log("Error to use IndexDB");
        }

        this.request.onsuccess = (event) => {
            this.db = event.target.result;
            console.log("hu");
        }

        this.request.onupgradeneeded = (event) =>{
            let db = event.target.result;

            //create ObjectStore to products in the charts
            let objecStoreProducts = db.createObjectStore("items", {keyPath :"productId"});
            
            objecStoreProducts.createIndex("userBuying", "userBuying", { unique: false });
            objecStoreProducts.createIndex("qnt", "qnt", {unique: false});

            // Use transaction oncomplete to make sure the objectStore creation is 
            // finished before adding data into it.
            objecStoreProducts.transaction.oncomplete = (event) =>{
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
            objecStoreUser.createIndex("senha", "senha", {unique: false});


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

        }

        
    }
    getObjectStore(store_name, mode) {
        var tx = this.db.transaction(store_name, mode);
        return tx.objectStore(store_name);
    }

    addItem(itemName, userBuy, qntItem){
        let obj = { productId: itemName, userBuying: userBuy, qnt: qntItem };
        var tx = this.db.transaction("items", 'readwrite');
        let store = tx.objectStore("items");

        var req;
        try{
            req = store.add(obj);
        } catch(e){
            console.log("ERROR");
            throw e;
        }
        req.onsuccess = (event) =>{
            console.log("Insertion Complete")
        }
        req.onerror = (event) => {
            console.error(this.error);
        }
    }
    addUsuario(nomeU, sobrenomeU, senhaU, emailU){
        let obj = { email: emailU, nome: nomeU, sobrenome: sobrenomeU, senha: senhaU };
        
        let tx = this.db.transaction("users", 'readwrite');
        let store = tx.objectStore("users");

        var req;
        try {
            req = store.add(obj);
        } catch (e) {
            console.log("ERROR");
            throw e;
        }
        req.onsuccess = (event) => {
            console.log("Insertion Complete")
        }
        req.onerror = (event) => {
            alert("aa");
            console.error(this.error);
        }
    }
    removeItem(itemName){
        let store = getObjectStore("items", 'readwrite');
        let req = store.index("productId");

        req.get(itemName).onsuccess = (event) =>{
            if (typeof event.target.result == 'undefined'){
                console.log("Dont find a register with this name");
                return;
            }
            this.remove(itemName, event.target.result.id);
        }
        
    }

    remove(key, store){


        var req = store.get(key);
        req.onupgradeneeded = (event) => {
            let record = event.target.result;
            console.log("Record:", record);
            if(typeof record  == 'undefined'){
                console.log("no match found!");
                return;
            }

            req = store.delete(key);
            req.onsuccess = (event) =>{
                console.log("evt:", evt);
                console.log("delete sucessfull");
            } 
            req.onerror = (event) =>{
                console.error("error to delete the key");
            }
        }
        req.onerror = (event) =>{
            console.error("Error to find the key");
        }
    }
}
function changePage(page) {
    $("#main").load(page + ".html");
}


function cadastraUsuario(){
    changePage("register");
    
    let firstName = document.getElementById("first_name").value;
    let lastName = document.getElementById("last_name").value;
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    let passwordConfirmation = document.getElementById("password_confirmation").value;
    console.log(password, passwordConfirmation);

    meuBanco = new DataBase("petShop", 1);
    meuBanco.addUsuario(firstName, lastName, password, email);
    
}


$(document).ready(() => {
    var meuBanco = new DataBase("petShop", 1);
    $("#novoUsuario").trigger(() => {
        alert("AA");
        
        changePage("register");
        let firstName = document.getElementById("first_name").value;
        let lastName = document.getElementById("last_name").value;
        let email = document.getElementById("email").value;
        let password = document.getElementById("password").value;
        let passwordConfirmation = document.getElementById("password_confirmation").value;
        console.log(password, passwordConfirmation);

        
        meuBanco.addUsuario(firstName, lastName, password, email);

        
    });
});


    

