const template = [
    "<input type='text' placeholder='Digite o nome do novo Produto!'>",
    "<select></select>",
    "<input type='number' min='0' placeholder='0'>",
    "<input type='button' value='Depositar' disabled>"
];
const botoes = [
    "Adicionar Novos Produtos",
    "Receber Produtos",
    "Despachar Produtos",
    "Relatorios",
    "Voltar"
];

var container = document.querySelector("#container");
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
        if(e[0] == "" ){
            stream.ref("produtos/"+a).set({
                nome : e[1],
                quantidade : e[2]
            });
        } else {
            stream.ref("produtos/"+e[0]).set({
                nome : e[1],
                quantidade : e[2]
            });
        }
        sound.addEventListener("ended", (e) =>{
            pagina = document.querySelector("input[type=button]").value;
            pages(pagina);
        })
        sound.play();
    },
    relatorio : () =>{}
}
function pages(e){
    container.innerHTML="";
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
            container.innerHTML+=`<button onclick='pages();'>Voltar</button><br /><h1>${botoes[3]}</h1><hr />${template[1]}${template[2]}${template[3]}`;
            document.querySelector("input[type=button]").value=botoes[3];
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
    if(inptnumber){
        this.addEventListener('change', () => {
           if(inptnumber.value > 0){
            inptbutton.disabled = false;
           } else {
            inptbutton.disabled = true;
           }
        });
    }
    inptbutton.addEventListener('click', () => {
        if(inptbutton.value == botoes[0] && inpttext){
            if (inpttext.value.length > 8 && confirm(`Cadastrar: ${inpttext.value} X ${inptnumber.value}`)) {
                produto = ["", inpttext.value, inptnumber.value];
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
                realtimedb.gravar(produto);
                
            }
        } if(inptbutton.value == botoes[2]){
            if(confirm(`Despachar: ${inptselect.value} X ${inptnumber.value}`)){
                console.log(`Despachar: ${inptselect.value} X ${inptnumber.value}`);
                var produto = inptselect.value.split(":");
                produto[2] = parseInt(produto[2]) - parseInt(inptnumber.value);
                if(produto[2] >= 0){
                    realtimedb.gravar(produto);
                } else {
                    alert("Você não tem essa quantidade em estoque!");
                }
            }
        }
    });
    return ;
}
pages();