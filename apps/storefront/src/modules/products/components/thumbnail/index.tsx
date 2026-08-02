import { clx } from "@modules/common/components/ui"
import Image from "next/image"
import React from "react"

type ThumbnailProps = {
  thumbnail?: string | null
  images?: { url?: string }[] | null
  size?: "small" | "medium" | "large" | "full" | "square"
  isFeatured?: boolean
  className?: string
  "data-testid"?: string
}

// ─── Ícone de cabide / roupa para placeholder ─────────────────────────────────
const HangerPlaceholder = ({ size }: { size?: string }) => {
  const px = size === "small" ? 28 : 40
  return (
    <svg
      width={px}
      height={px}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="text-gray-300"
    >
      <path
        d="M24 10C24 10 24 7 27 7C30 7 30 10 27 10"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M27 10C27 10 30 10 33 14L42 22H6L15 14C18 10 21 10 21 10"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8 22V38C8 39.1 8.9 40 10 40H38C39.1 40 40 39.1 40 38V22"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

const Thumbnail: React.FC<ThumbnailProps> = ({
  thumbnail,
  images,
  size = "small",
  isFeatured,
  className,
  "data-testid": dataTestid,
}) => {
  const initialImage = thumbnail || images?.[0]?.url

  return (
    <div
      className={clx(
        "relative w-full overflow-hidden bg-gray-50",
        className,
        {
          "aspect-[11/14]": isFeatured,
          "aspect-[3/4]": !isFeatured && size !== "square",
          "aspect-[1/1]": size === "square",
          "w-[180px]": size === "small",
          "w-[290px]": size === "medium",
          "w-[440px]": size === "large",
          "w-full": size === "full",
        }
      )}
      data-testid={dataTestid}
    >
      {initialImage ? (
        <Image
          src={initialImage}
          alt="Produto"
          className="absolute inset-0 object-cover object-center"
          draggable={false}
          quality={75}
          sizes="(max-width: 576px) 280px, (max-width: 768px) 360px, (max-width: 992px) 480px, 800px"
          fill
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
          <HangerPlaceholder size={size} />
          <span className="text-[10px] text-gray-300 tracking-widest uppercase font-medium">
            Foto em breve
          </span>
        </div>
      )}
    </div>
  )
}

export default Thumbnail
