export default {
  multipass: true,
  plugins: [
    "removeDoctype",
    "removeXMLProcInst",
    "removeComments",
    "removeMetadata",
    "removeEditorsNSData",
    "removeEmptyAttrs",
    "removeHiddenElems",
    "removeEmptyText",
    "removeEmptyContainers",
    "cleanupAttrs",
    "mergeStyles",
    "inlineStyles",
    "minifyStyles",
    "convertStyleToAttrs",
    "cleanupEnableBackground",
    "removeUselessDefs",

    {
      name: "cleanupNumericValues",
      params: { floatPrecision: 2 }
    },
    {
      name: "convertPathData",
      params: { floatPrecision: 2 }
    },

    "mergePaths",
    "collapseGroups",

    // 👇 to dodaje xmlns automatycznie
    {
      name: "addAttributesToSVGElement",
      params: {
        attributes: [
          { xmlns: "http://www.w3.org/2000/svg" }
        ]
      }
    }
  ]
}
