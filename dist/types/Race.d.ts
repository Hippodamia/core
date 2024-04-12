import { Track } from "./Track";
import { RaceLog, UserInfo } from "./types";
import { Horse } from "./Horse";
import { HipComponent } from "./HipComponent";
export interface RaceConfig {
    speed: number;
    length: number;
    mode: "pure" | "random" | "contract";
}
declare class Race {
    tracks: Track[];
    round: number;
    components: HipComponent[];
    logs: RaceLog[];
    players: (UserInfo & {
        display: string;
    })[];
    ended: boolean;
    mode: RaceConfig["mode"];
    config: RaceConfig;
    isStarted: boolean;
    constructor(config?: RaceConfig);
    onRaceStart(): void;
    private onRaceRoundStart;
    private onRaceRoundEnd;
    /**
     * Joins a user to the game.
     *
     * @param user - The user information.
     * @param display - The display name for the user.
     * @return Returns true if the user is successfully joined, false otherwise.
     */
    join(user: UserInfo, display: string): boolean;
    start(): void;
    next(): void;
    getHorses(): Horse[];
    getOthers(excludes: Horse[]): Horse[];
    pushLog(horse: Horse, content: string): void;
    getRaceResult(): {
        winners: {
            won: boolean;
            step: number;
            user: UserInfo;
            display: string;
        }[];
        ranks: {
            won: boolean;
            step: number;
            user: UserInfo;
            display: string;
        }[];
    };
    toString(): string;
    private simplify;
}
export { Race };
//# sourceMappingURL=Race.d.ts.map