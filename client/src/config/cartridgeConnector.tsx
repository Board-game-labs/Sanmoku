import { Connector } from "@starknet-react/core";
import { ControllerConnector } from "@cartridge/connector";
import { ColorMode, SessionPolicies } from "@cartridge/presets";
// import ControllerOptions from the correct package if needed
// import type { ControllerOptions } from "@cartridge/connector";
import { constants } from "starknet";

const { VITE_PUBLIC_DEPLOY_TYPE } = import.meta.env;
const { VITE_PUBLIC_SLOT_ADDRESS } = import.meta.env;

// const WORLD_ADDRESS = '0x024af3859a26f850ade5dbae4078e8140570811cf7933356a5091429aaa5c17c'
const SANMOKU_ADDRESS = '0x04553003e15c59ca569a2c7b39a19eb772e0258634a685421ab5a01b160fdde9'


const policies: SessionPolicies = {
  contracts: {
    [SANMOKU_ADDRESS]: {
      methods: [
        { name: "initiate_game", entrypoint: "initiate_game" },
        // { name: "join game", entrypoint: "join_game" },
        // { name: "play move", entrypoint: "play_game" },
        // { name: "restart game", entrypoint: "restart_game" },
      ],
    },
  },
}

// Controller basic configuration
const colorMode: ColorMode = "dark";
const theme = "bytebeasts-tamagotchi";

const getRpcUrl = () => {
  switch (VITE_PUBLIC_DEPLOY_TYPE) {
    case "mainnet":
      return "https://api.cartridge.gg/x/starknet/mainnet";
    case "sepolia":
      return "https://api.cartridge.gg/x/starknet/sepolia";
    case "katana":
      return "https://api.cartridge.gg/x/course/katana";
    default:
      return VITE_PUBLIC_SLOT_ADDRESS;
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const options: any = {
  rpc: getRpcUrl(),
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  chains: [
    {
      rpcUrl: "https://api.cartridge.gg/x/starknet/sepolia",
    },
  ],
  defaultChainId: VITE_PUBLIC_DEPLOY_TYPE === 'mainnet' ?  constants.StarknetChainId.SN_MAIN : constants.StarknetChainId.SN_SEPOLIA,
  policies,
  theme,
  colorMode,
  namespace: "sanmoku", 
  slot: "course", 
};

const cartridgeConnector = new ControllerConnector(
  options,
) as never as Connector;

export default cartridgeConnector;