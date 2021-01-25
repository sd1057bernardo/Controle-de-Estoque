const template = [
    "<input type='text' placeholder='Digite o nome do novo Produto!'>",
    "<select></select>",
    "<input type='number' min='0' placeholder='0'>",
    "<input type='button' value='Depositar' disable='true'>"
];
const botoes = [
    "Adicionar Novos Produtos",
    "Receber Produtos",
    "Despachar Produtos",
    "Relatorios",
    "Voltar"
]
var container = document.querySelector("#container");
function pages(e){
    container.innerHTML="";
    switch(e){
        case botoes[0]:
            container.innerHTML+=`<h1>${botoes[0]}</h1><hr />${template[0]}${template[2]}${template[3]}`;
            document.querySelector("input[type=button]").value=botoes[0];
        break;
        case botoes[1]:
            container.innerHTML+=`<h1>${botoes[1]}</h1><hr />${template[1]}${template[2]}${template[3]}`;
            document.querySelector("input[type=button]").value=botoes[1];
        break;
        case botoes[2]:
            container.innerHTML+=`<h1>${botoes[2]}</h1><hr />${template[1]}${template[2]}${template[3]}`;
            document.querySelector("input[type=button]").value=botoes[2];
        break;
        case botoes[3]:
            container.innerHTML+=`<h1>${botoes[3]}</h1><hr />${template[1]}${template[2]}${template[3]}`;
            document.querySelector("input[type=button]").value=botoes[3];
        break;
        default:
            i=0;
            for(button of botoes){
                if(botoes[i] !== botoes[4]){
                    container.innerHTML+=`${template[3]}`;
                    var btn = document.querySelectorAll("input[type=button]");
                    btn[i].value=botoes[i];
                    i++;
                }
            }
        break;
    }
}
pages();