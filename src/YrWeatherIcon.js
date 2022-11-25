import React from 'react'
import {ReactSVG} from 'react-svg'

const importAll = (r) => {
  let images = {};
  r.keys().map((item) => { images[item.replace('./', '')] = r(item); })
  return images
}

const YrWeatherIcon = ({name}) => {
  const images = importAll(require.context('/src/assets/weathericons', false, /\.(svg)$/))
  const image = images[`${name}.svg`]
  return <ReactSVG
    src={image}
    className="Weather_icon"
    beforeInjection={(svg) => {
      svg.classList.add('Weather_icon_svg')
      svg.setAttribute('style', 'height: 20px')
    }}
  />
}

export default YrWeatherIcon