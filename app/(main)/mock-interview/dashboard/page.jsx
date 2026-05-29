import React from 'react'
import WelcomeContainer from '../_components/WelcomeContainer'
import CreateOptions from '../_components/CreateOptions'
import LatestInterviewsList from '../_components/LatestInterviewsList'

const mockinterview = () => {
  return (
    <div>
      {/* <WelcomeContainer/> */}
      <h2 className='my-3 font-bold text-2xl'>Dashboard</h2>
      <CreateOptions/>
      <LatestInterviewsList limit={6}/>
    </div>
  )
}

export default mockinterview