/**
 * Initialize global input functions
 */
export function initializeInputGlobals(engine) {
    const g = globalThis;
    // ===== Keyboard Functions =====
    g.keyboard_check = function (key) {
        return engine.getKeyboardManager().check(key);
    };
    g.keyboard_check_pressed = function (key) {
        return engine.getKeyboardManager().checkPressed(key);
    };
    g.keyboard_check_released = function (key) {
        return engine.getKeyboardManager().checkReleased(key);
    };
    // ===== Mouse Functions =====
    g.mouse_check_button = function (button) {
        return engine.getMouseManager().check(button);
    };
    g.mouse_check_button_pressed = function (button) {
        return engine.getMouseManager().checkPressed(button);
    };
    g.mouse_check_button_released = function (button) {
        return engine.getMouseManager().checkReleased(button);
    };
    // ===== Mouse Position Variables =====
    Object.defineProperty(g, 'mouse_x', {
        get: () => engine.getMouseManager().x,
        configurable: true,
    });
    Object.defineProperty(g, 'mouse_y', {
        get: () => engine.getMouseManager().y,
        configurable: true,
    });
}
