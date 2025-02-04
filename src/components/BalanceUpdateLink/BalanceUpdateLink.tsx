import { Link, generatePath } from 'react-router-dom';
import { browser } from 'webextension-polyfill-ts';

import * as styles from './BalanceUpdateLink.module.css';

import { paths } from '../../views/paths';
import { hasVestedFunds } from '../../utilities/vesting/vesting';
import { useSwrDataOrThrow } from '../../utilities/useSwrDataOrThrow/useSwrDataOrThrow';

interface Props {
  address: string;
}

export function BalanceUpdateLink({ address }: Props): JSX.Element {
  const t = browser.i18n.getMessage;

  const enabled = useSwrDataOrThrow(address, hasVestedFunds, 'hasVestedFunds');

  return (
    <Link
      onClick={(event) => !enabled && event.preventDefault()}
      to={generatePath(paths.identity.vest, { address })}
      className={styles.update}
      aria-disabled={!enabled}
      title={enabled ? undefined : t('component_BalanceUpdateLink_error')}
      aria-label={enabled ? undefined : t('component_BalanceUpdateLink_error')}
    >
      {t('component_BalanceUpdateLink_CTA')}
    </Link>
  );
}
