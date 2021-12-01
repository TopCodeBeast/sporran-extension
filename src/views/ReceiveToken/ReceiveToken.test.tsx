import { MemoryRouter, Route, Routes } from 'react-router-dom';

import {
  identitiesMock as identities,
  render,
  waitForDialogUpdate,
} from '../../testing/testing';
import { NEW } from '../../utilities/identities/identities';
import '../../components/useCopyButton/useCopyButton.mock';
import { paths } from '../paths';

import { ReceiveToken } from './ReceiveToken';
import { Switch } from 'react-router-dom';

const identity = identities['4tJbxxKqYRv3gDvY66BKyKzZheHEH8a27VBiMfeGX2iQrire'];

describe('ReceiveToken', () => {
  it('should render a normal identity', async () => {
    const { container } = render(
      <MemoryRouter initialEntries={[`/identity/${identity.address}/receive`]}>
        <Routes>
          <Route
            path={paths.identity.receive}
            element={<ReceiveToken identity={identity} />}
          />
        </Routes>
      </MemoryRouter>,
    );
    await waitForDialogUpdate();
    expect(container).toMatchSnapshot();
  });

  it('should render the new identity', async () => {
    const { container } = render(
      <MemoryRouter initialEntries={['/identity/NEW/receive']}>
        <Routes>
          <Route
            path={paths.identity.receive}
            element={<ReceiveToken identity={NEW} />}
          />
        </Routes>
      </MemoryRouter>,
    );
    await waitForDialogUpdate();
    expect(container).toMatchSnapshot();
  });
});
