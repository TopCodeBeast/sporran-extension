import { useCallback, useState } from 'react';
import {
  generatePath,
  Route,
  Routes,
  Switch,
  useHistory,
} from 'react-router-dom';

import { importIdentity } from '../../utilities/identities/identities';
import { CreatePassword } from '../CreatePassword/CreatePassword';
import { ImportBackupPhrase } from '../ImportBackupPhrase/ImportBackupPhrase';
import { paths } from '../paths';

export function ImportIdentity(): JSX.Element {
  const [backupPhrase, setBackupPhrase] = useState('');
  const history = useHistory();

  const onImport = useCallback(
    (phrase) => {
      setBackupPhrase(phrase);
      history.push(paths.identity.import.password);
    },
    [history],
  );

  const onSuccess = useCallback(
    async (password: string) => {
      const { address } = await importIdentity(backupPhrase, password);
      history.push(
        generatePath(paths.identity.overview, { address, type: 'imported' }),
      );
    },
    [backupPhrase, history],
  );

  return (
    <Routes>
      <Route
        path={paths.identity.import.start}
        element={<ImportBackupPhrase onImport={onImport} />}
      />
      <Route
        path={paths.identity.import.password}
        element={<CreatePassword onSuccess={onSuccess} />}
      />
    </Routes>
  );
}
