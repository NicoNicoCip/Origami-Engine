/**
 * Initialize all global GMS-like functions
 */
export function initializeGlobalFunctions(engine) {
    const g = globalThis;
    // ===== Instance Management =====
    g.instance_create = async function (x, y, objectType) {
        return await engine.getInstanceManager().createInstance(objectType, x, y);
    };
    g.instance_destroy = function () {
        engine.getInstanceManager().destroyInstance(this);
    };
    g.instance_exists = function (objectType) {
        return engine.getInstanceManager().instanceExists(objectType);
    };
    g.instance_number = function (objectType) {
        return engine.getInstanceManager().instanceCount(objectType);
    };
    g.instance_find = function (objectType, n) {
        return engine.getInstanceManager().instanceFind(objectType, n);
    };
    // ===== Collision Functions =====
    g.place_meeting = function (x, y, objectType) {
        const targets = engine.getInstanceManager().getInstancesOfType(objectType);
        const collision = engine
            .getCollisionManager()
            .checkCollisionAtPosition(this, x, y, targets);
        return collision !== null;
    };
    g.place_free = function (x, y) {
        const allInstances = engine.getInstanceManager().getAllInstances();
        const collision = engine
            .getCollisionManager()
            .checkCollisionAtPosition(this, x, y, allInstances);
        return collision === null;
    };
    g.instance_place = function (x, y, objectType) {
        const targets = engine.getInstanceManager().getInstancesOfType(objectType);
        return engine.getCollisionManager().checkCollisionAtPosition(this, x, y, targets);
    };
    g.instance_position = function (x, y, objectType) {
        const targets = engine.getInstanceManager().getInstancesOfType(objectType);
        return engine.getCollisionManager().checkPointCollision(x, y, targets);
    };
    g.collision_rectangle = function (x1, y1, x2, y2, objectType) {
        const targets = engine.getInstanceManager().getInstancesOfType(objectType);
        return engine.getCollisionManager().checkRectangleCollision(x1, y1, x2, y2, targets);
    };
    g.collision_point = function (x, y, objectType) {
        const targets = engine.getInstanceManager().getInstancesOfType(objectType);
        return engine.getCollisionManager().checkPointCollision(x, y, targets);
    };
    // ===== Movement and Math =====
    g.lengthdir_x = function (length, direction) {
        return length * Math.cos((direction * Math.PI) / 180);
    };
    g.lengthdir_y = function (length, direction) {
        return -length * Math.sin((direction * Math.PI) / 180);
    };
    g.point_direction = function (x1, y1, x2, y2) {
        const angle = Math.atan2(-(y2 - y1), x2 - x1) * (180 / Math.PI);
        return angle < 0 ? angle + 360 : angle;
    };
    g.point_distance = function (x1, y1, x2, y2) {
        return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    };
    g.move_towards_point = function (x, y, speed) {
        const direction = g.point_direction(this.x, this.y, x, y);
        this.hspeed = g.lengthdir_x(speed, direction);
        this.vspeed = g.lengthdir_y(speed, direction);
    };
    // ===== Random Functions =====
    g.random = function (n) {
        return Math.random() * n;
    };
    g.irandom = function (n) {
        return Math.floor(Math.random() * (n + 1));
    };
    g.random_range = function (min, max) {
        return min + Math.random() * (max - min);
    };
    g.choose = function (...args) {
        return args[Math.floor(Math.random() * args.length)];
    };
    // ===== Math Utility Functions =====
    g.clamp = function (value, min, max) {
        return Math.min(Math.max(value, min), max);
    };
    g.lerp = function (a, b, t) {
        return a + (b - a) * t;
    };
    // ===== Room Functions =====
    g.room_goto = async function (roomName) {
        await engine.getRoomManager().gotoRoom(roomName);
    };
    // ===== Game Control =====
    g.game_end = function () {
        engine.stop();
    };
    g.game_restart = function () {
        engine.restart();
    };
    // ===== Debug =====
    g.show_debug_message = function (message) {
        const caller = this?.objectType || 'global';
        console.log(`[${caller}] ${message}`);
    };
    // ===== Global Variables =====
    g.room_width = 0;
    g.room_height = 0;
    g.room_speed = 60;
    g.debug_mode = false;
    // View variables
    g.view_xview = 0;
    g.view_yview = 0;
    g.view_wview = 0;
    g.view_hview = 0;
    g.view_xport = 0;
    g.view_yport = 0;
    g.view_wport = 0;
    g.view_hport = 0;
}
/**
 * Update global view variables from current room
 */
export function updateGlobalViewVariables(engine) {
    const g = globalThis;
    const room = engine.getRoomManager().getCurrentRoom();
    if (room) {
        const view = room.getView();
        g.view_xview = view.xview;
        g.view_yview = view.yview;
        g.view_wview = view.wview;
        g.view_hview = view.hview;
        g.view_xport = view.xport;
        g.view_yport = view.yport;
        g.view_wport = view.wport;
        g.view_hport = view.hport;
    }
}
