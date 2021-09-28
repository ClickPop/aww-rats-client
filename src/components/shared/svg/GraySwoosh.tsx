import { FC, SVGProps } from "react"

export const GraySwoosh: FC<SVGProps<SVGSVGElement>> = (props) => {
  return (
    <svg
      baseProfile="tiny"
      xmlns="http://www.w3.org/2000/svg"
      x="0px"
      y="0px"
      viewBox="0 0 1920 72.45"
      overflow="visible"
      xmlSpace="preserve"
      {...props}
    >
      <path
        fill="#2A353C"
        d="M1940 72.45s-365.9-48-980-48-980 48-980 48V0h1960v72.45z"
      />
    </svg>
  )
}