type PropsT = { additionalClass?: string };

export default function CompanyIcon({ additionalClass }: PropsT) {
  return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="21"
        viewBox="0 0 24 21"
        fill="none"
        className={`lucide lucide-arrow-down-to-line-icon lucide-arrow-down-to-line ${additionalClass}`}
      >
        <path
          d="M3.617 0.576a1.245 1.245 0 0 0 -0.509 0.48l-0.088 0.164 -0.011 8.651L3 18.52H1.001v1.999h21.999v-1.999H21V9.934c0 -6.465 -0.012 -8.623 -0.046 -8.742a1.2 1.2 0 0 0 -0.532 -0.597C20.267 0.525 19.928 0.522 12 0.522 5.184 0.523 3.719 0.532 3.617 0.576m7.383 5.944v0.999h-3V5.52h3zm5.001 0v0.999h-3V5.52h3zM11 10.52v1.001h-3V9.521h3zm5.001 0v1.001h-3V9.521h3zM11 14.52v1.001h-3V13.52h3zm5.001 0v1.001h-3V13.52h3z"
          fill="currentColor"
          fillRule="evenodd"
        />
      </svg>
  );
}
