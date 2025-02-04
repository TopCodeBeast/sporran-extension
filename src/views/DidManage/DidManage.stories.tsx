import { MemoryRouter, Route } from 'react-router-dom';
import { Meta } from '@storybook/react';

import { moreIdentitiesMock as identities } from '../../utilities/identities/IdentitiesProvider.mock';
import { generatePath, paths } from '../paths';

import { DidManage } from './DidManage';

export default {
  title: 'Views/DidManage',
  component: DidManage,
} as Meta;

export function WithoutWeb3Name(): JSX.Element {
  return (
    <MemoryRouter
      initialEntries={[
        generatePath(paths.identity.did.manage.start, { address: 'FOO' }),
      ]}
    >
      <Route path={paths.identity.did.manage.start}>
        <DidManage
          identity={
            identities['4sdkkaM8jvLJijJmpHmJhCDC34JvRKqqs1qLUyHYKXvygQ5w']
          }
        />
      </Route>
    </MemoryRouter>
  );
}

export function WithWeb3Name(): JSX.Element {
  return (
    <MemoryRouter
      initialEntries={[
        generatePath(paths.identity.did.manage.start, { address: 'FOO' }),
      ]}
    >
      <Route path={paths.identity.did.manage.start}>
        <DidManage
          identity={
            identities['4sm9oDiYFe22D7Ck2aBy5Y2gzxi2HhmGML98W9ZD2qmsqKCr']
          }
        />
      </Route>
    </MemoryRouter>
  );
}
