import manifest from "@neos-project/neos-ui-extensibility";
import ToolbarButton from "./ToolbarButton";
import InspectorButton from "./InspectorButton";
import { reloadIfNeeded } from "./Helper";

manifest("Carbon.CBD", {}, (globalRegistry) => {
    const viewsRegistry = globalRegistry.get("inspector").get("views");

    viewsRegistry.set(`Carbon.CBD/InspectorButton`, {
        component: InspectorButton,
    });

    const guestFrameRegistry = globalRegistry.get("@neos-project/neos-ui-guest-frame");
    guestFrameRegistry.set("NodeToolbar/Buttons/ToolbarButton", ToolbarButton, "start 999");

    const serverFeedbackHandlers = globalRegistry.get("serverFeedbackHandlers");

    serverFeedbackHandlers.set(
        "Neos.Neos.Ui:RenderContentOutOfBand/CarbonCBD",
        ({ contextPath }) => {
            setTimeout(() => {
                reloadIfNeeded(contextPath);
            }, 10);
        },
        "after Neos.Neos.Ui:RenderContentOutOfBand/Main",
    );

    serverFeedbackHandlers.set(
        "Neos.Neos.Ui:RemoveNode/CarbonCBD",
        ({ contextPath }) => {
            reloadIfNeeded(contextPath);
        },
        "before Neos.Neos.Ui:RemoveNode/Main",
    );

    serverFeedbackHandlers.set(
        "Neos.Neos.Ui:UpdateNodeInfo/CarbonCBD",
        ({ byContextPath }) => {
            Object.values(byContextPath).forEach(({ contextPath }) => {
                reloadIfNeeded(contextPath);
            });
        },
        "after Neos.Neos.Ui:UpdateNodeInfo/Main",
    );
});
