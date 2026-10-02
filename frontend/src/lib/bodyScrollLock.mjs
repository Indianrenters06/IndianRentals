// Overlapping menus/dialogs share one lock; closing either cannot unlock the other.
const locks = new WeakMap();

export function lockBodyScroll(body = document.body) {
    let state = locks.get(body);
    if (!state) {
        state = { count: 0, previous: body.style.overflow };
        locks.set(body, state);
    }
    state.count += 1;
    body.style.overflow = 'hidden';
    let released = false;
    return () => {
        if (released) return;
        released = true;
        if (--state.count === 0) {
            body.style.overflow = state.previous;
            locks.delete(body);
        }
    };
}
