// @ts-ignore
import { csl_decode } from '../csl';
import { hexString } from '../utils';
import Default from './default.json';

import EddyStone from './eddy-stone.json';

const ServiceDataConfigs = [
    EddyStone,
]

export function decodeServiceData(value: number[]) {
    for(const config of ServiceDataConfigs) {
        try {
            const res = csl_decode(value, 0, config, {});
            if(config.filter) {
                if(config.filter !== res.filter)
                    continue;
                else
                    delete res.filter
            }
            return (config.name ? `${config.name}: ` : '') + JSON.stringify(res, null, 2);
        }
        catch(e) {
            // ignore
        }
    }
    try {
        const res = csl_decode(value, 0, Default, {});
        return `UUID=${hexString(res.uuid, '')}`;
    }
    catch(e: any) {
        return e.message || e;
    }
}