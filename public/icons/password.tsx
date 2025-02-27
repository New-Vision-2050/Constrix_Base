export default function PasswordIcon({
  showPassword,
}: {
  showPassword: boolean;
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={20}
      height={20}
      x="0"
      y="0"
      enableBackground="new 0 0 800 800"
      version="1.1"
      viewBox="0 0 800 800"
      xmlSpace="preserve"
      className="transistion-all duration-300"
    >
      <path
    d="M473 423.2c0 55.2-44.8 100-100 100s-100-44.8-100-100 44.8-100 100-100 100 44.8 100 100z"
    className="st0"
    style={{
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "66.6667",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        strokeMiterlimit: "133.3333",
    }}
    />
      <path
    d="M373 189.9c-149.3 0-275.6 98.1-318.1 233.3C97.4 558.5 223.7 656.6 373 656.6s275.6-98.1 318.1-233.3C648.6 288 522.2 189.9 373 189.9z"
    className="st0"
    style={{
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "66.6667",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        strokeMiterlimit: "133.3333",
    }}
    />
      <path
    fill="currentColor"
    opacity={showPassword ? "0" : "1"}
    d="M726.1 736.8c-14.2 0-27.6-5.5-37.7-15.6l-600-600c-20.8-20.8-20.8-54.6 0-75.4 10.1-10.1 23.5-15.6 37.7-15.6 14.2 0 27.6 5.5 37.7 15.6l600 600c20.8 20.8 20.8 54.6 0 75.4-10.1 10.1-23.5 15.6-37.7 15.6z"
    />
      <path
    opacity={showPassword ? "0" : "1"}
    d="M126.1 50.1c8.5 0 17.1 3.3 23.6 9.8l600 600c13 13 13 34.1 0 47.1-6.5 6.5-15 9.8-23.6 9.8s-17.1-3.3-23.6-9.8l-600-600c-13-13-13-34.1 0-47.1 6.5-6.5 15-9.8 23.6-9.8m0-40c-19.6 0-38 7.6-51.9 21.5-28.6 28.6-28.6 75.1 0 103.7l600 600c13.9 13.9 32.3 21.5 51.9 21.5s38-7.6 51.9-21.5c28.6-28.6 28.6-75.1 0-103.7l-600-600c-13.9-13.8-32.4-21.5-51.9-21.5z"
    fill="currentColor"
    />
    </svg>
  );
}
