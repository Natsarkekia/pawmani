import { ImageResponse } from "next/og";

export const alt = "Pawmani";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  const pawSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><ellipse cx="256" cy="322" rx="82" ry="66" fill="white"/><ellipse cx="168" cy="232" rx="40" ry="48" fill="white"/><ellipse cx="224" cy="190" rx="40" ry="48" fill="white"/><ellipse cx="288" cy="190" rx="40" ry="48" fill="white"/><ellipse cx="344" cy="232" rx="40" ry="48" fill="white"/></svg>`;
  const pawUrl = `data:image/svg+xml;base64,${Buffer.from(pawSvg).toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #1d4ed8 0%, #1e3a8a 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 28,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={pawUrl} width={130} height={130} alt="" />
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
          <div style={{ fontSize: 100, fontWeight: 800, color: "white", letterSpacing: -4, lineHeight: 1 }}>
            Pawmani
          </div>
          <div style={{ fontSize: 30, color: "rgba(255,255,255,0.6)", letterSpacing: 3 }}>
            Match · Breed · Adopt
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
