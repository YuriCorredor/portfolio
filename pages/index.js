import Main from "../components/Main"
import Head from "next/head"
import Script from "next/script"

export default function Index() {
  return (
    <>
      <Head>
        <title>Yuri Corredor | Developer</title>
        <meta
          name="viewport"
          content="initial-scale=1.0, width=device-width"
        />
        <meta
          name="description"
          content="Yuri's portfolio. I solve problems using code (Mostly web). Engineer from Somewhere and everywhere."
        />
        <meta
          data-react-helmet="true"
          name="keywords"
          content="web developer, web designer, software engineer, freelancer, programmer, platform builder, MVP specialist, automation, tech, Essex, London, contractor, consultant, SaaS builder, backend specialist, TypeScript, node.js, AMQP, TCP, HTTP, websockets, flutter, mobile, react, ios, android, AWS, architect"
        />
      </Head>

      {/* Google AdSense Script */}
      <Script
        id="adsense-script"
        async
        strategy="beforeInteractive"
        crossOrigin="anonymous"
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4148112278798811"
      />

      <Main />
    </>
  )
}
