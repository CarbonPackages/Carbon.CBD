import React, { useEffect, useState } from "react";
import { Icon, Button } from "@neos-project/react-ui-components";
import { decorateFunction, eventBus } from "./Helper";

function ToggleButton({ labels, focusedNodePath }) {
    const [isEdit, setIsEdit] = useState(false);
    const [isCBD, setIsCBD] = useState(false);

    useEffect(() => {
        eventBus.on("Carbon.CBD:ToolbarButton", ({ isEdit, isCBD }) => {
            setIsEdit(isEdit);
            setIsCBD(isCBD);
        });
        return () => {
            eventBus.remove("Carbon.CBD:ToolbarButton");
        };
    }, []);

    if (!isCBD) {
        return null;
    }

    return (
        <Button
            style="lighter"
            onClick={() => {
                eventBus.dispatch("Carbon.CBD:ToggleButton", !isEdit);
                setIsEdit(!isEdit);
            }}
        >
            <Icon icon={isEdit ? "eye" : "edit"} padded="right" />
            <span>{isEdit ? labels.live : labels.edit}</span>
        </Button>
    );
}

export default decorateFunction(ToggleButton);
