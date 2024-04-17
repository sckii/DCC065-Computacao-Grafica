import {  InfoBox } from "../../libs/util/util.js";


function GameOver(tankColor){
    
    console.log("O tanque da cor " + tankColor + " perdeu!");

    // let str = "O tanque da cor " + tankColor + " perdeu!"; //não consegui deixar o fundo preto
    // var vencedor = new InfoBox();
    // vencedor.add(str);
    // vencedor.show();

    location.reload();


}

export default GameOver;
