import * as React from 'react'

function CarouselDot ({
  onClick,
  index,
  active
}) {
  return (
    <button 
      onClick={onClick}
      data-index={index}
      className={ `carousel__page-indicator${ active ? ' carousel__page-indicator--active': '' }` }
    />
  )
}

export default CarouselDot
