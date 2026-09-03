const MODE_ATTRIBUTE = "data-__cbd-mode";
const CONTENT_COLLECTION_SELECTOR = "[data-__cbd-content-collection]";
const LIVE_SELECTOR = `[${MODE_ATTRIBUTE}="live"]`;

export function getIframe() {
    const guestFrame = document.getElementsByName("neos-content-main")[0];
    return guestFrame.contentDocument || guestFrame.contentWindow.document;
}

export function contentCollectionHasChildren(element) {
    return element?.querySelector(CONTENT_COLLECTION_SELECTOR)?.children.length > 0;
}

export function setMode(element, mode) {
    if (element && mode) {
        element.setAttribute(MODE_ATTRIBUTE, mode);
    }
}

export function getMode(element) {
    return element?.getAttribute(MODE_ATTRIBUTE);
}

export function elementMatchesLiveSelector(element) {
    return element?.matches(LIVE_SELECTOR);
}

export function getClosestElementMatchesLiveSelector(element) {
    return element?.closest(LIVE_SELECTOR);
}
