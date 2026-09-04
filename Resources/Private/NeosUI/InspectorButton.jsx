import React, { useEffect, useState } from "react";
import { Icon, Button } from "@neos-project/react-ui-components";
import { decorateFunction, createEventBus } from "./Helper";

function InspectorButton({ labels, focusedNodePath }) {
    const [isEdit, setIsEdit] = useState(false);
    const [isCBD, setIsCBD] = useState(false);
    const [eventBus, setEventBus] = useState(null);

    useEffect(() => {
        console.log("init inspector button");
        const eventBus = createEventBus(focusedNodePath, { from: "Inspector", to: "Toolbar" }, ({ isEdit, isCBD }) => {
            setIsEdit(isEdit);
            setIsCBD(isCBD);
        });
        setEventBus(eventBus);

        eventBus.on();
        return () => {
            console.log("remove inspector button");
            eventBus.remove();
        };
    }, [focusedNodePath]);

    if (!isCBD) {
        return null;
    }

    return (
        <Button
            style="lighter"
            onClick={() => {
                eventBus?.dispatch({ isEdit: !isEdit });
                setIsEdit(!isEdit);
            }}
        >
            <Icon icon={isEdit ? "eye" : "edit"} padded="right" />
            <span>{isEdit ? labels.live : labels.edit}</span>
        </Button>
    );
}

export default decorateFunction(InspectorButton);
