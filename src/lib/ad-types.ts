/**
 * The adTypes json are converted from https://bitbucket.org/bluetooth-SIG/public/src/main/assigned_numbers/core/ad_types.yaml
 */
import adTypes from './ad-types.json';
import { hexString, utf8String } from "./utils";
import { csl_decode } from './csl';

export function adTypeName(type: number) {
    const adType = adTypes.find(adType => adType.value === type);
    return adType?.name || 'Unknown';
}

function decodeAdTypeFlags(value: number[]) {
    if(value.length !== 1)
        throw Error('Invalid field length of Flags')
    const AdTypeFlags = [
        {
            value: 0x01,
            name: 'LE Limited Discoverable Mode'
        },
        {
            value: 0x02,
            name: 'LE General Discoverable Mode'
        },
        {
            value: 0x04,
            name: 'BR/EDR Not Supported'
        }
    ]
    return AdTypeFlags.filter(flag => flag.value & value[0]).map(flag => flag.name).join(', ');
}

function decode16BitsUUIDs(value: number[]) {
    if(value.length < 2 || value.length % 2 !== 0)
        throw Error('Invalid field length of 16-bit Service Class UUIDs');
    const uuids = [];
    for(let i=0; i<value.length; i+=2) {
        uuids.push((value[i+1] << 8) + value[i]);
    }
    return uuids.map(uuid => '0x' + uuid.toString(16).padStart(4, '0').toUpperCase()).join(', ');
}

function decode128BitsUUIDs(value: number[]) {
    if(value.length !== 16)
        throw Error('Invalid field length of 128-bit Service Class UUIDs');
    const reversedBytesString = hexString(value.reverse(), '');
    const match = reversedBytesString.match(/(.{8})(.{4})(.{4})(.{4})(.{12})/);
    if(match)
        return match.slice(1).join('-');
    else
        // this should never happen
        throw Error('Invalid 128-bit UUID');
}

function decodeAdTypeLocalName(value: number[]) {
    return utf8String(value);
}

function decodeManufacturerSpecificData (value: number[]) {
    if(value.length === 25) {
        if(value[0] === 0x4C && value[1] === 0x00 && value[2] === 0x02 && value[3] === 0x15) {
            // Apple iBeacon
            const uuid = hexString(value.slice(4, 20), '');
            const major = (value[20] << 8) + value[21];
            const minor = (value[22] << 8) + value[23];
            const power = value[24] >= 128 ? value[24] - 256 : value[24];
            return `iBeacon: UUID=${uuid}, Major=${major}, Minor=${minor}, TxPower=${power}`;
        }
    }
    return '';
}

import ServiceDataConfig from './service-data/default.json';

function decodeServiceData(value: number[]) {
    try {
        const decodeResult = {};
        const res = csl_decode(value, 0, ServiceDataConfig, decodeResult);
        return JSON.stringify(res, null, 2);
    }
    catch(e) {
        return '';
    }
}

export function adTypeDescription(type: number, value: number[]): string {
    switch(type) {
        case 0x01: // Flags
            return decodeAdTypeFlags(value);
        case 0x02: // Incomplete List of 16-bit Service Class UUIDs
        case 0x03: // Complete List of 16-bit Service Class UUIDs
            return decode16BitsUUIDs(value);
        case 0x06: // Incomplete List of 128-bit Service Class UUIDs
        case 0x07: // Complete List of 128-bit Service Class UUIDs
            return decode128BitsUUIDs(value);
        case 0x08: // Shortened Local Name
        case 0x09: // Complete Local Name
            return decodeAdTypeLocalName(value);
        case 0x16: // Service Data - 16Bit UUID
            return decodeServiceData(value);
        case 0xFF: // Manufacturer Specific Data
            return decodeManufacturerSpecificData(value);
    }
    return '';
}