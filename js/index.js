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
            db.ler;
            eventos();
        break;
        case botoes[2]:
            container.innerHTML+=`<button onclick='pages();'>Voltar</button><br /><h1>${botoes[2]}</h1><hr />${template[1]}${template[2]}${template[3]}`;
            document.querySelector("input[type=button]").value=botoes[2];
            eventos();
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
                    container.innerHTML+=`<button onclick='pages("${botoes[i]}")'>${botoes[i]}</button>`;
                    i++;
                }
            }
        break;
    }
}
function db(operacao){
    if(operacao == "ler"){
        
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
                
            } else {
                alert("Por favor Preencha os campos corretamente.!");
            }
        }
        if(inptbutton.value == botoes[1]){
            if(confirm(`Receber: ${inptselect.value} X ${inptnumber.value}`)){
                console.log(`Receber: ${inptselect.value} X ${inptnumber.value}`);
                
            }
        } if(inptbutton.value == botoes[2]){
            if(confirm(`Despachar: ${inptselect.value} X ${inptnumber.value}`)){
                console.log(`Despachar: ${inptselect.value} X ${inptnumber.value}`);
                
                
            }
        }
    });
}
pages();