import { Buff, BuffWithTime, HipEmitterTypes } from "./types";
import { EventEmitter } from "eventemitter3";
import { Horse } from "./Horse";
import { Race } from "./Race";

export class BuffContainer<ModifierType> {
    _buffs: BuffWithTime<ModifierType>[] = [];

    /**
     * Adds a buff to the buff list.
     * @param buff - The buff to be added. 待添加的buff
     * @param times - The number of times the buff should be added. buff持续时间
     * @param stacks - stacks 层数
     */
    add(buff: Buff<ModifierType>, times: number, stacks: number = 1) {
        let find = this._buffs.find((b) => b.name == buff.name);
        if (find) {
            find.remains = Math.max(find.times, times);
            if (find.canStack == true) find.stacks += stacks;
        } else {
            let b: BuffWithTime<ModifierType> = {
                ...buff,
                times,
                remains: times,
                stacks,
            };
            b.listener = new EventEmitter<HipEmitterTypes>();
            this._buffs.push(b);

            // copy listeners
            if (b.listeners != undefined)
                for (const event in b.listeners)
                    b.listener.on(event, b.listeners[event]!);
        }
        this.sortByPriority();
    }

    /**
     * Removes a buff from the buff list.
     * @param buff
     */
    remove(buff: Buff<ModifierType>) {
        let find = this._buffs.find((b) => b.name == buff.name);
        if (find) this._buffs.splice(this._buffs.indexOf(find), 1);
    }

    /**
     * Sorts the list of buffs by priority.
     */
    sortByPriority() {
        this._buffs.sort((a, b) => (a.priority ?? 50) - (b.priority ?? 50));
    }

    /**
     * Applies each buff to the target in order.
     */
    getModified(target: ModifierType): ModifierType {
        let _target = JSON.parse(JSON.stringify(target)) as ModifierType;
        this._buffs.forEach((buff) => {
            if (buff.modifier != undefined)
                _target = buff.modifier(_target, buff) ?? _target;
        });
        return _target;
    }

    get() {
        return this._buffs;
    }

    /**
     * Refresh the buff list and count down the remaining time.
     */
    refresh(race: Race, horse: Horse) {
        for (let i = 0; i < this._buffs.length; i++) {
            const buff = this._buffs[i];
            buff.remains--;
            buff.listener?.emit("buff.refresh", buff);
            if (buff.remains <= 0) {
                buff.listener?.emit("buff.end", { race, horse, buff });
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
    emit<K extends keyof HipEmitterTypes>(
        event: K,
        ...args: Parameters<HipEmitterTypes[K]>
    ) {
        this._buffs.forEach((buff) => {
            buff.listener?.emit(event, ...args);
        });
    }
}
