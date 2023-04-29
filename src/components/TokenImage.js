import React, { useState } from 'react'
import FallbackImage from '../assets/images/fallback.png'
const TokenImage = ({ src, alt, className, height, width, objectFit, objectPosition }) => {
  const [isUndefined, updateIsUndefined] = useState(false)

  const onError = () => {
    updateIsUndefined(true)
  }

  if (isUndefined) {
    return <img className={className} src={FallbackImage} alt={alt} />
  }

  return <img src={src} alt={alt} className={className} onError={onError} style={{ height, width, objectFit, objectPosition }} />
}

export default React.memo(TokenImage, () => true)