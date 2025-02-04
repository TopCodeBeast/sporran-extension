import { Meta, Story } from '@storybook/react';

import { QRCode } from './QRCode';

type Type = Story<Parameters<typeof QRCode>[0]>;

export default {
  title: 'Components/QRCode',
  component: QRCode,
} as Meta;

export { QRCode };
(QRCode as Type).args = {
  address: '4tJbxxKqYRv3gDvY66BKyKzZheHEH8a27VBiMfeGX2iQrire',
};
