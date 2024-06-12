import { ErrorMessage } from '#/components/Error/ErrorMessage'
import Layout from '#/layouts/Default'

export default function Custom404() {
  return (
    <Layout seo={{ title: 'Page not found' }}>
      <ErrorMessage
        headline="404 error"
        subhead="Page not found"
        body="Sorry, we couldn't find that page."
      />
    </Layout>
  )
}
