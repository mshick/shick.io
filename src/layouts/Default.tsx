import Seo from '#/components/Seo'
import { SiteFooter } from '#/features/Site/SiteFooter'
import { SiteNavigation } from '#/features/Site/SiteNavigation'
import { config } from 'contentlayer/generated'
import { NextSeoProps } from 'next-seo'
import { PropsWithChildren } from 'react'

export interface LayoutDefaultProps {
  seo?: NextSeoProps
}

export const LayoutDefault = ({
  seo,
  children
}: PropsWithChildren<LayoutDefaultProps>) => {
  return (
    <>
      <Seo {...seo} />
      <div className="flex flex-col items-start lg:w-[80%] lg:px-[10%] md:w-[84%] md:px-[8%] sm:w-[90%] sm:px-[5%] w-[94%] px-[3%] mx-auto">
        <div className="flex flex-col w-full box-border max-w-4xl mx-auto min-h-screen">
          <SiteNavigation items={config.navigation} />

          <main id="content" className="w-full flex-grow">
            {children}
          </main>

          <SiteFooter showListeningTo={config.showListeningTo} />
        </div>
      </div>
    </>
  )
}

export default LayoutDefault
