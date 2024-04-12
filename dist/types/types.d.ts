import { Horse } from "./Horse";
import { Race } from "./Race";
import { EventEmitter } from "eventemitter3";
import { Track } from "./Track";
import { Segment } from "./Segment";
interface RaceLog {
    player: string;
    content: string;
    round: number;
}
interface UserInfo {
    name?: string;
    id: string;
}
declare enum EffectType {
    Positive = 0,
    Negative = 1,
    Neutral = 2
}
declare enum HorseStatus {
    NORMAL = "normal",
    DEAD = "dead",
    LEFT = "left"
}
interface BuffBase {
    name: string;
    type: EffectType;
    desc: string;
    doc?: string;
    canStack?: boolean;
    priority?: number;
}
export type HipEmitterTypes = {
    "race.start": (race: Race) => void; /** 赛事开始 */
    /**
     * 新一轮开始
     * @param round 当前轮数
     */
    "round.start": (race: Race, round: number) => void; /** 新一轮开始 */
    "round.end": (race: Race, round: number) => void; /** 新一轮结束 */
    "horse.round.start": (race: Race, horse: Horse) => void; /** 新一轮的选手回合开始 */
    "horse.round.end": (race: Race, horse: Horse) => void; /** 新一轮的选手回合结束 */
    /**
   * @param moved 尝试移动距离
   * @returns 是否允许移动
   */
    "horse.move": (race: Race, horse: Horse, move: number) => boolean; /** 选手移动 */
    /**
     * @param moved 真实移动距离
     */
    "horse.moved": (race: Race, horse: Horse, moved: number) => void; /** 选手移动完毕 */
    "segment.round.start": (race: Race, segment: Segment) => void; /** 新一轮的赛道格子开始 */
    "segment.round.end": (race: Race, segment: Segment) => void; /** 新一轮的赛道格子结束 */
    "track.round.start": (race: Race, track: Track) => void; /** 新一轮的赛道开始 */
    "track.round.end": (race: Race, track: Track) => void; /** 新一轮的赛道结束 */
    "buff.end": (ctx: {
        race: Race;
        horse: Horse;
        buff: BuffBase;
    }) => void; /** 效果结束 */
    "buff.effect": (ctx: {
        race: Race;
        horse: Horse;
        buff: BuffBase;
    }) => void; /** 效果作用于目标时 */
    [key: string]: (...args: any[]) => void;
};
type Buff<T> = BuffBase & {
    listeners?: {
        [K in keyof HipEmitterTypes]?: HipEmitterTypes[K];
    };
    listener?: EventEmitter<HipEmitterTypes>;
    modifier?: (target: T, buff: BuffWithTime<T>) => T;
};
type BuffWithTime<T> = Buff<T> & {
    times: number;
    remains: number;
    stacks: number;
};
declare enum RaceEvent {
    RaceStart = 0,
    RoundStart = 1,
    Track = 2,
    Segment = 3,
    TrackEnd = 4,
    RoundEnd = 5,
    Move = 6
}
declare enum RaceMode {
    Pure = "pure",
    RandomEvent = "random",
    Contract = "contract"
}
export type { UserInfo, Buff, BuffWithTime, RaceLog };
export { EffectType, HorseStatus, RaceEvent, RaceMode };
//# sourceMappingURL=types.d.ts.map