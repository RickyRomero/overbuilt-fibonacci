import React, { useState, useEffect } from 'react'
import axios from 'axios'

export default () => {
  let [ seenIndices, setSeenIndices ] = useState([])
  let [ values, setValues ] = useState({})
  let [ index, setIndex ] = useState('')

  const fetchValues = async () => {
    const values = await axios.get('/api/values/current')
    setValues(values.data)
  }

  const fetchIndices = async () => {
    const seenIndices = await axios.get('/api/values/all')
    setSeenIndices(seenIndices.data)
  }

  useEffect(() => { // On mount
    fetchValues()
    fetchIndices()
  }, [])


  const renderSeenIndices = () => seenIndices.map(({ number }) => number).join(', ')
  const renderValues = () => Object.keys(values).map(key => (
    <div key={key}>
      For index {key}, I calculated {values[key]}.
    </div>
  ))

  const submitData = async event => {
    event.preventDefault()

    await axios.post('/api/values', { index })
    setIndex('')
  }

  return (
    <div>
      <form onSubmit={submitData}>
        <label>Enter your index:</label>
        <input value={index} onInput={event => setIndex(event.target.value)} />
        <input type="submit" />
      </form>

      <h3>Indices I've seen:</h3>
      {renderSeenIndices()}

      <h3>Calculated values:</h3>
      {renderValues()}
    </div>
  )
}
