/**
 * Manages rendering to the canvas
 */
export class Renderer {
    constructor(engine, canvas) {
        // Drawing state
        this.currentColor = '#FFFFFF';
        this.currentAlpha = 1.0;
        this.currentFont = '12px Arial';
        this.engine = engine;
        this.canvas = canvas;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
            throw new Error('Failed to get 2D context from canvas');
        }
        this.ctx = ctx;
        // Set up canvas scaling
        this.setupCanvas();
    }
    /**
     * Set up canvas to scale to window
     */
    setupCanvas() {
        window.addEventListener('resize', () => this.resizeCanvas());
    }
    /**
     * Resize the canvas to fit the current room
     */
    resizeCanvas() {
        const room = this.engine.getRoomManager().getCurrentRoom();
        if (!room)
            return;
        const view = room.getView();
        // Calculate scale to fit window while maintaining aspect ratio
        const scaleX = window.innerWidth / view.wview;
        const scaleY = window.innerHeight / view.hview;
        const scale = Math.min(scaleX, scaleY);
        // Set canvas size
        this.canvas.width = view.wview;
        this.canvas.height = view.hview;
        // Set display size
        this.canvas.style.width = `${view.wview * scale}px`;
        this.canvas.style.height = `${view.hview * scale}px`;
    }
    /**
     * Get the canvas
     */
    getCanvas() {
        return this.canvas;
    }
    /**
     * Get the rendering context
     */
    getContext() {
        return this.ctx;
    }
    /**
     * Clear the canvas
     */
    clear(color) {
        this.ctx.fillStyle = color;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
    /**
     * Begin rendering a frame
     */
    beginFrame() {
        const room = this.engine.getRoomManager().getCurrentRoom();
        if (!room)
            return;
        // Clear with background color
        this.clear(room.backgroundColor);
        // Draw backgrounds
        this.drawBackgrounds();
        // Reset drawing state
        this.currentColor = '#FFFFFF';
        this.currentAlpha = 1.0;
        this.ctx.globalAlpha = 1.0;
    }
    /**
     * Draw backgrounds
     */
    drawBackgrounds() {
        const room = this.engine.getRoomManager().getCurrentRoom();
        if (!room)
            return;
        const view = room.getView();
        for (const bg of room.backgrounds) {
            if (!bg.visible || !bg.image)
                continue;
            const sprite = this.engine.getSpriteManager().getSprite(bg.image);
            if (!sprite || sprite.frames.length === 0)
                continue;
            const image = sprite.frames[0].image;
            if (bg.htiled || bg.vtiled) {
                // Tiled background
                const startX = bg.htiled ? Math.floor((view.xview + bg.x) / sprite.width) * sprite.width - bg.x - view.xview : bg.x - view.xview;
                const startY = bg.vtiled ? Math.floor((view.yview + bg.y) / sprite.height) * sprite.height - bg.y - view.yview : bg.y - view.yview;
                const endX = bg.htiled ? this.canvas.width : startX + sprite.width;
                const endY = bg.vtiled ? this.canvas.height : startY + sprite.height;
                for (let x = startX; x < endX; x += sprite.width) {
                    for (let y = startY; y < endY; y += sprite.height) {
                        this.ctx.drawImage(image, x, y);
                    }
                }
            }
            else {
                // Single background
                this.ctx.drawImage(image, bg.x - view.xview, bg.y - view.yview);
            }
        }
    }
    /**
     * Render a frame
     */
    render() {
        this.beginFrame();
        const room = this.engine.getRoomManager().getCurrentRoom();
        if (room) {
            const view = room.getView();
            // Translate context for view
            this.ctx.save();
            this.ctx.translate(-view.xview, -view.yview);
            // Draw all instances
            this.engine.getInstanceManager().drawInstances(this.ctx);
            this.ctx.restore();
        }
        // Draw debug overlay
        if (this.engine.isDebugMode()) {
            this.engine.getDebugManager().draw(this.ctx);
        }
    }
    /**
     * Set drawing color
     */
    setColor(color) {
        this.currentColor = color;
    }
    /**
     * Set drawing alpha
     */
    setAlpha(alpha) {
        this.currentAlpha = Math.max(0, Math.min(1, alpha));
    }
    /**
     * Get current color
     */
    getColor() {
        return this.currentColor;
    }
    /**
     * Get current alpha
     */
    getAlpha() {
        return this.currentAlpha;
    }
    /**
     * Set font
     */
    setFont(font) {
        this.currentFont = font;
    }
    /**
     * Get current font
     */
    getFont() {
        return this.currentFont;
    }
}
