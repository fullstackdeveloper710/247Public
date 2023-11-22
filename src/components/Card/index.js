import React from 'react'
import './cardProps.scss'
const Card = ({icon , title ,count,discount}) => {
    return (
        <div className='card-props d-flex align-items-center'>
                <span className='cardIcon'>{icon}</span>
                <dl className='cardTitle ps-3'>
                    <dt>{title}</dt>
                    <dd>{count} <span>{discount}</span></dd>
                </dl>
         </div>
    )
}   

export default Card