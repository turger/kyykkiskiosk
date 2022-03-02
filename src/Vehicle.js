import React from 'react'
import classNames from 'classnames'
import { ReactSVG } from 'react-svg'
import vehicleAssets from './VehicleAssets'
import './Vehicle.css'

const Vehicle = ({mode}) => {
  return (
    <div className={classNames("Vehicle", "Vehicle--"+mode)}>
      { mode in vehicleAssets &&
        <ReactSVG
          src={vehicleAssets[mode]}
          className="Vehicle__icon__svg"
        />
      }
      { !(mode in vehicleAssets) && mode }
    </div>
  )
}

export default Vehicle
