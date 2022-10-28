
let pagBusca=document.getElementById("pagBusca"),
    pagLogin=document.getElementById("wrapper")
    inEmail=document.getElementById("inEmail"),
    inSenha=document.getElementById("inSenha"),
    butEntrar=document.getElementById("butEntrar"),
    teste=document.getElementById("teste"),
    indErro=document.getElementById("indErro"),
    butBusca=document.getElementById("butBusca"),
    token=localStorage.getItem("token"),
    inDigimon=document.getElementById("inDigimon"),
    ansView=document.getElementById("ansView");
if (token==null||token==""){
    pagBusca.style.display="none";
    pagLogin.style.display="block";
}
else{
    pagLogin.style.display="none";
    pagBusca.style.display="block";
}
function carXml (metodo,url,dado){
    let x;
    let minhaPromessa = new Promise(function(valor){ 
    var xmlhttp=new XMLHttpRequest();
    xmlhttp.open(metodo,url,true);
    if(metodo=='POST')
        xmlhttp.setRequestHeader("Content-Type","application/json");
    xmlhttp.onreadystatechange=function(){
        if(xmlhttp.readyState==4 && xmlhttp.status==200)
            valor(xmlhttp.responseText);
        else if(xmlhttp.readyState==4)
            valor("ERROR: "+xmlhttp.status);
    }
    xmlhttp.send(dado);
});
x=minhaPromessa;
return x;
}
butEntrar.addEventListener('click', ()=>{
        if(inEmail.value.length<4||inSenha.value.length<4){
            indErro.innerHTML="Preencher os campos corretamente.";
            indErro.style.display="block";
            inEmail.style.border="2px solid red";
            inSenha.style.border="2px solid red";
        }
        else{
            indErro.style.display="none";
            inEmail.style.border="1px solid #dddfe2";
            inSenha.style.border="1px solid #dddfe2";
            let logJson={email: inEmail.value,
                    password: inSenha.value},
                inTexto=JSON.stringify(logJson);
            async function vai(){
                let resp= await carXml("POST", "https://reqres.in/api/login",inTexto);
                if(resp=="ERROR: 400"){
                    indErro.innerHTML="Email ou senha incorreto, por favor tente novamente!!!";
                    indErro.style.display="block";
                    inEmail.value="";
                    inSenha.value="";
                    inEmail.style.border="2px solid red";
                    inSenha.style.border="2px solid red";
                    inEmail.onfocus;
                }
                else{
                    tResp=JSON.parse(resp);
                    localStorage.setItem("token", tResp.token);
                    pagLogin.style.display="none";
                    pagBusca.style.display="block";
                    inEmail.value="";
                    inSenha.value="";
                }
            }
            vai();
        }
});
butBusca.addEventListener('click', ()=>{
    token=localStorage.getItem("token");
    if (token==null||token==""){
        alert("Necessário estar logado para realizar a busca!");
        inDigimon.value="";
        pagBusca.style.display="none";
        pagLogin.style.display="block";
    }
    else{
        if (inDigimon.value==""){
            inDigimon.style.border="2px solid red";
            alert("Favor escolher um Level (NÍVEL) de Digimon!");
        }
        else{
            inDigimon.style.border="#7ba7e9";
            let endereco="https://digimon-api.vercel.app/api/digimon/level/"+inDigimon.value;
            async function vamos(){
            let chegou= await carXml('GET',endereco,null),
                digAns=JSON.parse(chegou);
                while(ansView.hasChildNodes()){
                    ansView.removeChild(ansView.firstChild);
                }
                let digImg=[],
                    digPar=[],
                    digDiv=[];
            for (let i = 0; i < digAns.length; i++) {
                digImg[i]=document.createElement("img");
                digPar[i]=document.createElement("p");
                digDiv[i]=document.createElement("div");
                digImg[i].setAttribute("src",digAns[i].img);
                digPar[i].innerHTML=digAns[i].name;
                digDiv[i].appendChild(digImg[i]);
                digDiv[i].appendChild(digPar[i]);
                digDiv[i].setAttribute("style","border-radius: 10px;box-shadow: #7ba7e9 4px 4px 8px;padding:10px;margin:20px;justify-content:center;align-content:center;");
                digImg[i].setAttribute("style","width:250px;");
                digPar[i].setAttribute("style","font-size:20px; font-weight: bold;color: #1877f2;text-align:center");  
            }
            for (let i = 0; i < digAns.length; i++) {
                ansView.appendChild(digDiv[i]);
            }
        }
        vamos();
        }
    }
    
}); 
butSair.addEventListener('click', ()=>{
    localStorage.clear();
    pagBusca.style.display="none";
    pagLogin.style.display="block";
    inDigimon.value="";
    while(ansView.hasChildNodes()){
        ansView.removeChild(ansView.firstChild);
    }
}) 

