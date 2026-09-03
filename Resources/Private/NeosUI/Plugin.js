import manifest from '@neos-project/neos-ui-extensibility';

import ToggleButton from './ToggleButton';
import { getClosestElementMatchesLiveSelector, getIframe } from './Helper';
import { findNodeInGuestFrame } from "@neos-project/neos-ui-guest-frame";

let timeout = null;

manifest('Carbon.CBD.ToggleButton', {}, (globalRegistry) => {
    const guestFrameRegistry = globalRegistry.get('@neos-project/neos-ui-guest-frame');
    guestFrameRegistry.set('NodeToolbar/Buttons/ToggleButton', ToggleButton, 'start 999');

    const serverFeedbackHandlers = globalRegistry.get('serverFeedbackHandlers');

    const reloadIfNeeded = (contextPath) => {
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
    };

    serverFeedbackHandlers.set('Neos.Neos.Ui:RenderContentOutOfBand/CarbonCBD', ({ contextPath }) => {
        setTimeout(() => {
            reloadIfNeeded(contextPath);
        }, 10);
    }, 'after Neos.Neos.Ui:RenderContentOutOfBand/Main');

    serverFeedbackHandlers.set('Neos.Neos.Ui:RemoveNode/CarbonCBD', ({ contextPath }) => {
        reloadIfNeeded(contextPath);
    }, 'before Neos.Neos.Ui:RemoveNode/Main');

    serverFeedbackHandlers.set('Neos.Neos.Ui:UpdateNodeInfo/CarbonCBD', ({ byContextPath }) => {
        Object.values(byContextPath).forEach(({ contextPath }) => {
            reloadIfNeeded(contextPath);
        });
    }, 'after Neos.Neos.Ui:UpdateNodeInfo/Main');
});
