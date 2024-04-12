"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Track = void 0;
const Segment_1 = require("./Segment");
class Track {
    //初始化轨道内部的Segment(格)
    constructor(length = 26) {
        //buffs: BuffContainer<Track,any>; //todo track也允许拥有buff，用于影响整个赛道以及选手。
        this.horses = [];
        this.segments = [];
        for (let i = 0; i < length; i++) {
            const segment = new Segment_1.Segment();
            this.segments.push(segment);
        }
        //this.buffs = new BuffContainer<Track,any>();
    }
    addHorse(horse) {
        horse.track = this;
        this.horses.push(horse);
    }
    removeHorse(horse) {
        this.horses.splice(this.horses.indexOf(horse), 1);
        horse.track = undefined;
    }
    next(race) {
        //todo 用于给track的buff系统
        for (let horse of this.horses) {
            race.components.forEach(c => c.emit("track.round.end", race, this));
            horse.next(race, this);
        }
    }
    toString() {
        return JSON.stringify({
            segments: this.segments.map(s => s.toString()),
            horses: this.horses.map(h => h.toString()),
        });
    }
}
exports.Track = Track;
//# sourceMappingURL=Track.js.map