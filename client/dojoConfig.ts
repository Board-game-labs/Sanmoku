import { createDojoConfig } from "@dojoengine/core";

import manifest from "../contract/manifest_sepolia.json";

export const dojoConfig = createDojoConfig({
    manifest,
});
