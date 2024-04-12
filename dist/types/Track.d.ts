import { Horse } from "./Horse";
import { Segment } from "./Segment";
import { Race } from "./Race";
export declare class Track {
    constructor(length?: number);
    horses: Horse[];
    segments: Segment[];
    addHorse(horse: Horse): void;
    removeHorse(horse: Horse): void;
    next(race: Race): void;
    toString(): string;
}
//# sourceMappingURL=Track.d.ts.map