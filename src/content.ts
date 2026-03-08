import { extractCode } from './extractor';
import { getSiteProfile } from './site-profiles';

const profile = getSiteProfile(location.hostname);
if (profile) {
  const code = extractCode(document);
  if (code) {
    chrome.runtime.sendMessage({
      type: 'CODE_EXTRACTED',
      code,
      pageTitle: document.title,
      site: profile.name
    });
  }
}
