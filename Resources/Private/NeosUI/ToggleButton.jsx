import React, { useEffect, useState } from "react";
import { IconButton } from "@neos-project/react-ui-components";
import { connect } from "react-redux";
import { selectors } from "@neos-project/neos-ui-redux-store";
import { neos } from "@neos-project/neos-ui-decorators";
import { findNodeInGuestFrame } from "@neos-project/neos-ui-guest-frame";
import {
    setMode,
    getMode,
    elementMatchesLiveSelector,
    getClosestElementMatchesLiveSelector,
    contentCollectionHasChildren,
    getIframe,
} from "./Helper";

function ToggleButton({ labels, focusedNodePath }) {
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

export default neosifier(connector(ToggleButton));
