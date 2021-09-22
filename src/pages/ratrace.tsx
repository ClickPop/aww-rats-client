import { NextPage } from 'next'
import React from 'react'
import { RatRace } from '~/components/index/rat-race/RatRace'
import { Layout } from '~/components/layout/Layout'

const RatRacePage: NextPage = () => {
  return (
    <Layout className="bg-dark">
      <RatRace />
    </Layout>
  )
}

export default RatRacePage
