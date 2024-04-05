
import { debug, log } from 'console';
import {Race} from '../src/Race';

test('hello world test', () => {

    const race = new Race();
    race.join({id:'1223'}, 'hello world');
    race.join({id:'33433'}, '--!');
    race.join({id:'4444'}, '!!!');
    race.start();

    race.next();
    race.next();
    race.next();

    race.next();
    race.next();

    log(race.toString());
    expect(
        1
    ).toBe(1);
});