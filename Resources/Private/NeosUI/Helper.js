import { findNodeInGuestFrame } from "@neos-project/neos-ui-guest-frame";
import { connect } from "react-redux";
import { selectors } from "@neos-project/neos-ui-redux-store";
import { neos } from "@neos-project/neos-ui-decorators";

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

let timeout = null;

export function reloadIfNeeded(contextPath) {
    const currentElement = findNodeInGuestFrame(contextPath);
    const cbdElement = getClosestElementMatchesLiveSelector(currentElement);
    if (cbdElement) {
        if (timeout) {
            clearTimeout(timeout);
        }
        timeout = setTimeout(() => {
            getIframe()?.location.reload();
        }, 100);
    }
}

const neosifier = neos((globalRegistry) => {
    const labels = {};
    ["edit", "live"].map((label) => {
        labels[label] = globalRegistry.get("i18n").translate(`Carbon.CBD:Main:${label}`);
    });
    return {
        labels,
    };
});

const connector = connect((state) => ({
    focusedNodePath: selectors.CR.Nodes.focusedNodePathSelector(state),
}));

export function decorateFunction(Component) {
    return neosifier(connector(Component));
}

export const eventBus = {
    on(event, callback) {
        document.addEventListener(event, (e) => callback(e.detail));
    },
    dispatch(event, data) {
        document.dispatchEvent(new CustomEvent(event, { detail: data }));
    },
    remove(event, callback) {
        document.removeEventListener(event, callback);
    },
};
