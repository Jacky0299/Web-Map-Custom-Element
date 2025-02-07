import { test, expect, chromium } from '@playwright/test';

test.describe("Playwright Layer Context Menu Tests", () => {
  let page;
  let context;
  test.beforeAll(async () => {
    context = await chromium.launchPersistentContext('');
    page = context.pages().find((page) => page.url() === 'about:blank') || await context.newPage();
    await page.goto("layerContextMenu.html");
  });

  test.afterAll(async function () {
    await context.close();
  });

  test("Layer context menu shows when layer is clicked", async () => {
    await page.hover("div > div.leaflet-control-container > div.leaflet-top.leaflet-right > div");
    await page.click("div > div.leaflet-control-container > div.leaflet-top.leaflet-right > div > section > div.leaflet-control-layers-overlays > fieldset:nth-child(1) > div:nth-child(1) > label > span",
      { button: "right" });

    const aHandle = await page.evaluateHandle(() => document.querySelector("mapml-viewer"));
    const nextHandle = await page.evaluateHandle(doc => doc.shadowRoot, aHandle);
    const resultHandle = await page.evaluateHandle(root => root.querySelector(".mapml-contextmenu.mapml-layer-menu"), nextHandle);

    const menuDisplay = await (await page.evaluateHandle(elem => window.getComputedStyle(elem).getPropertyValue("display"), resultHandle)).jsonValue();

    expect(menuDisplay).toEqual("block");
  });

  test("Layer context menu copy layer", async () => {
    await page.hover("div > div.leaflet-control-container > div.leaflet-top.leaflet-right > div");
    await page.click("div > div.leaflet-control-container > div.leaflet-top.leaflet-right > div > section > div.leaflet-control-layers-overlays > fieldset:nth-child(1) > div:nth-child(1) > label > span",
      { button: "right" });
    
    await page.keyboard.press("l");
    await page.click("body > textarea#messageLayer");
    await page.keyboard.press("Control+v");
    const copyLayer = await page.$eval(
      "body > textarea#messageLayer",
      (text) => text.value
    );
    
    expect(copyLayer).toEqual("<layer- label=\"CBMT - INLINE\" checked=\"\">\n      <map-link rel=\"license\" title=\"Testing Inc.\"></map-link>\n      <map-extent units=\"CBMTILE\" hidden=\"\">\n        <map-input name=\"zoomLevel\" type=\"zoom\" value=\"3\" min=\"0\" max=\"3\"></map-input>\n        <map-input name=\"row\" type=\"location\" axis=\"row\" units=\"tilematrix\" min=\"14\" max=\"21\"></map-input>\n        <map-input name=\"col\" type=\"location\" axis=\"column\" units=\"tilematrix\" min=\"14\" max=\"19\"></map-input>\n        <map-link rel=\"tile\" tref=\"http://localhost:30001/data/cbmt/{zoomLevel}/c{col}_r{row}.png\"></map-link>\n      </map-extent>\n    </layer->");
  });

  test("Map zooms in to layer 2", async () => {
    await page.hover("div > div.leaflet-control-container > div.leaflet-top.leaflet-right > div");
    await page.click("div > div.leaflet-control-container > div.leaflet-top.leaflet-right > div > section > div.leaflet-control-layers-overlays > fieldset:nth-child(2) > div:nth-child(1) > label > span",
      { button: "right", force: true });
    await page.keyboard.press("z");
    await page.waitForTimeout(1000);
    const mapLocation = await page.$eval(
      "body > mapml-viewer",
      (text) => text._map.getPixelBounds()
    );

    const mapZoom = await page.$eval(
      "body > mapml-viewer",
      (text) => text._map.getZoom()
    );

    expect(mapZoom).toEqual(11);
    expect(mapLocation).toEqual({ max: { x: 43380, y: 43130 }, min: { x: 42380, y: 42630 } });
  });

  test("Map zooms out to layer 3", async () => {
    for (let i = 0; i < 5; i++) {
      await page.click("div > div.leaflet-control-container > div.leaflet-top.leaflet-left > div.leaflet-control-zoom.leaflet-bar.leaflet-control > a.leaflet-control-zoom-in");
      await page.waitForTimeout(200);
    }
    await page.hover("div > div.leaflet-control-container > div.leaflet-top.leaflet-right > div");
    await page.click("div > div.leaflet-control-container > div.leaflet-top.leaflet-right > div > section > div.leaflet-control-layers-overlays > fieldset:nth-child(3) > div:nth-child(1) > label > span",
      { button: "right", force: true });
    await page.keyboard.press("z");
    await page.waitForTimeout(1000);
    const mapLocation = await page.$eval(
      "body > mapml-viewer",
      (text) => text._map.getPixelBounds()
    );

    const mapZoom = await page.$eval(
      "body > mapml-viewer",
      (text) => text._map.getZoom()
    );

    expect(mapZoom).toEqual(11);
    expect(mapLocation).toEqual({ max: { x: 43380, y: 43557 }, min: { x: 42380, y: 43057 } });
  });

  test("Map zooms out to layer 4", async () => {
    for (let i = 0; i < 5; i++) {
      await page.click("div > div.leaflet-control-container > div.leaflet-top.leaflet-left > div.leaflet-control-zoom.leaflet-bar.leaflet-control > a.leaflet-control-zoom-in");
      await page.waitForTimeout(200);
    }
    await page.hover("div > div.leaflet-control-container > div.leaflet-top.leaflet-right > div");
    await page.click("div > div.leaflet-control-container > div.leaflet-top.leaflet-right > div > section > div.leaflet-control-layers-overlays > fieldset:nth-child(4) > div:nth-child(1) > label > span",
      { button: "right", force: true });
    await page.keyboard.press("z");
    await page.waitForTimeout(1000);
    const mapLocation = await page.$eval(
      "body > mapml-viewer",
      (text) => text._map.getPixelBounds()
    );

    const mapZoom = await page.$eval(
      "body > mapml-viewer",
      (text) => text._map.getZoom()
    );

    expect(mapZoom).toEqual(5);
    expect(mapLocation).toEqual({ max: { x: 8334, y: 8084 }, min: { x: 7334, y: 7584 } });
  });

  test("Copy layer with relative src attribute", async () => {
    await page.hover("div > div.leaflet-control-container > div.leaflet-top.leaflet-right > div");
    await page.click("div > div.leaflet-control-container > div.leaflet-top.leaflet-right > div > section > div.leaflet-control-layers-overlays > fieldset:nth-child(5) > div:nth-child(1) > label > span",
      { button: "right" });
    
    await page.keyboard.press("l");
    await page.click("body > textarea#messageLayer");
    await page.keyboard.press("Control+a");
    await page.keyboard.press("Backspace");
    await page.keyboard.press("Control+v");
    const copyLayer = await page.$eval(
      "body > textarea#messageLayer",
      (text) => text.value
    );
    
    expect(copyLayer).toEqual("<layer- src=\"http://localhost:30001/data/query/DouglasFir\" label=\"Natural Resources Canada - Douglas Fir (Genus Pseudotsuga) 250m resolution\"></layer->");
  });

  
});
