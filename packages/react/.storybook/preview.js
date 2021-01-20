import { ModalRoot } from "@amfa-team/theme-service";
import { MINIMAL_VIEWPORTS } from "@storybook/addon-viewport";
import { RecoilRoot } from "recoil";
import "@amfa-team/theme-service/dist/index.css";
import "@amfa-team/user-service/dist/index.css";

const customViewports = Object.keys(MINIMAL_VIEWPORTS).reduce((acc, key) => {
  acc[`${key}Rotated`] = {
    name: `${MINIMAL_VIEWPORTS[key].name} Rotated`,
    styles: {
      width: MINIMAL_VIEWPORTS[key].styles.height,
      height: MINIMAL_VIEWPORTS[key].styles.width,
    },
    type: MINIMAL_VIEWPORTS[key].type,
  };
  return acc;
}, {});

const viewports = {
  ...MINIMAL_VIEWPORTS,
  ...customViewports,
};

export const parameters = {
  layout: "fullscreen",
  viewport: { viewports },
};

export const decorators = [
  (Story) => (
    <RecoilRoot>
      <ModalRoot />
      <Story />
    </RecoilRoot>
  ),
];
