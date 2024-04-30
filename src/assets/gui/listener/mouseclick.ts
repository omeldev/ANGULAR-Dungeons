import {GameComponent} from "../../../app/components/game/game.component";
import {TitleScreen} from "../../../app/classes/gui/window/title";

export function registerGuiListener() {
  window.addEventListener("click", (event) => {
    if(GameComponent.isPaused){
      TitleScreen.checkButtons(event.clientX, event.clientY);
    }
  });
}
