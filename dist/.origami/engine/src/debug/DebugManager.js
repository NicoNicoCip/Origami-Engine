/**
 * Color palette for debug visualization
 */
const DEBUG_COLORS = [
    '#FF0000',
    '#00FF00',
    '#0000FF',
    '#FFFF00',
    '#FF00FF',
    '#00FFFF',
    '#FFA500',
    '#800080',
    '#008000',
    '#FFC0CB',
];
/**
 * Manages debug visualization and tools
 */
export class DebugManager {
    constructor(engine) {
        this.enabled = false;
        this.showCollisionBoxes = true;
        this.showFPS = true;
        this.showInstanceCount = true;
        this.fps = 60;
        this.frameCount = 0;
        this.lastFPSUpdate = 0;
        // Color mapping for object types
        this.objectColorMap = new Map();
        this.colorIndex = 0;
        this.engine = engine;
        this.setupKeyboardShortcut();
    }
    /**
     * Set up F3/~ keyboard shortcut to toggle debug mode
     */
    setupKeyboardShortcut() {
        window.addEventListener('keydown', (e) => {
            // F3 or ~ (tilde/backtick)
            if (e.key === 'F3' || e.key === '`' || e.key === '~') {
                this.toggle();
                e.preventDefault();
            }
        });
    }
    /**
     * Toggle debug mode
     */
    toggle() {
        this.enabled = !this.enabled;
        globalThis.debug_mode = this.enabled;
        console.log(`Debug mode: ${this.enabled ? 'ON' : 'OFF'}`);
    }
    /**
     * Check if debug mode is enabled
     */
    isEnabled() {
        return this.enabled;
    }
    /**
     * Update debug info (called each frame)
     */
    update(deltaTime) {
        if (!this.enabled)
            return;
        // Update FPS counter
        this.frameCount++;
        const now = performance.now();
        if (now - this.lastFPSUpdate >= 1000) {
            this.fps = Math.round((this.frameCount * 1000) / (now - this.lastFPSUpdate));
            this.frameCount = 0;
            this.lastFPSUpdate = now;
        }
    }
    /**
     * Draw debug overlay
     */
    draw(ctx) {
        if (!this.enabled)
            return;
        // Draw collision boxes
        if (this.showCollisionBoxes) {
            this.drawCollisionBoxes(ctx);
        }
        // Draw debug info overlay
        this.drawDebugInfo(ctx);
    }
    /**
     * Draw collision boxes for all instances
     */
    drawCollisionBoxes(ctx) {
        const instances = this.engine.getInstanceManager().getAllInstances();
        const room = this.engine.getRoomManager().getCurrentRoom();
        if (!room)
            return;
        const view = room.getView();
        ctx.save();
        ctx.translate(-view.xview, -view.yview);
        ctx.lineWidth = 2;
        for (const instance of instances) {
            if (instance.isDestroyed() || !instance.visible)
                continue;
            // Get color for this object type
            const color = this.getColorForObjectType(instance.objectType);
            // Get bounding box
            const bbox = this.engine.getCollisionManager().getBBox(instance);
            // Draw bbox
            ctx.strokeStyle = color;
            ctx.strokeRect(bbox.left, bbox.top, bbox.right - bbox.left, bbox.bottom - bbox.top);
            // Draw origin point
            ctx.fillStyle = color;
            ctx.fillRect(instance.x - 2, instance.y - 2, 4, 4);
        }
        ctx.restore();
    }
    /**
     * Draw debug info text
     */
    drawDebugInfo(ctx) {
        const instances = this.engine.getInstanceManager().getAllInstances();
        ctx.save();
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(10, 10, 200, 80);
        ctx.fillStyle = '#00FF00';
        ctx.font = '14px monospace';
        let y = 30;
        if (this.showFPS) {
            ctx.fillText(`FPS: ${this.fps}`, 20, y);
            y += 20;
        }
        if (this.showInstanceCount) {
            ctx.fillText(`Instances: ${instances.length}`, 20, y);
            y += 20;
        }
        const room = this.engine.getRoomManager().getCurrentRoom();
        if (room) {
            const view = room.getView();
            ctx.fillText(`View: (${Math.floor(view.xview)}, ${Math.floor(view.yview)})`, 20, y);
            y += 20;
        }
        ctx.restore();
    }
    /**
     * Get a consistent color for an object type
     */
    getColorForObjectType(objectType) {
        if (!this.objectColorMap.has(objectType)) {
            const color = DEBUG_COLORS[this.colorIndex % DEBUG_COLORS.length];
            this.objectColorMap.set(objectType, color);
            this.colorIndex++;
        }
        return this.objectColorMap.get(objectType);
    }
    /**
     * Log instance properties (for debug wrapping)
     */
    logInstance(instance) {
        console.log('=== Instance Debug ===');
        console.log('Type:', instance.objectType);
        console.log('ID:', instance.id);
        console.log('Position:', { x: instance.x, y: instance.y });
        console.log('Sprite:', instance.sprite_index);
        console.log('Visible:', instance.visible);
        console.log('Depth:', instance.depth);
        console.log('Properties:', instance);
        console.log('=====================');
    }
}
