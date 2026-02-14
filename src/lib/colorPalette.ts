export interface ColorInfo {
  name: string;
  hex: string;
  rgb: [number, number, number];
  cmyk: [number, number, number, number];
  hsb: [number, number, number];
  hsl: [number, number, number];
  lab: [number, number, number];
}

export const colorPalette: ColorInfo[] = [
  {
    name: "Aquamarine",
    hex: "5dfdcb",
    rgb: [93, 253, 203],
    cmyk: [63, 0, 20, 1],
    hsb: [161, 63, 99],
    hsl: [161, 98, 68],
    lab: [90, -53, 12]
  },
  {
    name: "Maya Blue",
    hex: "7cc6fe",
    rgb: [124, 198, 254],
    cmyk: [51, 22, 0, 0],
    hsb: [206, 51, 100],
    hsl: [206, 98, 74],
    lab: [77, -8, -35]
  },
  {
    name: "Alice Blue",
    hex: "f4faff",
    rgb: [244, 250, 255],
    cmyk: [4, 2, 0, 0],
    hsb: [207, 4, 100],
    hsl: [207, 100, 98],
    lab: [98, -1, -3]
  },
  {
    name: "Lavender Grey",
    hex: "8789c0",
    rgb: [135, 137, 192],
    cmyk: [30, 29, 0, 25],
    hsb: [238, 30, 75],
    hsl: [238, 31, 64],
    lab: [59, 12, -29]
  },
  {
    name: "Black",
    hex: "08090a",
    rgb: [8, 9, 10],
    cmyk: [20, 10, 0, 96],
    hsb: [210, 20, 4],
    hsl: [210, 11, 4],
    lab: [2, 0, 0]
  }
];

export const colorPaletteObject = {
  Aquamarine: "5dfdcb",
  "Maya Blue": "7cc6fe",
  "Alice Blue": "f4faff",
  "Lavender Grey": "8789c0",
  Black: "08090a"
};

export const colorPaletteArray = ["5dfdcb", "7cc6fe", "f4faff", "8789c0", "08090a"];

export const colorPaletteCSV = "5dfdcb,7cc6fe,f4faff,8789c0,08090a";
