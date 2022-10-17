import { amsDecoderAidon } from './aidon';
import * as Buffer from 'buffer';
import { ElwizConfig, List1, List2, List3 } from '@elwiz/common';
import { amsDecoderKaifa } from './kaifa';
import { Logger } from 'winston';


export function amsDecoder(buffer: Buffer, config: ElwizConfig, logger: Logger) {
  let data: List1 | List2 | List3;
  const hex = buffer.toString('hex').toUpperCase();
  switch ( config.meterType ) {
    case 'kamstrup':
      logger.warn('Kamstrup AMS not implemented yet.');
      data = {} as List1 | List2 | List3;
      break;
    case 'aidon':
      data = amsDecoderAidon(hex);
      break;
    case 'kaifa':
      data = amsDecoderKaifa(hex);
      break;
    default: {
      const aidon = amsDecoderAidon(hex);
      const kaifa = amsDecoderKaifa(hex);
      data = aidon.type !== null ? aidon : kaifa;
    }
  }
  return data;
}
