import { needLegacyDidCrypto } from '../did/did';
import { IdentitiesMap } from '../identities/types';
import { useIdentities } from '../identities/identities';
import { useSwrDataOrThrow } from '../useSwrDataOrThrow/useSwrDataOrThrow';

export async function getLegacyDidIdentities(
  identities: IdentitiesMap = {},
): Promise<IdentitiesMap> {
  const legacyDidIdentities: IdentitiesMap = {};

  for (const identity of Object.values(identities)) {
    if (await needLegacyDidCrypto(identity.did)) {
      legacyDidIdentities[identity.address] = identity;
    }
  }
  return legacyDidIdentities;
}

export function useLegacyDidIdentities(): IdentitiesMap {
  const identities = useIdentities().data;

  return (
    useSwrDataOrThrow(
      identities,
      getLegacyDidIdentities,
      'getLegacyDidIdentities',
    ) || {}
  );
}
