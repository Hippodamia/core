"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BuffContainer = void 0;
const eventemitter3_1 = require("eventemitter3");
class BuffContainer {
    constructor() {
        this._buffs = [];
    }
    /**
     * Adds a buff to the buff list.
     * @param buff - The buff to be added. 待添加的buff
     * @param times - The number of times the buff should be added. buff持续时间
     * @param stacks - stacks 层数
     */
    add(buff, times, stacks = 1) {
        let find = this._buffs.find((b) => b.name == buff.name);
        if (find) {
            find.remains = Math.max(find.times, times);
            if (find.canStack == true)
                find.stacks += stacks;
        }
        else {
            let b = Object.assign(Object.assign({}, buff), { times, remains: times, stacks });
            b.listener = new eventemitter3_1.EventEmitter();
            this._buffs.push(b);
            // copy listeners
            if (b.listeners != undefined)
                for (const event in b.listeners)
                    b.listener.on(event, b.listeners[event]);
        }
        this.sortByPriority();
    }
    /**
     * Removes a buff from the buff list.
     * @param buff
     */
    remove(buff) {
        let find = this._buffs.find((b) => b.name == buff.name);
        if (find)
            this._buffs.splice(this._buffs.indexOf(find), 1);
    }
    /**
     * Sorts the list of buffs by priority.
     */
    sortByPriority() {
        this._buffs.sort((a, b) => { var _a, _b; return ((_a = a.priority) !== null && _a !== void 0 ? _a : 50) - ((_b = b.priority) !== null && _b !== void 0 ? _b : 50); });
    }
    /**
     * Applies each buff to the target in order.
     */
    getModified(target) {
        let _target = JSON.parse(JSON.stringify(target));
        this._buffs.forEach((buff) => {
            var _a;
            if (buff.modifier != undefined)
                _target = (_a = buff.modifier(_target, buff)) !== null && _a !== void 0 ? _a : _target;
        });
        return _target;
    }
    get() {
        return this._buffs;
    }
    /**
     * Refresh the buff list and count down the remaining time.
     */
    refresh(race, horse) {
        var _a, _b;
        for (let i = 0; i < this._buffs.length; i++) {
            const buff = this._buffs[i];
            buff.remains--;
            (_a = buff.listener) === null || _a === void 0 ? void 0 : _a.emit("buff.refresh", buff);
            if (buff.remains <= 0) {
                (_b = buff.listener) === null || _b === void 0 ? void 0 : _b.emit("buff.end", { race, horse, buff });
                this._buffs.splice(i, 1);
                i--;
                this.sortByPriority();
            }
        }
    }
    /**
     * Emits an event to all buff listeners.
     * @param event 事件名称
     * @param args 事件参数
     */
    emit(event, ...args) {
        this._buffs.forEach((buff) => {
            var _a;
            (_a = buff.listener) === null || _a === void 0 ? void 0 : _a.emit(event, ...args);
        });
    }
}
exports.BuffContainer = BuffContainer;
//# sourceMappingURL=BuffContainer.js.map