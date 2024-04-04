import {
  block,
  inline,
  repeating,
  wrapper,
} from "@keystatic/core/content-components";
import * as customFields from "../fields";
import { fields } from "@keystatic/core";
import { CSSUnitEditor } from "../fields/cssUnit";
import { useEffect, useId, useRef, useState } from "react";

export const standardComponents = {
  HeroSection: wrapper({
    label: "Hero Section",
    schema: {
      image: fields.image({
        label: "Background Image",
        directory: "src/assets/images",
        publicPath: "",
      }),
      height: customFields.cssUnit({
        label: "Height",
        description: "height of this section",
        defaultValue: "300px",
      }),
      width: customFields.cssUnit({
        label: "Width",
        description: "Maximum width for this section",
        defaultValue: "100%",
      }),
      panelWidth: customFields.cssUnit({
        label: "Panel Width",
        description: "Width of the overlay panel",
        defaultValue: "250px",
      }),
      panelColor: customFields.colorPicker({
        label: "Background color for panel",
        defaultValue: "#ffffff",
      }),
      textColor: customFields.colorPicker({
        label: "Text color for panel",
        defaultValue: "#000000",
      }),

      parallax: fields.checkbox({ label: "Parallax scroll effect" }),
    },
    ContentView(props) {
      const [imageDataUrl, setImageDataUrl] = useState<any>(null);

      useEffect(() => {
        if (props?.value?.image?.data) {
          const u8intArray = props?.value?.image?.data;

          const blob = new Blob([u8intArray], { type: "image/png" });
          const reader = new FileReader();
          reader.onload = () => {
            setImageDataUrl(reader.result);
          };
          reader.readAsDataURL(blob);
        }
      }, []);

      return (
        <div
          style={{
            backgroundImage: `url(${imageDataUrl})`,
            height: props.value.height,
            maxWidth: props.value.width,
            backgroundSize: "cover",
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
            padding: "2rem",
          }}
        >
          <div
            style={{
              backgroundColor: props.value.panelColor,
              maxWidth: props.value.panelWidth,
              padding: "1rem",
              // @ts-ignore
              "--kui-color-foreground-neutral-emphasis": props.value.textColor,
            }}
          >
            {props.children}
          </div>
        </div>
      );
    },
  }),
  ImagePopout: block({
    label: "Image (with Popout)",
    ContentView(props) {
      const [imageDataUrl, setImageDataUrl] = useState<any>(null);

      useEffect(() => {
        const fetchImage = async () => {
          if (props?.value?.image?.data) {
            const u8intArray = props?.value?.image?.data;
            // console.log(u8intArray);
            const blob = new Blob([u8intArray], { type: "image/png" });
            const reader = new FileReader();
            reader.onload = () => {
              setImageDataUrl(reader.result);
            };
            reader.readAsDataURL(blob);
          }
        };
        fetchImage();
      }, []);

      return (
        <div>
          <img src={imageDataUrl} alt="" />
        </div>
      );
    },
    schema: {
      image: fields.image({
        label: "upload image",
        directory: "src/assets/images",
        publicPath: "",
      }),
      altText: fields.text({
        label: "Alt Text",
        description:
          "A description of the image contents. This is important for accessibility, as it allows non-sighted users to understand the content of the image",
        defaultValue: "",
      }),
      caption: fields.text({
        label: "Caption",
        description: "An optional caption to display below the image. ",
        defaultValue: "",
      }),
    },
  }),
  CodeEmbed: block({
    label: "HTML Embed",
    schema: {
      content: customFields.codeEditor({
        label: "Code",
        description:
          "Use this component to place embed codes, etc. WARNING: don't paste sketchy code from the internet in here unless you know what it does!",
        defaultValue: "",
      }),
    },
    ContentView(props) {
      return <div dangerouslySetInnerHTML={{ __html: props.value.content }} />;
    },
  }),
  SimpleMultiCol: repeating({
    label: "Simple (12-col) Multi-Column Layout",
    children: ["SimpleCol"],
    validation: {
      children: {
        min: 1,
        max: 5,
      },
    },
    schema: {},
    ContentView(props) {
      return (
        <div
          className="column-container-wrapper"
          style={{
            display: "flex",
            flexWrap: "wrap",
            containerName: "simple-col-container",
            containerType: "inline-size",
          }}
        >
          {props.children}
        </div>
      );
    },
  }),

  SimpleCol: wrapper({
    forSpecificLocations: true,
    label: "Col",
    schema: {
      width: fields.number({
        label: "Column Width (2-12)",
        validation: { isRequired: true, min: 2, max: 12 },
        defaultValue: 6,
      }),
    },
    ContentView(props) {
      return (
        <div
          style={{
            width: `${(100 / 14) * (props.value.width || 6)}cqw`,
          }}
        >
          {props.children}
        </div>
      );
    },
  }),
  MultiColumn: repeating({
    label: "Multi-Column Layout",
    children: ["Column"],
    schema: {
      justifyContent: fields.select({
        label: "Justify Content",
        description:
          "if the screen is wider than the items, how are they aligned horizontally?",
        defaultValue: "center",
        options: [
          { label: "Left", value: "flex-start" },
          { label: "Center", value: "center" },
          { label: "Right", value: "flex-end" },
          {
            label: "Justify (space-between)",
            value: "space-between",
          },
          {
            label: "Space evenly",
            value: "space-evenly",
          },
          {
            label: "Equal space around",
            value: "space-around",
          },
        ],
      }),
      alignItems: fields.select({
        label: "Align Items",
        description:
          "If columns have different amounts of content, how are they aligned vertically?",
        defaultValue: "flex-start",
        options: [
          { label: "Top", value: "flex-start" },
          { label: "Bottom", value: "flex-end" },
          { label: "Center", value: "center" },
        ],
      }),
      flexDirection: fields.select({
        label: "Item Order",
        description:
          "When the columns are able to appear side-by-side, what order should they be in?",
        defaultValue: "row",
        options: [
          { label: "Standard", value: "row" },
          { label: "Reverse", value: "row-reverse" },
        ],
      }),
      gap: customFields.cssUnit({
        label: "Gap",
        description: "The gap between columns",
        defaultValue: "10px",
      }),
    },
    ContentView(props) {
      const flexCSS = `
            .column-container-wrapper > span > span{
            display:flex;
            justify-content:${props.value.justifyContent};
            align-items: ${props.value.alignItems};
            flex-direction: ${props.value.flexDirection};
            gap:${props.value.gap};
            flex-wrap:wrap;
            position:relative;

                    }`;
      return (
        <div className="column-container-wrapper">
          <style>{flexCSS}</style>
          {props.children}
        </div>
      );
    },
  }),
  Column: wrapper({
    forSpecificLocations: true,
    label: "Column",

    ContentView(props) {
      const itemID = useId();
      const cssStyles = `.column-container-wrapper > span > span > div:has(#${CSS.escape(
        itemID
      )}){
        flex-basis:${props.value.targetWidth};
        flex-grow:${props.value.flexGrow ? "1" : "0"}
      }`;
      return (
        <div id={itemID} className="col-content-wrapper">
          <style>{cssStyles}</style>
          {props.children}
        </div>
      );
    },
    schema: {
      targetWidth: customFields.cssUnit({
        label: "target width",
        description:
          "the width that this column will 'try' to be if the screen is wide enough.",
        defaultValue: "100px",
      }),
      flexGrow: fields.checkbox({
        label: "Allow to grow",
        description:
          "Allow this column to get larger than the target width if the screen is wide enough",
      }),
    },
  }),
  CustomWidth: wrapper({
    label: "Custom Width Container",
    ContentView(props) {
      return (
        <div style={{ maxWidth: props.value.width }}>{props.children}</div>
      );
    },
    schema: {
      width: customFields.cssUnit({
        label: "Max Width",
        defaultValue: "100vw",
      }),
    },
  }),
};
