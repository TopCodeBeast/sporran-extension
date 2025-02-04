import { MemoryRouter, Route } from 'react-router-dom';

import {
  moreIdentitiesMock as identities,
  render,
  screen,
} from '../../testing/testing';

import { NEW } from '../../utilities/identities/identities';
import { paths } from '../paths';

import { InternalConfigurationContext } from '../../configuration/InternalConfigurationContext';
import { useSubscanHost } from '../../utilities/useSubscanHost/useSubscanHost';
import { mockIsFullDid } from '../../utilities/did/did.mock';

import { notDownloaded } from '../../utilities/credentials/CredentialsProvider.mock';

import { useIdentityCredentials } from '../../utilities/credentials/credentials';

import { legacyIdentity } from '../../utilities/identities/IdentitiesProvider.mock';

import { useWeb3Name } from '../../utilities/useWeb3Name/useWeb3Name';

import { useSwrDataOrThrow } from '../../utilities/useSwrDataOrThrow/useSwrDataOrThrow';

import { IdentityOverview } from './IdentityOverview';

jest.mock('../../utilities/useSubscanHost/useSubscanHost');

jest.mock('../../utilities/credentials/credentials');

jest.mock('../../utilities/useWeb3Name/useWeb3Name');

jest.mock('../../utilities/useSwrDataOrThrow/useSwrDataOrThrow');

const identity = identities['4tJbxxKqYRv3gDvY66BKyKzZheHEH8a27VBiMfeGX2iQrire'];

const fullDidIdentity =
  identities['4sm9oDiYFe22D7Ck2aBy5Y2gzxi2HhmGML98W9ZD2qmsqKCr'];

describe('IdentityOverview', () => {
  beforeEach(() => {
    jest.mocked(useSwrDataOrThrow).mockReset();
  });

  it('should render a normal identity', async () => {
    const { container } = render(
      <MemoryRouter initialEntries={[`/identity/${identity.address}/`]}>
        <Route path={paths.identity.overview}>
          <IdentityOverview identity={identity} />
        </Route>
      </MemoryRouter>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render the new identity', async () => {
    const { container } = render(
      <MemoryRouter initialEntries={['/identity/NEW/']}>
        <Route path={paths.identity.overview}>
          <IdentityOverview identity={NEW} />
        </Route>
      </MemoryRouter>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render with link to send screen', async () => {
    jest
      .mocked(useSubscanHost)
      .mockReturnValue('https://kilt-testnet.subscan.io');

    const { container } = render(
      <InternalConfigurationContext>
        <MemoryRouter initialEntries={[`/identity/${identity.address}/`]}>
          <Route path={paths.identity.overview}>
            <IdentityOverview identity={identity} />
          </Route>
        </MemoryRouter>
      </InternalConfigurationContext>,
    );

    await screen.findByRole('link', { name: 'Send' });

    expect(container).toMatchSnapshot();
  });

  it('should render with link to credentials screen', async () => {
    render(
      <InternalConfigurationContext>
        <MemoryRouter initialEntries={[`/identity/${identity.address}/`]}>
          <Route path={paths.identity.overview}>
            <IdentityOverview identity={identity} />
          </Route>
        </MemoryRouter>
      </InternalConfigurationContext>,
    );

    expect(
      await screen.findByRole('link', { name: 'Show Credentials' }),
    ).toBeInTheDocument();
  });

  it('should render full DID identity', async () => {
    mockIsFullDid(true);

    const { container } = render(
      <MemoryRouter initialEntries={[`/identity/${fullDidIdentity.address}/`]}>
        <Route path={paths.identity.overview}>
          <IdentityOverview identity={fullDidIdentity} />
        </Route>
      </MemoryRouter>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should show notification for not backed up credentials', async () => {
    jest.mocked(useIdentityCredentials).mockReturnValue(notDownloaded);

    const { container } = render(
      <MemoryRouter initialEntries={[`/identity/${identity.address}/`]}>
        <Route path={paths.identity.overview}>
          <IdentityOverview identity={identity} />
        </Route>
      </MemoryRouter>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should prompt to update legacy DID', async () => {
    jest.mocked(useSwrDataOrThrow).mockImplementation((key, fetcher, name) => {
      return {
        needLegacyDidCrypto: true,
        getDidDeletionStatus: false,
      }[name];
    });

    const { container } = render(
      <MemoryRouter initialEntries={[`/identity/${legacyIdentity.address}/`]}>
        <Route path={paths.identity.overview}>
          <IdentityOverview identity={legacyIdentity} />
        </Route>
      </MemoryRouter>,
    );

    expect(container).toMatchSnapshot();
  });

  it('should show web3name', async () => {
    jest.mocked(useWeb3Name).mockReturnValue('fancy-name');

    const { container } = render(
      <MemoryRouter initialEntries={[`/identity/${fullDidIdentity.address}/`]}>
        <Route path={paths.identity.overview}>
          <IdentityOverview identity={identity} />
        </Route>
      </MemoryRouter>,
    );

    expect(container).toMatchSnapshot();
  });

  it('should show on-chain DID removed', async () => {
    mockIsFullDid(false);
    jest.mocked(useSwrDataOrThrow).mockImplementation((key, fetcher, name) => {
      return {
        needLegacyDidCrypto: false,
        getDidDeletionStatus: true,
      }[name];
    });

    const { container } = render(
      <MemoryRouter
        initialEntries={[
          '/identity/4oESHtb7Hu6grwwQVpqTj8G1XdvEsbDUmWNnT8CdbhVGQx7Z',
        ]}
      >
        <Route path={paths.identity.overview}>
          <IdentityOverview
            identity={
              identities['4oESHtb7Hu6grwwQVpqTj8G1XdvEsbDUmWNnT8CdbhVGQx7Z']
            }
          />
        </Route>
      </MemoryRouter>,
    );

    expect(container).toMatchSnapshot();
  });
});
