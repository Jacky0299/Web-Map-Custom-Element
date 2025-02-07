import { test, expect, chromium } from '@playwright/test';

test.describe("Adding Opacity Attribute to the <map-extent> Element", () => {
  let page;
  let context;
  test.beforeAll(async function() {
    context = await chromium.launchPersistentContext('');
    page = context.pages().find((page) => page.url() === 'about:blank') || await context.newPage();
    await page.goto("multipleExtentsOpacity.html");
  });
  test.afterAll(async function () {
    await context.close();
  });

  test("Setting Opacity Attibute Value to map-extent Element", async () => {
    let extent_opacity1 = await page.$eval("body > mapml-viewer > layer- > map-extent:nth-child(1)", (extent) => extent.templatedLayer._container.style.opacity);
    expect(extent_opacity1).toEqual('0.9');
    let extent_opacity2 = await page.$eval("body > mapml-viewer > layer- > map-extent:nth-child(2)", (extent) => extent.templatedLayer._container.style.opacity);
    expect(extent_opacity2).toEqual('0.3');
    let extent_opacity3 = await page.$eval("body > mapml-viewer > layer- > map-extent:nth-child(3)", (extent) => extent.templatedLayer._container.style.opacity);
    expect(extent_opacity3).toEqual('0.2');
  });

  test("Opacity Slider Value Matches the Extent Opacity", async () => {
    let opacity_slider_value1 = await page.$eval("div > div.leaflet-control-container > div.leaflet-top.leaflet-right > div > section > div.leaflet-control-layers-overlays > fieldset > div.mapml-layer-item-settings > fieldset > fieldset:nth-child(1) > div.mapml-layer-item-settings > details > input[type=range]", (opacity) => opacity.value);
    let extent_opacity1 = await page.$eval("body > mapml-viewer > layer- > map-extent:nth-child(1)", (extent) => extent.templatedLayer._container.style.opacity);
    let opacity_slider_value2 = await page.$eval("div > div.leaflet-control-container > div.leaflet-top.leaflet-right > div > section > div.leaflet-control-layers-overlays > fieldset > div.mapml-layer-item-settings > fieldset > fieldset:nth-child(2) > div.mapml-layer-item-settings > details > input[type=range]", (opacity) => opacity.value);
    let extent_opacity2 = await page.$eval("body > mapml-viewer > layer- > map-extent:nth-child(2)", (extent) => extent.templatedLayer._container.style.opacity);
    let opacity_slider_value3 = await page.$eval("div > div.leaflet-control-container > div.leaflet-top.leaflet-right > div > section > div.leaflet-control-layers-overlays > fieldset > div.mapml-layer-item-settings > fieldset > fieldset:nth-child(3) > div.mapml-layer-item-settings > details > input[type=range]", (opacity) => opacity.value);
    let extent_opacity3 = await page.$eval("body > mapml-viewer > layer- > map-extent:nth-child(3)", (extent) => extent.templatedLayer._container.style.opacity);
    expect(extent_opacity1).toEqual(opacity_slider_value1);
    expect(extent_opacity2).toEqual(opacity_slider_value2);
    expect(extent_opacity3).toEqual(opacity_slider_value3);
  });
});



      