import PropTypes from "prop-types"
import React from "react"

const Loading = ({ size = "sm" }) => {
  const sizeClass =
    size === "sm" ? "w-8 h-8" : size === "lg" ? "w-12 h-12" : "w-14 h-14"

  return (
    <div className="flex justify-center items-center">
      <div className={`relative ${sizeClass}`}>
        <div className="flex justify-center items-center animate-bounce">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={32}
            height={32}
            fill="#0165cc"
            viewBox="0 0 256 256"
            className="animate-[drive_3s_infinite_linear]"
          >
            <path d="M240,112H211.31L168,68.69A15.86,15.86,0,0,0,156.69,64H44.28A16,16,0,0,0,31,71.12L1.34,115.56A8.07,8.07,0,0,0,0,120v48a16,16,0,0,0,16,16H33a32,32,0,0,0,62,0h66a32,32,0,0,0,62,0h17a16,16,0,0,0,16-16V128A16,16,0,0,0,240,112ZM44.28,80H156.69l32,32H23ZM64,192a16,16,0,1,1,16-16A16,16,0,0,1,64,192Zm128,0a16,16,0,1,1,16-16A16,16,0,0,1,192,192Zm48-24H223a32,32,0,0,0-62,0H95a32,32,0,0,0-62,0H16V128H240Z" />
          </svg>
        </div>
      </div>
    </div>
  )
}

Loading.propTypes = {
  size: PropTypes.oneOf(["sm", "md", "lg"]),
  message: PropTypes.string
}

export default Loading
