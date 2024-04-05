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

    public onHorseRoundStart(track: Track) {
        this.buffContainer.emit("horse.round.start", this.race, this);
        this.race.components.forEach((x) => x.emit("horse.round.start", this.race, this));
    }

    public onHorseRoundEnd(track: Track) {
        this.buffContainer.emit("horse.round.end", this.race, this);
        this.race.components.forEach((x) => x.emit("horse.round.end", this.race, this));
        //刷新冷却回合
        this.buffContainer.refresh(this.race, this);
    }

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

    private getRandomSteps() {
        function sigmoid(x: number, k: number, a: number) {
            return 1 / (1 + Math.exp(-k * (x - a)));
        }

        const k = 0.2; // 调整函数的陡峭程度
        const a = 10; // 控制函数的中心位置
        const p = sigmoid(Math.min(this.Property.speed, 20), k, a);
        const randomNumber = Math.random();
        if (p < 0.2) {
            return 0;
        } else if (p > 0.8) {
            return 3;
        } else {
            return randomNumber < 0.5 ? 1 : 2;
        }
    }

    toString() {
        return JSON.stringify(this.simplify());
    }

    simplify() {
        return {
            property: this.Property,
            step: this.step,
            last_moved: this.last_moved,
            buffs: this.buffContainer._buffs,
            user: this.user,
            raw_display: this.raw_display,

        }
    }
}
