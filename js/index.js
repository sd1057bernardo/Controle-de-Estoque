const template = [
    "<input type='text' placeholder='Digite o nome do novo Produto!'>",
    "<select></select>",
    "<input type='number' min='0' placeholder='0'>",
    "<input type='button' value='Depositar' disabled>",
    "<input type='date'>",

];
const botoes = [
    "Adicionar Novos Produtos",
    "Receber Produtos",
    "Despachar Produtos",
    "Relatorios",
    "Voltar"
];

var container = document.querySelector("#container");
var lastup = document.querySelector("#lastupdates");
var stream = firebase.database();
var sound = new Audio("barcode.wav");
var realtimedb = {
   leitura :  (e) => {
        stream.ref("produtos").on("value", (snapshot) =>{
            document.querySelector("select").innerHTML="";
            data = snapshot.val();
            i=0;
            for(dados of data){
            if(i == 0){a = "selected";} else { a ="";}
            if(e == null && data[i] || e == "despachar" && data[i] && data[i].quantidade > 0){
                document.querySelector("select").innerHTML +=`<option value='${i}:${data[i].nome}:${data[i].quantidade}' ${a}>${data[i].nome}</option>`;
            }
            i++;
            }
        });
    },
    gravar: (e) => {
        var a = 0;
        var b = 0;
        stream.ref("produtos").on("value", (snapshot) =>{
            data = snapshot.val();
            for(dados of data){
                if(!data[a]){
                    a;
                } else {
                    a++;
                }
            }
        });
        stream.ref(`extrato/${tempo().dia}`).on("value", (snapshot) =>{
            data2 = snapshot.val();
            for(dados of data2){
                if(!data2[b]){
                    b;
                } else {
                    b++;
                }
            }
            
        });
        if(!e[0]){
            stream.ref(`produtos/${a}`).set({
                nome : e[1],
                quantidade : e[2]
            });
            
        } else {
            stream.ref(`produtos/${e[0]}`).set({
                nome : e[1],
                quantidade : e[2]
            });
        }
        stream.ref(`extrato/${tempo().dia}/${b}/${tempo().hora}`).set({
            produto : e[1],
            quantidade : e[2],
            status : e[3]
        });
        sound.addEventListener("ended", (e) =>{
            pagina = document.querySelector("input[type=button]").value;
            pages(pagina);
        })
        sound.play();
    },
    relatorio : (e) =>{
        stream.ref(`extrato/${e}`).on("value", (snapshot) =>{
            data = snapshot.val();
            i=0;
            
            if(data && document.querySelector("input[type=date]")){
                document.querySelector("input[type=button]").disabled=false;
            } else {
                if(document.querySelector("input[type=button]")){
                    document.querySelector("input[type=button]").disabled=true;
                }
            }
            lastup.innerHTML="<dl>"
            for(var prop in data){
            var alvo = data[i];
            Object.keys(alvo).forEach( (key, index) => {
                if(alvo[key].status == "Recebido"){
                    lastup.innerHTML+="<dt style='background-color:MediumSeaGreen'>"+e+" > "+alvo[key].status+"</dt>";
                }
                if(alvo[key].status == "Despachado"){
                    lastup.innerHTML+="<dt style='background-color:Orange'>"+e+" > "+alvo[key].status+"</dt>";
                }
                if(alvo[key].status == "Adicionado"){
                    lastup.innerHTML+="<dt style='background-color:DodgerBlue'>"+e+" > "+alvo[key].status+"</dt>";
                }
                lastup.innerHTML+="<dd>"+alvo[key].produto+" X "+alvo[key].quantidade+"</dd>";
            });
                i++;
                
            }
            lastup.innerHTML+="</dl>";
        });
    }
}
function pages(e){
    container.innerHTML="";
    realtimedb.relatorio(tempo().dia);
    switch(e){
        case botoes[0]:
            container.innerHTML+=`<button onclick='pages();'>Voltar</button><br /><h1>${botoes[0]}</h1><hr />${template[0]}${template[2]}${template[3]}`;
            document.querySelector("input[type=button]").value=botoes[0];
            eventos();
            
        break;
        case botoes[1]:
            container.innerHTML+=`<button onclick='pages();'>Voltar</button><br /><h1>${botoes[1]}</h1><hr />${template[1]}${template[2]}${template[3]}`;
            document.querySelector("input[type=button]").value=botoes[1];
            eventos();
            realtimedb.leitura();
            
        break;
        case botoes[2]:
            container.innerHTML+=`<button onclick='pages();'>Voltar</button><br /><h1>${botoes[2]}</h1><hr />${template[1]}${template[2]}${template[3]}`;
            document.querySelector("input[type=button]").value=botoes[2];
            eventos();
            realtimedb.leitura("despachar");
        break;
        case botoes[3]:
            container.innerHTML+=`<button onclick='pages();'>Voltar</button><br /><h1>${botoes[3]}</h1><hr />${template[4]}${template[3]}`;
            document.querySelector("input[type=button]").value=botoes[3];
            eventos();
        break;
        default:
            i=0;
            container.innerHTML+=`<h1>Painel Principal</h1><hr />`;
            for(button of botoes){
                if(botoes[i] !== botoes[4]){
                    container.innerHTML+=`<button onclick="pages('${botoes[i]}')">${botoes[i]}</button>`;
                    i++;
                }
            }
        break;
    }
}
function eventos(){
    var inptselect = document.querySelector("select");
    var inptnumber = document.querySelector("input[type=number]");
    var inptbutton = document.querySelector("input[type=button]");
    var inpttext = document.querySelector("input[type=text]");
    var inptdate = document.querySelector("input[type=date]");
    if(inptnumber){
        this.addEventListener('change', () => {
           if(inptnumber.value > 0){
            inptbutton.disabled = false;
           } else {
            inptbutton.disabled = true;
           }
        });
    }
    if(inptdate){
        inptdate.addEventListener("change", (e) =>{
            realtimedb.relatorio(inptdate.value);
        });
    }
    inptbutton.addEventListener('click', () => {
        if(inptbutton.value == botoes[0] && inpttext){
            if (inpttext.value.length > 8 && confirm(`Cadastrar: ${inpttext.value} X ${inptnumber.value}`)) {
                produto = ["", inpttext.value, inptnumber.value];
                produto[3] = "Adicionado";
                realtimedb.gravar(produto);
                
            } else {
                alert("Por favor Preencha os campos corretamente.!");
            }
        }
        if(inptbutton.value == botoes[1]){
            if(confirm(`Receber: ${inptselect.value} X ${inptnumber.value}`)){
                console.log(`Receber: ${inptselect.value} X ${inptnumber.value}`);
                var produto = inptselect.value.split(":");
                produto[2] = parseInt(produto[2]) + parseInt(inptnumber.value);
                produto[3] = "Recebido";
                realtimedb.gravar(produto);
                
            }
        } if(inptbutton.value == botoes[2]){
            if(confirm(`Despachar: ${inptselect.value} X ${inptnumber.value}`)){
                console.log(`Despachar: ${inptselect.value} X ${inptnumber.value}`);
                var produto = inptselect.value.split(":");
                produto[2] = parseInt(produto[2]) - parseInt(inptnumber.value);
                produto[3] = "Despachado";
                if(produto[2] >= 0){
                    realtimedb.gravar(produto);
                } else {
                    alert("Você não tem essa quantidade em estoque!");
                }
            }
        }
    });
}
function tempo(){
today=new Date(),
h=today.getHours();if(h < 10 ) h = `0${h}`; 
m=today.getMinutes();if(m < 10 )m = `0${m}`; 
s=today.getSeconds();if(s < 10 ) s = `0${s}`; 
d=today.getDate();if(d < 10 ) d = `0${d}`; 
M=today.getMonth()+1;if(M < 10 ) M = `0${M}`; 
y=today.getFullYear(); 
return time ={
    dia: `${y}-${M}-${d}`,
    hora: `${h}-${m}-${s}`

}
}
pages();