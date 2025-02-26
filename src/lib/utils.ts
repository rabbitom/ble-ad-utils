export function hexString(n: number | Array<number>) : string {
    if(typeof n === 'number')
        return n.toString(16).padStart(2, '0').toUpperCase()
    else
        return n.map(hexString).join(' ')
}

export function parseHexString(str: string) {
    const res = [];
    let i = 0;
    if(str.substring(0,2) === "0x")
        i = 2;
    while(i < str.length) {
        let n = parseInt(str.charAt(i++),16);
        if(!isNaN(n)) {
            if(i < str.length) {
                let n1 = parseInt(str.charAt(i++),16);
                if(!isNaN(n1))
                    n = n * 16 + n1;
            }
            res.push(n)
        }
    }
    return res;
}

export function parseRawAdvertisingData(rawData: number[]) {
    rawData = rawData.map(n => n < 0 ? n + 256 : n)
    const fields = []
    let index = 0;
    while(index < rawData.length) {
        if(rawData[index] === 0)
            break
        const fieldLength = rawData[index] + 1
        if(fieldLength < 3)
            throw Error('Invalid field length')
        if(index + fieldLength <= rawData.length) {
            fields.push({
                length: rawData[index],
                type: rawData[index + 1],
                bytes: rawData.slice(index + 2, index + fieldLength)
            })
            index += fieldLength
        }
        else
            throw Error('Incomplete raw data')
    }
    return fields;
}

export function utf8String(bytes: number[]) {
    return new TextDecoder().decode(new Uint8Array(bytes))
}