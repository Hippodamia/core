import { BuffContainer } from "./BuffContainer";
import { Track } from "./Track";
import { HorseStatus, UserInfo } from "./types";
import { Race } from "./Race";

export interface HorseProperty {
    // 0-20的数值
    speed: number;
    //1为单位的增长概率的倍率
    effect_resistance: number;
    // 1为单位，用于增加幸运概率的倍率
    luck: number;
    status: HorseStatus;
    display: string;
}

export class Horse {
    race: Race;
    constructor(race: Race, user: UserInfo, display: string) {
        this.race = race;
        this.user = user;
        this.step = 1;
        this.buffContainer = new BuffContainer<HorseProperty>();
        this.raw_display = display;
        this.last_moved = 0;
        this._property = {
            speed: 10,
            effect_resistance: 0,
            luck: 1,
            status: HorseStatus.NORMAL,
            display: display,
        };
    }

    track?: Track;
    user: UserInfo;
    buffContainer: BuffContainer<HorseProperty>;
    step: number;

    public raw_display: string;
    public last_moved: number;

    private _property: HorseProperty;

    get Property(): HorseProperty {
        let property = this._property;
        return this.buffContainer.getModified(property);
    }

    set Property(value: HorseProperty) {
        this._property = value;
    }

    //todo 让property能够被直接更改子值



    /**
     * Executes a move for the horse character, taking into account any active buffs.
     * @return 距离上一次移动的步数
     */
    public next(race: Race, track: Track) {
        let step = this.step;
        this.onHorseRoundStart(track);
        this.move(this.getRandomSteps());
        this.onHorseRoundEnd(track);
        this.last_moved = this.step - step;
        return this.last_moved;
    }

    /**
     * 所有的移动必须使用move来进行移动，移动有一个「无视异常状态」的选项
     * @param step 移动的步数
     * @param ignoreStatus 是否无视异常状态
     */
    public move(step: number, ignoreStatus: boolean = false) {
        let move = step;
        if (this.Property.status == HorseStatus.NORMAL) {
            //计算buff是否导致无法移动
            let canMove = true || ignoreStatus;

            //canMove = this.buffContainer.emit
            //canMove = this.buffs.call<boolean, any>("canMove", true, this, {race, horse: this, track});
            if (canMove) {

                this.step += move;
                this.buffContainer.emit("horse.moved", this.race, this, move);
                this.race.components.forEach((x) => x.emit("horse.moved", this.race, this, move));
            }
        }
    }

    get display() {
        return this.Property.display;
    }

    public getRandomSteps() {
        function sigmoid(x: number) {
            return 1 / (1 + Math.exp(-(x- 10) * 0.52)) * 3;
        }
        function normalDistribution(mean:number, stdDev:number) {
            let u = 0, v = 0;
            while (u === 0) u = Math.random(); // Converting [0,1) to (0,1)
            while (v === 0) v = Math.random();
            let num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
            num = num * stdDev + mean; // Translate to 0 -> mean -> infinity
            return num;
        }
        const speed = this.Property.speed;

        let delta = normalDistribution(0,(-0.53*(sigmoid(speed)-1.5)^2+1.3)^2)

        return Math.round(sigmoid(speed) + delta)
    }

    private onHorseRoundStart(track: Track) {
        this.buffContainer.emit("horse.round.start", this.race, this);
        this.race.components.forEach((x) => x.emit("horse.round.start", this.race, this));
    }

    private onHorseRoundEnd(track: Track) {
        this.buffContainer.emit("horse.round.end", this.race, this);
        this.race.components.forEach((x) => x.emit("horse.round.end", this.race, this));
        //刷新冷却回合
        this.buffContainer.refresh(this.race, this);
    }


    toString() {
        return JSON.stringify(this.simplify());
    }

    /**
     * 简化函数，返回一个对象，包含属性、步骤、最后移动、buffs、用户和原始显示
    */
    simplify() {
        return {
            property: this.Property,
            step: this.step,
            last_moved: this.last_moved,
            buffs: this.buffContainer._buffs.map(buff => { return { name: buff.name, stacks: buff.stacks, times: buff.times } }),
            user: this.user,
            raw_display: this.raw_display,
        }
    }
}
