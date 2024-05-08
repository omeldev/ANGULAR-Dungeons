import {GameComponent} from "../../../app/components/game/game.component";
import {TitleScreen} from "../../../app/classes/gui/window/title";
import {Mobile} from "../../../app/classes/gui/window/mobile";

export function registerGuiListener() {
  window.addEventListener("click", (event) => {
    if (GameComponent.isTitleScreen) {
      TitleScreen.checkButtons(event.clientX, event.clientY);
    }

    if (GameComponent.isMobile) {
      Mobile.checkButtons(event.clientX, event.clientY);
    }


  });
}
