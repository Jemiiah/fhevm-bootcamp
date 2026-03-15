import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          background: "#FFC517",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span
          style={{
            fontSize: 20,
            fontWeight: 900,
            color: "#000000",
            fontFamily: "monospace",
            lineHeight: 1,
          }}
        >
          F
        </span>
      </div>
    ),
    { ...size }
  );
}
