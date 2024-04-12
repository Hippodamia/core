import { BuffContainer } from "./BuffContainer";
import { Track } from "./Track";
import { HorseStatus, UserInfo } from "./types";
import { Race } from "./Race";
export interface HorseProperty {
    speed: number;
    effect_resistance: number;
    luck: number;
    status: HorseStatus;
    display: string;
}
export declare class Horse {
    race: Race;
    constructor(race: Race, user: UserInfo, display: string);
    track?: Track;
    user: UserInfo;
    buffContainer: BuffContainer<HorseProperty>;
    step: number;
    raw_display: string;
    last_moved: number;
    private _property;
    get Property(): HorseProperty;
    set Property(value: HorseProperty);
    onHorseRoundStart(track: Track): void;
    onHorseRoundEnd(track: Track): void;
    /**
     * Executes a move for the horse character, taking into account any active buffs.
     * @return 距离上一次移动的步数
     */
    next(race: Race, track: Track): number;
    /**
     * 所有的移动必须使用move来进行移动，移动有一个「无视异常状态」的选项
     * @param step 移动的步数
     * @param ignoreStatus 是否无视异常状态
     */
    move(step: number, ignoreStatus?: boolean): void;
    get display(): string;
    private getRandomSteps;
    toString(): string;
    simplify(): {
        property: HorseProperty;
        step: number;
        last_moved: number;
        buffs: import("./types").BuffWithTime<HorseProperty>[];
        user: UserInfo;
        raw_display: string;
    };
}
//# sourceMappingURL=Horse.d.ts.map