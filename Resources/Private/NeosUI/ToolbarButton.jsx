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
    eventBus,
} from "./Helper";

function ToolbarButton({ labels, focusedNodePath }) {
    const [isEdit, setIsEdit] = useState(false);
    const [node, setNode] = useState(null);
    const [isCBD, setIsCBD] = useState(false);
    const [iframeDocument, setIframeDocument] = useState(null);

    const getIframeDocument = () => {
        if (iframeDocument) {
            return iframeDocument;
        }
        const doc = getIframe();
        setIframeDocument(doc);
        return doc;
    };

    useEffect(() => {
        eventBus.on("Carbon.CBD:ToggleButton", (isEdit) => {
            setIsEdit(isEdit);
        });
        return () => {
            eventBus.remove("Carbon.CBD:ToggleButton");
        };
    }, []);

    useEffect(() => {
        const foundNode = findNodeInGuestFrame(focusedNodePath);
        const mode = getMode(foundNode);
        const hasChildren = contentCollectionHasChildren(foundNode);

        if (!mode || !hasChildren) {
            setIsCBD(false);
            setIsEdit(false);
            setNode(null);
            return;
        }

        setIsCBD(true);
        setIsEdit(mode === "edit");
        setNode(foundNode);
    }, [focusedNodePath]);

    useEffect(() => {
        if (!node) {
            return;
        }
        if (isEdit) {
            setMode(node, "edit");
            return;
        }
        getIframeDocument()?.location.reload();
    }, [isEdit]);

    useEffect(() => {
        eventBus.dispatch("Carbon.CBD:ToolbarButton", { isEdit, isCBD });
    }, [isEdit, isCBD]);

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
