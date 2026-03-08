import { getSiteProfile } from './site-profiles';
import { startPolling } from './poller';

const profile = getSiteProfile(location.hostname);
if (profile) {
  startPolling(document);
}
