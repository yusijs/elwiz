export const getIndexOfHex = (payload: string, pattern: string, offset: number): number | null => {
  const index = payload.indexOf(pattern);
  if ( index < 0 ) {
    return null;
  }
  return index + offset;
};

export const getRelevantPayload = (payload: string, pattern: string, offset: number, length: number): string | null => {
  const index = getIndexOfHex(payload, pattern, offset);
  if ( index !== null ) {
    return payload.substring(index, index + length);
  }
  return null;
};

export const hex_to_dec_signed = (str1: string | null): number | null => {
  if ( !str1 ) {
    return null;
  }
  let dec = parseInt(str1, 16);
  if ( ( dec & 0x8000 ) > 0 ) {
    dec = dec - 0x10000;
  }
  return dec;
};

export const hex_to_dec = (str1: string | null): number | null => {
  if ( !str1 ) {
    return null;
  }
  return parseInt(str1, 16);
};

export const hex_to_ascii = (str1: string | null): string | null => {
  if ( !str1 ) {
    return null;
  }
  const hex = str1.toString();
  let str = '';
  for ( let n = 0; n < hex.length; n += 2 ) {
    str += String.fromCharCode(parseInt(hex.substr(n, 2), 16));
  }
  return str;
};
