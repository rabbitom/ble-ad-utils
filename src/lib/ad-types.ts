import adTypes from './ad-types.json';

export function adTypeName(type: number) {
    const adType = adTypes.find(adType => adType.value === type);
    return adType?.name || 'Unknown';
}