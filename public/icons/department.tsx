type PropsT = { className?: string };
export default function DepartmentIcon({ className }: PropsT) {
  return (
    <svg
      width={24}
      height={19.826}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 19.826"
      className={className}
    >
      <path
        d="M3.179 0.557c-0.31 0.076 -0.645 0.384 -0.733 0.675 -0.035 0.118 -0.047 2.123 -0.047 8.083v7.925H0.28v2.08H23.28v-2.08h-2.12V7.569l-0.112 -0.214c-0.124 -0.239 -0.371 -0.451 -0.599 -0.513 -0.092 -0.026 -0.786 -0.042 -1.799 -0.042h-1.65v10.44h-2.081V9.347c0 -8.914 0.028 -8.163 -0.318 -8.51 -0.341 -0.341 0.097 -0.318 -5.958 -0.314 -2.938 0.002 -5.397 0.018 -5.464 0.033m7.54 5.203v1.04H6.56V4.72h4.159zm0 4.16v1.039H6.56V8.88h4.159z"
        fill="currentColor"
        fillRule="evenodd"/>
    </svg>
  )
}
