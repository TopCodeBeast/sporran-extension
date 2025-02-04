import { Meta } from '@storybook/react';
import { MemoryRouter, Route } from 'react-router-dom';

import * as styles from './CredentialCard.module.css';

import {
  credentialsMock,
  notDownloaded,
} from '../../utilities/credentials/CredentialsProvider.mock';
import { moreIdentitiesMock } from '../../utilities/identities/IdentitiesProvider.mock';
import { paths } from '../../views/paths';

import { CredentialCard } from './CredentialCard';

export default {
  title: 'Components/CredentialCard',
  component: CredentialCard,
} as Meta;

export function Template(): JSX.Element {
  return (
    <ul className={styles.credentialsList}>
      <CredentialCard credential={credentialsMock[0]} />
    </ul>
  );
}

export function DownloadPrompt(): JSX.Element {
  return (
    <ul className={styles.credentialsList}>
      <CredentialCard credential={notDownloaded[0]} />
    </ul>
  );
}

export function PresentationPrompt(): JSX.Element {
  const identity =
    moreIdentitiesMock['4p1VA6zuhqKuZ8EdJA7QtjcB9mVLt3L31EKWVXfbJ6GaiQos'];
  return (
    <MemoryRouter
      initialEntries={[
        `/identity/${identity.address}/credentials/${credentialsMock[12].request.rootHash}/presentation`,
      ]}
    >
      <Route path={paths.identity.credentials.presentation}>
        <ul className={styles.credentialsList}>
          <CredentialCard expand credential={credentialsMock[12]} />
        </ul>
      </Route>
    </MemoryRouter>
  );
}

export function Expanded(): JSX.Element {
  return (
    <ul className={styles.credentialsList}>
      <CredentialCard expand credential={notDownloaded[0]} />
    </ul>
  );
}
