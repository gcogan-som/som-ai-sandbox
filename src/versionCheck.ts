/**
 * After a new Hosting deploy, staff may still run an old JS bundle from disk cache.
 * We compare the build id baked into this bundle with `version.json` from the server
 * (always fetched with no-store) and reload once when the server is newer.
 */
type VersionPayload = { buildId?: string };

let reloadScheduled = false;

async function fetchServerBuildId(): Promise<string | null> {
    const url = new URL('version.json', document.baseURI);
    url.searchParams.set('t', String(Date.now()));
    const res = await fetch(url.href, { cache: 'no-store' });
    if (!res.ok) return null;
    const data = (await res.json()) as VersionPayload;
    return typeof data.buildId === 'string' ? data.buildId : null;
}

export async function checkForNewerDeployment(): Promise<void> {
    if (reloadScheduled || import.meta.env.DEV) return;
    try {
        const serverId = await fetchServerBuildId();
        if (serverId === null || serverId === __DEPLOY_BUILD_ID__) return;
        reloadScheduled = true;
        window.location.reload();
    } catch {
        /* offline or blocked; ignore */
    }
}

/** Run a check after load and whenever the user returns to the tab. */
export function startDeployVersionWatcher(): void {
    if (import.meta.env.DEV) return;

    const runLater = () => {
        void checkForNewerDeployment();
    };

    window.setTimeout(runLater, 4000);
    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') runLater();
    });
}
