/**
 * Mouse button constants
 */
export const mb_left = 0;
export const mb_right = 2;
export const mb_middle = 1;
/**
 * Manages mouse input state
 */
export class MouseManager {
    constructor(canvas) {
        this.buttonsDown = new Set();
        this.buttonsPressed = new Set();
        this.buttonsReleased = new Set();
        // Mouse position in canvas space
        this.x = 0;
        this.y = 0;
        this.canvas = canvas;
        this.setupEventListeners();
    }
    /**
     * Set up mouse event listeners
     */
    setupEventListeners() {
        this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        this.canvas.addEventListener('mousedown', (e) => this.handleMouseDown(e));
        this.canvas.addEventListener('mouseup', (e) => this.handleMouseUp(e));
        // Prevent context menu on right click
        this.canvas.addEventListener('contextmenu', (e) => e.preventDefault());
    }
    /**
     * Handle mouse move event
     */
    handleMouseMove(e) {
        const rect = this.canvas.getBoundingClientRect();
        const scaleX = this.canvas.width / rect.width;
        const scaleY = this.canvas.height / rect.height;
        this.x = (e.clientX - rect.left) * scaleX;
        this.y = (e.clientY - rect.top) * scaleY;
    }
    /**
     * Handle mouse down event
     */
    handleMouseDown(e) {
        const button = e.button;
        if (!this.buttonsDown.has(button)) {
            this.buttonsPressed.add(button);
        }
        this.buttonsDown.add(button);
    }
    /**
     * Handle mouse up event
     */
    handleMouseUp(e) {
        const button = e.button;
        this.buttonsDown.delete(button);
        this.buttonsReleased.add(button);
    }
    /**
     * Check if a mouse button is currently held down
     */
    check(button) {
        return this.buttonsDown.has(button);
    }
    /**
     * Check if a mouse button was just pressed this frame
     */
    checkPressed(button) {
        return this.buttonsPressed.has(button);
    }
    /**
     * Check if a mouse button was just released this frame
     */
    checkReleased(button) {
        return this.buttonsReleased.has(button);
    }
    /**
     * Clear pressed and released states (called at end of frame)
     */
    clearFrameStates() {
        this.buttonsPressed.clear();
        this.buttonsReleased.clear();
    }
}
