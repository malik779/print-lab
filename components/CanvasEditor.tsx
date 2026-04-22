"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { FabricImage, Canvas, Rect, Textbox } from "fabric";
import { DesignTemplate, SavedDesign } from "@/lib/types";

type Props = {
  productImage: string;
  templates: DesignTemplate[];
  onSave: (design: SavedDesign, artworkFile: File | null) => void;
};

export function CanvasEditor({ productImage, templates, onSave }: Props) {
  const canvasEl = useRef<HTMLCanvasElement | null>(null);
  const fabricRef = useRef<Canvas | null>(null);
  const designObjRef = useRef<FabricImage | Textbox | null>(null);
  const [areaName, setAreaName] = useState<string>(templates[0]?.area_name ?? "front");
  const [artworkFile, setArtworkFile] = useState<File | null>(null);

  const activeTemplate = useMemo(
    () => templates.find((t) => t.area_name === areaName) ?? templates[0],
    [areaName, templates]
  );

  useEffect(() => {
    if (!canvasEl.current) return;
    const canvas = new Canvas(canvasEl.current, {
      width: 500,
      height: 650,
      backgroundColor: "#fff"
    });

    fabricRef.current = canvas;

    FabricImage.fromURL(productImage).then((img) => {
      img.set({ selectable: false, evented: false });
      img.scaleToWidth(500);
      img.set({ top: 0, left: 0 });
      canvas.backgroundImage = img;
      canvas.requestRenderAll();
    });

    return () => {
      canvas.dispose();
    };
  }, [productImage]);

  useEffect(() => {
    const canvas = fabricRef.current;
    if (!canvas || !activeTemplate) return;

    canvas.getObjects("rect").forEach((obj) => canvas.remove(obj));

    const printableArea = new Rect({
      left: activeTemplate.x,
      top: activeTemplate.y,
      width: activeTemplate.width,
      height: activeTemplate.height,
      fill: "transparent",
      stroke: "#2563eb",
      strokeDashArray: [8, 6],
      selectable: false,
      evented: false
    });

    canvas.add(printableArea);
    printableArea.moveTo(1);
    canvas.requestRenderAll();
  }, [activeTemplate]);

  function clampToArea() {
    const canvas = fabricRef.current;
    if (!canvas || !designObjRef.current || !activeTemplate) return;
    const obj = designObjRef.current;
    obj.setCoords();
    const bounds = obj.getBoundingRect();

    const minX = activeTemplate.x;
    const minY = activeTemplate.y;
    const maxX = activeTemplate.x + activeTemplate.width;
    const maxY = activeTemplate.y + activeTemplate.height;

    let left = obj.left ?? 0;
    let top = obj.top ?? 0;

    if (bounds.left < minX) {
      left += minX - bounds.left;
    }
    if (bounds.top < minY) {
      top += minY - bounds.top;
    }
    if (bounds.left + bounds.width > maxX) {
      left -= bounds.left + bounds.width - maxX;
    }
    if (bounds.top + bounds.height > maxY) {
      top -= bounds.top + bounds.height - maxY;
    }

    obj.set({ left, top });
    obj.setCoords();
    canvas.requestRenderAll();
  }

  function attachObjectHandlers() {
    const canvas = fabricRef.current;
    if (!canvas || !designObjRef.current) return;
    designObjRef.current.on("moving", clampToArea);
    designObjRef.current.on("scaling", clampToArea);
    designObjRef.current.on("rotating", clampToArea);
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !activeTemplate) return;
    setArtworkFile(file);

    const canvas = fabricRef.current;
    if (!canvas) return;

    if (designObjRef.current) {
      canvas.remove(designObjRef.current);
    }

    const dataUrl = URL.createObjectURL(file);
    const img = await FabricImage.fromURL(dataUrl);
    img.set({
      left: activeTemplate.x + 30,
      top: activeTemplate.y + 30,
      cornerStyle: "circle",
      transparentCorners: false
    });
    img.scaleToWidth(Math.min(activeTemplate.width * 0.75, 240));
    canvas.add(img);
    designObjRef.current = img;
    attachObjectHandlers();
    clampToArea();
  }

  function addText() {
    if (!activeTemplate) return;
    const canvas = fabricRef.current;
    if (!canvas) return;
    const text = new Textbox("Printlab", {
      left: activeTemplate.x + 24,
      top: activeTemplate.y + 24,
      width: activeTemplate.width - 48,
      fontSize: 40,
      fill: "#0f172a"
    });
    if (designObjRef.current) {
      canvas.remove(designObjRef.current);
    }
    canvas.add(text);
    designObjRef.current = text;
    attachObjectHandlers();
    clampToArea();
  }

  function save() {
    const canvas = fabricRef.current;
    const obj = designObjRef.current;
    if (!canvas || !obj || !activeTemplate) return;

    const saved: SavedDesign = {
      x: obj.left ?? 0,
      y: obj.top ?? 0,
      scale: obj.scaleX ?? 1,
      rotation: obj.angle ?? 0,
      image_url: artworkFile?.name ?? "text-only",
      text: obj instanceof Textbox ? obj.text ?? "" : undefined,
      area_name: activeTemplate.area_name,
      preview_data_url: canvas.toDataURL({ format: "png", multiplier: 1 })
    };

    onSave(saved, artworkFile);
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
      <div className="rounded-xl border bg-white p-3">
        <canvas ref={canvasEl} />
      </div>
      <aside className="space-y-4 rounded-xl border bg-white p-4">
        <div>
          <label className="mb-1 block text-sm font-medium">Print area</label>
          <select
            value={areaName}
            onChange={(e) => setAreaName(e.target.value)}
            className="w-full rounded-md border p-2"
          >
            {templates.map((template) => (
              <option key={template.id} value={template.area_name}>
                {template.area_name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Upload artwork</label>
          <input type="file" accept="image/*" onChange={handleUpload} className="w-full text-sm" />
        </div>
        <button onClick={addText} className="w-full rounded-md border px-3 py-2 text-sm font-medium">
          Add text
        </button>
        <button onClick={save} className="w-full rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white">
          Save design
        </button>
      </aside>
    </div>
  );
}
