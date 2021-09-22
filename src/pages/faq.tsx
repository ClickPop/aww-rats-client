import { NextPage } from "next";
import { FAQ } from "~/components/faq/FAQ";
import { RatRace } from "~/components/index/rat-race/RatRace";
import { Layout } from "~/components/layout/Layout";

const FAQPage: NextPage = () => {
  return (
    <Layout>
      <FAQ />
      <RatRace />
    </Layout>
  )
}

export default FAQPage;