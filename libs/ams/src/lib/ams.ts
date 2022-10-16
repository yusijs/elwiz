import { amsDecoderAidon } from './aidon';
import * as Buffer from 'buffer';


export function amsDecoder(buffer: Buffer) {
  return amsDecoderAidon(buffer);
}
