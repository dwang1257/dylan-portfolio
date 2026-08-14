import { ImageResponse } from "next/og";

export const alt = "Dylan Wang - Software Engineer at IBM";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          backgroundColor: "#000000",
          color: "#ffffff",
          padding: "96px",
          fontFamily: "Helvetica, Arial, sans-serif",
        }}
      >
        <div style={{ fontSize: 96, fontWeight: 700, letterSpacing: "-0.03em" }}>
          Dylan Wang
        </div>
        <div style={{ fontSize: 44, color: "#d1d5db", marginTop: 28 }}>
          Software Engineer at IBM
        </div>
        <div style={{ fontSize: 32, color: "#9ca3af", marginTop: 16 }}>
          Computer Engineering, UMass Amherst
        </div>
        <div style={{ fontSize: 28, color: "#6b7280", marginTop: 56 }}>
          dwang.vercel.app
        </div>
      </div>
    ),
    size
  );
}
