import { Buff, BuffWithTime, HipEmitterTypes } from "./types";
import { Horse } from "./Horse";
import { Race } from "./Race";
export declare class BuffContainer<ModifierType> {
    _buffs: BuffWithTime<ModifierType>[];
    /**
     * Adds a buff to the buff list.
     * @param buff - The buff to be added. 待添加的buff
     * @param times - The number of times the buff should be added. buff持续时间
     * @param stacks - stacks 层数
     */
    add(buff: Buff<ModifierType>, times: number, stacks?: number): void;
    /**
     * Removes a buff from the buff list.
     * @param buff
     */
    remove(buff: Buff<ModifierType>): void;
    /**
     * Sorts the list of buffs by priority.
     */
    sortByPriority(): void;
    /**
     * Applies each buff to the target in order.
     */
    getModified(target: ModifierType): ModifierType;
    get(): BuffWithTime<ModifierType>[];
    /**
     * Refresh the buff list and count down the remaining time.
     */
    refresh(race: Race, horse: Horse): void;
    /**
     * Emits an event to all buff listeners.
     * @param event 事件名称
     * @param args 事件参数
     */
    emit<K extends keyof HipEmitterTypes>(event: K, ...args: Parameters<HipEmitterTypes[K]>): void;
}
//# sourceMappingURL=BuffContainer.d.ts.map