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
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#1d4ed8",
          borderRadius: 8,
        }}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="4" r="2" />
          <circle cx="18" cy="8" r="2" />
          <circle cx="4" cy="8" r="2" />
          <circle cx="18" cy="16" r="2" />
          <circle cx="4" cy="16" r="2" />
          <path d="M12 22c-4 0-6-2-6-5s2-6 6-6 6 3 6 6-2 5-6 5z" />
        </svg>
      </div>
    ),
    size
  );
}
