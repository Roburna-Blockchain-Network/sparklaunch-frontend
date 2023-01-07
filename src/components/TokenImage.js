import React, { useState } from 'react'
import FallbackImage from '../assets/images/fallback.png'
const TokenImage = ({ src, alt, className, style }) => {
  const [isUndefined, updateIsUndefined] = useState(false)

  const onError = () => {
    updateIsUndefined(true)
  }

  if (isUndefined) {
    return <img className={className} src={FallbackImage} alt={alt} />
  }

  return <img src={src} alt={alt} style={style} className={className} onError={onError} />
}

export default React.memo(TokenImage, () => true)