import { FeatureCollection, MultiPolygon, Polygon, Position } from "geojson";

export const generateBorderTexture = async (
    geoData: FeatureCollection<Polygon | MultiPolygon>,
    width: number = 2048,
    height: number = 1024
): Promise<HTMLCanvasElement> => {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, width, height);

    ctx.strokeStyle = "white";
    ctx.lineWidth = 1;

    geoData.features.forEach((feature) => {
        const { type, coordinates } = feature.geometry;
        if (type === "Polygon") {
            drawPolygon(ctx, coordinates);
        } else if (type === "MultiPolygon") {
            coordinates.forEach((polygon) => drawPolygon(ctx, polygon));
        }
    });

    return canvas;
};

export const generateCountryDataTexture = async (
    geoData: FeatureCollection<Polygon | MultiPolygon>,
    width: number = 2048,
    height: number = 1024
): Promise<HTMLCanvasElement> => {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, width, height);

    geoData.features.forEach((feature, index) => {
        const { type, coordinates } = feature.geometry;

        const r = (index >> 16) & 0xff;
        const g = (index >> 8) & 0xff;
        const b = index & 0xff;
        ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;

        if (type === "Polygon") {
            drawPolygon(ctx, coordinates);
        } else if (type === "MultiPolygon") {
            coordinates.forEach((polygon) => drawPolygon(ctx, polygon));
        }
    });

    return canvas;
};

const drawPolygon = (ctx: CanvasRenderingContext2D, coordinates: Position[][]) => {
    coordinates.forEach((ring) => {
        ctx.beginPath();
        ring.forEach(([lng, lat], i) => {
            const x = ((lng + 180) / 360) * ctx.canvas.width;
            const y = ((90 - lat) / 180) * ctx.canvas.height;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        });
        ctx.closePath();
        ctx.fill();
    });
};
