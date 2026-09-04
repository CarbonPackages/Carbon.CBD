import React, { useEffect, useState } from "react";
import { IconButton } from "@neos-project/react-ui-components";
import { findNodeInGuestFrame } from "@neos-project/neos-ui-guest-frame";
import {
    setMode,
    getMode,
    elementMatchesLiveSelector,
    getClosestElementMatchesLiveSelector,
    contentCollectionHasChildren,
    getIframe,
    decorateFunction,
    createEventBus,
} from "./Helper";

function ToolbarButton({ labels, focusedNodePath }) {
    const [isEdit, setIsEdit] = useState(false);
    const [node, setNode] = useState(null);
    const [isCBD, setIsCBD] = useState(false);
    const [iframeDocument, setIframeDocument] = useState(null);
    const [eventBus, setEventBus] = useState(null);

    const getIframeDocument = () => {
        if (iframeDocument) {
            return iframeDocument;
        }
        const doc = getIframe();
        setIframeDocument(doc);
        return doc;
    };

    useEffect(() => {
        console.log("init toolbar button");

        const eventBus = createEventBus(focusedNodePath, { from: "Toolbar", to: "Inspector" }, ({ isEdit }) => {
            setIsEdit(isEdit);
        });

        let foundNode = findNodeInGuestFrame(focusedNodePath);
        const mode = getMode(foundNode);
        const hasChildren = contentCollectionHasChildren(foundNode);

        let cbd = true;
        let edit = mode === "edit";

        if (!mode || !hasChildren) {
            cbd = false;
            foundNode = null;
        }

        setIsCBD(cbd);
        setIsEdit(edit);
        setNode(foundNode);
        setEventBus(eventBus);

        eventBus.on();
        eventBus.dispatch({ isEdit: edit, isCBD: cbd });

        return () => {
            console.log("remove toolbar button");
            eventBus.remove();
        };
    }, [focusedNodePath]);

    useEffect(() => {
        if (!node) {
            return;
        }
        eventBus?.dispatch({ isEdit: !!isEdit, isCBD: true });
        if (isEdit) {
            setMode(node, "edit");
            return;
        }
        getIframeDocument()?.location.reload();
    }, [isEdit]);

    if (!isCBD) {
        return null;
    }

    return (
        <IconButton
            id="neos-InlineToolbar-CarbonCBD"
            icon={isEdit ? "eye" : "edit"}
            onClick={() => setIsEdit((prev) => !prev)}
            hoverStyle="brand"
            title={isEdit ? labels.live : labels.edit}
        />
    );
}

export default decorateFunction(ToolbarButton);
