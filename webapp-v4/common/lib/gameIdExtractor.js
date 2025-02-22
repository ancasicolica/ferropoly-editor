/**
 * Extracts the Game ID from an URL of a page
 * Christian Kuster, CH-8342 Wernetshausen, christian@kusti.ch
 * Created: 22.02.2025
 **/

import {onBeforeMount, ref} from 'vue';
import {last, split} from 'lodash';

export function gameIdExtractor() {
  const gameId = ref('');

  onBeforeMount(() => {
    console.log('onBeforeMount extractor');
    const elements = split(window.location.pathname, '/');
    gameId.value   = last(elements);
    console.log(`GameId: ${gameId.value}`);
  })

  return {gameId};
}

