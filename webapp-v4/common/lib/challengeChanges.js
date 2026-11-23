import {reactive} from 'vue';
import lodash from 'lodash';

const {cloneDeep, isEqual} = lodash;

/**
 * Creates a tracker for detecting whether challenge objects have unsaved changes.
 *
 * The tracker stores a deep-cloned snapshot of each marked challenge and compares
 * the current challenge state against that snapshot when checking for changes.
 * A challenge is considered unsaved when it has no identifier, has not been
 * marked as saved, or differs from its saved snapshot.
 *
 * @return {Object} An object with methods for marking challenges as saved and checking whether they are unsaved.
 */
function createChallengeTracker() {
  const saved = reactive(new WeakMap());

  return {
    markSaved(challenge) {
      saved.set(challenge, cloneDeep(challenge));
    },
    isUnsaved(challenge) {
      return !challenge._id || !saved.has(challenge) || !isEqual(challenge, saved.get(challenge));
    }
  };
}

export {createChallengeTracker};
