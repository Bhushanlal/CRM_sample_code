import React from 'react'
import _ from 'lodash'
import { toWords } from './custom'

export const getErrorMessages = (value) => {
    //const getData = _.map(value, (getVal, getKey) => <li key={getKey}>Message : {getVal[0]} / Param : {getKey}</li>)
    const getData = _.map(value, (getVal, getKey) => <li key={getKey}>Message : {getVal[0]} </li>)
    return <ul className="text-left error--list">{getData}</ul>
}

// camelcase to
export const noRecordFound = <div className="text-center">No Records Found.</div>;

// validation function
export const parseTheErrors = (validator) => {
    let getAllErr =   _.map(validator, (sd,pp) => {
        return <li key={pp}>Row {parseInt(sd.errorIndex, 10) + 1} - {toWords(sd.field).toUpperCase()}: {sd.message}</li>
      })
    return <ul className="text-left">{getAllErr}</ul>;
}